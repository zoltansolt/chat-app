import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatAppComponent } from './modules/chat-app/chat-app.component';
import { LoginComponent } from './modules/login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
