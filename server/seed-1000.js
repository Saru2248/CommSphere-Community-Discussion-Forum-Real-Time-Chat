import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Discussion from './models/Discussion.js';
import Comment from './models/Comment.js';
import Message from './models/Message.js';

dotenv.config();

const prefixes = [
  'How to build', 'Understanding', 'A comprehensive guide to', 'Best practices for',
  'Exploring', 'Solving issues with', 'Tips for mastering', 'An introduction to',
  'Advanced concepts in', 'The future of', 'Performance tuning in', 'Debugging'
];

const subjects = [
  'React Hooks and State', 'Node.js Cluster Scaling', 'Socket.IO Room Events',
  'MongoDB Aggregation Pipelines', 'Tailwind CSS v4 Layouts', 'JWT Token Rotation',
  'Express Middleware Routing', 'Docker Containership', 'Redis Caching Clusters',
  'Next.js Server Actions', 'WebSockets Heartbeats', 'NoSQL Indexes', 'API Rate Limiting'
];

const suffixes = [
  'in production', 'for beginners', 'like a professional', 'under the hood',
  'step-by-step', 'for highly scalable apps', 'with real-time updates',
  'in modern full-stack web apps', 'for robust architectures', 'without memory leaks'
];

const categories = ['General', 'Announcements', 'Programming', 'Technology', 'Career Advice', 'Support'];

const tagsPool = [
  'React', 'NodeJS', 'MongoDB', 'SocketIO', 'WebDev', 'Express',
  'Tailwind', 'NextJS', 'DevOps', 'Cloud', 'Careers', 'Programming',
  'Backend', 'Frontend', 'Database', 'Security', 'Caching'
];

const loremTexts = [
  'I am currently working on a scalable project and looking for some architectural feedback. Has anyone successfully implemented this structure before?',
  'This post details some of the most common issues developers face when deploying these systems. I would love to hear how you deal with reconnection states, database lag, or caching strategies.',
  'Let us open a discussion on this topic. Please share your experiences, benchmark data, or recommended guides to help the community learn.',
  'I have put together some tips after troubleshooting this in a production cluster last week. Let me know if you run into similar bottlenecks!',
  'For a beginner learning full-stack engineering, understanding this concept is crucial. Here is a breakdown of how the client communicates with the server.'
];

const seedLargeData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_forum');
    console.log('MongoDB Connected for large seeding...');

    // Clear discussions, comments, and messages (keep users to avoid re-auth issues, but recreate if empty)
    await Discussion.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared discussions, comments, and messages.');

    // Ensure we have users
    let users = await User.find({});
    if (users.length === 0) {
      console.log('Creating sample users first...');
      users = await User.create([
        {
          username: 'alex_merner',
          email: 'alex@example.com',
          password: 'password123',
          bio: 'MERN stack engineer and open-source enthusiast.',
          avatarColor: '#6366f1',
        },
        {
          username: 'sophia_designer',
          email: 'sophia@example.com',
          password: 'password123',
          bio: 'Creative designer. Love clean UI and glassmorphic aesthetics.',
          avatarColor: '#ec4899',
        },
        {
          username: 'liam_devops',
          email: 'liam@example.com',
          password: 'password123',
          bio: 'Cloud architectures and deployment pipeline specialist.',
          avatarColor: '#10b981',
        },
      ]);
    }

    console.log(`Generating 1000 discussions using ${users.length} active users...`);
    const discussions = [];

    for (let i = 1; i <= 1000; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      
      const title = `${prefix} ${subject} ${suffix} (#${i})`;
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const creator = users[Math.floor(Math.random() * users.length)]._id;
      
      // Select 2-3 random tags
      const shuffledTags = [...tagsPool].sort(() => 0.5 - Math.random());
      const tags = shuffledTags.slice(0, 2 + Math.floor(Math.random() * 2));
      
      const description = `${loremTexts[Math.floor(Math.random() * loremTexts.length)]} This is auto-generated mock thread #${i} for performance testing search indexes, routing, and infinite lists.`;

      discussions.push({
        title,
        description,
        category,
        creator,
        tags,
        createdAt: new Date(Date.now() - i * 60 * 1000), // decrement creation time to stagger them
      });
    }

    // Insert in chunks of 200 to be efficient
    const chunkSize = 200;
    for (let i = 0; i < discussions.length; i += chunkSize) {
      const chunk = discussions.slice(i, i + chunkSize);
      await Discussion.insertMany(chunk);
      console.log(`Inserted discussions ${i + 1} to ${Math.min(i + chunkSize, discussions.length)}`);
    }

    console.log('Seeded 1000 discussions successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Large seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedLargeData();
