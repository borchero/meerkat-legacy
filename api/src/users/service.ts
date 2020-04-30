import { Injectable, ConflictException, NotFoundException, HttpException } from '@nestjs/common';
import { DatabaseService } from 'src/db/service';
import { User } from 'src/db/entities/user';
import { VaultService } from 'src/crypto/vault/service';
import { VPNService } from 'src/crypto/vpn/service';
import { Device } from 'src/db/entities/device';

@Injectable()
export class UserService {
    constructor(
        private readonly db: DatabaseService,
        private readonly vault: VaultService,
        private readonly vpn: VPNService,
    ) {}

    async list(): Promise<User[]> {
        const users = await this.db.listUsers();
        return users;
    }

    async create(name: string): Promise<User> {
        // First, check if user already exists
        const exists = await this.db.userExists(name);
        if (exists) {
            throw new ConflictException(`User with name '${name}' already exists.`);
        }

        // Then, create database entry
        return await this.db.createUser(name);
    }

    async createCertificate(user: string, device: string): Promise<string> {
        // First, check if user exists and has already been deleted
        await this.ensureUserExists(user);

        // Then, check if device already exists
        const exists = await this.db.deviceExists(device, user);
        if (exists) {
            throw new ConflictException(
                `Device with name '${device}' already exists for user '${user}'.`,
            );
        }

        // Then, create the certificate with the PKI
        const certificate = await this.vault.createCertificate(`${user}.${device}`);

        // Afterward, store it in the database
        await this.db.createDevice(device, certificate.serial_number, user);

        // And obtain the VPN configuration
        return this.vpn.generateClientConfig(certificate);
    }

    async revokeCertificate(user: string, device: string): Promise<void> {
        // First, check if user exists and has already been deleted
        await this.ensureUserExists(user);

        // First, check if device exists
        const exists = await this.db.deviceExists(device, user);
        if (!exists) {
            throw new NotFoundException(
                `User '${user}' does not own device with name '${device}'.`,
            );
        }

        // Then, get device
        const dvc = await this.db.findDevice(device, user);
        if (dvc.deletedAt != null) {
            throw new HttpException(
                `Device '${device}' by user '${user}' has already been revoked.`,
                412,
            );
        }

        await this.revokeDevice(dvc, user);
    }

    async revokeAllCertificates(userName: string): Promise<void> {
        // First, check if the user exists
        const user = await this.ensureUserExists(userName);

        // Afterwards, we can iterate over all devices and revoke them if needed
        await Promise.all(
            user.devices.map(async (device) => {
                if (device.deletedAt != null) {
                    return;
                }
                await this.revokeDevice(device, userName);
            }),
        );

        // Eventually, we can soft-delete the user
        await this.db.deleteUser(userName);
    }

    private async ensureUserExists(user: string): Promise<User> {
        const userExists = await this.db.userExists(user);
        if (!userExists) {
            throw new NotFoundException(`User with name '${user}' does not exist.`);
        }

        const usr = await this.db.findUser(user);
        if (usr.deletedAt != null) {
            throw new HttpException(`User with name '${user}' has already been deleted.`, 412);
        }

        return usr;
    }

    private async revokeDevice(device: Device, userName: string): Promise<void> {
        await this.vault.revokeCertificate(device.serial);
        await this.db.deleteDevice(device.name, userName);
    }
}
