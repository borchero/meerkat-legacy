import {
    Entity,
    ManyToOne,
    JoinColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
} from 'typeorm';
import { User } from './user';

@Entity({ name: 'devices' })
export class Device {
    /**
     * The reference to the user owning the device.
     */
    @ManyToOne(
        () => User,
        (user) => user.devices,
        { primary: true },
    )
    @JoinColumn({ name: 'user_id' })
    user: User;

    /**
     * The common name of the device acting as unique per-user ID.
     */
    @PrimaryColumn({ type: 'varchar', length: 63 })
    name: string;

    /**
     * The serial uniquely identifying the certificate.
     */
    @Column({ type: 'char', length: 59 })
    serial: string;

    /**
     * The timestamp at which access for this device has been granted.
     */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    /**
     * The timestamp at which access for this device has been revoked.
     */
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;
}
