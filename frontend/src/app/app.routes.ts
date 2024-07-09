import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';
import { EventsComponent } from './user/events/events.component';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './user/event-details/event-details.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'events', component: EventsComponent },
    { path: 'eventdetails/:id', component: EventDetailsComponent },
    { path: 'wishlist', component: WishlistComponent },

    // other routes
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes), CommonModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
