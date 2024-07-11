import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';
import { EventsComponent } from './user/events/events.component';
import { EventDetailsComponent } from './user/event-details/event-details.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { BookNowComponent } from './user/book-now/book-now.component';
import { AuthComponent } from './global/auth/auth.component';
import { MyBookingsComponent } from './user/my-bookings/my-bookings.component';
import { ResetPasswordComponent } from './global/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventsComponent },
  { path: 'eventdetails/:id', component: EventDetailsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'book-now/:id', component: BookNowComponent },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule, ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
