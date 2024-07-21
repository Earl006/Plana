import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../event-manager/global/sidebar/sidebar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service'; // Adjust the import path as needed

interface Notification {
  message: string;
  time: string;
}

interface Event {
  name: string;
  date: Date;
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

  constructor(private userService: UserService) {}

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
    this.upcomingEvents = [
      { name: 'Tech Meetup', date: new Date('2024-08-01'), registered: 120, capacity: 150, status: 'On Track' },
      { name: 'Music Festival', date: new Date('2024-08-15'), registered: 800, capacity: 1000, status: 'Almost Full' },
      { name: 'Food Fair', date: new Date('2024-09-01'), registered: 50, capacity: 200, status: 'Need Promotion' },
    ];
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
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'Almost Full':
        return 'bg-yellow-100 text-yellow-800';
      case 'Need Promotion':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  manageEvent(event: Event) {
    console.log('Managing event:', event.name);
  }

  loadMoreEvents() {
    // Simulating loading more events
    const newEvents: Event[] = [
      { name: 'Business Conference', date: new Date('2024-09-15'), registered: 200, capacity: 300, status: 'On Track' },
      { name: 'Art Exhibition', date: new Date('2024-10-01'), registered: 75, capacity: 150, status: 'Need Promotion' },
    ];
    this.upcomingEvents = [...this.upcomingEvents, ...newEvents];
    this.hasMoreEvents = false; // Assuming no more events after this
  }
}