import { Entity, CreateDateColumn, OneToMany, DeleteDateColumn, PrimaryColumn } from 'typeorm';
import { Device } from './device';

@Entity({ name: 'users' })
export class User {
    /**
     * The common name of the user acting as unique ID. Should generally be the full name.
     */
    @PrimaryColumn({ type: 'varchar', length: 63 })
    name: string;

    /**
     * The devices registered for the user. Eagerly retrieved when fetching the user.
     */
    @OneToMany(
        () => Device,
        (device) => device.user,
        { cascade: true, onDelete: 'CASCADE', eager: true },
    )
    devices: Device[];

    /**
     * The timestamp at which the user was created.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    /**
     * The timestamp at which the user has been deleted and access for all its devices revoked.
     */
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;
}
