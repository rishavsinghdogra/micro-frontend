import nodemailer from "nodemailer";

class EmailService {
  transporter;
//   testAccount = nodemailer.createTestAccount();
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "alvera.hamill@ethereal.email",
        pass: "zgdYAQcHX4MDQZGUff",
      },
    });
  }
  async sendEmail(options) {
    try {
      const info = await this.transporter.sendMail(options);
      console.log("Email sent successfully to:", options.to);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();