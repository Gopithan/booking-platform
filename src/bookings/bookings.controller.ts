import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new booking (Public)' })
    @ApiResponse({ status: 201, description: 'Booking successfully created' })
    @ApiResponse({ status: 400, description: 'Invalid input data or business rule violation' })
    @ApiResponse({ status: 409, description: 'Duplicate booking slot conflict' })
    async create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all bookings with pagination, search, and filtering (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Return paginated bookings list' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(@Query() filterDto: GetBookingsFilterDto) {
        return this.bookingsService.findAll(filterDto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a booking by ID (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Return the booking details' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update booking status (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Booking status successfully updated' })
    @ApiResponse({ status: 400, description: 'Invalid status transition' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async updateStatus(
        @Param('id') id: string,
        @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    ) {
        return this.bookingsService.updateStatus(id, updateBookingStatusDto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a booking (Public/Authenticated)' })
    @ApiResponse({ status: 200, description: 'Booking successfully cancelled' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async cancel(@Param('id') id: string) {
        return this.bookingsService.cancel(id);
    }
}
