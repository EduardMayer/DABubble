import {Component} from '@angular/core';
import {FormControl, Validators,FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorInfo: any = false;

  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  








}


