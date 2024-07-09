import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistKey = 'plana_wishlist';

  constructor() { }

  addToWishlist(event: any): void {
    let wishlist: any[] = JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
    console.log('Current Wishlist:', wishlist);
    if (!wishlist.some(e => e.name === event.name)) {
      wishlist.push(event);
      localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
      console.log('Updated Wishlist:', wishlist);
    }
  }
  

  removeFromWishlist(event: any): void {
    let wishlist: any[] = JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
    wishlist = wishlist.filter(e => e.name !== event.name);
    localStorage.setItem(this.wishlistKey, JSON.stringify(wishlist));
  }

  isInWishlist(event: any): boolean {
    let wishlist: any[] = JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
    return wishlist.some(e => e.name === event.name);
  }

  getWishlist(): any[] {
    return JSON.parse(localStorage.getItem(this.wishlistKey) || '[]');
  }
}
