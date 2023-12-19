import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfileService } from 'src/services/user-profile.service';
import { UserStatusFirebaseService } from 'src/services/user-status-firebase.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent{

  user: User = new User(); 
  refreshIntervall = 5000;  

  constructor(
    public userService: UserFirebaseService,
    private userProfileService: UserProfileService, 
    private userStatusService: UserStatusFirebaseService
  ) {

  }

  @Input() set uId(value: string) {

    // Use Promise<User> directly, as getUserByUID returns a Promise<User>
    this.userService.getUserByUID(value)
      .then((loadedUser: User) => {
        this.user = loadedUser;
        //Get Userstatus
        this.userStatusService.getUserStatus(value)
        .then((result) => {
          this.user!.status = result;
          this.checkStatus(); 
        })
        .catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
        console.error('Error loading user:', error);
      });
  }


  /**
  * Opens the user profile for the specified user using the UserProfileService.
  */
  async openUserProfil(user: User) {
    this.userProfileService.openUserProfil(user);
  }


  /**
   * Refreshes the user status in a defined intervall. 
   */
  checkStatus(){
    setInterval(() => {
      if(this.user.id != null || this.user.id != undefined ){
        this.userStatusService.getUserStatus(this.user.id)
        .then((result) => {
          this.user!.status = result;
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }, this.refreshIntervall);
  }

}
