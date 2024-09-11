const nodemailer = require("nodemailer");

// Function to create a transporter based on the email provider
const createTransporter = (emailProvider) => {
  switch (emailProvider) {
    case 'gmail':
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSFOREMAIL,
        },
      });
    case 'outlook':
      return nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSFOREMAIL,
        },
      });
    case 'yahoo':
      return nodemailer.createTransport({
        host: "smtp.mail.yahoo.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSFOREMAIL,
        },
      });
    case 'hotmail':
      return nodemailer.createTransport({
        host: "smtp.live.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSFOREMAIL,
        },
      });
    default:
      throw new Error('El email no es soportado, debe ser Gmail, Hotmail, Outlook o Yahoo');
  }
};

// Example usage: Choose the email provider here
const emailProvider = 'gmail'; // This can be dynamically set based on the provider
const transporter = createTransporter(emailProvider);

// Verify the transporter configuration
transporter.verify().then(() => {
  console.log('Listo para enviar correos');
}).catch((error) => {
  console.log('Error verifying transporter:', error);
});

// Export the transporter
module.exports = { transporter };
