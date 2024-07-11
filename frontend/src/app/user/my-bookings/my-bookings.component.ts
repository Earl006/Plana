import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

interface Booking {
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventVenue: string;
  tickets: Ticket[];
  totalPrice: number;
}

interface Ticket {
  type: string;
  count: number;
  price: number;
}

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CommonModule, ConfirmModalComponent],
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  showCancelModal = false;
  bookingToCancel: any;

  constructor() { }

  ngOnInit(): void {
    // Fetch booking data from an API or service
    this.bookings = [
        {
          eventName: 'Concert A',
          eventDate: new Date('2024-08-12'),
          eventTime: '7:00 PM',
          eventVenue: 'Stadium 1',
          tickets: [
            { type: 'VIP', count: 2, price: 50 },
            { type: 'Regular', count: 1, price: 25 }
          ],
          totalPrice: 125
        },
        {
          eventName: 'Concert B',
          eventDate: new Date('2024-09-15'),
          eventTime: '8:00 PM',
          eventVenue: 'Stadium 2',
          tickets: [
            { type: 'Standard', count: 4, price: 50 },
          ],
          totalPrice: 200
        }
    ];
   
  }
  downloadTicket(booking: Booking): void {
    // Handle ticket download logic here
    alert(`Download ticket for ${booking.eventName}`);
  }
  openCancelModal(booking: any) {
    this.bookingToCancel = booking;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
  }
  cancelBooking() {
    // Implement your cancel booking logic here
    const index = this.bookings.indexOf(this.bookingToCancel);
    if (index > -1) {
      this.bookings.splice(index, 1);
    }
    this.closeCancelModal();
  
  }
}
