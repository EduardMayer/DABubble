import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  @Output() closeForgotPasswordView = new EventEmitter<void>();

  constructor(private userService: UserFirebaseService, private authService: AuthFirebaseService, private router: Router) { }
  email: string = '';
  errorInfo: any = false;
  isInputActive = false;
  isEmailInputActive = false;
 

  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
  });


  isButtonDisabled(){
    return this.contactForm.invalid;
  }

  passwordReset(){

  }

  closeForgotPassword(){
    this.closeForgotPasswordView.emit(); 
  }

  resetPassword(){
    this.authService.resetPassword(this.email);
  }

}
