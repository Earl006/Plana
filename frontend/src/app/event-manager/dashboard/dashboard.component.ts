import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, DatePipe, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  managerName = 'John Doe'; 
  totalEvents = 12; 
  totalAttendees = 345;
  revenue = 12345; 
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
