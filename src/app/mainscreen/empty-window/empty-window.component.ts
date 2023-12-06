import { Component } from '@angular/core';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-empty-window',
  templateUrl: './empty-window.component.html',
  styleUrls: ['./empty-window.component.scss']
})
export class EmptyWindowComponent {
    constructor(
      public channelService: ChannelFirebaseService,
      public userService: UserFirebaseService
    ){

    }
}
