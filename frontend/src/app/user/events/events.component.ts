import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { EventService } from '../../services/events.service';
import { CategoryService } from '../../services/category.service';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  posterUrl: string;
  category: {
    name: string;
  };
  tickets: {
    type: string;
    price: string;
    quantity: number;
  }[];
  inWishlist: boolean;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Event[] = [];
  paginatedEvents: Event[] = [];
  categories: Category[] = [];

  eventsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;

  searchKeyword: string = '';
  selectedCategory: string = 'All Categories';

  private searchTimeout: any;

  constructor(
    private wishlistService: WishlistService, 
    private eventService: EventService, 
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(
      (response) => {
        this.events = response.events.map((event: any) => ({
          ...event,
          inWishlist: this.wishlistService.isInWishlist(event)
        }));
        this.filterEvents();
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else {
          console.error('Unexpected response format for categories:', response);
          this.categories = [];
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    );
  }

  filterEvents() {
    let filteredEvents = this.events;

    if (this.searchKeyword) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'All Categories') {
      filteredEvents = filteredEvents.filter(event =>
        event.category.name === this.selectedCategory
      );
    }

    this.totalPages = Math.ceil(filteredEvents.length / this.eventsPerPage);
    this.currentPage = 1; 
    this.updatePaginatedEvents(filteredEvents);
  }

  updatePaginatedEvents(filteredEvents: Event[]): void {
    const start = (this.currentPage - 1) * this.eventsPerPage;
    const end = start + this.eventsPerPage;
    this.paginatedEvents = filteredEvents.slice(start, end).map(event => ({
      ...event,
      inWishlist: this.wishlistService.isInWishlist(event)
    }));
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterEvents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterEvents();
    }
  }

  addToWishlist(event: Event): void {
    this.wishlistService.addToWishlist(event);
    event.inWishlist = true;
  }

  removeFromWishlist(event: Event): void {
    this.wishlistService.removeFromWishlist(event);
    event.inWishlist = false;
  }

  onSearchChange(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchKeyword = target.value;
        this.filterEvents();
      }, 300); 
    }
  }
  
  onCategoryChange(event: any): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedCategory = target.value;
      this.filterEvents();
    }
  }
}