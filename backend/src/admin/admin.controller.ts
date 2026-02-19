import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
    constructor(
        private adminService: AdminService,
        private usersService: UsersService,
        private bookingsService: BookingsService,
    ) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get admin dashboard statistics' })
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    async getUsers(@Query() query: any) {
        return this.usersService.getAllUsers(query.page, query.limit);
    }

    @Get('bookings')
    @ApiOperation({ summary: 'Get all bookings with filters' })
    async getBookings(@Query() query: any) {
        return this.bookingsService.getAllBookings(query);
    }

    @Put('bookings/:id/status')
    @ApiOperation({ summary: 'Update booking status' })
    async updateBookingStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateBookingStatusDto,
    ) {
        return this.adminService.updateBookingStatus(id, updateStatusDto.status);
    }

    @Get('analytics/revenue')
    @ApiOperation({ summary: 'Get revenue analytics' })
    async getRevenueAnalytics(@Query() query: any) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;
        return this.adminService.getRevenueAnalytics(startDate, endDate);
    }
}
