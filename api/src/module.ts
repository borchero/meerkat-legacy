import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/module';
import database from './config/database';
import { Device } from './db/entities/device';
import { User } from './db/entities/user';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forRoot({ load: [database] })],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get<string>('database.connection'),
                schema: config.get<string>('database.schema'),
                entities: [User, Device],
                synchronize: true,
            }),
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
