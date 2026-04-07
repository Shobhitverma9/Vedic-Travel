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

const featuredImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'ayodhya_travel_guide_featured_image_1775544188930.png');
const hanumanGarhiImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'hanuman_garhi_ayodhya_section_image_v2_1775544477847.png');

async function seed() {
  try {
    console.log('--- Seeding Ayodhya Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const featuredUpload = await cloudinary.uploader.upload(featuredImagePath, {
      folder: 'blogs/ayodhya-guide',
    });
    const hanumanUpload = await cloudinary.uploader.upload(hanumanGarhiImagePath, {
      folder: 'blogs/ayodhya-guide',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Ayodhya is the sacred birthplace of Lord Rama that invites you to experience its timeless beauty. From the Ram Janmabhoomi Temple to other ancient places, this holy city offers a journey of devotion and history. Read on to find the best places to visit in Ayodhya and immerse yourself in its rich culture.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Top Temples in Ayodhya',
            level: 2
          }
        },
        {
          type: 'header',
          data: {
            text: '1. Ram Janmabhoomi Temple',
            level: 3
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The Ram Janmabhoomi Temple is one of the most revered pilgrimage sites in Ayodhya. It is a mark of the birthplace of Lord Ram. The temple is an epitome of Ayodhya\'s spiritual ambiance, attracting millions of visitors every year seeking blessings.'
          }
        },
        {
          type: 'grid',
          data: {
            url: hanumanUpload.secure_url,
            alignment: 'left',
            text: '<h3>2. Hanuman Garhi</h3><p>Hanuman Garhi is a temple dedicated to Lord Hanuman, located just a short walk from Ram Janmabhoomi. Situated on top of a hill, it offers a panoramic view of the city. It is a peaceful place perfect for prayer and meditation.</p>',
            button: {
              text: 'View Ayodhya Packages',
              url: '/yatras/ayodhya-packages'
            }
          }
        },
        {
          type: 'header',
          data: {
            text: '3. Kanak Bhawan & Nageshwarnath Temple',
            level: 3
          }
        },
        {
          type: 'paragraph',
          data: {
            text: '<b>Kanak Bhawan</b> is dedicated to Lord Ram and Sita, known for its beautiful golden idols. <b>Nageshwarnath Temple</b>, built for Lord Shiva, is one among the 12 Jyotirlingas, offering a pure environment for pilgrims.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Ayodhya Tourist Attractions',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Ayodhya provides more than just temples. It is a city where spirituality meets culture and history.'
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Ram Katha Park:</b> Dedicated to the story of Lord Ram, with cultural performances.',
              '<b>Saryu River Bank:</b> Experience the spirit of the city with boating and Ganga Aarti.',
              '<b>Tulsi Smarak Bhavan:</b> Dedicated to the legendary poet Tulsidas.',
              '<b>Treta Ke Thakur Temple:</b> Where Lord Ram is believed to have performed Ashwamedha Yajna.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'Vedic Significance and Sacred Abodes',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Explore the <b>Shri Vedi Mandir</b>, the <b>Birla Ghat</b> for peaceful solitude, or the <b>Manoj Vedic Research Center</b> to dive deeper into Vedic scriptures. Don\'t miss the grand <b>Vishnu Dwar</b> and the sacred <b>Ram Chabutra</b>.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Amazing Things to do in Ayodhya for Fun',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Boat Ride on Saryu River:</b> Golden hues of sunset reflect off the water.',
              '<b>Visit Local Markets:</b> For handcrafted souvenirs, brassware, and spiritual books.',
              '<b>Light & Sound Show:</b> Narrating the glorious history of the epic Ramayan.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'A Royal Experience on a Budget',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Travelling to Ayodhya can be a royal experience without breaking the bank. With guesthouses and heritage hotels, Ayodhya offers both comfort and luxury within your reach. Enjoy local vegetarian delicacies and feel like royalty as you explore this beautiful, holy city.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Conclusion',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Ayodhya is a city where spirituality shines perfectly with entertainment. Whether you visit the Ram Janmabhoomi Temple or take a stroll along the Saryu River, Kashi\'s birthplace promises a peaceful, heart-warming memory.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'Best Places to Visit in Ayodhya: A Journey of Devotion',
      slug: 'best-places-to-visit-in-ayodhya-travel-guide',
      excerpt: 'Explore the sacred birthplace of Lord Ram. From the magnificent Ram Janmabhoomi Temple to peaceful Saryu ghats, discover the best of Ayodhya.',
      content: blogContent,
      featuredImage: featuredUpload.secure_url,
      image: featuredUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Travel Guide',
      tags: ['Ayodhya', 'Ram Janmabhoomi', 'Spiritual', 'Travel Tips', 'India'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Complete Ayodhya Travel Guide 2026 | Vedic Travel',
        description: 'Plan your trip to Ayodhya. Discover the best temples, historical sites, things to do, and budget-friendly travel tips for a spiritual pilgrimage.',
        keywords: ['best places in ayodhya', 'ram janmabhoomi temple', 'hanuman garhi ayodhya', 'saryu river aarti', 'ayodhya travel guide']
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
    console.error('Error seeding Ayodhya blog:', error);
    process.exit(1);
  }
}

seed();
