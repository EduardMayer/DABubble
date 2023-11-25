import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';
import { UserStatusFirebaseService } from 'src/services/user-status-firebase.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit {

  @Input() user: User = new User();
  isCurrentUser = false;
  editUserMode = false;

  currentAuthMail = "";
  currentUserInput = "";

  editUserForm = new FormGroup({
    nameInput: new FormControl("", [
      Validators.required,
      this.nameValidator
    ]),
    emailInput: new FormControl("", [
      Validators.required,
      Validators.email
    ]),

  });

  constructor(
    private userProfilService: UserProfilService,
    private userStatusService: UserStatusFirebaseService,
    private userFirebaseService: UserFirebaseService,
    private authService: AuthFirebaseService,
    private chatFirebaseService: ChatFirebaseService, 
    private router: Router) {
  }

  /**
   * Gets the current user status when opening userProfil.
   */
  ngOnInit(): void {
    this.isCurrentUser = this.userFirebaseService.currentUser.id == this.user.id ? true : false;
    console.log("is current user" + this.isCurrentUser);
    this.getStatus();
    this.editUserForm.patchValue({
      nameInput: this.user.fullName, 
      emailInput: this.user.mail
    });
    this.currentAuthMail = this.authService.UserData.email
    this.currentUserInput = this.user.mail; 
  }

  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.trim().split(' ').length < 2) {
      return { invalidName: true };
    }
    return null;
  }
  /**
 * Edit the current User and saves the changes in the firebase store. 
 */
  async editUser() {
    const nameinput = this.editUserForm.get("nameInput")?.value;
    if(nameinput){
      this.user.fullName = nameinput;
    }
    const mail = this.editUserForm.get("emailInput")?.value
    if (this.currentAuthMail != this.editUserForm.get("emailInput")?.value) {
      await this.authService.sendUpdateEmail(mail!);
    }
    this.userFirebaseService.setCurrentUser(this.user);
    this.userFirebaseService.update(this.userFirebaseService.currentUser);

    if (this.currentAuthMail != this.editUserForm.get("emailInput")?.value) {
      this.authService.logout();
    }
  }

  closeWithoutSave() {
    this.editUserMode = false
    this.editUserForm.patchValue({
      nameInput: this.user.fullName,
      emailInput: this.user.mail
    });
    this.currentUserInput = this.user.mail;
  }

  /**
   * Close user profil
   */
  close() {
    this.userProfilService.close();
  }

  /**
   * Gets the current user status from userStatusService. 
   */
  getStatus() {
    this.userStatusService.getUserStatus(this.user.id)
      .then((result) => {
        this.user.status = result;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendMessage(){
    if(this.user && this.userFirebaseService.currentUser){
      let users = []; 
      users.push(this.user.id); 
      users.push(this.userFirebaseService.currentUser.id); 
      console.log(users);
      const chatExists = await this.chatFirebaseService.checkChatExists(users);
      console.log(chatExists);
    }
  }
}
