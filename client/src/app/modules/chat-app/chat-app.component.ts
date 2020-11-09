import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Socket } from "ngx-socket-io";

@Component({
  selector: 'chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss']
})
export class ChatAppComponent implements OnInit {

  constructor(private socket: Socket, private cdr: ChangeDetectorRef) { }
  inputForm: FormGroup;
  messages: any[] = [];
  userList: any[] = [];
  currentUser: any;

  ngOnInit(): void {
    this.inputForm = new FormGroup({
      message: new FormControl()
   });
   this.initSocketListener();
  }

  private initSocketListener() {
    this.socket.on("get users list", (users: string) => {
      this.userList = [...JSON.parse(users)];
      this.cdr.markForCheck();
    });

    this.socket.on("get messages history", (messages: string) => {
      const historyMessages = [...JSON.parse(messages)];
      this.messages = historyMessages.map(message => {
        return {
          ...message,
          userName: message.user
        };
      });
      this.cdr.markForCheck();
    });

    this.socket.on("message", (message: string) => {
      const msg = JSON.parse(message);
      this.messages = [
        ...this.messages,
        {
          ...msg,
          userName: msg.user
        }
      ];
      this.cdr.markForCheck();
    });

    this.socket.on("user name added", (user: string) => {
      const newUser = JSON.parse(user);
      this.userList = [
        ...this.userList,
        {
          ...newUser,
          isCurrent: this.currentUser
            ? newUser.id === this.currentUser.id
            : false
        }
      ];
      this.cdr.markForCheck();
    });

    this.socket.on("my user added", (user: string) => {
      const createdUser = JSON.parse(user);
      this.currentUser = {
        ...createdUser,
        isCurrent: true
      };
    });
  }

  onSubmit() {
    const text = this.inputForm.value.message;
    const msg: any = {
      text,
      userName: this.currentUser
    };
    this.socket.emit("message", msg);
    this.inputForm.reset();
  }

}
