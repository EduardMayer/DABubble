import { Component } from '@angular/core';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  constructor(private authService:AuthFirebaseService){}

  logout(){
    this.authService.logout(); 
  }
}
