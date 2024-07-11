import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  standalone: true,
  imports:[CommonModule],
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() show: boolean = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    this.show = false;
  }

  close() {
    this.closed.emit();
    this.show = false;
  }
}
