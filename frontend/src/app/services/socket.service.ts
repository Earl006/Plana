import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {}

  joinRoom(room: string) {
    this.socket.emit('join', room);
  }

  leaveRoom(room: string) {
    this.socket.emit('leave', room);
  }

  sendMessage(room: string, message: string) {
    this.socket.emit('message', { room, message });
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getNotifications() {
    return this.socket.fromEvent('notification');
  }
}
