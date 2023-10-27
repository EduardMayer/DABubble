import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {
  @Input() channel: any; //Channel, Chat, Thread

  message=new Message();

  constructor(
    private firebaseMessageService: MessageFirebaseService, 
    private firebaseChannelService: ChannelFirebaseService
    ){
   
  }

 async createMessage(){
    console.log(this.message.content);
    this.message.content;
    let messageId=await this.firebaseMessageService.update(this.message);
    if(true){
      this.channel.messages.push(messageId);
      this.firebaseChannelService.update(this.channel);
    }
  }
}
