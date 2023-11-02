import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.scss']
})
export class StartscreenComponent implements OnInit{

  showLogin = true; 
  imprint = false; 
  privacyPolicy = false; 
  showAvatar = false;
  showRegister = false;
  showForgotPassword = false;

  constructor(private authService: AuthFirebaseService , private router: Router){}

  ngOnInit(): void {
    if(this.authService.isLoggedIn() && !this.authService.loginExprired()){
      this.router.navigateByUrl('main'); 
    }
  }

  closeImprintAndPrivacy(){
    this.imprint = false; 
    this.privacyPolicy = false; 
  }

  closeRegister(){
    this.showRegister = false; 
    this.showAvatar = true; 
  }

  closeAvatar(){
    this.showLogin = true;
    this.showAvatar = false;
  }

  closeForgotPassword(){
    this.showLogin = true;
    this.showForgotPassword = false;
  }

  onForgotPasswordLinkClick() {
    this.showLogin = false;
    this.showForgotPassword = true;
  }

}
