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

  constructor(private channelFirebaseService: ChannelFirebaseService){}

  ngOnInit(): void {
    if(this.channelFirebaseService.selectedChannel){
      this.channel = this.channelFirebaseService.selectedChannel; 
    }
  }

  close(){
    this.closeEvent.emit(); 
  }

}
