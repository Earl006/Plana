import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

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

  eventsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  paginatedEvents: Event[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
    this.updatePaginatedEvents();
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

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEvents();
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
}
