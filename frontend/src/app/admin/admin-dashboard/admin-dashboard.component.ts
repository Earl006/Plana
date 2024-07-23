import { Component, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service'; // Adjust the import path as needed
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventService } from '../../services/events.service';

interface Notification {
  message: string;
  time: string;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  tickets: any[]; // Replace 'any[]' with the actual type of the 'tickets' property
  registered: number;
  capacity: number;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  standalone: true,
  imports: [AdminSidebarComponent, TopbarComponent, CommonModule, RouterModule],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  eventManagers: number = 0;
  users: number = 0;
  admins: number = 0;
  attendees: number = 0;
  allEvents: number = 120; // You might want to fetch this from an API as well
  revenue: number = 45000; // You might want to fetch this from an API as well
  notifications: Notification[] = [];
  upcomingEvents: Event[] = [];
  hasMoreEvents: boolean = true;

  constructor(private userService: UserService, private http: HttpClient, private eventService: EventService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadNotifications();
    this.loadUpcomingEvents();
  }

  loadDashboardData() {
    this.userService.getUserStats().subscribe(
      (data) => {
        this.users = data.total;
        this.admins = data.byRole.ADMIN;
        this.attendees = data.byRole.ATTENDEE;
        this.eventManagers = data.byRole.EVENT_MANAGER;
      },
      (error) => {
        console.error('Error fetching user stats:', error);
        // Handle error (e.g., show an error message to the user)
      }
    );
  }

  loadNotifications() {
    this.notifications = [
      { message: '5 new registrations for "Tech Meetup"', time: '30 mins ago' },
      { message: '"Music Festival" is at 80% capacity', time: '2 hours ago' },
      { message: 'New vendor application for "Food Fair"', time: '1 day ago' },
    ];
  }

  loadUpcomingEvents() {
    this.fetchEvents().subscribe(
      (events: Event[]) => {
        const now = new Date();
        console.log('Current Date:', now); // Log current date

        this.upcomingEvents = events
          .map(event => ({
            ...event,
            date: new Date(event.date) // Ensure date is a Date object
          }))
          .filter((event: Event) => {
            const eventDate = new Date(event.date);
            console.log(`Event Date: ${eventDate}, Now: ${now}, Is Upcoming: ${eventDate > now}`); // Log event date and comparison
            return eventDate > now;
          })
          .sort((a: Event, b: Event) => a.date.getTime() - b.date.getTime())
          .slice(0, 6)
          .map((event: Event) => ({
            ...event,
            registered: event.tickets.reduce((total, ticket) => total + ticket.quantity, 0),
            capacity: event.tickets.reduce((total, ticket) => total + ticket.quantity, 0), // Replace with actual capacity if available
            status: this.getEventStatus(event)
          }));
        
        console.log('Upcoming events:', this.upcomingEvents); // Log final upcoming events array
      },
      (error) => {
        console.error('Error fetching events:', error);
        // Handle error (e.g., show an error message to the user)
      }
    );
  }

  fetchEvents(): Observable<Event[]> {
    return this.eventService.getAllEvents().pipe(
      map((data: any) => {
        console.log('Fetched events data:', data); // Log the data to inspect it
        if (data && Array.isArray(data.events)) {
          return data.events; // Extract events array
        }
        throw new Error('Unexpected data format');
      }),
      catchError((error) => {
        console.error('Error fetching event stats:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  getEventStatus(event: any): string {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (eventDate > now) {
      return 'Upcoming';
    }
    return 'Past';
  }

  viewReports() {
    console.log('Viewing reports...');
  }

  sendAnnouncements() {
    console.log('Sending announcements...');
  }

  viewAllNotifications() {
    console.log('Viewing all notifications...');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Upcoming':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  manageEvent(event: Event) {
    console.log('Managing event:', event.title);
  }
}
