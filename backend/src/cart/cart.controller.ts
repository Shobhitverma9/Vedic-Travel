import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post('add')
    async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(req.user.userId, addToCartDto);
    }

    @Get()
    async getCart(@Request() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Get('total')
    async getCartTotal(@Request() req) {
        return this.cartService.getCartTotal(req.user.userId);
    }

    @Patch('items/:index')
    async updateCartItem(
        @Request() req,
        @Param('index') index: string,
        @Body() updateDto: UpdateCartItemDto
    ) {
        return this.cartService.updateCartItem(
            req.user.userId,
            parseInt(index),
            updateDto
        );
    }

    @Delete('items/:index')
    async removeCartItem(@Request() req, @Param('index') index: string) {
        return this.cartService.removeCartItem(req.user.userId, parseInt(index));
    }

    @Delete('clear')
    async clearCart(@Request() req) {
        return this.cartService.clearCart(req.user.userId);
    }
}
