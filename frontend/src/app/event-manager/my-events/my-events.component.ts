import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from "../../global/navbar/navbar.component";
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/events.service';

interface Event {
revenue: any;
totalTickets: any;
ticketsSold: any;
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  categoryId: string;
  posterUrl: string;
  category: {
    id: string;
    name: string;
  };
  tickets: {
    id: string;
    type: string;
    price: string;
    quantity: number;
  }[];
  bookings?: Booking[];

}

interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  quantity: number;
  totalPrice: string;
  status: string;
  verificationCode: string;
  createdAt: string;
  updatedAt: string;
  ticket: {
    id: string;
    eventId: string;
    type: string;
    price: string;
    quantity: number;
  };
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  standalone: true,
  imports: [CancelModalComponent, DatePipe, RouterModule, CommonModule, SidebarComponent, TopbarComponent],
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  showCancelModal = false;
  eventToCancel: Event | null = null;
  userId: string = '';

  constructor(private router: Router, private authService: AuthService, private eventsService: EventService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getEventsByManager(this.userId).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.events)) {
          this.events = response.events.map((event: Event) => ({
            ...event,
            ticketsSold: this.calculateTicketsSold(event),
            totalTickets: this.calculateTotalTickets(event),
            revenue: this.calculateRevenue(event)
          }));
        } else {
          console.error('Response is not an array:', response);
        }
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/edit-event', eventId]);
  }

  manageAttendees(eventId: string): void {
    this.router.navigate(['/manage-attendees', eventId]);
  }

  verifyTickets(eventId: string): void {
    this.router.navigate(['/verify/', eventId]);
  }

  openCancelModal(event: Event): void {
    this.eventToCancel = event;
    console.log('Opening cancel modal for event:', this.eventToCancel);
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.eventToCancel = null;
  }
  private calculateTicketsSold(event: Event): number {
    if (!event.bookings || event.bookings.length === 0) {
      return 0;
    }
  
    return event.bookings.reduce((total, booking) => {
      if (booking.status === 'CONFIRMED') {
        return total + booking.quantity;
      }
      return total;
    }, 0);
  }
  
  private calculateTotalTickets(event: Event): number {
    return event.tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  }
  
  private calculateRevenue(event: Event): number {
    return event.tickets.reduce((total, ticket) => total + (parseInt(ticket.price) * ticket.quantity), 0);
  }

  confirmCancelEvent(): void {
    if (this.eventToCancel) {
      console.log('Cancelling event:', this.eventToCancel);

      this.eventsService.deleteEvent(this.eventToCancel.id).subscribe(
        () => {
          this.events = this.events.filter(event => event.id !== this.eventToCancel!.id);
          this.closeCancelModal();
          this.loadEvents();
          // Optionally, show a success message to the user
        },
        (error) => {
          console.error('Error cancelling event:', error);
        }
      );
    }
  }
}
