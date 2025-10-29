const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const AppError = require('../utils/appError');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  static async register(userData) {
    const { email, username, password } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  static async login(credentials) {
    const { email, password } = credentials;

    // Check if user exists and password is correct
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}

module.exports = AuthService;