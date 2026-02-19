import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Tours')
@Controller('tours')
export class ToursController {
    constructor(private toursService: ToursService) { }

    @Get()
    @ApiOperation({ summary: 'Get all tours with filters' })
    async findAll(@Query() query: any) {
        return this.toursService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get tour by ID' })
    async findOne(@Param('id') id: string) {
        return this.toursService.findOne(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get tour by slug' })
    async findBySlug(@Param('slug') slug: string) {
        return this.toursService.findBySlug(slug);
    }

    @Post()
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles(UserRole.ADMIN)
    // @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new tour (Admin only)' })
    async create(@Body() createTourDto: CreateTourDto) {
        return this.toursService.create(createTourDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update tour (Admin only)' })
    async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
        return this.toursService.update(id, updateTourDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete tour (Admin only)' })
    async remove(@Param('id') id: string) {
        return this.toursService.remove(id);
    }
}
