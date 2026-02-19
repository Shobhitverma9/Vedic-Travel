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
import { InstagramService } from './instagram.service';
import { CreateInstagramPostDto } from './dto/create-instagram-post.dto';
import { UpdateInstagramPostDto } from './dto/update-instagram-post.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Instagram')
@Controller('instagram')
export class InstagramController {
    constructor(private readonly instagramService: InstagramService) { }

    @Get()
    @ApiOperation({ summary: 'Get all instagram posts' })
    async findAll(@Query() query: any) {
        return this.instagramService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get instagram post by ID' })
    async findOne(@Param('id') id: string) {
        return this.instagramService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new instagram post (Admin only)' })
    async create(@Body() createInstagramPostDto: CreateInstagramPostDto) {
        return this.instagramService.create(createInstagramPostDto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update instagram post (Admin only)' })
    async update(
        @Param('id') id: string,
        @Body() updateInstagramPostDto: UpdateInstagramPostDto,
    ) {
        return this.instagramService.update(id, updateInstagramPostDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete instagram post (Admin only)' })
    async remove(@Param('id') id: string) {
        return this.instagramService.remove(id);
    }
}
