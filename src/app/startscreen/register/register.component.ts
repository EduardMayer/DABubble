import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {



  constructor(private userService: UserFirebaseService, private authService: AuthFirebaseService, private router: Router) { }

  @Output() closeRegisterView = new EventEmitter<void>();

  isNameInputActive = false;
  isEmailInputActive = false;
  isPasswordInputActive = false;
  isPasswordVisible: boolean = false;
  showPasswordImage: string = 'assets/img/icons/eye.png';
  hidePasswordImage: string = 'assets/img/icons/hideeye.png';
  checkboxValue: boolean = false;
  registrationFailed = false;
  registrationErrorMessage = "";



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


  /**
 * Emits an event to signal the closing of the registration view.
 * 
 * @emits closeRegisterView
 * @returns {void}
 */
  closeRegister() {
    this.closeRegisterView.emit();
  }


  /**
   * Validates the format of the name input.
   * Returns an object with an 'invalidName' property if the name format is invalid.
   * 
   * @param {FormControl} control - The form control for the name input.
   * @returns {{ [key: string]: boolean } | null} - An object with 'invalidName' property if the name is invalid; otherwise, null.
   */
  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().split(' ').length < 2) {
      return { invalidName: true };
    }
    return null;
  }


  /**
 * Validates the format of the password input.
 * Returns an object with an 'invalidPassword' property if the password format is invalid.
 * 
 * @param {FormControl} control - The form control for the password input.
 * @returns {{ [key: string]: boolean } | null} - An object with 'invalidPassword' property if the password is invalid; otherwise, null.
 */
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

  /**
 * Determines whether the registration button should be disabled based on the form validity and checkbox value.
 * 
 * @returns {boolean} - True if the button should be disabled; false otherwise.
 */
  isButtonDisabled() {
    return this.contactForm.invalid || !this.checkboxValue;
  }


  /**
 * Toggles the visibility of the password input.
 * 
 * @returns {void}
 */
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  /**
 * Handles the form submission for user registration.
 * Retrieves input values, attempts user registration, and updates the UI accordingly.
 * 
 * @returns {Promise<void>}
 */
  async onSubmit() {
    const nameInputValue = this.contactForm.get('nameInput')?.value || '';
    const emailInputValue = this.contactForm.get('emailInput')?.value || '';
    const passwordInputValue = this.contactForm.get('passwordInput')?.value || '';
    let registerSuccessful = false;

    this.userService.registUser.fullName = nameInputValue;
    this.userService.registUser.mail = emailInputValue;
    await this.authService.register(emailInputValue, passwordInputValue)
      .then(() => {
        console.log("Registrierung erfolgreich. User wird angelegt");
        this.userService.addRegistUserWithUID(this.userService.registUser.id);
        this.closeRegister();
      })
      .catch((error) => {
        console.log("AuthResponse: ");
        const errorCode = error.code;
        console.log(errorCode);
        if (errorCode != null && errorCode != undefined) {
          this.registrationErrorMessage = this.authService.getErrorMessage(errorCode);
          this.registrationFailed = true;
        }
        return;
      });
  }

}