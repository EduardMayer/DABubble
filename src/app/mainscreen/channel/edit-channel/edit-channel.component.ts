import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { WindowSizeService } from 'src/services/window-size.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<any>();
  @Output() addUserEvent = new EventEmitter<any>();

  channel = new Channel();
  editChannelDescription = false;
  editChannelName = false;
  

  NewChannelName: string = "";
  NewChannelDescription: string = "";
  channelCreatorName = "";

  windowWidth: any;

  /**
   * Declares services and subsribe for user window size, for switching between desktop and mobile view. 
   * @param channelService 
   * @param userService 
   * @param windowSizeService 
   */
  constructor(
    private channelService: ChannelFirebaseService,
    private userService: UserFirebaseService,
    private windowSizeService: WindowSizeService
  ) {
    this.windowSizeService.windowWidth$.subscribe(windowWidth => {
      this.windowWidth = windowWidth;
    });
    this.windowSizeService.setWindowSize();
  }

  /**
   * Sets information of the selected channel in this component. 
   */
  ngOnInit(): void {
    if (this.channelService.selectedChannel) {
      this.channel = this.channelService.selectedChannel;
      this.NewChannelName = this.channelService.selectedChannel.channelName;
      this.NewChannelDescription = this.channelService.selectedChannel.channelDescription;
      this.userService.getUserByUID(this.channelService.selectedChannel.creatorOfChannel)
        .then((user) => {
          this.channelCreatorName = user.fullName;
        })
    }
  }


  /**
   * Closes edit channel-dialog
   */
  close() {
    this.closeEvent.emit();
  }


  /**
   * Leave selectedChannel
   */
  leaveChannel() {
    this.channelService.leaveSelectedChannel();
    this.close();
  }


  /**
   * Saves the channel name from input field. 
   */
  async saveChannelName() {
    if (this.channelService.selectedChannel) {
      this.channelService.selectedChannel.channelName = this.NewChannelName;
      await this.channelService.updateChannel(this.channelService.selectedChannel);
      this.channel = this.channelService.selectedChannel;
    }
    this.editChannelName = false;
  }


  /**
   * Saves the description of the description input field. 
   */
  async saveChannelDescription() {
    if (this.channelService.selectedChannel) {
      this.channelService.selectedChannel.channelDescription = this.NewChannelDescription;
      await this.channelService.updateChannel(this.channelService.selectedChannel);
      this.channel = this.channelService.selectedChannel;
    }
    this.editChannelDescription = false;
  }


  /**
   * Move to edit channel users component
   */
  openAddMemberMenu() {
    this.addUserEvent.emit();
    this.close();
  }


  /**
   * returns the useres array of the current selected channel. 
   */
  getCurrentUserChannel() {
    return this.channelService.userOnCurrentChannel
  }
}
