import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorInfo: any = false;
  isInputActive = false;
  isPasswordInputActive = false;
  isPasswordVisible: boolean = false;
  showPasswordImage: string = 'assets/img/icons/eye.png';
  hidePasswordImage: string = 'assets/img/icons/hideeye.png';

  guestLoginName = 'guest@guest.at';
  guestLoginPassword = 'DABubbleGuest';

  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  loginFailed = false; 
  loginErrorMessage = ""; 

  constructor(private authService: AuthFirebaseService) { }

  firebaseUserService = inject(UserFirebaseService);

  ngOnInit(): void {
    console.log('User Logged In: ' + this.authService.isLoggedIn());
  }

  async login() {
    console.log(this.contactForm.value.emailInput);
    console.log(this.contactForm.value.passwordInput);
    if (
      this.contactForm.value.emailInput != null &&
      this.contactForm.value.passwordInput != null
    ) {
        this.authService.login(this.contactForm.value.emailInput,this.contactForm.value.passwordInput)
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          
          if(errorCode != null && errorCode != undefined){
            this.loginErrorMessage = this.authService.getErrorMessage(errorCode); 
            this.loginFailed = true; 
          }
        });
      }
      
      /*
      .then(() => {
        // Handle successful login
        console.log('logged in successfully');
      })
      .catch((error) => {
        // Handle login error here
        console.error('Login failed:', error.message);
      });
      */
    
  }

  async guestLogin() {
    this.authService
      .login(this.guestLoginName, this.guestLoginPassword)
    /*
    .then((result) => {
      // Handle successful login
      console.log('logged in successfully');
    })
    .catch((error) => {
      // Handle login error here
      console.error('Login failed:', error.message);
    });
    */
  }

  loginWithGoogle() {
    this.authService.GoogleAuth();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
