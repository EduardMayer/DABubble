import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainscreenComponent } from './mainscreen/mainscreen.component';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { authGuard } from 'src/guard/auth-guard.guard';


const routes: Routes = [
  //{ path: '', component: MainscreenComponent },
   /** FOR PROD */ 
  { path: '', component: StartscreenComponent },
  { path: 'main', component: MainscreenComponent, canActivate: [authGuard] },
]
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
