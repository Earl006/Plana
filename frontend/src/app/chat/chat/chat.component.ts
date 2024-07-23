// src/app/components/chat/chat.component.ts
import { Component, OnInit } from '@angular/core';
import { NotificationChatService } from '../../services/notification-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chatRooms: any[] = [];
  selectedRoom: any = null;
  newMessage: string = '';

  constructor(private notificationChatService: NotificationChatService) {}

  ngOnInit(): void {
    this.loadChatRooms();
  }

  loadChatRooms(): void {
    this.notificationChatService.getChatRooms().subscribe(data => {
      this.chatRooms = data;
    });
  }

  selectRoom(room: any): void {
    this.selectedRoom = room;
    // Load messages for the selected room
  }

  sendMessage(): void {
    if (this.selectedRoom && this.newMessage.trim()) {
      this.notificationChatService.sendMessage(this.selectedRoom.id, this.newMessage).subscribe(() => {
        // Reload messages after sending
        this.newMessage = '';
      });
    }
  }
}
