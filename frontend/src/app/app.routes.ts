import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: 'https://plana-ehci.onrender.com', options: {} };

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
import { BookingSuccessComponent } from './user/booking-success/booking-success.component';
import { AdminGuard, AttendeeGuard, AuthGuard, EventManagerGuard } from './guards/auth-guard.guard';
import { UnauthrorisedComponent } from './unauthrorised/unauthrorised.component';
import { VerifyTicketsComponent } from './event-manager/verify-tickets/verify-tickets.component';

export const routes: Routes = [
  // ATTENDEE
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'events', component: EventsComponent },
  { path: 'eventdetails/:id', component: EventDetailsComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard, AttendeeGuard] },
  { path: 'book-now/:id', component: BookNowComponent, canActivate: [AuthGuard, AttendeeGuard] },
  { path: 'login', component: AuthComponent, data: { mode: 'login' } },
  { path: 'register', component: AuthComponent, data: { mode: 'register' } },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard, AttendeeGuard] },
  { path: 'booking/success', component: BookingSuccessComponent, canActivate: [AuthGuard, AttendeeGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },

  // EVENT MANAGER
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'my-events', component: MyEventsComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'edit-event/:id', component: EditEventComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'attendee-lists', component: AtendeeListsComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'my-calendar', component: MyCalendarComponent, canActivate: [AuthGuard, EventManagerGuard] },
  { path: 'verify/:id', component: VerifyTicketsComponent, canActivate: [AuthGuard, EventManagerGuard] },

  // ADMIN
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-users', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-events', component: AdminEventsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-categories', component: AdminCategoriesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-manager-requests', component: AdminManagerRequestsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin-bookings', component: AdminBookingsComponent, canActivate: [AuthGuard, AdminGuard] },

  // 403 Unauthorized
  { path: 'Unauthorised', component: UnauthrorisedComponent },

  // Catch-all route for undefined routes
  { path: '**', redirectTo: '/Unauthorised' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule, ReactiveFormsModule, BrowserAnimationsModule,SocketIoModule.forRoot(config)],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  exports: [RouterModule]
})
export class AppRoutingModule { }
