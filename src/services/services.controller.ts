import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new service (Authenticated)' })
    @ApiResponse({ status: 201, description: 'Service successfully created' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all services' })
    @ApiResponse({ status: 200, description: 'Return all services' })
    async findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a service by ID' })
    @ApiResponse({ status: 200, description: 'Return the service' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async findOne(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a service by ID (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Service successfully updated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a service by ID (Authenticated)' })
    @ApiResponse({ status: 200, description: 'Service successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Service not found' })
    async remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
