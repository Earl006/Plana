import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

interface Booking {
  id: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventVenue: string;
  tickets: Ticket[];
  totalPrice: number;
  quantity: number;
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
  imports: [CurrencyPipe, DatePipe, CommonModule, ConfirmModalComponent, NavbarComponent],
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  showCancelModal = false;
  bookingToCancel: any;
  userId: string = '';

  constructor(private bookingService: BookingService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    if (this.userId) {
      this.fetchBookings();
    } else {
      console.error('User ID not found');
    }
  }

  fetchBookings(): void {
    this.bookingService.getBooking(this.userId).subscribe(response => {
      console.log('Bookings data:', response);
      const bookingsData = response.bookings || []; 
      if (Array.isArray(bookingsData)) {
        this.bookings = bookingsData.map((booking: any) => ({
          id: booking.id,
          eventName: booking.event.title,
          eventDate: new Date(booking.event.date),
          eventTime: new Date(booking.event.date).toLocaleTimeString(),
          eventVenue: booking.event.location,
          quantity: booking.TicketBookings.length,
          tickets: booking.TicketBookings.map((ticketBooking: any) => ({
            type: ticketBooking.type || 'Unknown', 
            count: ticketBooking.legnth,
            price: ticketBooking.price || 0 
          })),
          totalPrice: booking.totalPrice
        }));
      } else {
        console.error('Unexpected data format:', response);
      }
    }, error => {
      console.error('Error fetching bookings:', error);
    });
  }
  
  

  downloadTicket(booking: Booking): void {
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
    const index = this.bookings.indexOf(this.bookingToCancel);
    if (index > -1) {
      this.bookings.splice(index, 1);
    }
    this.closeCancelModal();
  }
}
