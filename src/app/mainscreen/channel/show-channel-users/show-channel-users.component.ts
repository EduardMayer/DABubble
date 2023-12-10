import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-show-channel-users',
  templateUrl: './show-channel-users.component.html',
  styleUrls: ['./show-channel-users.component.scss']
})
export class ShowChannelUsersComponent {
  
  @Output() closeEvent = new EventEmitter<any>();

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public activeSelectionService: ActiveSelectionService
  ) {

    console.log(channelFirebaseService.userOnCurrentChannel);
    
  }

  openAddMemberMenu(){
    this.closeEvent.emit("editChannelUser");
  }

  close() {
    this.closeEvent.emit();
  }
}
