import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
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
  isUserSelected: boolean = false;
  @Output() closeEvent = new EventEmitter<any>();

  @Input() set refChannel(value: Channel) {
    this.channelCopy = value;
  }

  /**
  * Defines Services and declase a new channel to work with in this component. 
  * @param channelService 
  * @param notificationService 
  * @param formatService 
  */
  constructor(
    private channelService: ChannelFirebaseService,
    private notificationService: NotificationService,
    private formatService: FormatService
  ) {
    this.channelCopy = new Channel();
  }


  /**
  * Stores/Saves the updated channel after adding new users. 
  * @param newChannel - updated channel
  */
  handleChannelUserUpdate(newChannel: Channel) {
    this.channelCopy = newChannel;
    this.isUserSelected= this.checkIfUserIsSelected(newChannel);
  }
  

  /**
  * Checks if a user is selected in the specified channel.
  *
  * This function evaluates whether the provided channel exists and contains at least one user.
  *
  * @param {Channel} channel - The channel to check for user selection.
  * @returns {boolean} - True if the channel exists and has at least one user; otherwise, false.
  */
  checkIfUserIsSelected(channel: Channel): boolean {
    return channel && channel.users && channel.users.length > 0;
  }


  /**
  * Saves changes when users where removed or added. 
  */
  saveUserChanges() {
    if (this.channelCopy) {
        this.channelService.selectedChannel = this.channelCopy;
        this.channelService.updateChannel(this.channelCopy);
        this.channelService.loadallChannelusers();
        this.notificationService.renderNotification("Benutzer wurden dem Channel hinzugefügt");
        this.close();
    }
  }


  /**
   * Closes edit channel user popup component 
   */
  close() {
    this.closeEvent.emit();
  }


  /**
   * Returns a shorted string if it is to long. 
   * @param stringToFormat - string that should be shorten
   * @returns shorted string
   */
  getFormatedString(stringToFormat:string){
    return this.formatService.cutStrLen(stringToFormat); 
  }
}
