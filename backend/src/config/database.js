const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected with Prisma');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };