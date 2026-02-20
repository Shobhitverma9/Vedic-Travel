import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from './schemas/tour.schema';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
    constructor(@InjectModel(Tour.name) private tourModel: Model<TourDocument>) { }

    async create(createTourDto: CreateTourDto) {
        const slug = createTourDto.slug || this.generateSlug(createTourDto.title);
        const tour = await this.tourModel.create({
            ...createTourDto,
            slug,
        });
        return tour;
    }

    async findAll(query: any = {}) {
        const {
            page = 1,
            limit = 12,
            search,
            category,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            order = 'desc',
            isTrending,
        } = query;

        const filter: any = { isActive: true };

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { locations: { $regex: searchRegex } },
                { 'highlights.temples': { $regex: searchRegex } },
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (query.destination) {
            filter.destination = query.destination;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (isTrending) {
            filter.isTrending = isTrending === 'true';
        }

        if (query.isFavorite) {
            filter.isFavorite = query.isFavorite === 'true';
        }

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        const [tours, total] = await Promise.all([
            this.tourModel
                .find(filter)
                .select('title slug price priceOriginal images duration locations highlights.temples isTrending rating reviewsCount favoriteSize')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(Number(limit)),
            this.tourModel.countDocuments(filter),
        ]);

        return {
            tours,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const tour = await this.tourModel.findById(id);
        if (!tour) {
            throw new NotFoundException('Tour not found');
        }
        return tour;
    }

    async findBySlug(slug: string) {
        const tour = await this.tourModel.findOne({ slug, isActive: true });
        if (!tour) {
            throw new NotFoundException('Tour not found');
        }
        return tour;
    }

    async update(id: string, updateTourDto: UpdateTourDto) {
        const tour = await this.tourModel.findByIdAndUpdate(id, updateTourDto, {
            new: true,
        });
        if (!tour) {
            throw new NotFoundException('Tour not found');
        }
        return tour;
    }

    async remove(id: string) {
        const tour = await this.tourModel.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true },
        );
        if (!tour) {
            throw new NotFoundException('Tour not found');
        }
        return { message: 'Tour deleted successfully' };
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}
