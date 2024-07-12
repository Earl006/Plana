import { Component, ViewChild, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendarModule
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../topbar/topbar.component';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { SidebarComponent } from '../global/sidebar/sidebar.component';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, TopbarComponent, SidebarComponent],
  styleUrls: ['./my-calendar.component.css']
})
export class MyCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;

  ngOnInit() {
    this.calendarOptions = {
      initialView: 'dayGridMonth', // Initial view when the calendar loads
      height: 'auto', // Adjust as needed
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      events: [
        // Sample events, replace with your actual data
        { title: 'Event 1', start: '2024-07-15T10:00:00', end: '2024-07-15T12:00:00' },
        { title: 'Event 2', start: '2024-07-16T14:00:00', end: '2024-07-16T16:00:00' },
        // Add more events as needed
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      }
    };
  }
}
