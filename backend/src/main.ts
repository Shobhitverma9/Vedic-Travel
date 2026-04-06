// Production Build: 2024-04-01-V1
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded, Request, Response, NextFunction } from 'express';

// Trigger rebuild

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Trust proxy for Cloud Run/Load Balancer
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);

    // Global interceptors
    app.useGlobalInterceptors(new LoggerInterceptor());

    // Security Headers
    app.use(helmet());

    // Compression
    app.use(compression());

    // Cookies
    app.use(cookieParser());

    // Increase body size limit — skip for multipart/form-data so Multer can handle file uploads correctly
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.headers['content-type']?.startsWith('multipart/form-data')) {
            return next(); // Let Multer handle it
        }
        json({ limit: '50mb' })(req, res, next);
    });
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.headers['content-type']?.startsWith('multipart/form-data')) {
            return next();
        }
        urlencoded({ extended: true, limit: '50mb' })(req, res, next);
    });

    // Enable CORS — allow both production and local origins
    const allowedOrigins = [
        (process.env.FRONTEND_URL || 'http://localhost:3000').trim(),
        'http://localhost:3000',
        'http://localhost:3001',
    ].filter(Boolean);

    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (curl, Postman, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Allow any *.vercel.app or *.web.app subdomain for previews
            if (origin.endsWith('.vercel.app') || origin.endsWith('.web.app') || origin.endsWith('.run.app')) {
                return callback(null, true);
            }
            return callback(new Error(`CORS: Origin ${origin} not allowed`));
        },
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

    const port = process.env.PORT || 8080;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 VedicTravel Backend running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
