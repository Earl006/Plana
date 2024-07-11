import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from 'express';
import { NavbarComponent } from '../../global/navbar/navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
