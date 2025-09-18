import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  body: any;
  attachments?: { 
    filename: string;
    path: string;
    contentType: string;
  }[];
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  try {
    console.log('Creating transport...');
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // Use the env value
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      socketTimeout: 30000, // 30 seconds
      connectionTimeout: 30000, // 30 seconds
    });

    console.log('Transport created successfully');

    const { email, subject, template, body, attachments } = options;
    console.log('Rendering email template...');
    const html: string = await ejs.renderFile(template, body);

    console.log('Email template rendered successfully');

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html,
      attachments, // Add attachments to the mail options
    };

    console.log('Sending email to:', email);
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    throw new Error('Failed to send email. Please try again later.');
  }
};

export default sendMail;