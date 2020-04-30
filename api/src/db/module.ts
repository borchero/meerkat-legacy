import { Module } from '@nestjs/common';
import { DatabaseService } from './service';
import { User } from './entities/user';
import { Device } from './entities/device';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Device])],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
