import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { LoginComponent } from './startscreen/login/login.component';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { AvatarChooseComponent } from './startscreen/avatar-choose/avatar-choose.component';
import { authGuard } from 'src/guard/auth-guard.guard';

const routes: Routes = [
  //{ path: '', component: AvatarChooseComponent },
  //{ path: '', component: MainscreenComponent },
  { path: 'login', component: LoginComponent },

   /** FOR PROD */ 
  { path: '', component: StartscreenComponent },
  { path: 'main', component: MainscreenComponent, canActivate: [authGuard] },
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
