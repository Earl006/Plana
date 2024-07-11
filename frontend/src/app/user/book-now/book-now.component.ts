import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../global/navbar/navbar.component';

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
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NavbarComponent],
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {
  bookingForm: FormGroup;
  event: Event[] = [
    {id:1, name: 'Event 1', pricing: '$10 - $20', category: 'Music', tickets: 10, description: 'This is a music event.'},
    {id:2, name: 'Event 2', pricing: '$15 - $25', category: 'Sports', tickets: 20, description: 'This is a music event.' },
    {id:3, name: 'Event 3', pricing: '$20 - $30', category: 'Theatre', tickets: 15, description: 'This is a music event.' },
    {id:4, name: 'Event 4', pricing: '$25 - $35', category: 'Music', tickets: 5, description: 'This is a music event.'},
    {id:5, name: 'Event 5', pricing: '$30 - $40', category: 'Sports', tickets: 10, description: 'This is a music event.' },
    {id:6, name: 'Event 6', pricing: '$35 - $45', category: 'Theatre', tickets: 8, description: 'This is a music event.' },
    {id:7, name: 'Event 7', pricing: '$40 - $50', category: 'Music', tickets: 12, description: 'This is a music event.'},
    {id:8, name: 'Event 8', pricing: '$45 - $55', category: 'Sports', tickets: 18, description: 'This is a music event.' },
    {id:9, name: 'Event 9', pricing: '$50 - $60', category: 'Theatre', tickets: 25, description: 'This is a music event.' }
  ];
  ticketTypes = ['General', 'VIP', 'Premium'];

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      tickets: this.fb.array([this.createTicketFormGroup()]),
      phoneNumber: ['', Validators.required]
    });
  }
  selectevent: Event |undefined
  
  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.selectevent = this.event.find(event => event.id === eventId);
  }

  get tickets() {
    return this.bookingForm.get('tickets') as FormArray;
  }

  createTicketFormGroup(): FormGroup {
    return this.fb.group({
      ticketType: [[this.ticketTypes[0]], Validators.required],
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

  removeTicket(index: number): void {
    this.tickets.removeAt(index);
    if (this.tickets.length > 0) {
      const lastTicket = this.tickets.at(this.tickets.length - 1);
      lastTicket.get('addNew')?.setValue(true);  // Enable add button in the new last ticket
    }
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
