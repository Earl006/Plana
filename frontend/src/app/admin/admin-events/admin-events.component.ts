import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/events.service';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { response } from 'express';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: {
    id: string;
    name: string;
  };
  managerId: string;
  manager: { id: string; firstName: string; lastName: string };
  posterUrl: string;
  tickets: { type: string; price: number; quantity: number }[];
}
interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
interface Category{
  id:string;
  name: string;
}
@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [TopbarComponent, AdminSidebarComponent, CommonModule, FormsModule],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent implements OnInit {
  events: Event[] = [];
  selectedCategory: string = '';
  selectedManager: string = '';
  managers: Manager[] = [];
  categories: Category[] =[];

  constructor(private eventService: EventService, private userService: UserService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadAllEvents();
    this.loadManagers();
    this.loadCategories();
  }
  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        if (response && response.categories) {
          this.categories = response.categories; 
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe(response => {
      this.events = response.events;

    });
  }
  loadManagers(){

    this.userService.getManagers().subscribe(response=>
    {
      this.managers = response;
      
    }
    )
  }

  loadEventsByCategory(categoryId: string): void {
    if (!categoryId) {
      this.loadAllEvents();
    }else{
    this.eventService.getEventsByCategory(categoryId).subscribe(response => {
      this.events = response.events;
    });
  }
  }

  loadEventsByManager(managerId: string): void {
    if(!managerId){
      this.loadAllEvents();
    }else{
    this.eventService.getEventsByManager(managerId).subscribe(response => {
      this.events = response.events;
      
    });
  }
  }
}
