import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent implements OnInit {

  @Output() closeEvent = new EventEmitter<any>();
  channel = new Channel(); 
  editChannelDescription = false; 
  editChannelName = false; 

  NewChannelName: string = ""; 
  NewChannelDescription: string = ""; 

  constructor(private channelFirebaseService: ChannelFirebaseService){}

  ngOnInit(): void {
    if(this.channelFirebaseService.selectedChannel){
      this.channel = this.channelFirebaseService.selectedChannel; 
      this.NewChannelName = this.channelFirebaseService.selectedChannel.channelName; 
      this.NewChannelDescription = this.channelFirebaseService.selectedChannel.channelDescription; 
    }
  }

  close(){
    this.closeEvent.emit(); 
  }

  leaveChannel(){
    this.channelFirebaseService.leaveSelectedChannel(); 
    this.close(); 
  }

  async saveChannelName(){
    if( this.channelFirebaseService.selectedChannel){
      this.channelFirebaseService.selectedChannel.channelName = this.NewChannelName;
      await this.channelFirebaseService.updateChannel(this.channelFirebaseService.selectedChannel);
      this.channel = this.channelFirebaseService.selectedChannel; 
    }
    this.editChannelName = false; 
  }
  async saveChannelDescription(){
    if( this.channelFirebaseService.selectedChannel){
      this.channelFirebaseService.selectedChannel.channelDescription = this.NewChannelDescription;
      await this.channelFirebaseService.updateChannel(this.channelFirebaseService.selectedChannel);
      this.channel = this.channelFirebaseService.selectedChannel; 
    }
    this.editChannelDescription = false; 
  }
}
