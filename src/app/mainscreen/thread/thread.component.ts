import { Component } from '@angular/core';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss', '../../../styles.scss']
})
export class ThreadComponent {

  answer: any;

constructor(public messageFirebaseService: MessageFirebaseService, public channelFirebaseService: ChannelFirebaseService)  {

}



}
