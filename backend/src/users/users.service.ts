import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findById(id: string) {
        return this.userModel.findById(id).select('-password');
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    async updateProfile(userId: string, updateData: Partial<User>) {
        return this.userModel
            .findByIdAndUpdate(userId, updateData, { new: true })
            .select('-password');
    }

    async getAllUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.userModel.find().select('-password').skip(skip).limit(limit),
            this.userModel.countDocuments(),
        ]);

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async toggleWishlist(userId: string, tourId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) return null;

        const index = user.wishlist.indexOf(tourId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(tourId);
        }

        await user.save();
        return user.wishlist;
    }

    async addToWishlist(userId: string, tourId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.wishlist.includes(tourId)) {
            user.wishlist.push(tourId);
            await user.save();
        }

        return { message: 'Added to wishlist', wishlist: user.wishlist };
    }

    async removeFromWishlist(userId: string, tourId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const index = user.wishlist.indexOf(tourId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
            await user.save();
        }

        return { message: 'Removed from wishlist', wishlist: user.wishlist };
    }

    async getWishlist(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .populate('wishlist')
            .select('wishlist');

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.wishlist;
    }

    async isInWishlist(userId: string, tourId: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).select('wishlist');
        if (!user) {
            return false;
        }
        return user.wishlist.includes(tourId);
    }
}

