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

  constructor(
    public channelFirebaseService: ChannelFirebaseService , 
    private userFirebaseService: UserFirebaseService, 
    private windowSizeService: WindowSizeService
  ){
    this.windowSizeService.windowWidth$.subscribe(windowWidth => {
      this.windowWidth = windowWidth; 
    });
    this.windowSizeService.setWindowSize(); 
  }

  ngOnInit(): void {
    if(this.channelFirebaseService.selectedChannel){
      this.channel = this.channelFirebaseService.selectedChannel; 
      this.NewChannelName = this.channelFirebaseService.selectedChannel.channelName; 
      this.NewChannelDescription = this.channelFirebaseService.selectedChannel.channelDescription; 
      this.userFirebaseService.getUserByUID(this.channelFirebaseService.selectedChannel.creatorOfChannel)
      .then((user) => { 
        this.channelCreatorName = user.fullName; 
      }) 
    }
  }

  /**
   * Closes edit channel-dialog
   */
  close(){
    this.closeEvent.emit(); 
  }

  /**
   * Leave selectedChannel
   */
  leaveChannel(){
    this.channelFirebaseService.leaveSelectedChannel(); 
    this.close(); 
  }

  /**
   * Saves the channel name from input field. 
   */
  async saveChannelName(){
    if( this.channelFirebaseService.selectedChannel){
      this.channelFirebaseService.selectedChannel.channelName = this.NewChannelName;
      await this.channelFirebaseService.updateChannel(this.channelFirebaseService.selectedChannel);
      this.channel = this.channelFirebaseService.selectedChannel; 
    }
    this.editChannelName = false; 
  }

  /**
   * Saves the description of the description input field. 
   */
  async saveChannelDescription(){
    if( this.channelFirebaseService.selectedChannel){
      this.channelFirebaseService.selectedChannel.channelDescription = this.NewChannelDescription;
      await this.channelFirebaseService.updateChannel(this.channelFirebaseService.selectedChannel);
      this.channel = this.channelFirebaseService.selectedChannel; 
    }
    this.editChannelDescription = false; 
  }

  openAddMemberMenu(){
    this.addUserEvent.emit();
    console.log("emit in child");
    
    this.close(); 
  }
}
