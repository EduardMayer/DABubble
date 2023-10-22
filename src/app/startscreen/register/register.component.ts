import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor() {}


  errorInfo: any = false;
  isNameInputActive = false;
  isEmailInputActive = false;
  isPasswordInputActive = false;
  checkboxValue: boolean = false;


  contactForm = new FormGroup({ 
    nameInput: new FormControl('', [Validators.required, Validators.minLength(3)]),
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [Validators.required, Validators.minLength(6)]),
    accept: new FormControl(false) // Das FormControl für die Checkbox
  });

}

