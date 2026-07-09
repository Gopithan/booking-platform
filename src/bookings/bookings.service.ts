import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Like } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingStatus } from './booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingRepository: Repository<Booking>,
        private servicesService: ServicesService,
    ) { }

    async create(createBookingDto: CreateBookingDto): Promise<Booking> {
        const { serviceId, bookingDate, bookingTime } = createBookingDto;

        // 1. Verify service exists and is active
        const service = await this.servicesService.findOne(serviceId);
        if (!service.isActive) {
            throw new BadRequestException('The selected service is currently inactive and cannot be booked');
        }

        // 2. Verify booking date/time is not in the past
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        if (bookingDate < todayStr) {
            throw new BadRequestException('Booking date cannot be in the past');
        }

        if (bookingDate === todayStr) {
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();
            const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
            if (bookingTime < currentTimeStr) {
                throw new BadRequestException('Booking time cannot be in the past');
            }
        }

        // 3. Prevent duplicate bookings for the same service, date, and time
        // (Only check against non-cancelled bookings)
        const duplicate = await this.bookingRepository.findOne({
            where: {
                serviceId,
                bookingDate,
                bookingTime,
                status: Not(BookingStatus.CANCELLED),
            },
        });

        if (duplicate) {
            throw new ConflictException('This service is already booked for the selected date and time');
        }

        // 4. Create and save booking
        const booking = this.bookingRepository.create({
            ...createBookingDto,
            status: BookingStatus.PENDING,
        });

        return this.bookingRepository.save(booking);
    }

    async findAll(filterDto: GetBookingsFilterDto) {
        const { search, status, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;

        const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.service', 'service')
            .orderBy('booking.bookingDate', 'ASC')
            .addOrderBy('booking.bookingTime', 'ASC')
            .skip(skip)
            .take(limit);

        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }

        if (search) {
            queryBuilder.andWhere(
                '(booking.customerName LIKE :search OR booking.customerEmail LIKE :search)',
                { search: `%${search}%` },
            );
        }

        const [data, total] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }

    async findOne(id: string): Promise<Booking> {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: { service: true },
        });

        if (!booking) {
            throw new NotFoundException(`Booking with ID "${id}" not found`);
        }

        return booking;
    }

    async updateStatus(id: string, updateBookingStatusDto: UpdateBookingStatusDto): Promise<Booking> {
        const { status } = updateBookingStatusDto;
        const booking = await this.findOne(id);

        // Business rule: Cancelled bookings cannot be marked as completed
        if (booking.status === BookingStatus.CANCELLED && status === BookingStatus.COMPLETED) {
            throw new BadRequestException('Cancelled bookings cannot be marked as completed');
        }

        booking.status = status;
        return this.bookingRepository.save(booking);
    }

    async cancel(id: string): Promise<Booking> {
        const booking = await this.findOne(id);
        booking.status = BookingStatus.CANCELLED;
        return this.bookingRepository.save(booking);
    }
}
