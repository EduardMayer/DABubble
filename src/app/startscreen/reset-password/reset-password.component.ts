import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  contactForm: FormGroup;
  isInputActive = false;
  imprint = false;
  privacyPolicy = false;
  oobCode = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthFirebaseService,
    private router: Router
  ) {
    this.contactForm = this.formBuilder.group({
      passwordInput: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-]).*$/)
        ]
      ],
      passwordRepeatInput: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-]).*$/)
        ]
      ],
    });
  }

  /**
 * Angular lifecycle hook called after component initialization.
 * Retrieves the 'oobCode' query parameter from the URL and logs it to the console if present.
 * 
 * @returns {void}
 */
  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('oobCode') != null) {
      this.oobCode = queryParams.get('oobCode')!;
    }
  }

  /**
 * Closes the imprint and privacy policy views by setting their respective flags to false.
 * 
 * @returns {void}
 */
  closeImprintAndPrivacy() {
    this.imprint = false;
    this.privacyPolicy = false;
  }

  /**
 * Determines whether the "New Password" button should be disabled based on form validation.
 * 
 * @returns {boolean} - True if the button should be disabled; false otherwise.
 */
  isButtonDisabled(): boolean {
    const passwordControl = this.contactForm.get('passwordInput');
    const passwordRepeatControl = this.contactForm.get('passwordRepeatInput');

    if (passwordControl && passwordRepeatControl) {
      return (
        !passwordControl.valid ||
        passwordControl.value !== passwordRepeatControl.value ||
        !this.contactForm.valid
      );
    }

    return true;
  }

  /**
 * Resets the user's password using the provided 'oobCode' and new password.
 * Navigates to the home page after successful password reset.
 * 
 * @returns {void}
 */
  newPassword() {
    if (this.contactForm.valid) {
      const queryParams = new URLSearchParams(window.location.search);
      const oobCode = queryParams.get('oobCode');
      const newPassword = this.contactForm.get('passwordInput')!.value;


      if (oobCode) {
        this.authService.applyActionCode(oobCode)
          .then(() => {
            this.authService.confirmPasswordReset(oobCode, newPassword);
            this.router.navigate(['']);
          })
      }
    }
  }
}




