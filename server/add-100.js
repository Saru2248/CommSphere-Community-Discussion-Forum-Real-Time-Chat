import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Discussion from './models/Discussion.js';

dotenv.config();

const prefixes = [
  'Exploring new patterns in', 'How we resolved issues with', 'Advanced methods for', 'My tips on',
  'Analyzing bottlenecks of', 'A guide to configuring', 'Solving security loops in', 'Speeding up'
];

const subjects = [
  'React Virtual DOM rendering', 'Node.js event loops', 'Socket.IO payload sizing',
  'MongoDB compound indexing', 'Tailwind CSS container configurations', 'JWT cookies storage',
  'Express async route boundaries', 'Kubernetes pod clusters', 'Redis pub-sub layers',
  'Next.js partial hydration', 'WebSockets frame buffers', 'Mongoose pre-validate hooks'
];

const suffixes = [
  'in cluster environments', 'for client-heavy apps', 'with high availability',
  'inside secure docker networks', 'for enterprise web applications', 'with minimal latency'
];

const categories = ['Announcements', 'Programming', 'Technology', 'Career Advice', 'Support'];

const tagsPool = [
  'React', 'NodeJS', 'MongoDB', 'SocketIO', 'WebDev', 'Express',
  'Tailwind', 'NextJS', 'DevOps', 'Cloud', 'Careers', 'Programming',
  'Backend', 'Frontend', 'Database', 'Security', 'Caching'
];

const loremTexts = [
  'Sharing a quick solution I came up with today. I hope this helps anyone else trying to scale their network pipeline.',
  'Let us run some micro-benchmarks on this architecture. Post your query times below so we can compare findings.',
  'An open request for feedback: does anyone see any security concerns with this implementation approach?',
  'Just finished documenting this workflow for my team and wanted to share it with the community.'
];

const appendDiscussions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_forum');
    console.log('MongoDB Connected to append topics...');

    // Fetch existing users
    const users = await User.find({});
    if (users.length === 0) {
      console.error('No users found. Run standard seed first.');
      process.exit(1);
    }

    console.log(`Generating 100 new topics...`);
    const discussions = [];

    // Get the current highest thread number or count
    const currentCount = await Discussion.countDocuments({});

    for (let i = 1; i <= 100; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const topicNum = currentCount + i;
      const title = `${prefix} ${subject} ${suffix} (#${topicNum})`;
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const creator = users[Math.floor(Math.random() * users.length)]._id;
      
      // Select random tags
      const shuffledTags = [...tagsPool].sort(() => 0.5 - Math.random());
      const tags = shuffledTags.slice(0, 2 + Math.floor(Math.random() * 2));
      
      const description = `${loremTexts[Math.floor(Math.random() * loremTexts.length)]} This is new appended discussion topic #${topicNum}.`;

      discussions.push({
        title,
        description,
        category,
        creator,
        tags,
        createdAt: new Date(), // fresh creation timestamp
      });
    }

    await Discussion.insertMany(discussions);
    console.log('Successfully appended 100 new discussions to the database!');
    process.exit(0);
  } catch (error) {
    console.error(`Error appending topics: ${error.message}`);
    process.exit(1);
  }
};

appendDiscussions();
