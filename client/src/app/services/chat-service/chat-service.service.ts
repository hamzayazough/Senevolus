import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  opened : boolean = false;



  constructor() { }

  toggleChat() {
    this.opened = !this.opened;
  }
}
