import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Yatra, YatraDocument } from './schemas/yatra.schema';

@Injectable()
export class YatrasService {
    constructor(
        @InjectModel(Yatra.name) private yatraModel: Model<YatraDocument>,
    ) { }

    async create(createYatraDto: any): Promise<Yatra> {
        const createdYatra = new this.yatraModel(createYatraDto);
        return createdYatra.save();
    }

    async findAll(query: any = {}): Promise<Yatra[]> {
        const { isActive } = query;
        const filter: any = {};

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (query.isVedicImprint !== undefined) {
            filter.isVedicImprint = query.isVedicImprint === 'true';
        }

        return this.yatraModel
            .find(filter)
            .sort({ rank: 1 })
            .populate('packages')
            .exec();
    }

    async findOne(id: string): Promise<Yatra> {
        const yatra = await this.yatraModel.findById(id).populate('packages').exec();
        if (!yatra) {
            throw new NotFoundException(`Yatra with ID ${id} not found`);
        }
        return yatra;
    }

    async findBySlug(slug: string): Promise<Yatra> {
        const yatra = await this.yatraModel.findOne({ slug }).populate('packages').exec();
        if (!yatra) {
            throw new NotFoundException(`Yatra with slug ${slug} not found`);
        }
        return yatra;
    }

    async update(id: string, updateYatraDto: any): Promise<Yatra> {
        const updatedYatra = await this.yatraModel
            .findByIdAndUpdate(id, updateYatraDto, { new: true })
            .populate('packages')
            .exec();

        if (!updatedYatra) {
            throw new NotFoundException(`Yatra with ID ${id} not found`);
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
