import { Controller, Post, Body, Get, Param, HttpCode, Delete } from '@nestjs/common';
import { IUser, UserRequest, DeviceRequest, ICertificate } from './types';
import { UserService } from './service';

@Controller('/users')
export class UserController {
    constructor(private readonly users: UserService) {}

    @Get()
    async listUsers(): Promise<IUser[]> {
        const users = await this.users.list();
        return users.map((user) => ({
            name: user.name,
            devices: user.devices.map((device) => ({
                name: device.name,
                created_at: device.createdAt,
                deleted_at: device.deletedAt,
            })),
            created_at: user.createdAt,
            deleted_at: user.deletedAt,
        }));
    }

    @Post()
    @HttpCode(201)
    async createUser(@Body() request: UserRequest): Promise<IUser> {
        const user = await this.users.create(request.name);
        return {
            name: user.name,
            devices: [],
            created_at: user.createdAt,
        };
    }

    @Delete(':id')
    @HttpCode(204)
    async revokeUserCertificate(@Param('id') userId: string): Promise<void> {
        await this.users.revokeAllCertificates(userId);
    }

    @Post(':id/devices')
    @HttpCode(201)
    async createCertificate(
        @Param('id') userId: string,
        @Body() request: DeviceRequest,
    ): Promise<ICertificate> {
        const certificate = await this.users.createCertificate(userId, request.name);
        return { certificate: certificate };
    }

    @Delete(':userId/devices/:deviceId')
    @HttpCode(204)
    async revokeCertificate(
        @Param('userId') userId: string,
        @Param('deviceId') deviceId: string,
    ): Promise<void> {
        await this.users.revokeCertificate(userId, deviceId);
    }
}
