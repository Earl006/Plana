import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { EventService } from '../../services/events.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

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
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    managerId: string;
    categoryId: string;
    posterUrl: string;
  };
  ticket: {
    id: string;
    eventId: string;
    type: string;
    price: string;
    quantity: number;
  };
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent, AdminSidebarComponent, DatePipe],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  categories: any[] = [];
  managers: any[] = [];
  events: any[] = [];

  selectedCategory: string = '';
  selectedManager: string = '';
  selectedEvent: string = '';

  constructor(
    private bookingService: BookingService,
    private categoryService: CategoryService,
    private userService: UserService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadBookings();
    this.loadCategories();
    this.loadManagers();
    this.loadEvents();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe(
      (response: any) => {
        this.bookings = response.bookings;
        this.filteredBookings = this.bookings;
      },
      (error) => {
        console.error('Error loading bookings:', error);
      }
    );
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        console.log('Raw categories response:', response);
        if (response && response.categories) {
          console.log('Categories before processing:', response.categories);
          if (Array.isArray(response.categories)) {
            this.categories = response.categories;
          } else if (typeof response.categories === 'object') {
            this.categories = Object.values(response.categories);
          } else {
            this.categories = [];
          }
          console.log('Processed categories:', this.categories);
        } else {
          console.error('Invalid response format:', response);
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    );
  }

  loadManagers() {
    this.userService.getManagers().subscribe(
      (response: any) => {
        console.log('Raw managers response:', response);
        if (Array.isArray(response)) {
          this.managers = response;
        } else if (response && typeof response === 'object') {
          this.managers = [response]; 
        } else {
          this.managers = [];
        }
        console.log('Processed managers:', this.managers);
      },
      (error) => {
        console.error('Error loading managers:', error);
        this.managers = [];
      }
    );
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(
      (response: any) => {
        console.log('Raw events response:', response);
        if (Array.isArray(response)) {
          this.events = response;
        } else if (response && typeof response === 'object' && response.events) {
          // If the response is an object with an 'events' property
          this.events = Array.isArray(response.events) ? response.events : [response.events];
        } else if (response && typeof response === 'object') {
          // If it's a single event object, wrap it in an array
          this.events = [response];
        } else {
          this.events = [];
        }
        console.log('Processed events:', this.events);
      },
      (error) => {
        console.error('Error loading events:', error);
        this.events = [];
      }
    );
  }

  filterBookings() {
    this.filteredBookings = this.bookings.filter(booking =>
      (!this.selectedCategory || booking.event.categoryId === this.selectedCategory) &&
      (!this.selectedManager || booking.event.managerId === this.selectedManager) &&
      (!this.selectedEvent || booking.eventId === this.selectedEvent)
    );
  }

  resetFilters() {
    this.selectedCategory = '';
    this.selectedManager = '';
    this.selectedEvent = '';
    this.filteredBookings = this.bookings;
  }
}