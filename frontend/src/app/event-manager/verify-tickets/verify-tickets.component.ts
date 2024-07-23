import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../topbar/topbar.component';
import { AdminSidebarComponent } from "../../admin/admin-sidebar/admin-sidebar.component";

interface Booking {
  id: string;
  event: {
    title: string;
  };
  quantity: number;
  totalPrice: number;
  verificationCode: string;
}

@Component({
  selector: 'app-verify-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TopbarComponent, AdminSidebarComponent],
  templateUrl: './verify-tickets.component.html',
  styleUrl: './verify-tickets.component.css'
})
export class VerifyTicketsComponent implements OnInit {

  verifyForm: FormGroup;
  verifiedBookings: Booking[] = [];
  totalAttendees: number = 0;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.verifyForm = this.fb.group({
      bookingId: ['', Validators.required],
      verificationCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVerifiedBookings();
  }

  loadVerifiedBookings() {
    this.bookingService.getVerifiedBookings().subscribe({
      next: (response: any) => {
        console.log('Raw response:', response);
  
        if (response && response.bookings && Array.isArray(response.bookings)) {
          this.verifiedBookings = response.bookings
            .filter((booking: { verified: any; }) => booking.verified)
            .map((booking: { id: any; event: { title: any; }; quantity: any; totalPrice: string; verificationCode: any; }) => ({
              id: booking.id,
              event: {
                title: booking.event?.title || 'Unknown Event'
              },
              quantity: booking.quantity || 0,
              totalPrice: parseFloat(booking.totalPrice) || 0,
              verificationCode: booking.verificationCode || ''
            }));
  
          this.totalAttendees = this.verifiedBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        } else {
          console.error('Unexpected data structure:', response);
          this.verifiedBookings = [];
          this.totalAttendees = 0;
        }
  
        console.log('Processed verified bookings:', this.verifiedBookings);
        console.log('Total attendees:', this.totalAttendees);
      },
      error: (error) => {
        console.error('Error loading verified bookings', error);
        this.verifiedBookings = [];
        this.totalAttendees = 0;
      }
    });
  }
  onSubmit() {
    if (this.verifyForm.valid) {
      const { bookingId, verificationCode } = this.verifyForm.value;
      this.bookingService.verifyBooking(bookingId, verificationCode).subscribe({
        next: (response) => {
          if (response.valid) {
            alert('Booking verified successfully');
            this.loadVerifiedBookings(); 
          } else {
            alert(response.message);
          }
        },
        error: (error) => console.error('Error verifying booking', error)
      });
    }
  }
}