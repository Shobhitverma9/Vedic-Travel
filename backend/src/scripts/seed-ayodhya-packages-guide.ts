import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { BlogSchema } from '../blogs/schemas/blog.schema';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const featuredImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'ayodhya_tour_package_featured_image_1775544731857.png');
const busImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'ayodhya_luxury_bus_tour_section_image_1775544756171.png');

async function seed() {
  try {
    console.log('--- Seeding Ayodhya Packages Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const featuredUpload = await cloudinary.uploader.upload(featuredImagePath, {
      folder: 'blogs/ayodhya-packages',
    });
    const sectionUpload = await cloudinary.uploader.upload(busImagePath, {
      folder: 'blogs/ayodhya-packages',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Are you planning to pay a visit to the religious town of Ayodhya? Prepare for a spiritual treat! The sunshine carries a deep spirit of faith, and this city thrives with religious places and historical importance. But how do you select the correct tour package for yourself? This guide is here to help.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Why Visit Ayodhya?',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Ayodhya is the birthplace of Lord Ram and home to the magnificent new <b>Ram Mandir</b>. Beyond that, it offers a glimpse of religious and cultural tourism starting from old temples to serene ghats on the <b>Sarayu River</b>.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Types of Ayodhya Tour Packages',
            level: 2
          }
        },
        {
          type: 'grid',
          data: {
            url: sectionUpload.secure_url,
            alignment: 'right',
            text: '<h3>Plan Your Perfect Journey</h3><p>Choose the stay that fits your needs:</p><ul><li><b>Ayodhya One Day Tour:</b> Perfect for highlights like Ram Mandir and Hanuman Garhi.</li><li><b>Ayodhya Ram Mandir Tour:</b> Focused for a deeper spiritual experience.</li><li><b>Ayodhya Sightseeing:</b> Covers a wider range of attractions and historical sites.</li><li><b>Multi-day Ayodhya Tour Plan:</b> Explore everything at a relaxed pace.</li></ul>',
            button: {
              text: 'View All Packages',
              url: '/yatras/ayodhya-packages'
            }
          }
        },
        {
          type: 'header',
          data: {
            text: 'What to Look for in a Tour Package',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'A good Ayodhya tour plan should be comprehensive and cover the most sacred sites:'
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Ram Mandir & Hanuman Garhi',
              'Kanak Bhawan & Dasharath Mahal',
              'Sita Rasoi & Nageshwarnath Temple',
              'Sarayu River Ghats'
            ]
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Consider the <b>Duration</b>, <b>Transport</b> (AC vehicles are recommended), <b>Guide Knowledge</b>, and the quality of <b>Accommodation</b> and <b>Meals</b> provided.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Tips for a Great Ayodhya Visit',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Best Time:</b> October to March is ideal to avoid the heat.',
              '<b>Dress Code:</b> Modest attire is required for visiting temples.',
              '<b>Local Cuisine:</b> Try Ayodhya ke Pede, khasta kachori, and traditional thalis.',
              '<b>Souvenirs:</b> Religious artifacts and local handicrafts make great mementos.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'Booking Your Tour with Vedic Travel',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Consider booking with <b>Vedic Travel</b>. Our guides are well-versed in Ayodhya\'s history and legends, adding depth to your experience. We help you find hidden gems and ensure a smooth, spiritually enriching journey.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Conclusion: An Unforgettable Experience',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Selecting the appropriate Ayodhya tour package determines the success of your visit. Whether seeker or traveler, choose a route that lets you feel the atmosphere of Kashi\'s history and rich traditions.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'How to Choose the Perfect Ayodhya Tour Package',
      slug: 'choose-perfect-ayodhya-tour-package',
      excerpt: 'Find the right Ayodhya tour plan for your spiritual journey. From one-day highlights to multi-day sightseeing, learn how to book the best package.',
      content: blogContent,
      featuredImage: featuredUpload.secure_url,
      image: featuredUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Tour Guide',
      tags: ['Ayodhya', 'Tour Package', 'Ram Mandir', 'Travel Tips', 'India'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Choose the Best Ayodhya Tour Package | Vedic Travel',
        description: 'Planning a trip to Ayodhya? Learn about one-day and multi-day tour packages, must-visit sites like Ram Mandir, and expert tips for booking your perfect journey.',
        keywords: ['ayodhya tour package', 'ram mandir tour plan', 'ayodhya one day tour', 'best ayodhya sightseeing', 'book ayodhya pilgrimage']
      }
    };

    // Check if blog with same slug already exists
    const existing = await Blog.findOne({ slug: blogData.slug });
    if (existing) {
        console.log('Blog already exists. Updating...');
        await Blog.updateOne({ _id: existing._id }, blogData);
        console.log('Blog updated successfully.');
    } else {
        const blog = new Blog(blogData);
        await blog.save();
        console.log('Blog created successfully!');
    }

    mongoose.disconnect();
    console.log('--- Seeding Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Ayodhya Packages blog:', error);
    process.exit(1);
  }
}

seed();
