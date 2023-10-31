import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router} from '@angular/router';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  constructor(private userService: UserFirebaseService, private authService: AuthFirebaseService, private router: Router) { }
  
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
      Validators.minLength(5),
      this.nameValidator
    ]),
    emailInput: new FormControl('', [
      Validators.required, Validators.email
    ]),
    passwordInput: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      this.passwordValidator,
    ]),
  });

  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().split(' ').length < 2) {
      return { invalidName: true };
    }
    return null;
  }


  passwordValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const hasUppercase = /[A-Z]/.test(control.value);
      const hasLowercase = /[a-z]/.test(control.value);
      const hasSpecialCharacter = /[!@#$%^&*()_+]/.test(control.value);

      if (!hasUppercase || !hasLowercase || !hasSpecialCharacter) {
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


  async onSubmit() {
    const nameInputValue = this.contactForm.get('nameInput')?.value || '';
    const emailInputValue = this.contactForm.get('emailInput')?.value || '';
    const passwordInputValue = this.contactForm.get('passwordInput')?.value || '';

    if (this.userService.mailExists(emailInputValue)) {
      console.log("Die E-Mail-Adresse existiert bereits.");
    } else {
      this.userService.registUser.fullName = nameInputValue;
      this.userService.registUser.mail = emailInputValue;
      const registerResponse = await this.authService.register(emailInputValue, passwordInputValue);
      console.log("AuthResponse: ");
      console.log(registerResponse);
      this.userService.addRegistUserWithUID(this.userService.registUser.id); 
      this.router.navigate(['avatar']);
    }
  }

}