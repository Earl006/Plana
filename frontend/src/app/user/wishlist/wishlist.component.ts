import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../global/navbar/navbar.component';

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
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlist = this.wishlistService.getWishlist();
  }

  isInWishlist(event: Event): boolean {
    return this.wishlistService.isInWishlist(event);
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
    this.loadWishlist(); // Refresh wishlist after modification
  }

  removeFromWishlist(event: Event): void {
    this.wishlistService.removeFromWishlist(event);
    this.loadWishlist(); // Refresh wishlist after modification
  }
}
