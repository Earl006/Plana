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
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  category: { id: string; name: string; }
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  posterUrl: string;
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
  userId: string = '';

  constructor(private router: Router, private authService: AuthService, private eventsService : EventService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!;
    this.loadEvents();
  }
  loadEvents(): void {
    this.eventsService.getEventsByManager(this.userId).subscribe((response: any) => {
      if (response && Array.isArray(response.events)) {
        this.events = response.events;
      } else {
        console.error('Response is not an array:', response);
      }
    });
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