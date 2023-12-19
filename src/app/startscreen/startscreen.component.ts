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
  public introComplete: boolean = false;
 

  constructor(
    private authService: AuthFirebaseService,
    private router: Router
  ){}


  /**
  * Angular lifecycle hook called after component initialization.
  * Redirects to the 'main' route if the user is already logged in and the login session is not expired.
  * 
  * @returns {void}
  */
  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    if(this.authService.isLoggedIn() && !this.authService.loginExprired()){
      this.router.navigateByUrl('index'); 
    }
  }


  /**
  * Closes the imprint and privacy policy views by setting their respective flags to false.
  * 
  * @returns {void}
  */
  closeImprintAndPrivacy(){
    this.imprint = false; 
    this.privacyPolicy = false; 
  }


  /**
  * Closes the registration view and shows the avatar view.
  * 
  * @returns {void}
  */
  closeRegister(){
    this.showRegister = false; 
    this.showAvatar = true; 
  }


  /**
  * Closes the avatar view and shows the login view.
  * 
  * @returns {void}
  */
  closeAvatar(){
    this.showLogin = true;
    this.showAvatar = false;
  }


  /**
  * Closes the forgot password view and shows the login view.
  * 
  * @returns {void}
  */
  closeForgotPassword(){
    this.showLogin = true;
    this.showForgotPassword = false;
  }


  /**
  * Shows the forgot password view and hides the login view.
  * 
  * @returns {void}
  */
  onForgotPasswordLinkClick() {
    this.showLogin = false;
    this.showForgotPassword = true;
  }


  /**
  * Handles the completion of the introduction.
  */
  handleIntroComplete(introComplete: boolean){
    document.body.style.overflow = 'auto';
    this.introComplete=introComplete;
  }


  /**
  * Opens the imprint and sets the privacy policy flag to true.
  */
  handleOpenImprint(){
    this.privacyPolicy=true;
  }
}
