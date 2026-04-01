import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
    console.log('Testing Nest Bootstrap...');
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        console.log('Successfully bootstrapped Nest!');
        await app.close();
    } catch (err) {
        console.error('Failed to bootstrap Nest:', err);
    }
}
bootstrap();
