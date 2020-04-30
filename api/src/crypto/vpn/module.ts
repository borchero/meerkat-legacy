import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import vpn from 'src/config/vpn';
import { VPNService } from './service';
import { VaultService } from '../vault/service';
import { VaultModule } from '../vault/module';

@Module({
    imports: [ConfigModule.forRoot({ load: [vpn] }), VaultModule],
    providers: [
        {
            inject: [ConfigService, VaultService],
            provide: VPNService,
            useFactory: async (config: ConfigService, vault: VaultService) => {
                const service = new VPNService(config, vault);
                await service.fetchTlsAuth();
                return service;
            },
        },
    ],
    exports: [VPNService],
})
export class VPNModule {}
