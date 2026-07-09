import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BookingStatus } from './booking-status.enum';
import { Service } from '../services/service.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column()
    customerPhone: string;

    @Column()
    serviceId: string;

    @ManyToOne(() => Service, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'serviceId' })
    service: Service;

    @Column()
    bookingDate: string; // Format: YYYY-MM-DD

    @Column()
    bookingTime: string; // Format: HH:MM

    @Column({
        type: 'varchar',
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
