import { emailService } from "../services/emailService.js";

export const sendEmail = async (req, res, next) => {
  try {
    const { to, subject, text, from } = req.body;
    await emailService.sendEmail({
      to,
      subject,
      text,
      from,
    });
    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
    });
  } catch (error) {
    next(error);
  }
};
