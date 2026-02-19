import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
    @ApiProperty({ example: 'marquee_config', description: 'Unique key for the setting' })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({ example: { enabled: true, text: 'Welcome' }, description: 'Value of the setting' })
    @IsNotEmpty()
    value: any;

    @ApiProperty({ example: 'Configuration for top marquee', description: 'Description of the setting' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateSettingDto {
    @ApiProperty({ example: { enabled: true, text: 'Welcome' }, description: 'Value of the setting' })
    @IsNotEmpty()
    value: any;
}
