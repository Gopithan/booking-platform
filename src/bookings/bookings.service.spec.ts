import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { BookingStatus } from './booking-status.enum';
import { ServicesService } from '../services/services.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('BookingsService', () => {
    let service: BookingsService;
    let bookingRepository: Repository<Booking>;
    let servicesService: ServicesService;

    const mockBookingRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockServicesService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: getRepositoryToken(Booking),
                    useValue: mockBookingRepository,
                },
                {
                    provide: ServicesService,
                    useValue: mockServicesService,
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
        servicesService = module.get<ServicesService>(ServicesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should throw NotFoundException if service does not exist', async () => {
            mockServicesService.findOne.mockRejectedValue(new NotFoundException());

            const dto = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'invalid-id',
                bookingDate: '2026-12-25',
                bookingTime: '10:00',
            };

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if service is inactive', async () => {
            mockServicesService.findOne.mockResolvedValue({ id: 'service-id', isActive: false });

            const dto = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'service-id',
                bookingDate: '2026-12-25',
                bookingTime: '10:00',
            };

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if booking date is in the past', async () => {
            mockServicesService.findOne.mockResolvedValue({ id: 'service-id', isActive: true });

            const dto = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'service-id',
                bookingDate: '2020-01-01',
                bookingTime: '10:00',
            };

            await expect(service.create(dto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if duplicate booking exists', async () => {
            mockServicesService.findOne.mockResolvedValue({ id: 'service-id', isActive: true });
            mockBookingRepository.findOne.mockResolvedValue({ id: 'existing-booking-id' });

            const dto = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'service-id',
                bookingDate: '2026-12-25',
                bookingTime: '10:00',
            };

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });

        it('should successfully create and save a booking', async () => {
            const serviceMock = { id: 'service-id', isActive: true };
            mockServicesService.findOne.mockResolvedValue(serviceMock);
            mockBookingRepository.findOne.mockResolvedValue(null);

            const bookingMock = {
                id: 'new-booking-id',
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'service-id',
                bookingDate: '2026-12-25',
                bookingTime: '10:00',
                status: BookingStatus.PENDING,
            };

            mockBookingRepository.create.mockReturnValue(bookingMock);
            mockBookingRepository.save.mockResolvedValue(bookingMock);

            const dto = {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '123456',
                serviceId: 'service-id',
                bookingDate: '2026-12-25',
                bookingTime: '10:00',
            };

            const result = await service.create(dto);
            expect(result).toEqual(bookingMock);
            expect(mockBookingRepository.save).toHaveBeenCalledWith(bookingMock);
        });
    });

    describe('updateStatus', () => {
        it('should throw BadRequestException when trying to complete a cancelled booking', async () => {
            const bookingMock = {
                id: 'booking-id',
                status: BookingStatus.CANCELLED,
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(bookingMock as any);

            await expect(service.updateStatus('booking-id', { status: BookingStatus.COMPLETED }))
                .rejects.toThrow(BadRequestException);
        });

        it('should successfully update status', async () => {
            const bookingMock = {
                id: 'booking-id',
                status: BookingStatus.PENDING,
            };

            jest.spyOn(service, 'findOne').mockResolvedValue(bookingMock as any);
            mockBookingRepository.save.mockImplementation((b) => Promise.resolve(b));

            const result = await service.updateStatus('booking-id', { status: BookingStatus.CONFIRMED });
            expect(result.status).toBe(BookingStatus.CONFIRMED);
        });
    });
});
