import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Discussion from './models/Discussion.js';
import Comment from './models/Comment.js';
import Message from './models/Message.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_forum');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Discussion.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    console.log('Existing database collections cleared.');

    // 1. Create sample users
    console.log('Creating sample users...');
    const users = await User.create([
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

    const [alex, sophia, liam] = users;
    console.log(`Created ${users.length} sample users.`);

    // 2. Create sample discussions
    console.log('Creating discussions...');
    const discussions = await Discussion.create([
      {
        title: 'Welcome to the CommSphere Community Forum!',
        description: 'Hello everyone! Welcome to CommSphere, a space designed for developers, creators, and learners to discuss engineering projects, share career tips, and chat in real-time. Use the Forum Discussion tab for detailed replies, or switch to the Live Chat Room tab for immediate conversations. Let us know where you are joining from!',
        category: 'Announcements',
        creator: alex._id,
        tags: ['Announcements', 'Introduction', 'WebDev'],
      },
      {
        title: 'How to manage Socket.IO reconnections in production React apps?',
        description: 'I am building a chat application and sometimes the websocket connection drops when switching networks or after long idle periods. What are the best practices for handling reconnect states and buffer messages on the client side without throwing UI exceptions?',
        category: 'Programming',
        creator: sophia._id,
        tags: ['Programming', 'SocketIO', 'React'],
      },
      {
        title: 'What are your top MERN Stack developer interview tips?',
        description: 'I have a technical interview coming up next week for a Full Stack role. Besides basic CRUD and hooks, what advanced topics (e.g. database indexing, JWT rotation, socket scaling) should I focus on? Share your experiences!',
        category: 'Career Advice',
        creator: liam._id,
        tags: ['Career', 'InterviewPrep', 'MERN'],
      },
    ]);

    const [dWelcome, dSocket, dInterview] = discussions;
    console.log(`Created ${discussions.length} discussions.`);

    // 3. Create sample forum comments
    console.log('Creating forum comments...');
    await Comment.create([
      {
        discussion: dWelcome._id,
        creator: sophia._id,
        content: 'Excited to be here! This design looks super clean. I am joining from San Francisco!',
      },
      {
        discussion: dWelcome._id,
        creator: liam._id,
        content: 'Great initiative, Alex. The real-time chat sync is working flawlessly. Joining from London!',
      },
      {
        discussion: dSocket._id,
        creator: alex._id,
        content: 'Great question! In production, you should handle the "disconnect" event by showing a subtle reconnection banner to the user. Socket.IO automatically attempts reconnection by default, but keeping track of the status in React state is crucial.',
      },
      {
        discussion: dInterview._id,
        creator: alex._id,
        content: 'Focus heavily on performance! Interviewers love to ask about database indexing, token expiration schemas, and how Socket.IO manages connections (like sticky sessions behind a load balancer). Good luck!',
      },
    ]);

    // 4. Create sample live messages
    console.log('Creating live messages...');
    await Message.create([
      {
        discussion: dWelcome._id,
        sender: alex._id,
        content: 'Welcome to the live chat channel!',
      },
      {
        discussion: dWelcome._id,
        sender: sophia._id,
        content: 'Hey Alex! Quick live chat test, looks fast!',
      },
      {
        discussion: dWelcome._id,
        sender: liam._id,
        content: 'Agreed. Websocket updates are sub-second.',
      },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
