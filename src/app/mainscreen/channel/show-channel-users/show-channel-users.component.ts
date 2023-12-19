import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/models/user.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserProfileService } from 'src/services/user-profile.service';

@Component({
  selector: 'app-show-channel-users',
  templateUrl: './show-channel-users.component.html',
  styleUrls: ['./show-channel-users.component.scss']
})
export class ShowChannelUsersComponent {
  
  @Output() closeEvent = new EventEmitter<any>();

  /**
   * Defines Services
   * @param channelService 
   * @param activeSelectionService 
   * @param userProfileService 
   */
  constructor(
    public channelService: ChannelFirebaseService,
    public activeSelectionService: ActiveSelectionService , 
    private userProfileService: UserProfileService
  ) { }

  /**
   * Moves to edit channel user component
   */
  openAddMemberMenu(){
    this.closeEvent.emit("editChannelUser");
  }

  
  /**
   * Closes show user popup component
   */
  close() {
    this.closeEvent.emit();
  }

  
  /**
   * Shows userprofile of given user. 
   * @param user - user for showing in profil
   */
    openProfil(user: User) {
      this.close()
      this.userProfileService.openUserProfil(user);
    }
}
