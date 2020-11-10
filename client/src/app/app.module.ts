import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatAppComponent } from './modules/chat-app/chat-app.component';
import { LoginComponent } from './modules/login/login.component';
import { IpaddressService } from './modules/login/ipaddress.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatAppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [IpaddressService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
