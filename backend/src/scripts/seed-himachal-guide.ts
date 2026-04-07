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

const featuredImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'himachal_family_tour_featured_image_1775542208700.png');
const sectionImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'himachal_shimla_toy_train_section_image_1775542233575.png');

async function seed() {
  try {
    console.log('--- Seeding Himachal Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const featuredUpload = await cloudinary.uploader.upload(featuredImagePath, {
      folder: 'blogs/himachal-guide',
    });
    const sectionUpload = await cloudinary.uploader.upload(sectionImagePath, {
      folder: 'blogs/himachal-guide',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Do you wish to have a family trip to Himachal Pradesh? It is not just scenic beauty but also great richness in the culture. From old temples covered in snowfall to great outdoor adventures, this place has something exciting for every family member. Here is how you can plan the most ideal Himachal Pradesh family tour. Follow these tips on how to travel wisely, ideal times to plan a trip, and get the royal experience without losing money.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Why is Himachal Pradesh Perfect for a Family Tour?',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The state of Himachal Pradesh has always been a centre of attraction for travellers. This state, besides its natural beauty, is full of spiritual importance and historical treasures. This all make it perfect for a family tour. Families can experience the local traditions, visit ancient temples, and enjoy the landscapes of cultural importance.'
          }
        },
        {
          type: 'header',
          data: {
            text: '1. Best Family Places to Visit in Himachal',
            level: 2
          }
        },
        {
          type: 'grid',
          data: {
            url: sectionUpload.secure_url,
            alignment: 'right',
            text: '<h3>Shimla - The Queen of Hills</h3><p>Shimla, the colonial charm, is the perfect destination for families. It has a scenic train ride on the famous <b>Kalka-Shimla toy train</b> and a bustling Mall Road to shop for local handicrafts and snacks. Shimla\'s Ridge also hosts seasonal festivals and gatherings with Vedic rituals that will leave families in awe.</p>',
            button: {
              text: 'View Shimla Packages',
              url: '/yatras/shimla-packages'
            }
          }
        },
        {
            type: 'header',
            data: {
              text: 'Manali - Adventure Meets Entertainment',
              level: 3
            }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The man-made attractions blend spirituality with adventure in Manali. Visit the Hadimba Devi Temple, surrounded by cedar forests dating back thousands of years. It challenges your nerves with river rafting and paragliding in Solang Valley. It is a great destination to thrill kids, relax parents, and enjoy Himachal\'s spiritual origins.'
          }
        },
        {
            type: 'header',
            data: {
              text: 'Dharamshala and McLeodganj - Cultural Capital',
              level: 3
            }
        },
        {
          type: 'paragraph',
          data: {
            text: 'It has its Buddhist heritage, Dharamshala is an abode of spirituality. Families can visit monasteries, learn about the Tibetan culture, and can even take classes in meditation. Do not miss visiting the Dalai Lama Temple Complex wherein kids and adults alike can learn about peace and mindfulness.'
          }
        },
        {
            type: 'header',
            data: {
              text: 'Kullu Valley - A Spiritual Escape',
              level: 3
            }
        },
        {
          type: 'paragraph',
          data: {
            text: 'There are aged temples like Raghunath Temple and Bijli Mahadev. These are connected with deep Vedic interest. The scenic beauty offered by the Beas-river flowing through the valley. It provides excellent water sports that cater family entertainment.'
          }
        },
        {
          type: 'header',
          data: {
            text: '2. Best Time for Family Trip to Himachal',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The best time for family trip to Himachal can make it more fun for the families to enjoy the experience and allow them to plan their visit efficiently:'
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Himachal During Summertime (March To June):</b> Perfect to provide a pleasant climate for family picnics.',
              '<b>Winter (November to February):</b> Good for snow enthusiasts as snow activities can be enjoyed in Manali and Shimla.',
              '<b>Monsoon (July to September):</b> In case your family prefers solitude retreats, although accessibility might be restricted.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '3. Best Himachal Pradesh Travel Tips for Families',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              '<b>Book in advance:</b> Family-friendly hotels in popular destinations book out fast.',
              '<b>Use local transport:</b> Opt for Himachal\'s local buses and toy trains for an economical option.',
              '<b>Mix it up:</b> Make an itinerary comprising a mix of heritage, adventure, and shopping.',
              '<b>Respect Local Customs:</b> Some temples and monasteries have a dress code one should respect.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: '4. Things to do in Himachal Pradesh for Thrill',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'There are a lot of things to do in Himachal Pradesh for outdoor activities, and there are family-friendly ones too. There is trekking in Kasol, paragliding in Bir Billing, zorbing, skiing, and quad biking in Solang Valley.'
          }
        },
        {
          type: 'header',
          data: {
            text: '5. Experience of Vedic Significance in Himachal Festivals',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'In Himachal Pradesh, many festivals traditionally celebrate Vedic culture, such as Lohri or Dussehra. Families can also participate in and observe music, dance, and rituals. This forms a memorable way in the minds of kids regarding what Indian culture and tradition really mean.'
          }
        },
        {
          type: 'header',
          data: {
            text: '6. Places to Stay for a Vacation in Himachal',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Himachal has some diverse accommodation options depending on your budget, from budget-friendly homestays to luxury resorts in Mashobra and Kasauli offering divine mountain views and family services.'
          }
        },
        {
          type: 'header',
          data: {
            text: '7. Trying Himachal\'s Unique Food with Family',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The best way to taste Himachal Pradesh local food is to visit roadside dhabas for cozy and budget-friendly meals. Don\'t miss <b>Dhaam</b>, <b>Siddu</b>, and <b>Thukpa</b>.'
          }
        },
        {
          type: 'header',
          data: {
            text: '8. Best Family Destinations in Himachal to Visit',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Tirthan Valley:</b> Calm and unspoiled, perfect for trekking and fishing.',
              '<b>Chitkul:</b> The last village on the Indo-Tibetan border, providing insights into rural life.',
              '<b>Parashar Lake:</b> Isolated with a floating island, offering an architectural wonder of a temple.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'Conclusion: Himachal Pradesh Family Tour',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Himachal Pradesh is that place which offers a mix of adventure, spirituality, and nature in the perfect condition that can be offered to a family. Explore colorful markets, attend Vedic rituals and hike in pristine valleys. Follow these travel tips to ensure your family tour is as fulfilling as it is entertaining.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'Guide to Plan Himachal Pradesh Tour with Your Family',
      slug: 'guide-to-plan-himachal-pradesh-tour-with-family',
      excerpt: 'Discover why Himachal Pradesh is the perfect family destination. From Shimlas colonial charm to Manalis spiritual adventures, plan your royal experience today.',
      content: blogContent,
      featuredImage: featuredUpload.secure_url,
      image: featuredUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Travel Guide',
      tags: ['Himachal Pradesh', 'Family Tour', 'Travel Tips', 'Spiritual', 'Adventure'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Complete Himachal Family Tour Guide | Vedic Travel',
        description: 'Plan the perfect family trip to Himachal Pradesh. Find the best places to visit, travel tips, and cultural experiences for a memorable family vacation.',
        keywords: ['himachal family tour', 'best time to visit himachal', 'shimla family trip', 'manali with kids', 'himachal travel tips']
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
    console.error('Error seeding Himachal blog:', error);
    process.exit(1);
  }
}

seed();
