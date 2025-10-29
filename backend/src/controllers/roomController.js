const { prisma } = require('../config/database');
const catchAsync = require('../utils/catchAsync');

const getRooms = catchAsync(async (req, res, next) => {
  const rooms = await prisma.chatRoom.findMany({
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      rooms,
    },
  });
});

const createRoom = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const room = await prisma.chatRoom.create({
    data: {
      name,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      room,
    },
  });
});

module.exports = { getRooms, createRoom };