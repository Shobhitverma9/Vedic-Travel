import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { CreateSettingDto, UpdateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) { }

    async create(createSettingDto: CreateSettingDto): Promise<Setting> {
        const createdSetting = new this.settingModel(createSettingDto);
        return createdSetting.save();
    }

    async findAll(): Promise<Setting[]> {
        return this.settingModel.find().exec();
    }

    async findOne(key: string): Promise<Setting> {
        const setting = await this.settingModel.findOne({ key }).exec();
        if (!setting) {
            throw new NotFoundException(`Setting with key "${key}" not found`);
        }
        return setting;
    }

    async update(key: string, updateSettingDto: UpdateSettingDto): Promise<Setting> {
        const updatedSetting = await this.settingModel
            .findOneAndUpdate({ key }, { value: updateSettingDto.value }, { new: true })
            .exec();

        if (!updatedSetting) {
            // If not found, try to create it if we have enough info, otherwise throw or handle
            // Here we assume if update is called, we might want to upsert if description was optional, 
            // but since description is required for create, we'll throw not found or just use a default description if we were to upsert.
            // For simplicity, let's throw for now or upsert with a default description if needed.
            // Actually, usually settings are seeded or created once. Let's stick to update logic.
            throw new NotFoundException(`Setting with key "${key}" not found`);
        }
        return updatedSetting;
    }

    async upsert(key: string, value: any, description: string = 'System Setting'): Promise<Setting> {
        return this.settingModel.findOneAndUpdate(
            { key },
            { key, value, description },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).exec();
    }
}
