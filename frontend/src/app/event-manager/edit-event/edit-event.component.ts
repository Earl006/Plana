import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { mockEvent, mockCategories } from '../mock-data';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../global/sidebar/sidebar.component';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, TopbarComponent, SidebarComponent],
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string = '';
  categories: any[] = mockCategories;
  posterFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      categoryId: ['', Validators.required],
      tickets: this.fb.array([])
    });
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEventDetails();
  }

  get tickets() {
    return this.eventForm.get('tickets') as FormArray;
  }

  loadEventDetails() {
    // Using mock data instead of API call
    const event = mockEvent;
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      categoryId: event.categoryId
    });
    this.patchTickets(event.tickets);
  }

  patchTickets(tickets: any[]) {
    const ticketFormArray = this.eventForm.get('tickets') as FormArray;
    tickets.forEach(ticket => {
      ticketFormArray.push(this.fb.group({
        type: [ticket.type, Validators.required],
        price: [ticket.price, [Validators.required, Validators.min(0)]],
        quantity: [ticket.quantity, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  onFileSelected(event: any) {
    this.posterFile = event.target.files[0];
  }

  addTicket() {
    const tickets = this.eventForm.get('tickets') as FormArray;
    tickets.push(this.fb.group({
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]]
    }));
  }

  removeTicket(index: number) {
    const tickets = this.eventForm.get('tickets') as FormArray;
    tickets.removeAt(index);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Updated event data:', this.eventForm.value);
      console.log('New poster file:', this.posterFile);
      // In a real application, you would send this data to your API
      // For now, we'll just log it and pretend it was successful
      alert('Event updated successfully!');
      this.router.navigate(['/my-events']);
    }
  }
}