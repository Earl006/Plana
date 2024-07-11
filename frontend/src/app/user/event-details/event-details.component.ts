import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
import { NavbarComponent } from '../../global/navbar/navbar.component';


interface Event {
  id: number;
  name: string;
  pricing: string;
  category: string;
  tickets: number;
  img: string;
  description?: string;
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
  event: Event[] = [
    {id:1, name: 'Event 1', pricing: '$10 - $20', category: 'Music', tickets: 10, img: 'clubMbuzi.png', description: 'This is a music event.'},
    {id:2, name: 'Event 2', pricing: '$15 - $25', category: 'Sports', tickets: 20, img: 'clubMbuzi.png', description: 'This is a music event.' },
    {id:3, name: 'Event 3', pricing: '$20 - $30', category: 'Theatre', tickets: 15, img: 'clubMbuzi.png', description: 'This is a music event.' },
    {id:4, name: 'Event 4', pricing: '$25 - $35', category: 'Music', tickets: 5, img: 'clubMbuzi.png', description: 'This is a music event.'},
    {id:5, name: 'Event 5', pricing: '$30 - $40', category: 'Sports', tickets: 10, img: 'clubMbuzi.png', description: 'This is a music event.' },
    {id:6, name: 'Event 6', pricing: '$35 - $45', category: 'Theatre', tickets: 8, img: 'clubMbuzi.png', description: 'This is a music event.' },
    {id:7, name: 'Event 7', pricing: '$40 - $50', category: 'Music', tickets: 12, img: 'clubMbuzi.png', description: 'This is a music event.'},
    {id:8, name: 'Event 8', pricing: '$45 - $55', category: 'Sports', tickets: 18, img: 'clubMbuzi.png', description: 'This is a music event.' },
    {id:9, name: 'Event 9', pricing: '$50 - $60', category: 'Theatre', tickets: 25, img: 'clubMbuzi.png', description: 'This is a music event.' }
  ];
  selectevent: Event | undefined;

  constructor(private route: ActivatedRoute, private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.selectevent = this.event.find(event => event.id === eventId);
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
