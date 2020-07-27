import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import vault from 'src/config/vault';
import { VaultService } from './service';

@Module({
    imports: [ConfigModule.forRoot({ load: [vault] })],
    providers: [VaultService],
    exports: [VaultService],
})
export class VaultModule {}
