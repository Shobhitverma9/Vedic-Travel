import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

// Trigger rebuild

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global interceptors
    app.useGlobalInterceptors(new LoggerInterceptor());

    // Security Headers
    app.use(helmet());

    // Compression
    app.use(compression());

    // Cookies
    app.use(cookieParser());

    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Global prefix
    app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: process.env.NODE_ENV === 'production',
        }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('VedicTravel API')
        .setDescription('Spiritual Travel & Tours Platform API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 VedicTravel Backend running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
