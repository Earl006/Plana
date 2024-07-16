import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
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
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
  event: Event[] = [];
  selectevent: Event | undefined;

  constructor(private route: ActivatedRoute, private wishlistService: WishlistService, private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
    } else {
      console.log('No event ID found in route');
      
    }
  }

  loadEventDetails(eventId: string): void {
    this.eventService.getEvent(eventId).subscribe(
      (response) => {
        this.selectevent = response;
      },
      (error) => {
        console.error('Error fetching event details:', error);
        console.log('Error fetching event details:', error);
        
      }
    );
  }
  isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.selectevent);
  }

  toggleWishlist(): void {
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.selectevent);
    } else {
      this.wishlistService.addToWishlist(this.selectevent);
    }
  }

}
