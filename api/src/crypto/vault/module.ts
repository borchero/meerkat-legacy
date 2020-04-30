import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import vault from 'src/config/vault';
import { VaultService } from './service';

@Module({
    imports: [ConfigModule.forRoot({ load: [vault] })],
    providers: [
        {
            inject: [ConfigService],
            provide: VaultService,
            useFactory: async (config: ConfigService) => {
                const service = new VaultService(config);
                await service.authenticate();
                return service;
            },
        },
    ],
    exports: [VaultService],
})
export class VaultModule {}
