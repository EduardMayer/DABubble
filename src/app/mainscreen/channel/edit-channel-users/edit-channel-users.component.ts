import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { FormatService } from 'src/services/format.service';
import { NotificationService } from 'src/services/notification.service';

@Component({
  selector: 'app-edit-channel-users',
  templateUrl: './edit-channel-users.component.html',
  styleUrls: ['./edit-channel-users.component.scss']
})
export class EditChannelUsersComponent {

  channelCopy: Channel;
  savingChanges: boolean=false;
  @Output() closeEvent = new EventEmitter<any>();

  constructor(
    private channelService: ChannelFirebaseService,
    public activeSelectionService: ActiveSelectionService,
    private notService: NotificationService,
    public formatService: FormatService
  ) {
    this.channelCopy = new Channel();

  }

  @Input() set refChannel(value: Channel) {
    this.channelCopy = value;
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
        this.channelService.selectedChannel = this.channelCopy;
        this.channelService.updateChannel(this.channelCopy);
        this.channelService.loadallChannelusers();
        this.notService.renderNotification("Benutzer wurden dem Channel hinzugefügt");
        this.close();
    }
  }


  close() {
    this.closeEvent.emit();
  }
}
