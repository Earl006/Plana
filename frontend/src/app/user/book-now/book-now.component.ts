import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { EventService } from '../../services/events.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

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
  tickets: Ticket[];
  inWishlist: boolean;
}

interface Ticket {
  id: string;
  type: string;
  price: string;
  quantity: number;
}

interface BookingRequest {
  userId: string;
  eventId: string;
  tickets: TicketRequest[];
  attendeeDetails: AttendeeDetail[];
}

interface TicketRequest {
  ticketId: string;
  quantity: number;
}

interface AttendeeDetail {
  firstName: string;
  lastName: string;
  ticketType: string;
}

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {
  bookingForm: FormGroup;
  event: Event | undefined;
  ticketTypes: Ticket[] = [];
  userId:string ='';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.bookingForm = this.fb.group({
      tickets: this.fb.array([]),
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.getEvent(eventId);
    this.userId=this.authService.getUserId()!;
    }
  }

  get tickets() {
    return this.bookingForm.get('tickets') as FormArray;
  }

  getEvent(eventId: string): void {
    this.eventService.getEvent(eventId).subscribe(
      (event: Event) => {
        this.event = event;
        this.ticketTypes = event.tickets;
        this.initForm();
      },
      error => console.error('Error fetching event:', error)
    );
  }

  initForm(): void {
    while (this.tickets.length) {
      this.tickets.removeAt(0);
    }
    this.addTicket();
  }

  createTicketFormGroup(): FormGroup {
    return this.fb.group({
      ticketType: [this.ticketTypes[0]?.type, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addNew: [true]
    });
  }

  addTicket(): void {
    const newTicket = this.createTicketFormGroup();
    if (this.tickets.length > 0) {
      const lastTicket = this.tickets.at(this.tickets.length - 1);
      lastTicket.get('addNew')?.setValue(false);
    }
    this.tickets.push(newTicket);
  }

  removeTicket(index: number): void {
    this.tickets.removeAt(index);
    if (this.tickets.length > 0) {
      const lastTicket = this.tickets.at(this.tickets.length - 1);
      lastTicket.get('addNew')?.setValue(true);
    }
  }

  calculateTotalPrice(): number {
    return this.tickets.controls.reduce((total, ticketControl) => {
      const ticketType = ticketControl.get('ticketType')?.value;
      const price = this.ticketTypes.find(t => t.type === ticketType)?.price;
      return total + (Number(price) || 0);
    }, 0);
  }

  calculateTicketsRemaining(): number {
    return this.event?.tickets?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0;
  }

  createBookingRequest(): BookingRequest {
    const ticketCounts = new Map<string, number>();
    const attendeeDetails: AttendeeDetail[] = [];

    this.tickets.controls.forEach(control => {
      const ticketType = control.get('ticketType')?.value;
      const firstName = control.get('firstName')?.value;
      const lastName = control.get('lastName')?.value;

      attendeeDetails.push({ firstName, lastName, ticketType });

      const ticket = this.ticketTypes.find(t => t.type === ticketType);
      if (ticket) {
        ticketCounts.set(ticket.id, (ticketCounts.get(ticket.id) || 0) + 1);
      }
    });

    const tickets: TicketRequest[] = Array.from(ticketCounts.entries()).map(([ticketId, quantity]) => ({
      ticketId,
      quantity
    }));

    return {
      userId: this.userId,
      eventId: this.event?.id || '',
      tickets,
      attendeeDetails
    };
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.bookingService.createBooking(this.createBookingRequest()).subscribe(
        (response)=>{
          console.log('Booking made successfully');
          this.router.navigate(['/bookings/success']);         
        },
        (error)=>{
          console.log('Error creating booking', error);
          
        }
      )
     
      
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }
}