import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    Req,
    Query,
    Post,
    Param,
    Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Req() req) {
        return this.usersService.findById(req.user._id);
    }

    @Put('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user._id, updateProfileDto);
    }

    @Post('wishlist/:tourId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle tour in wishlist' })
    async toggleWishlist(@Req() req, @Param('tourId') tourId: string) {
        return this.usersService.toggleWishlist(req.user._id, tourId);
    }

    @Post('wishlist/add/:tourId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add tour to wishlist' })
    async addToWishlist(@Req() req, @Param('tourId') tourId: string) {
        return this.usersService.addToWishlist(req.user._id, tourId);
    }

    @Delete('wishlist/:tourId')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove tour from wishlist' })
    async removeFromWishlist(@Req() req, @Param('tourId') tourId: string) {
        return this.usersService.removeFromWishlist(req.user._id, tourId);
    }

    @Get('wishlist')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user wishlist' })
    async getWishlist(@Req() req) {
        return this.usersService.getWishlist(req.user._id);
    }
}

