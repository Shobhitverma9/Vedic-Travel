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

const featuredImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'jaipur_travel_guide_featured_image_1775542541302.png');
const amberFortImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'amber_fort_jaipur_section_image_1775542568017.png');

async function seed() {
  try {
    console.log('--- Seeding Jaipur Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const featuredUpload = await cloudinary.uploader.upload(featuredImagePath, {
      folder: 'blogs/jaipur-guide',
    });
    const amberUpload = await cloudinary.uploader.upload(amberFortImagePath, {
      folder: 'blogs/jaipur-guide',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Jaipur is popularly known as the Pink City, a haven for travelers where royalty meets history and culture with entertainment and joy. Going to Jaipur is a journey back in time to find the mighty palaces of kings and queens. The experience can be royal without burning holes in the pocket.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Why Jaipur?',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Jaipur is more than just a city of forts and palaces. It is the place that gives both enlightenment and amusement. This city was founded by Maharaja Jai Singh II, with origins embedded in the Vedic foundations. Vibrant markets and some of the greatest temples have transformed Jaipur into a state of heaven.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Historic Places in Jaipur for Royal Attractions',
            level: 2
          }
        },
        {
          type: 'grid',
          data: {
            url: amberUpload.secure_url,
            alignment: 'left',
            text: '<h3>1. Amber Fort</h3><p>Begin with Amber Fort. This giant fort stands atop a hillock offering a bird\'s eye view of the city. Rich in carvings and beautiful mirror work, it sports an interesting blend of Hindu and Mughal architectural designs.</p><p><b>Pro Tip:</b> Ride an elephant to the fort for a royal experience that is both fun and inexpensive.</p>',
            button: {
              text: 'View Jaipur Packages',
              url: '/yatras/jaipur-packages'
            }
          }
        },
        {
          type: 'header',
          data: {
            text: '2. City Palace',
            level: 3
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'City Palace is a huge palace that the royal family resides in. It has courtyards, museums, and gardens showing the dresses of kings, weapons, and paintings. Walking through City Palace gives you an idea about how kings spend their luxurious lives.'
          }
        },
        {
          type: 'header',
          data: {
            text: '3. Hawa Mahal: The Palace of Winds',
            level: 3
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'This is a five-storey palace with 953 tiny windows allowing cool air to pass through. It was constructed so that royal women might observe festivals held in the streets. Today it is a prime spot for photography.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Vedic and Spiritual Significance',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Jaipur\'s design patterns are based on olden Vedic thought with perfect natural synchrony. Exploring your spiritual side is easy with temples like <b>Govind Dev Ji Temple</b> and <b>Birla Mandir</b>, where Vedic rituals and white marble architecture offer spiritual satisfaction.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Things to Do in Jaipur for Entertainment',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              '<b>Shopping at Johari Bazaar:</b> Famous for Rajasthani traditional jewelry and textiles.',
              '<b>Elephant Safari at Dera Amer:</b> Ride through the wilderness followed by a peaceful dinner.',
              '<b>Chokhi Dhani:</b> Experience Rajasthani folk dances, puppetry, and traditional food.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'Historic Treasures and Hidden Adventures',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Explore <b>Nahargarh Fort</b> for stunning sunset views and <b>Jaigarh Fort</b>, home to the largest cannon on wheels in the world. For art lovers, the <b>Albert Hall Museum</b> offers a rich collection of artifacts, including an Egyptian mummy.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Thrilling Things to Do in Jaipur',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Experience the Pink City from above with a <b>Hot Air Balloon Ride</b> or explore the wilds with a <b>Jeep Safari at Nahargarh Biological Park</b>, home to leopards and tigers.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Festivals of Jaipur- the Vedic Origins',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Plan your visit during the <b>Gangaur</b> or <b>Teej</b> festivals to witness the city streets coming alive with colorful processions, Vedic rituals, and traditional folk dances.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Jaipur Budget Travel Guide',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              '<b>Local Transport:</b> Use tuk-tuks and local buses for pocket-friendly travel.',
              '<b>Jaipur Heritage Walk:</b> Explore hidden corners at almost no cost.',
              '<b>Street Food:</b> Savor kachoris and thalis at roadside dhabas for authentic taste without high prices.'
            ]
          }
        },
        {
          type: 'header',
          data: {
            text: 'Conclusion: Everlasting Experience',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Jaipur is more than a city; it is an experience of history, culture, and spirituality. From architectural splendor to vibrant festivals, every moment in Jaipur is a royal adventure waiting for you.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'Jaipur Travel Guide: Best Places & Budget-Friendly Tips',
      slug: 'jaipur-travel-guide-best-places-budget-tips',
      excerpt: 'Discover the Pink City where royalty meets Vedic history. Plan your Jaipur adventure with our budget-friendly guide to forts, palaces, and spiritual temples.',
      content: blogContent,
      featuredImage: featuredUpload.secure_url,
      image: featuredUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Travel Guide',
      tags: ['Jaipur', 'Pink City', 'Travel Guide', 'Budget Travel', 'Rajasthan'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Jaipur Travel Guide & Budget Tips | Vedic Travel',
        description: 'Explore the best of Jaipur with our travel guide. Learn about historic forts, spiritual sites, and budget-friendly tips for the royal Pink City experience.',
        keywords: ['jaipur travel guide', 'pink city budget tips', 'best places in jaipur', 'amber fort guide', 'hawa mahal jaipur']
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
    console.error('Error seeding Jaipur blog:', error);
    process.exit(1);
  }
}

seed();
