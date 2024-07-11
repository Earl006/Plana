import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../global/navbar/navbar.component';

interface Event {
  id: number; // Add the 'id' property
  name: string;
  pricing: string;
  category: string;
  tickets: number;
  img: string;
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Event[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlist = this.wishlistService.getWishlist();
  }

  isInWishlist(event: Event): boolean {
    return this.wishlist.some(e => e.id === event.id);
  }

  toggleWishlist(event: Event): void {
    if (this.isInWishlist(event)) {
      this.removeFromWishlist(event);
    } else {
      this.addToWishlist(event);
    }
  }

  addToWishlist(event: Event): void {
    this.wishlistService.addToWishlist(event);
    this.wishlist = this.wishlistService.getWishlist(); // Refresh wishlist after modification
  }

  removeFromWishlist(event: Event): void {
    this.wishlistService.removeFromWishlist(event);
    this.wishlist = this.wishlistService.getWishlist(); // Refresh wishlist after modification
  }
}
