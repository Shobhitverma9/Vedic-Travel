import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from './schemas/tour.schema';
import { Yatra, YatraDocument } from '../yatras/schemas/yatra.schema';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(Yatra.name) private yatraModel: Model<YatraDocument>
    ) { }

    async create(createTourDto: CreateTourDto) {
        const slug = createTourDto.slug || this.generateSlug(createTourDto.title);
        const tour = await this.tourModel.create({
            ...createTourDto,
            slug,
        });

        if (createTourDto.category) {
            // Check if category is a valid ObjectId (Yatra ID)
            if (createTourDto.category.match(/^[0-9a-fA-F]{24}$/)) {
                await this.yatraModel.findByIdAndUpdate(
                    createTourDto.category,
                    { $addToSet: { packages: tour._id } }
                );
            }
        }

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
            isTrending,
            sortBy = isTrending === 'true' ? 'trendingRank' : 'createdAt',
            order = isTrending === 'true' ? 'asc' : 'desc',
            isActive,
            ids,
        } = query;

        const filter: any = {};

        // isActive filter: 'true'/'false' = explicit filter, 'all' = no filter, undefined = default to active only
        if (isActive === 'all') {
            // No isActive filter — return all tours regardless of active status
        } else if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        } else {
            // Default (public-facing): only show active tours
            filter.isActive = true;
        }

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
 
        if (ids) {
            const idArray = Array.isArray(ids) ? ids : ids.split(',');
            filter._id = { $in: idArray };
        }

        const skip = (page - 1) * limit;
        const sortOrder = order === 'asc' ? 1 : -1;

        const [tours, total] = await Promise.all([
            this.tourModel
                .find(filter)
                .select('title slug price priceOriginal images duration locations highlights.temples isTrending trendingRank rating reviewsCount favoriteSize isActive category destination')
                .sort(sortBy === 'trendingRank' 
                    ? { [sortBy]: sortOrder, createdAt: -1 } // Secondary sort by latest if ranks same
                    : { [sortBy]: sortOrder }
                )
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

        // Manage Yatra association if category was updated
        if ('category' in updateTourDto) {
            // Remove from all yatras first
            await this.yatraModel.updateMany(
                { packages: tour._id },
                { $pull: { packages: tour._id as any } }
            );

            // Add to new yatra if valid
            if (updateTourDto.category && updateTourDto.category.match(/^[0-9a-fA-F]{24}$/)) {
                await this.yatraModel.findByIdAndUpdate(
                    updateTourDto.category,
                    { $addToSet: { packages: tour._id as any } }
                );
            }
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

        // Remove from associated yatra upon soft delete
        await this.yatraModel.updateMany(
            { packages: tour._id },
            { $pull: { packages: tour._id as any } }
        );

        return { message: 'Tour deleted successfully' };
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}
