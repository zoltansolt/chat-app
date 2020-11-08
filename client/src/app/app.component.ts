import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newMessage: string;
  messageList:  string[] = [];
  title: string = 'Chat App';

  constructor(private chatService: ChatService) {
  }

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    console.log(this.newMessage)
    this.newMessage = '';
  }
  ngOnInit() {
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
        console.log('messagelist', this.messageList)
      });
  }
}