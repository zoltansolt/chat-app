import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private socket: Socket) { }
  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl()
   });
  }

  onSubmit() {
    this.socket.emit("user name added", this.loginForm.value.name);
    this.loginForm.reset();
    this.router.navigate(['/', 'chat']);
  }

}
