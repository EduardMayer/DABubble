import {Component} from '@angular/core';
import {FormControl, Validators,FormGroup} from '@angular/forms';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorInfo: any = false;
  hide: any;
  
  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthFirebaseService){

  }

  async login(){
    console.log(this.contactForm.value.emailInput);
    console.log(this.contactForm.value.passwordInput);
    if( this.contactForm.value.emailInput  != null && this.contactForm.value.passwordInput != null ){
      
        this.authService.login( this.contactForm.value.emailInput , this.contactForm.value.passwordInput )
        .then((result) => {
          // Handle successful login
          console.log("logged in successfully");
        })
        .catch((error) => {
          // Handle login error here
          console.error('Login failed:', error.message);
        });
    
    }
  }








}


