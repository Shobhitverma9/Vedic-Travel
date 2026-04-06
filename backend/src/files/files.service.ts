import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class FilesService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, resourceType: 'auto' | 'image' | 'video' = 'auto'): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'vedic-travel/uploads',
                    resource_type: resourceType,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async uploadImages(files: Array<Express.Multer.File>): Promise<string[]> {
        if (!files || !files.length) return [];
        const urls: string[] = [];
        for (const file of files) {
            try {
                const url = await this.uploadImage(file);
                urls.push(url);
            } catch (error) {
                console.error('Error uploading image in batch:', error);
                throw error;
            }
        }
        return urls;
    }
}
