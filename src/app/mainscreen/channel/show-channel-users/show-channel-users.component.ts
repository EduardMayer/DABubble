import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-show-channel-users',
  templateUrl: './show-channel-users.component.html',
  styleUrls: ['./show-channel-users.component.scss']
})
export class ShowChannelUsersComponent {
  
  @Output() closeEvent = new EventEmitter<any>();

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public activeSelectionService: ActiveSelectionService , 
    private userProfilService: UserProfilService
  ) { }

  openAddMemberMenu(){
    this.closeEvent.emit("editChannelUser");
  }

  close() {
    this.closeEvent.emit();
  }

  
  /**
   * Shows userprofile of given user. 
   * @param user - user for showing in profil
   */
    openProfil(user: User) {
      this.close()
      this.userProfilService.openUserProfil(user);
    }
}
