import { Injectable } from '@nestjs/common';
import { VaultService } from '../vault/service';
import { ConfigService } from '@nestjs/config';
import { IClientCertificate } from '../vault/types';

@Injectable()
export class VPNService {
    private tlsAuth: string;

    constructor(private readonly config: ConfigService, private readonly vault: VaultService) {}

    async fetchTlsAuth(): Promise<void> {
        this.tlsAuth = await this.vault.readTlsAuth();
    }

    generateClientConfig(certificate: IClientCertificate): string {
        const host = this.config.get<string>('vpn.host');
        const port = this.config.get<string>('vpn.port');
        const protocol = this.config.get<string>('vpn.protocol');
        return (
            `
client
nobind
dev ${this.config.get<string>('vpn.device')}
remote-cert-tls server
remote ${host} ${port} ${protocol}

<key>
${certificate.private_key}
</key>
<cert>
${certificate.certificate}
</cert>
<ca>
${certificate.issuing_ca}
</ca>

<tls-crypt>
${this.tlsAuth}
</tls-crypt>

auth ${this.config.get<string>('vpn.auth')}
cipher ${this.config.get<string>('vpn.cipher')}
        `.trim() + '\n'
        );
    }
}
