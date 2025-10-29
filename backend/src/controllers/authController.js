const AuthService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res, next) => {
  const { user, token } = await AuthService.register(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { user, token } = await AuthService.login(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
});

module.exports = { register, login };