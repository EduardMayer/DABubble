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
  imprint = false; 
  privacyPolicy = false; 

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

  closeImprintAndPrivacy(){
    this.imprint = false; 
    this.privacyPolicy = false; 
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
      const queryParams = new URLSearchParams(window.location.search);
      const oobCode = queryParams.get('oobCode');
      const apiKey = queryParams.get('apiKey');
      const mode = queryParams.get('mode');
      const newPassword = this.contactForm.get('passwordInput')!.value;

      if (oobCode) {
        this.authService.applyActionCode(oobCode)
          .then(() => {
            console.log(oobCode)
            console.log(apiKey)
            console.log(mode)
          
          })
          .catch(error => {
            console.error('Fehler bei der Passwortänderung:', error);
            // Hier kannst du Fehlermeldungen anzeigen oder andere erforderliche Aktionen durchführen.
          });
      }
    }
  }
  

  
}
