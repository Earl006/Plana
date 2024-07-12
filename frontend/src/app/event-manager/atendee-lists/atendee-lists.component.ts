import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';

interface Attendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketType: string;
  eventId: string;
}

@Component({
  selector: 'app-atendee-lists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TopbarComponent, SidebarComponent, FormsModule],
  templateUrl: './atendee-lists.component.html',
  styleUrls: ['./atendee-lists.component.css']
})
export class AtendeeListsComponent implements OnInit {
  attendees = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', ticketType: 'VIP', eventId: '1' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', ticketType: 'General Admission', eventId: '1' },
    { id: '3', firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', ticketType: 'VIP', eventId: '2' }
    // Add more mock attendees as needed
  ];
  events = [
    { id: '1', name: 'Summer Music Festival' },
    { id: '2', name: 'Winter Wonderland' }
    // Add more mock events as needed
  ];
  filteredAttendees: Attendee[] = [];
  searchQuery = '';
  selectedEventId = '';
  editingAttendee: any = null;
  editAttendeeForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.editAttendeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ticketType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.selectedEventId = params['eventId'] || '';
      this.filterAttendeesByEvent();
    });
  }
  getEventName(eventId: string): string {
    const event = this.events.find(e => e.id === eventId);
    return event ? event.name : 'Unknown Event';
  }
  filterAttendeesByEvent(): void {
    this.filteredAttendees = this.attendees.filter(attendee => 
      this.selectedEventId ? attendee.eventId === this.selectedEventId : true
    );
    this.searchAttendees();
  }

  searchAttendees(): void {
    this.filteredAttendees = this.filteredAttendees.filter(attendee => 
      attendee.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      attendee.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  editAttendee(attendee: any): void {
    this.editingAttendee = attendee;
    this.editAttendeeForm.patchValue(attendee);
  }

  cancelEdit(): void {
    this.editingAttendee = null;
  }

  onUpdateAttendee(): void {
    if (this.editAttendeeForm.valid && this.editingAttendee) {
      const updatedAttendee = { ...this.editingAttendee, ...this.editAttendeeForm.value };
      this.attendees = this.attendees.map(attendee => 
        attendee.id === updatedAttendee.id ? updatedAttendee : attendee
      );
      this.filterAttendeesByEvent(); // Refresh the filtered attendees
      this.cancelEdit();
    }
  }

  deleteAttendee(id: string): void {
    this.attendees = this.attendees.filter(attendee => attendee.id !== id);
    this.filterAttendeesByEvent(); // Refresh the filtered attendees
  }

  onEventChange(event: any): void {
    this.selectedEventId = event.target.value;
    this.filterAttendeesByEvent();
  }
}
