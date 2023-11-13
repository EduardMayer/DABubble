import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { authGuard } from 'src/guard/auth-guard.guard';
import { ActionHandlerComponent } from './action-handler/action-handler.component';
import { ResetPasswordComponent } from './startscreen/reset-password/reset-password.component';
import { IntroComponent } from './startscreen/intro/intro.component';


const routes: Routes = [
  //{ path: '', component: IntroComponent },
  //{ path: '', component: MainscreenComponent },
   /** FOR PROD */ 
  { path: '', component: StartscreenComponent },
  { path: 'main', component: MainscreenComponent, canActivate: [authGuard] },
  { path: 'userMgmt', component: ActionHandlerComponent },
  { path: 'reset/:oobCode', component: ResetPasswordComponent },
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
