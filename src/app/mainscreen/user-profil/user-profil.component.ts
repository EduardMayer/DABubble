import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from 'src/models/chat.class';
import { User } from 'src/models/user.class';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { NotificationService } from 'src/services/notification.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfileService } from 'src/services/user-profile.service';
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

  public currentUserId: string ="";
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

  /**
   * Defines services
   * @param userProfileService 
   * @param userStatusService 
   * @param userService 
   * @param authService 
   * @param chatService 
   * @param notificationService 
   * @param router 
   */
  constructor(
    private userProfileService: UserProfileService,
    private userStatusService: UserStatusFirebaseService,
    private userService: UserFirebaseService,
    private authService: AuthFirebaseService,
    private chatService: ChatFirebaseService, 
    private notificationService: NotificationService
    ) {
      this.currentUserId = this.userService.currentUser.id;
  }


  /**
   * Gets the current user status when opening userProfil.
   */
  ngOnInit(): void {
    this.isCurrentUser = this.userService.currentUser.id == this.user.id ? true : false;
    this.getStatus();
    this.editUserForm.patchValue({
      nameInput: this.user.fullName, 
      emailInput: this.user.mail
    });
    this.currentAuthMail = this.authService.UserData.email
    this.currentUserInput = this.user.mail; 
  }


  /**
   * Validates the input value of a form controle if it has not more than two words.
   * @param control - formControl for validation
   * @returns 
   */
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
      this.userService.update(this.user);
      this.userService.setCurrentUser(this.user);
    }
    const mail = this.editUserForm.get("emailInput")?.value
    if (this.currentAuthMail != this.editUserForm.get("emailInput")?.value) {
      const sendSuccessfull = await this.authService.sendUpdateEmail(mail!);
      this.notificationService.renderNotification("E-Mail zur Verifizierung wurde erfolgreich versendet!"); 
      this.close(); 
      setTimeout(() => {
        this.userService.setCurrentUser(this.user);
        if (this.currentAuthMail != this.editUserForm.get("emailInput")?.value) {
          this.authService.logout();
        }
      },  3000 ) ; 
    }
    else{
      location.reload(); 
    }
    this.close(); 
  }


  /**
   * Closes userprofil without saving changes. 
   */
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
    this.userProfileService.close();
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
        console.error(error);
      });
  }

  /**
   * Opens Chat with user. If a chat already exists, chat was openden. If no chat existst, a new one was created!
   */
  async sendMessage(){
    if(this.user && this.userService.currentUser){
      const usersChat = this.chatService.getChatWithUser(this.user.id);  
      if(usersChat){
        this.chatService.selectChat(usersChat.id);
        this.userProfileService.close(); 
      }
      else{
        this.createChat(); 
      }
    }
  }


  /**
   * Creates a new chat between the opened profile user and the current logged in user. 
   */
  createChat() {
    let chat = new Chat({
      users: [this.userService.currentUser.id, this.user.id]
    });
    this.chatService.update(chat).then((chat) => {
      this.chatService.loadedChats.unshift(chat);
      this.chatService.selectChat(chat.id);
      this.close(); 
    }).catch((error) => {
      throw new Error(`Failed to start chat: ${error.message}`);
    });
  }

  /**
   * prevents further propagation of the current event 
   * @param event - Clickevent
   */
  stopPropagation(event:Event){
    event.stopPropagation();
  }


  /**
   * Confirm edits with press enter key
   */
  confirmEdit() {
    if (this.editUserForm.valid) {
      this.editUser();
    }
  }
}

