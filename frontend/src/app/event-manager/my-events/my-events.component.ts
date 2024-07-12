import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from "../../global/navbar/navbar.component";
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

interface Event {
  id: number;
  name: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  img: string;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  standalone:true,
  imports: [CancelModalComponent, DatePipe, RouterModule, CommonModule, SidebarComponent, TopbarComponent],
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  events: Event[] = [];
  showCancelModal = false;
  eventToCancel: Event | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockEvents();
  }

  loadMockEvents(): void {
    this.events = [
      {
        id: 1,
        name: 'Tech Conference 2024',
        date: new Date('2024-09-15'),
        time: '09:00 AM - 05:00 PM',
        venue: 'Convention Center',
        category: 'Technology',
        ticketsSold: 350,
        totalTickets: 500,
        revenue: 35000,
        img: 'clubMbuzi.png'
      },
      {
        id: 2,
        name: 'Music Festival',
        date: new Date('2024-07-20'),
        time: '12:00 PM - 11:00 PM',
        venue: 'City Park',
        category: 'Music',
        ticketsSold: 5000,
        totalTickets: 7500,
        revenue: 250000,
        img: 'clubMbuzi.png'
      },
      {
        id: 3,
        name: 'Food & Wine Expo',
        date: new Date('2024-10-05'),
        time: '11:00 AM - 08:00 PM',
        venue: 'Exhibition Hall',
        category: 'Culinary',
        ticketsSold: 1200,
        totalTickets: 2000,
        revenue: 60000,
        img: 'clubMbuzi.png'
      }
    ];
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/edit-event', eventId]);
  }

  manageAttendees(eventId: number): void {
    this.router.navigate(['/manage-attendees', eventId]);
  }

  viewReports(eventId: number): void {
    this.router.navigate(['/event-reports', eventId]);
  }

  openCancelModal(event: Event): void {
    this.eventToCancel = event;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.eventToCancel = null;
  }

  confirmCancelEvent(): void {
    if (this.eventToCancel) {
      this.events = this.events.filter(event => event.id !== this.eventToCancel!.id);
      this.closeCancelModal();
      // Optionally, show a success message
    }
  }
}