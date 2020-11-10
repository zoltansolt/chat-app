import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Socket } from "ngx-socket-io";

@Component({
  selector: 'chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss']
})
export class ChatAppComponent implements OnInit {

  constructor(private socket: Socket, private cdr: ChangeDetectorRef) { }
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
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
    this.socket.on('get users', (users: string) => {
      this.userList = [...JSON.parse(users)];
      this.cdr.markForCheck();
    });

    this.socket.on('get history', (messages: string) => {
      this.messages = [...JSON.parse(messages)];
      this.cdr.markForCheck();
    });

    this.socket.on('message', (message: string) => {
      const msg = JSON.parse(message);
      this.messages.push(msg);
      this.cdr.markForCheck();
    });
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  onSubmit() {
    this.socket.emit("message", this.inputForm.value.message);
    this.inputForm.reset();
  }

}
