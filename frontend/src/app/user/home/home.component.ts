import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { EventService } from '../../services/events.service';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Note the correct 'styleUrls'
})
export class HomeComponent implements OnInit, OnDestroy {
  events: Event[] = [];

  currentSlide = 0;
  private intervalId: any;

  slides = [
    {
      image: 'car.jpg',
      title: 'Automotive Extravaganza',
      text: 'Rev up your excitement! Join us for a high-octane showcase of the latest and greatest in automotive innovation.'
    },
    {
      image: 'concert.jpg',
      title: 'Melodic Nights',
      text: 'Immerse yourself in a world of sound! Experience unforgettable performances by top artists in a night of pure musical magic.'
    },
    {
      image: 'festival.jpg',
      title: 'Cultural Fusion Festival',
      text: 'Celebrate diversity! Dive into a vibrant tapestry of global cultures, cuisines, and performances at our annual festival.'
    },
    {
      image: 'tech.jpg',
      title: 'Tech Revolution Expo',
      text: 'Step into the future! Discover cutting-edge innovations and be part of shaping tomorrow\'s technology today.'
    },
    {
      image: 'product-launch.jpg',
      title: 'Exclusive Product Unveiling',
      text: 'Be the first to witness greatness! Join us for an electrifying reveal of groundbreaking products that will redefine industries.'
    },
    {
      image: 'gaming.jpg',
      title: 'Epic Gaming Championship',
      text: 'Game on! Compete with the best or cheer from the sidelines in this adrenaline-pumping gaming spectacle.'
    }
  ];

  eventsPerPage: number = 3;
  currentPage: number = 1;
  totalPages: number = 1;
  paginatedEvents: Event[] = [];
  isLoggedIn = false;
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';
  filteredEvents: Event[] = [];

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private cd: ChangeDetectorRef,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.startRandomSlideShow();
    this.checkLoginStatus();
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(
      (response) => {
        this.events = response.events.map((event: any) => ({
          ...event,
          inWishlist: this.wishlistService.isInWishlist(event)
        }));
        this.extractCategories();
        this.filterAndSearchEvents(); // This replaces updatePaginatedEvents()
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  extractCategories() {
    const uniqueCategories = [...new Set(this.events.map(event => event.category.name))];
    this.categories = ['All', ...uniqueCategories];
    console.log('Extracted categories:', this.categories); // For debugging
  }

  filterAndSearchEvents() {
    this.filteredEvents = this.events;
  
    if (this.selectedCategory !== 'All') {
      this.filteredEvents = this.filteredEvents.filter(event => event.category.name === this.selectedCategory);
    }
  
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredEvents = this.filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
  
    this.totalPages = Math.ceil(this.filteredEvents.length / this.eventsPerPage);
    this.currentPage = 1;
    this.updatePaginatedEvents();
  }

  updatePaginatedEvents(): void {
    const start = (this.currentPage - 1) * this.eventsPerPage;
    const end = start + this.eventsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(start, end).map(event => ({
      ...event,
      inWishlist: this.wishlistService.isInWishlist(event)
    }));
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEvents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEvents();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startRandomSlideShow() {
    this.intervalId = setInterval(() => {
      this.currentSlide = Math.floor(Math.random() * this.slides.length);
    }, 10000); // Change slide every 10 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetInterval();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetInterval();
  }
  onCategoryChange(event: any): void {
    if (event && event.target && typeof event.target.value === 'string') {
      this.selectedCategory = event.target.value;
      this.filterAndSearchEvents();
    }
  }

  onSearch(event: any): void {
    if (event && event.target && typeof event.target.value === 'string') {
      this.searchTerm = event.target.value;
      this.filterAndSearchEvents();
    }
  }
  private resetInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startRandomSlideShow();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  addToWishlist(event: Event): void {
    this.wishlistService.addToWishlist(event);
    event.inWishlist = true;
    this.updatePaginatedEvents(); // Ensure the UI reflects the change
  }

  removeFromWishlist(event: Event): void {
    this.wishlistService.removeFromWishlist(event);
    event.inWishlist = false;
    this.updatePaginatedEvents(); // Ensure the UI reflects the change
  }

  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
    this.cd.detectChanges();
  }
}
