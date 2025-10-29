const { prisma } = require('../config/database');
const catchAsync = require('../utils/catchAsync');

const getRoomMessages = catchAsync(async (req, res, next) => {
  const { roomId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const skip = (page - 1) * limit;

  const messages = await prisma.message.findMany({
    where: { room: roomId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: parseInt(skip),
    take: parseInt(limit),
  });

  // Reverse to show oldest first
  messages.reverse();

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});

module.exports = { getRoomMessages };