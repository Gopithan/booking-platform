import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsUUID, Matches, IsOptional } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer name is required' })
    customerName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the customer' })
    @IsEmail({}, { message: 'Invalid customer email address' })
    customerEmail: string;

    @ApiProperty({ example: '+1234567890', description: 'The phone number of the customer' })
    @IsString()
    @IsNotEmpty({ message: 'Customer phone number is required' })
    customerPhone: string;

    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'The ID of the service being booked' })
    @IsUUID('all', { message: 'Service ID must be a valid UUID' })
    serviceId: string;

    @ApiProperty({ example: '2026-08-15', description: 'The date of the booking (YYYY-MM-DD)' })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Booking date must be in YYYY-MM-DD format' })
    bookingDate: string;

    @ApiProperty({ example: '14:30', description: 'The time of the booking (HH:MM)' })
    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Booking time must be in HH:MM format' })
    bookingTime: string;

    @ApiPropertyOptional({ example: 'Please make sure to be on time.', description: 'Additional notes for the booking' })
    @IsString()
    @IsOptional()
    notes?: string;
}
