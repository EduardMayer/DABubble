import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { timeout } from 'rxjs';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { NotificationService } from 'src/services/notification.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  emailSubmitted: boolean = false;

  @Output() closeForgotPasswordView = new EventEmitter<void>();

  constructor(
    private authService: AuthFirebaseService,
    private notificationService: NotificationService
    ) { }
  email: string = '';
  errorInfo: any = false;
  isInputActive = false;
  isEmailInputActive = false;


  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
  });


  /**
 * Checks if the contact form is invalid, determining whether the associated button should be disabled.
 * 
 * @returns {boolean} - True if the contact form is invalid, indicating that the button should be disabled; false otherwise.
 */
  isButtonDisabled() {
    return this.contactForm.invalid;
  }

  
  /**
 * Emits an event to signal the closing of the forgot password view.
 * 
 * @emits closeForgotPasswordView
 * @returns {void}
 */
  closeForgotPassword() {
    this.closeForgotPasswordView.emit();
  }

  /**
  * Initiates the password reset process using the provided email.
  * Marks the email as submitted, and closes the forgot password view after a delay upon successful reset.
  * 
  * @returns {void}
  */
  resetPassword() {
    this.authService.resetPassword(this.email)
      .then(() => {
        this.emailSubmitted = true;
        this.notificationService.renderNotification("E-Mail gesendet");

        setTimeout(() => {
          this.closeForgotPassword();
        }, 1400);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }


}
