import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/events.service';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: {
    id: string;
    name: string;
  };
  managerId: string;
  posterUrl: string;
  tickets: { type: string; price: number; quantity: number }[];
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [TopbarComponent, AdminSidebarComponent, CommonModule, FormsModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent implements OnInit {
  events: Event[] = [];
  selectedCategory: string = '';
  selectedManager: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe(response => {
      this.events = response.events;
    });
  }

  loadEventsByCategory(categoryId: string): void {
    this.eventService.getEventsByCategory(categoryId).subscribe(response => {
      this.events = response.events;
    });
  }

  loadEventsByManager(managerId: string): void {
    this.eventService.getEventsByManager(managerId).subscribe(response => {
      this.events = response.events;
    });
  }
}
