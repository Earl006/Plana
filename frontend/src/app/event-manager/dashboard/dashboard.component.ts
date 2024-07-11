import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  managerName = 'John Doe'; // Replace with actual manager name from your data source
  totalEvents = 12; // Replace with actual data
  totalAttendees = 345; // Replace with actual data
  revenue = 12345; // Replace with actual data
  recentActivities = [
    'Added a new event: Annual Conference',
    'Updated event details for: Summer Festival',
    'Checked in attendees for: Music Concert'
  ];
  upcomingEvents = [
    { name: 'Annual Conference', date: new Date('2023-08-12'), location: 'Conference Hall A' },
    { name: 'Summer Festival', date: new Date('2023-08-18'), location: 'Central Park' }
  ]; 

  constructor() { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
