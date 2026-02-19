import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ToursService } from '../tours/tours.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const toursService = app.get(ToursService);
    const configService = app.get(ConfigService);

    console.log('Connecting to database...');
    // Ensure DB connection is established by app module initialization

    console.log('Fetching tours...');
    const result = await toursService.findAll({ limit: 100 });
    const tours = result.tours;

    if (tours.length < 4) {
        console.log(`Found only ${tours.length} tours. Need at least 4 to seed trending properly.`);
    }

    // Pick top 4 or all
    const toursToUpdate = tours.slice(0, 4);

    console.log(`Marking ${toursToUpdate.length} tours as trending...`);

    for (let i = 0; i < toursToUpdate.length; i++) {
        const tour = toursToUpdate[i];
        await toursService.update(String(tour._id), {
            isTrending: true,
            trendingRank: i + 1
        } as any);
        console.log(`Updated "${tour.title}" as Trending #${i + 1}`);
    }

    console.log('Seeding complete.');
    await app.close();
}

bootstrap();
