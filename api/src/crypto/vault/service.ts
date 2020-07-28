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
            token: this.config.get<string>('vault.token'),
            requestOptions: {
                ca: this.config.get<string>('vault.ca')
            }
        });
    }

    async readTlsAuth(): Promise<string> {
        const path = this.config.get<string>('vault.tlsAuth');
        const content = await this.vault.read(path);
        return content.data.data.value;
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
