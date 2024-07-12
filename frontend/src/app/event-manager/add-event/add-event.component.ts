// src/app/my-calendar/my-calendar.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../global/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  standalone:true,
  imports:[TopbarComponent, SidebarComponent, CommonModule, ReactiveFormsModule],
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  step: number = 1;
  progressValue: number = 0;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      basicInfo: this.fb.group({
        name: [''],
        description: [''],
        category: [''],
        date: [''],
        time: [''],
        venue: ['']
      }),
      ticketInfo: this.fb.group({
        ticketTypes: this.fb.array([])
      }),
      additionalInfo: this.fb.group({
        posterImage: ['']
      })
    });
  }

  ngOnInit(): void {
    this.updateProgressValue();
  }

  get ticketTypes() {
    return this.eventForm.get('ticketInfo.ticketTypes') as FormArray;
  }

  addTicketType() {
    const ticketType = this.fb.group({
      name: [''],
      price: [''],
      quantity: ['']
    });
    this.ticketTypes.push(ticketType);
  }

  removeTicketType(index: number) {
    this.ticketTypes.removeAt(index);
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
    // Handle form submission
    console.log(this.eventForm.value);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.eventForm.get('additionalInfo.posterImage')!.setValue(file);
  }
}
