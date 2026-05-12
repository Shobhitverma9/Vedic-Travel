import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Yatra, YatraDocument } from './schemas/yatra.schema';
import { Tour, TourDocument } from '../tours/schemas/tour.schema';

@Injectable()
export class YatrasService {
    constructor(
        @InjectModel(Yatra.name) private yatraModel: Model<YatraDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) { }

    async create(createYatraDto: any): Promise<Yatra> {
        console.log('[YatraCreate] packages received:', createYatraDto.packages);

        // Ensure packages are cast to ObjectIds
        if (createYatraDto.packages && Array.isArray(createYatraDto.packages)) {
            const Types = require('mongoose').Types;
            createYatraDto.packages = createYatraDto.packages.map((id: string) => {
                return typeof id === 'string' && Types.ObjectId.isValid(id)
                    ? new Types.ObjectId(id)
                    : id;
            });
        }

        const createdYatra = new this.yatraModel(createYatraDto);
        const saved = await createdYatra.save();

        // Ensure associated tours have their category updated
        if (saved.packages && saved.packages.length > 0) {
            await this.tourModel.updateMany(
                { _id: { $in: saved.packages } },
                { $set: { category: String(saved._id) } }
            );
        }

        console.log('[YatraCreate] packages saved:', saved.packages);
        return saved;
    }

    async findAll(query: any = {}): Promise<Yatra[]> {
        const { isActive, search } = query;
        const filter: any = {};

        if (isActive === 'all') {
            // No isActive filter
        } else if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        } else {
            // Default: only show active yatras
            filter.isActive = true;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filter.$or = [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
            ];
        }

        if (query.isVedicImprint !== undefined) {
            if (query.isVedicImprint === 'false') {
                filter.isVedicImprint = { $ne: true };
            } else {
                filter.isVedicImprint = query.isVedicImprint === 'true';
            }
        }

        if (query.showOnHome !== undefined) {
            filter.showOnHome = query.showOnHome === 'true';
        }


        // If isTrending=true, only return yatras that have at least one trending package
        if (query.isTrending === 'true') {
            const populationOptions: any = { path: 'packages' };
            if (isActive !== 'all') {
                populationOptions.match = { isActive: true };
            }

            const allYatras = await this.yatraModel
                .find(filter)
                .sort({ rank: 1 })
                .populate(populationOptions)
                .exec();

            return allYatras.filter((yatra: any) =>
                yatra.packages && yatra.packages.some((pkg: any) => pkg.isTrending === true)
            );
        }

        const populationOptions: any = { path: 'packages' };
        if (isActive !== 'all') {
            populationOptions.match = { isActive: true };
        }

        return this.yatraModel
            .find(filter)
            .sort({ rank: 1 })
            .populate(populationOptions)
            .exec();
    }

    async findOne(id: string, query: any = {}): Promise<Yatra> {
        const { isActive } = query;
        const populationOptions: any = { path: 'packages' };
        if (isActive !== 'all') {
            populationOptions.match = { isActive: true };
        }

        const yatra = await this.yatraModel.findById(id).populate(populationOptions).exec();
        if (!yatra) {
            throw new NotFoundException(`Yatra with ID ${id} not found`);
        }
        return yatra;
    }

    async findBySlug(slug: string): Promise<Yatra> {
        const yatra = await this.yatraModel
            .findOne({ slug, isActive: true })
            .populate({
                path: 'packages',
                match: { isActive: true }
            })
            .exec();
        if (!yatra) {
            throw new NotFoundException(`Yatra with slug ${slug} not found`);
        }
        return yatra;
    }

    async update(id: string, updateYatraDto: any): Promise<Yatra> {
        // Ensure packages are cast to ObjectIds
        if (updateYatraDto.packages && Array.isArray(updateYatraDto.packages)) {
            const Types = require('mongoose').Types;
            updateYatraDto.packages = updateYatraDto.packages.map((pkgId: string) => {
                return typeof pkgId === 'string' && Types.ObjectId.isValid(pkgId)
                    ? new Types.ObjectId(pkgId)
                    : pkgId;
            });
        }

        // Get old yatra to find which packages were removed
        const oldYatra = await this.yatraModel.findById(id).exec();

        const updatedYatra = await this.yatraModel
            .findByIdAndUpdate(id, updateYatraDto, { new: true })
            .populate('packages')
            .exec();

        if (!updatedYatra) {
            throw new NotFoundException(`Yatra with ID ${id} not found`);
        }

        // Sync tour categories if packages list changed
        if (updateYatraDto.packages) {
            // 1. Update category for current packages
            await this.tourModel.updateMany(
                { _id: { $in: updateYatraDto.packages } },
                { $set: { category: String(id) } }
            );

            // 2. Clear category for removed packages (only if they were pointing to this yatra)
            if (oldYatra && oldYatra.packages) {
                const removedPackageIds = oldYatra.packages.filter(
                    pkgId => !updateYatraDto.packages.some(newId => String(newId) === String(pkgId))
                );

                if (removedPackageIds.length > 0) {
                    await this.tourModel.updateMany(
                        { _id: { $in: removedPackageIds }, category: String(id) },
                        { $set: { category: '' } }
                    );
                }
            }
        }

        return updatedYatra;
    }

    async remove(id: string): Promise<void> {
        const result = await this.yatraModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Yatra with ID ${id} not found`);
        }
    }
}
