import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../topbar/topbar.component';
import { AdminSidebarComponent } from "../../admin/admin-sidebar/admin-sidebar.component";
import { booking } from '../../interfaces/types';
import { SidebarComponent } from '../global/sidebar/sidebar.component';

@Component({
  selector: 'app-verify-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TopbarComponent, SidebarComponent],
  templateUrl: './verify-tickets.component.html',
  styleUrl: './verify-tickets.component.css'
})
export class VerifyTicketsComponent implements OnInit {

  verifyForm: FormGroup;
  verifiedBookings:  booking[] = [];
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
    this.bookingService.getVerifiedBookings().subscribe(
      res => {
        console.log(res);
        
        this.verifiedBookings = res.bookings;
        this.totalAttendees = this.verifiedBookings.length
      }
    );
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      const { bookingId, verificationCode } = this.verifyForm.value;
      this.bookingService.verifyBooking(bookingId, verificationCode).subscribe(
        (response) => {
          if (response.valid) {
            alert('Booking verified successfully');
            this.loadVerifiedBookings(); // Reload the verified bookings
          } else {
            alert(response.message);
          }
        },
        (error) => console.error('Error verifying booking', error)
      );
    }
  }
}


