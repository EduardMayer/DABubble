import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { LoginComponent } from './startscreen/login/login.component';
import { StartscreenComponent } from './startscreen/startscreen.component';

const routes: Routes = [
  
  { path: '', component: MainscreenComponent },
  { path: 'login', component: StartscreenComponent },
  { path: 'main', component: MainscreenComponent },
  { path: '', component: LoginComponent },
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
