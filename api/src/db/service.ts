import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { Device } from './entities/device';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectRepository(User)
        private readonly users: Repository<User>,
        @InjectRepository(Device)
        private readonly devices: Repository<Device>,
    ) {}

    async userExists(name: string): Promise<boolean> {
        const user = await this.users.findOne({ name: name }, { withDeleted: true });
        return user != null;
    }

    async createUser(name: string): Promise<User> {
        const user = new User();
        user.name = name;
        await this.users.save(user);
        return user;
    }

    async listUsers(): Promise<User[]> {
        const users = await this.users.find({ withDeleted: true });
        return users;
    }

    async findUser(name: string): Promise<User> {
        const user = await this.users.findOne({ name: name }, { withDeleted: true });
        return user;
    }

    async deleteUser(name: string): Promise<void> {
        await this.users.softDelete({ name: name });
    }

    async deviceExists(name: string, userName: string): Promise<boolean> {
        const user = new User();
        user.name = userName;
        const device = await this.devices.findOne(
            { name: name, user: user },
            { withDeleted: true },
        );
        return device != null;
    }

    async createDevice(name: string, serial: string, userName: string): Promise<Device> {
        const device = new Device();
        device.name = name;
        device.serial = serial;
        device.user = new User();
        device.user.name = userName;
        await this.devices.save(device);
        return device;
    }

    async findDevice(name: string, userName: string): Promise<Device> {
        const user = new User();
        user.name = userName;
        const device = await this.devices.findOneOrFail(
            { name: name, user: user },
            { withDeleted: true },
        );
        return device;
    }

    async deleteDevice(name: string, userName: string): Promise<void> {
        const user = new User();
        user.name = userName;
        await this.devices.softDelete({ name: name, user: user });
    }
}
