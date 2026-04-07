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

const featuredImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'varanasi_travel_guide_featured_image_1775542979326.png');
const gangaAartiImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'ganga_aarti_varanasi_section_image_1775543001526.png');

async function seed() {
  try {
    console.log('--- Seeding Varanasi Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const featuredUpload = await cloudinary.uploader.upload(featuredImagePath, {
      folder: 'blogs/varanasi-guide',
    });
    const aartiUpload = await cloudinary.uploader.upload(gangaAartiImagePath, {
      folder: 'blogs/varanasi-guide',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Varanasi, also known as Kashi, is not only a city but also a feeling. Every corner vibrates with energy, devotion, and centuries-old traditions. It is a place where sins are believed to be cleansed, inviting peace-seekers and history-lovers alike.'
          }
        },
        {
          type: 'header',
          data: {
            text: '1. Famous Ghats in Varanasi: Soul of the City',
            level: 2
          }
        },
        {
          type: 'grid',
          data: {
            url: aartiUpload.secure_url,
            alignment: 'right',
            text: '<h3>Dashashwamedh Ghat: The Heart of Aarti</h3><p>Dashashwamedh Ghat is often called the most popular ghat. It is the venue for the mystical <b>Ganga Aarti</b>. Witnessing the evening ceremony with its rhythmic chants, massive fire lamps, and fragrant incense is a truly spiritual experience.</p>',
            button: {
              text: 'Explore Varanasi Packages',
              url: '/yatras/varanasi-packages'
            }
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Manikarnika Ghat:</b> The ancient ghat representing the intense cycle of life and death.',
              '<b>Assi Ghat:</b> The southernmost end, known for sunrise yoga, music, and meditation.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '2. Must-See Temples in Varanasi',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Varanasi is home to more than a thousand temples. Every one of them holds a story to inspire your spirituality. Key temples include:'
          }
        },
        {
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              '<b>Kashi Vishwanath Temple:</b> One of the 12 Jyotirlingas dedicated to Lord Shiva.',
              '<b>Durga Temple:</b> An iconic red-colored temple dedicated to Goddess Durga.',
              '<b>Sankat Mochan Temple:</b> Dedicated to Lord Hanuman, always filled with devotional songs.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '3. Historical and Spiritual Landmarks',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'From the 18th-century <b>Ramnagar Fort</b> to <b>Sarnath</b>, where Lord Buddha delivered his first sermon, Varanasi is a walk through time. Other spiritual sites include the <b>Annapurna Temple</b> for prosperity and the unique <b>Bharat Mata Temple</b> featuring a marble-carved map of India.'
          }
        },
        {
          type: 'header',
          data: {
            text: '4. Cultural Hubs and Educational Heritage',
            level: 2
          }
        },
        {
            type: 'paragraph',
            data: {
              text: 'Varanasi is a cultural center for music, dance, and art. <b>Banaras Hindu University (BHU)</b> stands as a hub of learning, while the <b>Jantar Mantar</b> showcases ancient India\'s astronomical advancements.'
            }
        },
        {
          type: 'header',
          data: {
            text: '5. Things to Do in Varanasi for Adventure & Fun',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Boat Ride on the Ganges:</b> Best experienced at dawn for a golden reflection of the ghats.',
              '<b>Watch Ganga Aarti:</b> A spiritual highlight at Dashashwamedh Ghat.',
              '<b>Taste Local Cuisine:</b> Don\'t miss Kachori, Jalebi, and the world-famous Banarasi paan.',
              '<b>Hot Air Balloon Ride:</b> A bird\'s eye view of the sacred river and ghats.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '6. Varanasi Markets: A Shopper\'s Paradise',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'From the religious souvenirs of <b>Vishwanath Gali</b> to the brass metalwork of <b>Thatheri Bazar</b>, shopping in Varanasi is a delight. <b>Lahurabir</b> is the best place to find authentic Banarasi silk sarees.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Budget-Friendly Tips for Varanasi',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Varanasi is accessible on any budget. Stay at local ashramas, use shared public boats for river rides, and enjoy the delicious street food to experience the city\'s richness without overspending.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Conclusion: An Everlasting Memory',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Varanasi is a city that stays with you forever. Whether you come for peace, joy, or adventure, Kashi welcomes you with open arms. Let this sacred city surprise and inspire you.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'Best Places to Visit in Varanasi: The Spiritual Heart of India',
      slug: 'best-places-to-visit-in-varanasi-spiritual-guide',
      excerpt: 'Experience the magic of Kashi. From the mystical Ganga Aarti to ancient temples and bustling silk markets, discover the best of Varanasi.',
      content: blogContent,
      featuredImage: featuredUpload.secure_url,
      image: featuredUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Travel Guide',
      tags: ['Varanasi', 'Kashi', 'Spiritual', 'Travel Tips', 'Ganges'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Varanasi Travel Guide: Best Places & Things to Do | Vedic Travel',
        description: 'Explore the spiritual city of Varanasi. Discover the best ghats, temples, cultural sites, and budget-friendly travel tips for a perfect trip to Kashi.',
        keywords: ['best places in varanasi', 'ganga aarti dashashwamedh', 'kashi vishwanath guide', 'varanasi travel tips', 'sarnath tourist guide']
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
    console.error('Error seeding Varanasi blog:', error);
    process.exit(1);
  }
}

seed();
