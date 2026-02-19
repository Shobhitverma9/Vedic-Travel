import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Tour, TourDocument } from '../tours/schemas/tour.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) { }

    async addToCart(userId: string, addToCartDto: AddToCartDto) {
        const { tourId, quantity, travelDate } = addToCartDto;

        // Validate tour exists and is active
        const tour = await this.tourModel.findById(tourId);
        if (!tour || !tour.isActive) {
            throw new NotFoundException('Tour not found or not available');
        }

        // Validate travel date is in the future
        const selectedDate = new Date(travelDate);
        if (selectedDate < new Date()) {
            throw new BadRequestException('Travel date must be in the future');
        }

        // Find or create cart for user
        let cart = await this.cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new this.cartModel({ user: userId, items: [] });
        }

        // Check if tour already in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.tour.toString() === tourId
        );

        if (existingItemIndex > -1) {
            // Update existing item
            cart.items[existingItemIndex].quantity = quantity;
            cart.items[existingItemIndex].travelDate = selectedDate;
            cart.items[existingItemIndex].priceSnapshot = tour.price;
        } else {
            // Add new item
            cart.items.push({
                tour: new Types.ObjectId(tourId),
                quantity,
                travelDate: selectedDate,
                priceSnapshot: tour.price,
                addedAt: new Date(),
            } as any);
        }

        await cart.save();
        return this.getCart(userId);
    }

    async getCart(userId: string) {
        const cart = await this.cartModel
            .findOne({ user: userId })
            .populate('items.tour')
            .lean();

        if (!cart) {
            return {
                items: [],
                total: 0,
                itemCount: 0,
            };
        }

        // Calculate totals
        const total = cart.items.reduce(
            (sum, item: any) => sum + item.priceSnapshot * item.quantity,
            0
        );

        const itemCount = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        return {
            ...cart,
            total,
            itemCount,
        };
    }

    async updateCartItem(
        userId: string,
        itemIndex: number,
        updateDto: UpdateCartItemDto
    ) {
        const cart = await this.cartModel.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (itemIndex < 0 || itemIndex >= cart.items.length) {
            throw new BadRequestException('Invalid item index');
        }

        const item = cart.items[itemIndex];

        if (updateDto.quantity !== undefined) {
            if (updateDto.quantity < 1) {
                throw new BadRequestException('Quantity must be at least 1');
            }
            item.quantity = updateDto.quantity;
        }

        if (updateDto.travelDate !== undefined) {
            const selectedDate = new Date(updateDto.travelDate);
            if (selectedDate < new Date()) {
                throw new BadRequestException('Travel date must be in the future');
            }
            item.travelDate = selectedDate;
        }

        await cart.save();
        return this.getCart(userId);
    }

    async removeCartItem(userId: string, itemIndex: number) {
        const cart = await this.cartModel.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (itemIndex < 0 || itemIndex >= cart.items.length) {
            throw new BadRequestException('Invalid item index');
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();
        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        await this.cartModel.findOneAndUpdate(
            { user: userId },
            { items: [] },
            { new: true }
        );
        return { message: 'Cart cleared successfully' };
    }

    async getCartTotal(userId: string) {
        const cart = await this.getCart(userId);
        return {
            subtotal: cart.total,
            gst: cart.total * 0.05, // 5% GST
            total: cart.total * 1.05,
            itemCount: cart.itemCount,
        };
    }
}
