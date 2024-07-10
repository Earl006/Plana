import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

interface Event {
  id: number;
  name: string;
  pricing: string;
  category: string;
  tickets: number;
  description: string;
}

@Component({
  selector: 'app-book-now',
  templateUrl: './book-now.component.html',
  standalone:true,
  imports:[ReactiveFormsModule, CommonModule],
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {
  bookingForm: FormGroup;
  event: Event = {
    id: 1,
    name: 'Event 1',
    pricing: '$10 - $20',
    category: 'Music',
    tickets: 10,
    description: 'This is a music event.'
  };
  ticketTypes = ['General', 'VIP', 'Premium'];

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      tickets: this.fb.array([this.createTicketFormGroup()]),
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get tickets() {
    return this.bookingForm.get('tickets') as FormArray;
  }

  createTicketFormGroup(): FormGroup {
    return this.fb.group({
      ticketType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addNew: [true]  // For managing add button visibility
    });
  }

  addTicket(): void {
    const newTicket = this.createTicketFormGroup();
    const lastTicket = this.tickets.at(this.tickets.length - 1);
    lastTicket.get('addNew')?.setValue(false);  // Disable add button in the last ticket
    this.tickets.push(newTicket);
  }

  calculateTotalPrice(): number {
    const basePrice = 10; // Use your pricing logic here
    return this.tickets.length * basePrice;
  }

  onSubmit(): void {
    console.log(this.bookingForm.value);
    // Handle form submission
  }
}
