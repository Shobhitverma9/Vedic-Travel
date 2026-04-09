// Production Build: 2024-04-01-V1
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { HttpAdapterHost } from '@nestjs/core';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded, Request, Response, NextFunction } from 'express';

// Trigger rebuild

async function bootstrap() {
    console.log('🏁 Starting VedicTravel Backend Bootstrap...');
    
    try {
        const app = await NestFactory.create(AppModule);
        console.log('✅ NestJS Application instance created.');

        // Trust proxy for Cloud Run/Load Balancer
        const expressApp = app.getHttpAdapter().getInstance();
        expressApp.set('trust proxy', 1);

        // Simple root health check - Must be before global prefix to be at /
        expressApp.get('/', (req, res) => {
            res.status(200).send('VedicTravel Backend: OK');
        });
        console.log('✅ Root health check configured.');

    // Global exception filter for 500 error diagnostics
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter({ httpAdapter } as any));
    console.log('✅ Global exception filter registered.');

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

    // Enable CORS — allow production, local, and any additional origins from env
    const envOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : [];

    const allowedOrigins = [
        (process.env.FRONTEND_URL || 'http://localhost:3000').trim(),
        'https://vedictravel.in',
        'https://www.vedictravel.in',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://test.payu.in',
        'https://secure.payu.in',
        'https://api.payu.in',
        ...envOrigins,
    ]
    .filter(Boolean)
    .map(o => o.toLowerCase().replace(/\/$/, '')); // Normalize: lowercase and remove trailing slash

    console.log('CORS Allowed Origins (Normalized):', allowedOrigins);

    app.enableCors({
        origin: (origin, callback) => {
            // Allow requests with no origin (curl, Postman, server-to-server)
            if (!origin) return callback(null, true);
            
            const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');
            
            if (allowedOrigins.includes(normalizedOrigin)) {
                return callback(null, true);
            }
            
            // Allow any *.vercel.app or *.web.app subdomain for previews
            if (normalizedOrigin.endsWith('.vercel.app') || normalizedOrigin.endsWith('.web.app') || normalizedOrigin.endsWith('.run.app')) {
                return callback(null, true);
            }
            
            // Allow any PayU domain explicitly via regex as a fallback
            if (normalizedOrigin.match(/^https?:\/\/([a-z0-9-]+\.)*payu\.in$/i)) {
                return callback(null, true);
            }

            console.error(`❌ CORS Blocked Origin: ${origin} (Normalized: ${normalizedOrigin})`);
            console.log(`Current Allowed Origins: ${JSON.stringify(allowedOrigins)}`);
            
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

    const port = Number(process.env.PORT) || 8080;
    console.log(`🔌 Attempting to listen on port: ${port}`);
    
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 VedicTravel Backend running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    } catch (error) {
        console.error('❌ FATAL ERROR DURING BOOTSTRAP:');
        console.error(error);
        process.exit(1);
    }
}
bootstrap();
