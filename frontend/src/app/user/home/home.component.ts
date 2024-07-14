import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';

import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../global/navbar/navbar.component';

interface Event {
  inWishlist: boolean;
  id: number;
  name: string;
  pricing: string;
  category: string;
  tickets: number;
  img: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  events: Event[] = [
    {
      id: 1, name: 'Event 1', pricing: '$10 - $20', category: 'Music', tickets: 10, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 2, name: 'Event 2', pricing: '$15 - $25', category: 'Sports', tickets: 20, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 3, name: 'Event 3', pricing: '$20 - $30', category: 'Theatre', tickets: 15, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 4, name: 'Event 4', pricing: '$25 - $35', category: 'Music', tickets: 5, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 5, name: 'Event 5', pricing: '$30 - $40', category: 'Sports', tickets: 10, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 6, name: 'Event 6', pricing: '$35 - $45', category: 'Theatre', tickets: 8, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 7, name: 'Event 7', pricing: '$40 - $50', category: 'Music', tickets: 12, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 8, name: 'Event 8', pricing: '$45 - $55', category: 'Sports', tickets: 18, img: 'clubMbuzi.png',
      inWishlist: false
    },
    {
      id: 9, name: 'Event 9', pricing: '$50 - $60', category: 'Theatre', tickets: 25, img: 'clubMbuzi.png',
      inWishlist: false
    }
  ];

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


  constructor(private router: Router, private wishlistService: WishlistService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.startRandomSlideShow();
    this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
    this.updatePaginatedEvents();
    this.checkLoginStatus();
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