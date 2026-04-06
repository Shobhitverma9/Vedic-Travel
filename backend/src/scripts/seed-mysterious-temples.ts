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

const imagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'mysterious_indian_temples_featured_image_1775466439296.png');
const kamakhyaImagePath = path.join('C:', 'Users', 'SHOBHIT', '.gemini', 'antigravity', 'brain', '29432e36-1c5e-4d86-8cb5-5fc8d9149af8', 'kamakhya_temple_section_image_1775473041582.png');

async function seed() {
  try {
    console.log('--- Seeding Blog Post ---');
    console.log('Connecting to MongoDB...');
    if (!uri) throw new Error('MONGODB_URI not found in environment variables');
    await mongoose.connect(uri);
    console.log('Connected.');

    const Blog = mongoose.model('Blog', BlogSchema);

    console.log('Uploading images to Cloudinary...');
    const mainUpload = await cloudinary.uploader.upload(imagePath, {
      folder: 'blogs/mysterious-temples',
    });
    const sectionUpload = await cloudinary.uploader.upload(kamakhyaImagePath, {
      folder: 'blogs/mysterious-temples',
    });
    console.log('Images uploaded successfully.');

    const blogContent = {
      time: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'This is a country which holds great religious and spiritual values but on the other hand, there are spooky and mystical things that make ones’ skin crawl. Every corner of the country is teeming with temples that are thousands of years old, so many of them are associated with strange Traditions and things like that. Below are some of the sneak peeks of some of the most mysterious temples in India and the strange beliefs associated with them.'
          }
        },
        {
          type: 'grid',
          data: {
            url: sectionUpload.secure_url,
            alignment: 'left',
            text: '<h3>1. Kamakhya Temple, Assam – Worshiping Menstruation</h3><p>The Kamakhya temple in Assam is one of the most mysterious temples in India. It is devoted to the goddess Kamakhya, who is said to embody the power of reproduction. A peculiar custom here is celebrated every year, called Ambubachi Mela, which commemorates the goddess’s yearly menstrual cycle.</p><p>The temple shuts for three days which signifies the goddess’s monthly period cycle. On the fourth day the doors of the temple are opened again, and red colored cloths wet with holy water offered to the people believed to be incest with goddess Kamakhya.</p>',
            button: {
              text: 'Learn More about Kamakhya',
              url: 'https://en.wikipedia.org/wiki/Kamakhya_Temple'
            }
          }
        },
        {
          type: 'header',
          data: {
            text: '2. Kal Bhairav Temple, Ujjain – Offering Liquor to the Deity',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Kal Bhairav Temple in Ujjain, Madhya Pradesh, is dedicated to Lord Bhairav, a fierce form of Lord Shiva. What makes this temple particularly unusual is that devotees offer liquor to the deity. The priests pour alcohol directly into the idol’s mouth, and it is said that the deity "consumes" it. This unusual offering shocks many first-time visitors, but locals consider it a normal practice to seek blessings from Lord Bhairav.'
          }
        },
        {
          type: 'header',
          data: {
            text: '3. Karni Mata Temple, Rajasthan – Home to Thousands of Rats',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Known as the "Rat Temple," Karni Mata Temple in Deshnoke, Rajasthan, is home to over 25,000 rats. These rats, considered holy, are allowed to freely roam the temple grounds. Devotees believe these rats, known as "Kabbas," are the reincarnations of Karni Mata\'s followers. It is considered extremely lucky to spot a white rat here, as it is believed to be a manifestation of Karni Mata herself. Eating food nibbled by these rats is also considered a blessing, a practice that leaves many visitors stunned.'
          }
        },
        {
          type: 'header',
          data: {
            text: '4. Mehandipur Balaji Temple, Rajasthan – Exorcisms and Healing Rituals',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Situated in Rajasthan\'s Dausa district, Mehandipur Balaji Temple has a reputation for its exorcism ceremonies. People who think evil spirits have taken hold of them or that black magic affects them come to this temple. The exorcism rituals at this place can startle visitors, as people yell, flail about, or do intense physical things to get rid of bad energy. Many believe the temple has the power to heal, and folks from all over India travel here to solve their supernatural issues.'
          }
        },
        {
          type: 'header',
          data: {
            text: '5. Venkateswara Temple, Andhra Pradesh – Hair Offering Ritual',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'The Venkateswara Temple, also known as Tirupati Balaji Temple, is one of the richest and most visited temples in India. One of the most unique customs here is the offering of hair to the deity. Devotees shave their heads as a sign of gratitude or to fulfill a vow. Every day, tons of hair is collected and later auctioned, generating significant revenue for the temple.'
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
            text: 'Indian temples are not merely places for prayers and worship; they are often filled with deep secrets and unusual practices that go beyond what reason and science can explain. These temples are remarkable for their extreme and unusual practices, be it worshiping common rats as gods, giving liquor to idols, cleansing people from associated evil spirits and so on.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Key Takeaways:',
            level: 3
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Kamakhya Temple celebrates menstruation in a divine form.',
              'Kal Bhairav Temple offers liquor as a sacred ritual.',
              'Karni Mata Temple reveres rats as holy beings.',
              'Mehandipur Balaji Temple is famous for its exorcisms.',
              'Venkateswara Temple has a unique hair-offering ritual.'
            ]
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Visiting these mysterious temples in India can be a spine-chilling yet spiritually enriching experience. Each of them offers a glimpse into the intriguing world of India’s ancient traditions and the strong beliefs of its people.'
          }
        }
      ],
      version: '2.22.2'
    };

    const blogData = {
      title: 'Insanely Mysterious Temples in India and Their Strange Rituals That Will Shock You',
      slug: 'insanely-mysterious-temples-in-india-rituals',
      excerpt: 'Indias ancient temples are home to some of the most mysterious and spine-chilling traditions that defy scientific explanation.',
      content: blogContent,
      featuredImage: mainUpload.secure_url,
      image: mainUpload.secure_url,
      author: 'Vedic Travel',
      category: 'Spiritual',
      tags: ['Temples', 'India', 'Mystery', 'Traditions', 'Spiritual'],
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      publishedDate: new Date(),
      seo: {
        title: 'Mysterious Temples in India & Strange Rituals | Vedic Travel',
        description: 'Explore the most mysterious temples in India, from rats in Karni Mata to liquor offerings in Kal Bhairav. Discover strange spiritual traditions.',
        keywords: ['mysterious temples india', 'strange rituals india', 'kamakhya temple menstruation', 'karni mata rat temple', 'mehandipur balaji exorcism']
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
    console.error('Error seeding blog:', error);
    process.exit(1);
  }
}

seed();
