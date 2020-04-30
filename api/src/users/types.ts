import { IsDefined, IsByteLength, Matches } from 'class-validator';

export class UserRequest {
    @IsDefined()
    @IsByteLength(5, 63, { message: 'Name must be between 5 and 63 characters.' })
    @Matches(/^[a-z]+-[a-z]+$/, { message: 'Name should match <firstname>-<lastname>.' })
    name: string;
}

export class DeviceRequest {
    @IsDefined()
    @IsByteLength(5, 63, { message: 'Name must be between 5 and 63 characters.' })
    @Matches(/^[a-z]+-20[0-9]{2}$/, { message: 'Name should match <name>-<year>' })
    name: string;
}

export interface IUser {
    name: string;
    devices: IDevice[];
    created_at: string;
    deleted_at?: string;
}

export interface IDevice {
    name: string;
    created_at: string;
    deleted_at?: string;
}

export interface ICertificate {
    certificate: string;
}
