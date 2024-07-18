import { PrismaClient, Booking, Ticket } from '@prisma/client';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export class TicketService {
  async generateTicket(bookingId: string, attendeeDetails: { firstName: string; lastName: string; ticketType: string }): Promise<string> {
    // Fetch the booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        event: true,
        TicketBookings: {
          include: {
            ticket: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Generate verification code if it doesn't exist
    // if (!booking.verificationCode) {
    //   const verificationCode = this.generateVerificationCode();
    //   await prisma.booking.update({
    //     where: { id: bookingId },
    //     data: { verificationCode },
    //   });
    //   booking.verificationCode = verificationCode;
    // }

    // Generate QR code using the booking's verification code
    const qrCodeDataUrl = await QRCode.toDataURL(booking.verificationCode || '');
    // Create PDF
    const pdfBuffer = await this.createPDF(booking, attendeeDetails, qrCodeDataUrl);

    // Save PDF to file system (you might want to use cloud storage in production)
    const fileName = `ticket_${bookingId}_${attendeeDetails.firstName}_${attendeeDetails.lastName}.pdf`;
    const filePath = path.join(__dirname, '../../public/tickets', fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Return the file path or URL
    return filePath; // Updated to return file path
  }

  private async createPDF(
    booking: Booking & { user: { firstName: string; lastName: string }; event: any; TicketBookings: { ticket: Ticket }[] },
    attendeeDetails: { firstName: string; lastName: string; ticketType: string },
    qrCodeDataUrl: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50, // Add margins for better readability and aesthetics
      });
      const buffers: Buffer[] = [];
  
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
  
      // Add background color
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff'); // White background
  
      // Add header
      doc.rect(0, 0, doc.page.width, 150).fill('#4a90e2'); // Blue header
      doc.fill('#ffffff').fontSize(30).font('Helvetica-Bold').text('EVENT TICKET', 50, 50);
      doc.fontSize(18).text(booking.event.title, 50, 100);
  
     // Add attendee details
     doc.moveDown(); // Move cursor down for spacing
     doc.fill('#333333').fontSize(14).font('Helvetica-Bold').text('Attendee Information', 50, 300);
     doc.fontSize(12).text(`Name: ${attendeeDetails.firstName} ${attendeeDetails.lastName}`, 50, 330);
     doc.text(`Ticket Type: ${attendeeDetails.ticketType}`, 50, 350);
  
      // // Add attendee details
      // doc.moveDown(); // Move cursor down for spacing
      // doc.fill('#333333').fontSize(14).font('Helvetica-Bold').text('Attendee Information', 50, 300);
      // doc.fontSize(12).text(`Name: ${attendeeDetails.firstName} ${attendeeDetails.lastName}`, 50, 330);
      // booking.TicketBookings.forEach((ticketBooking, index) => {
      //   doc.fontSize(12).text(`Ticket Type ${ticketBooking.ticket.type}`, 50, 400 + index * 20);
      // });    //   doc.text(`Buddy Tickets: ${booking.quantity}`, 50, 370);

  
      // Add QR code
      doc.image(qrCodeDataUrl, 400, 200, { width: 150 }); // Position QR code to the right
      doc.fontSize(10).fill('#666666').text('Scan this QR code at the event', 400, 360);
  
      // Add verification code
      doc.moveDown(); // Move cursor down for spacing
      doc.fontSize(14).fill('#333333').font('Helvetica-Bold').text('Verification Code', 50, 450);
      doc.fontSize(20).fill('#4a90e2').text(booking.verificationCode ?? '', 50, 480);
  
      // Add footer
      doc.fontSize(10).fill('#666666').text('Powered by Plana', { align: 'center' });
  
      doc.end();
    });
  }
}
