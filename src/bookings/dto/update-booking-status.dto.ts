import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../booking-status.enum';

export class UpdateBookingStatusDto {
    @ApiProperty({ enum: BookingStatus, example: BookingStatus.CONFIRMED, description: 'The new status of the booking' })
    @IsEnum(BookingStatus, { message: 'Invalid booking status' })
    status: BookingStatus;
}
