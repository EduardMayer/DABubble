import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor() {}

  isNameInputActive = false;
  isEmailInputActive = false;
  isPasswordInputActive = false;
  isPasswordVisible: boolean = false;
  showPasswordImage: string = 'assets/img/icons/eye.png';
  hidePasswordImage: string = 'assets/img/icons/hideeye.png';
  checkboxValue: boolean = false;

  contactForm = new FormGroup({
    nameInput: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      this.passwordValidator,
    ]),
  });

  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const hasUppercase = /[A-Z]/.test(control.value);
      const hasSpecialCharacter = /[!@#$%^&*()_+]/.test(control.value);
      if (!hasUppercase || !hasSpecialCharacter) {
        return { invalidPassword: true };
      }
    }
    return null;
  }

  isButtonDisabled() {
    return this.contactForm.invalid || !this.checkboxValue;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
