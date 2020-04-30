import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vault from 'node-vault';
import { IClientCertificate } from './types';

@Injectable()
export class VaultService {
    private vault: vault.client;

    constructor(private readonly config: ConfigService) {
        this.vault = vault({
            apiVersion: this.config.get<string>('vault.version'),
            endpoint: this.config.get<string>('vault.endpoint'),
        });
    }

    async authenticate(): Promise<void> {
        // First, try to get the token directly
        var token = this.config.get<string>('vault.token');
        if (!token) {
            // If this is not possible, we login via Kubernetes
            const jwt = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');
            const result = await this.vault.kubernetesLogin({
                role: this.config.get<string>('vault.role'),
                jwt: jwt,
            });
            console.log(result);
        }

        // Eventually, we can set thhe client's token
        this.vault.token = token;
    }

    async readTlsAuth(): Promise<string> {
        const path = this.config.get<string>('vault.ta');
        const content = await this.vault.read(path);
        return content;
    }

    async createCertificate(name: string): Promise<IClientCertificate> {
        const path = this.config.get<string>('vault.pki');
        const issuePath = `${path}/issue/client`;
        const result = await this.vault.write(issuePath, { common_name: name });
        return result.data;
    }

    async revokeCertificate(serial: string): Promise<void> {
        const path = this.config.get<string>('vault.pki');
        const revokePath = `${path}/revoke`;
        await this.vault.write(revokePath, { serial_number: serial });
    }
}
