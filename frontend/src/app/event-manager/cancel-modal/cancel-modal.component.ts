import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cancel-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
  <div class="p-5 border w-96 shadow-lg rounded-md bg-gray-800 text-white">
    <div class="text-center">
      <h3 class="text-lg leading-6 font-medium text-white">Cancel Event</h3>
      <div class="mt-2 px-7 py-3">
        <p class="text-sm text-gray-400">
          Are you sure you want to cancel this event? This action cannot be undone.
        </p>
      </div>
      <div class="mt-4 flex justify-center space-x-4">
        <button
          (click)="onCancel.emit()"
          class="px-4 py-2 bg-gray-600 text-white text-base font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          No
        </button>
        <button
          (click)="onConfirm.emit()"
          class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
</div>
  `
})
export class CancelModalComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
}