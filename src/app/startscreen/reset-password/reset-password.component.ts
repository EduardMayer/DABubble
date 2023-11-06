import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  contactForm: FormGroup;
  isInputActive = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserFirebaseService,
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

  newPassword() {
    if (this.contactForm.valid) {
      // Handle password update logic here
    }
  }
}
