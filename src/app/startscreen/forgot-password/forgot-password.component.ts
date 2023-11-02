import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  @Output() closeForgotPasswordView = new EventEmitter<void>();


  errorInfo: any = false;
  isInputActive = false;
  isEmailInputActive = false;
 

  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
  });


  isButtonDisabled(){
    return this.contactForm.invalid;
  }

  passwordReset(){

  }

  closeForgotPassword(){
    this.closeForgotPasswordView.emit(); 
  }

}
