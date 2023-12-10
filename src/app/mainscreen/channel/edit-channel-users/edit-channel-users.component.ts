import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-edit-channel-users',
  templateUrl: './edit-channel-users.component.html',
  styleUrls: ['./edit-channel-users.component.scss']
})
export class EditChannelUsersComponent {

  channelCopy: Channel;
  @Output() closeEvent = new EventEmitter<any>();

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public activeSelectionService: ActiveSelectionService
  ) {
    this.channelCopy = new Channel();

  }

  @Input() set refChannel(value: Channel) {
    this.channelCopy = value;
    console.log(this.channelCopy);
  }

  setClosingEventListener() {
    document.addEventListener('click', (event) => {
      if (event.target != document.getElementById("editChannel")) {
        console.log("Calling close Dialog");
        this.close();
      }
    });

    document.addEventListener('touchstart', (event) => {
      if (event.target != document.getElementById("editChannel")) {
        console.log("Calling close Dialog");
        this.close();
      }
    });

  }


  /**
  * Stores/Saves the updated channel after adding new users. 
  * @param newChannel - updated channel
  */
  handleChannelUserUpdate(newChannel: Channel) {
    this.channelCopy = newChannel;
  }


  /**
  * Saves changes when users where removed or added. 
  */
  saveUserChanges() {
    if (this.channelCopy) {
      this.channelFirebaseService.selectedChannel = this.channelCopy;
      this.channelFirebaseService.updateChannel(this.channelCopy);
      this.channelFirebaseService.loadallChannelusers();
    }
  }


  close() {
    this.closeEvent.emit();
  }
}
