import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/events.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  standalone: true,
  imports: [TopbarComponent, SidebarComponent, CommonModule, ReactiveFormsModule],
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  step: number = 1;
  progressValue: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  categories: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      categoryId: ['', Validators.required],
      tickets: this.fb.array([]),
      poster: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateProgressValue();
    this.addTicketType();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        if (response && response.categories && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else {
          console.error('Unexpected response format', response);
          this.errorMessage = 'Failed to load categories. Unexpected data format.';
        }
      },
      (error) => {
        console.error('Error loading categories', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
      }
    );
  }

  get tickets() {
    return this.eventForm.get('tickets') as FormArray;
  }

  addTicketType() {
    const ticketType = this.fb.group({
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
    this.tickets.push(ticketType);
  }

  removeTicketType(index: number) {
    this.tickets.removeAt(index);
  }

  nextStep() {
    if (this.step < 3) {
      this.step++;
      this.updateProgressValue();
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
      this.updateProgressValue();
    }
  }

  updateProgressValue() {
    this.progressValue = (this.step - 1) * 50;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.valid) {
      const formData = new FormData();
      
      // Append form fields to FormData
      Object.keys(this.eventForm.value).forEach(key => {
        if (key !== 'tickets' && key !== 'poster') {
          formData.append(key, this.eventForm.get(key)!.value);
        }
      });

      // Append tickets as JSON string
      formData.append('tickets', JSON.stringify(this.eventForm.get('tickets')!.value));

      // Append poster file
      const posterFile = this.eventForm.get('poster')!.value;
      if (posterFile) {
        formData.append('poster', posterFile, posterFile.name);
      }

      this.eventService.createEvent(formData).subscribe(
        response => {
          console.log('Event created successfully', response);
          this.successMessage = 'Event created successfully!';
          setTimeout(() => {
            this.router.navigate(['/my-events']);
          }, 2000);
        },
        error => {
          console.error('Error creating event', error);
          this.errorMessage = 'Error creating event. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.markFormGroupTouched(this.eventForm);
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.eventForm.patchValue({ poster: file });
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}