import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

import { CreateGuestBookingDto } from './dto/create-guest-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new booking' })
    async create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user._id, createBookingDto);
    }

    @Post('checkout')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create booking from cart' })
    async checkout(@Req() req, @Body() checkoutDto: CreateCheckoutDto) {
        return this.bookingsService.createFromCart(req.user._id, checkoutDto);
    }

    @Post('guest-checkout')
    @ApiOperation({ summary: 'Create booking for guest user' })
    async guestCheckout(@Body() guestDto: CreateGuestBookingDto) {
        return this.bookingsService.createGuestBooking(guestDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user bookings' })
    async findUserBookings(@Req() req, @Query() query: any) {
        return this.bookingsService.findUserBookings(
            req.user._id,
            query.page,
            query.limit,
        );
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get booking by ID' })
    async findOne(@Req() req, @Param('id') id: string) {
        return this.bookingsService.findOne(id, req.user._id);
    }

    @Get('admin/all')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all bookings (Admin)' })
    async findAllBookings(@Req() req, @Query() query: any) {
        // TODO: Add Admin Check Guard
        if (req.user.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        return this.bookingsService.getAllBookings({
            page: query.page,
            limit: query.limit,
            status: query.status,
            paymentStatus: query.paymentStatus,
            fromDate: query.fromDate,
            toDate: query.toDate,
        });
    }

    @Put(':id/cancel')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cancel booking' })
    async cancel(
        @Req() req,
        @Param('id') id: string,
        @Body() cancelBookingDto: CancelBookingDto,
    ) {
        return this.bookingsService.cancelBooking(
            id,
            req.user._id,
            cancelBookingDto.reason,
        );
    }
}

