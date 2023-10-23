import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { LoginComponent } from './startscreen/login/login.component';
import { StartscreenComponent } from './startscreen/startscreen.component';

const routes: Routes = [
  { path: '', component: MainscreenComponent },
  { path: '', component: StartscreenComponent },
  { path: 'login', component: LoginComponent },
  
  { path: 'main', component: MainscreenComponent },
  
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
