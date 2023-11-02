import { Component, EventEmitter, Output } from '@angular/core';
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
  
  @Output() closeRegisterView = new EventEmitter<void>();

  isNameInputActive = false;
  isEmailInputActive = false;
  isPasswordInputActive = false;
  isPasswordVisible: boolean = false;
  showPasswordImage: string = 'assets/img/icons/eye.png';
  hidePasswordImage: string = 'assets/img/icons/hideeye.png';
  checkboxValue: boolean = false;

  contactForm = new FormGroup({
    nameInput: new FormControl('',[
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

  registrationFailed = false; 
  registrationErrorMessage = ""; 
  

  closeRegister(){
    this.closeRegisterView.emit(); 
  }

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
      if(errorCode != null && errorCode != undefined){
        this.registrationErrorMessage = this.authService.getErrorMessage(errorCode); 
        this.registrationFailed = true; 
      }
      return; 
    });    
  }

}