import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  emailSubmitted: boolean = false;

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

  closeForgotPassword(){
    this.closeForgotPasswordView.emit(); 
  }

  resetPassword() {
    if (this.userService.mailExists(this.email)) {
      this.authService.resetPassword(this.email);
      this.emailSubmitted = true;
      setTimeout(() => {
        this.closeForgotPassword();
      }, 1400);
    } else {
      console.log("User with the provided email does not exist.");
    }
  }


}
