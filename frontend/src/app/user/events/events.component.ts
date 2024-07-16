import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Event[] = [];

  eventsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  paginatedEvents: Event[] = [];

  constructor(private wishlistService: WishlistService, private eventService: EventService) {}

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.events.length / this.eventsPerPage);
    this.updatePaginatedEvents();
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
