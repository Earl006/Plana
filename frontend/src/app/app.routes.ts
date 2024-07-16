import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';
import { EventsComponent } from './user/events/events.component';
import { EventDetailsComponent } from './user/event-details/event-details.component';
import { WishlistComponent } from './user/wishlist/wishlist.component';
import { BookNowComponent } from './user/book-now/book-now.component';
import { AuthComponent } from './global/auth/auth.component';
import { MyBookingsComponent } from './user/my-bookings/my-bookings.component';
import { ResetPasswordComponent } from './global/reset-password/reset-password.component';
import { EditProfileComponent } from './global/auth/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './global/auth/change-password/change-password.component';
import { DashboardComponent } from './event-manager/dashboard/dashboard.component';
import { MyEventsComponent } from './event-manager/my-events/my-events.component';
import { AddEventComponent } from './event-manager/add-event/add-event.component';
import { EditEventComponent } from './event-manager/edit-event/edit-event.component';
import { AtendeeListsComponent } from './event-manager/atendee-lists/atendee-lists.component';
import { MyCalendarComponent } from './event-manager/my-calendar/my-calendar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminEventsComponent } from './admin/admin-events/admin-events.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminManagerRequestsComponent } from './admin/admin-manager-requests/admin-manager-requests.component';
import { AdminBookingsComponent } from './admin/admin-bookings/admin-bookings.component';

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
  { path: 'profile', component: EditProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'dashboard',component:DashboardComponent},
  { path: 'my-events', component: MyEventsComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'attendee-lists', component:AtendeeListsComponent},
  { path: 'my-calendar', component: MyCalendarComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'admin-users', component: AdminUsersComponent},
  { path: 'admin-events', component:AdminEventsComponent},
  { path: 'admin-categories', component:AdminCategoriesComponent},
  { path: 'admin-manager-requests', component:AdminManagerRequestsComponent},
  { path: 'admin-bookings', component:AdminBookingsComponent}
  // other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule, ReactiveFormsModule, BrowserAnimationsModule,],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  exports: [RouterModule]
})
export class AppRoutingModule { }
