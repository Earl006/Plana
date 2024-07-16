import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';

import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { EventService } from '../../services/events.service';

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
  imports: [CommonModule,RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
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


  constructor(private router: Router, private wishlistService: WishlistService, private cd: ChangeDetectorRef, private eventService: EventService) {}

  ngOnInit() {
    this.startRandomSlideShow();
    this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
    this.updatePaginatedEvents();
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
        this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
        this.updatePaginatedEvents();
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  updatePaginatedEvents(): void {
    const start = (this.currentPage - 1) * this.eventsPerPage;
    const end = start + this.eventsPerPage;
    this.paginatedEvents = this.events.slice(start, end).map(event => ({
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
  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
    console.log(this.isLoggedIn , token);
    this.cd.detectChanges();
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
    }, 10000); // Change slide every 5 seconds
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetInterval();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetInterval();
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
  }

  removeFromWishlist(event: Event): void {
    this.wishlistService.removeFromWishlist(event);
    event.inWishlist = false;
  }
}