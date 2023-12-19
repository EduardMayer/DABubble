import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  @Output() forgotPasswordLinkClick = new EventEmitter<void>();

  /**
 * Handles the click event on the forgot password link by emitting the `forgotPasswordLinkClick` event.
 * 
 * @emits forgotPasswordLinkClick
 * @returns {void}
 */
  onForgotPasswordLinkClick() {
    this.forgotPasswordLinkClick.emit();
  }

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


  /**
   * Initiates the login process with the provided email and password.
   * Handles login failures by displaying error messages.
   * 
   * @returns {void}
   */
  async login() {
    if (
      this.contactForm.value.emailInput != null &&
      this.contactForm.value.passwordInput != null
    ) {
      this.authService.login(this.contactForm.value.emailInput, this.contactForm.value.passwordInput)
        .catch((error) => {
          const errorCode = error.code;
          console.error(errorCode);

          if (errorCode != null && errorCode != undefined) {
            this.loginErrorMessage = this.authService.getErrorMessage(errorCode);
            this.loginFailed = true;
          }
        });
    }
  }

  /**
 * Initiates a guest login process.
 * 
 * @returns {void}
 */
  async guestLogin() {
    this.authService
      .login(this.guestLoginName, this.guestLoginPassword)
  }

  /**
 * Initiates the login process using Google authentication.
 * 
 * @returns {void}
 */
  loginWithGoogle() {
    this.authService.GoogleAuth();
  }

  /**
 * Toggles the visibility of the password input.
 * 
 * @returns {void}
 */
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }



}
