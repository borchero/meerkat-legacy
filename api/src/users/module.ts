import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { VaultModule } from 'src/crypto/vault/module';
import { DatabaseModule } from 'src/db/module';
import { UserService } from './service';
import { VPNModule } from 'src/crypto/vpn/module';

@Module({
    imports: [VaultModule, VPNModule, DatabaseModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
