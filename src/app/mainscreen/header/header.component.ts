import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss',  '../../../styles.scss']
})
export class HeaderComponent implements OnInit{

  user: any = new User({
    birthdate: "2000-03-23", 
    fullName: "",
    id:"",
  }) ; 

  showHeaderMenu = false; 
  showHeaderUserProfil = false; 
  editUserMode = false; 

  currentAuthMail = ""; 
  currentUserInput = ""; 

  editUserForm = new FormGroup({
    nameInput: new FormControl( "" , [
      Validators.required, 
      this.nameValidator
    ]),
    emailInput: new FormControl( "", [
      Validators.required,
      Validators.email
    ]),
  
  });

  constructor(private authService:AuthFirebaseService , private userService:UserFirebaseService , private router:Router){}

  async ngOnInit(): Promise<void> {
    //console.log( this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid));
    const user = await this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid);
    this.user = user; 
    this.editUserForm.patchValue({
      nameInput: this.user.fullName, 
      emailInput: this.user.mail
    });
    this.currentAuthMail = this.authService.UserData.email
    this.currentUserInput = this.user.mail; 
  }

  /**
   * Validator for the name input fiel in the edit mode of the user.
   * 
   * @param control - FormControl with a string input
   * @returns - a boolean Value, if the given string have two subelement for fullName.
   */
  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().split(' ').length < 2) {
      return { invalidName: true };
    }
    return null;
  }

  /**
   * loggout the current user. 
   */
  logout(){
    this.showHeaderMenu = false;
    this.authService.logout(); 
    //this.router.navigate(['']);
  }

  /**
   * Show or hide menu. 
   */
  toogleHeaderMenu(){
    this.showHeaderMenu = !this.showHeaderMenu; 
  }

  /**
   * show or hide userprofil
   */
  showProfil(){
    this.showHeaderMenu = false;
    this.showHeaderUserProfil = true; 
  }

  /**
   * Edit the current User and saves the changes in the firebase store. 
   */
  async editUser(){
    const nameinput = this.editUserForm.get("nameInput")?.value;  
    if(nameinput != null){
      //this.user.firstName = nameinput.split(" ", 2)[0]; 
      //this.user.lastName = nameinput.split(" ", 2)[1]; 
    }
    this.user.fullName =  this.editUserForm.get("nameInput")?.value; 
    const mail = this.editUserForm.get("emailInput")?.value
    if(this.currentAuthMail != this.editUserForm.get("emailInput")?.value){
      await this.authService.sendUpdateEmail(mail!);  
      console.log("Email wird erst nach bestätigung geändert");
    }
    this.userService.setCurrentUser(this.user); 
    this.userService.update(this.userService.currentUser);
    //console.log("Current User after Edit:");
    //console.log(this.userService.currentUser);
    // console.log("User Update in Firebase muss noch ergänzt werden!");

  
    

    this.showHeaderUserProfil = false; 
    this.showHeaderMenu = false; 
    this.authService.logout(); 

  }

  closeWithoutSave(){
    this.editUserMode=false
    this.editUserForm.patchValue({
      nameInput: this.user.fullName, 
      emailInput: this.user.mail
    });
    this.currentUserInput = this.user.mail; 
  }
}
