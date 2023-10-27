import { Component, Input } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent {
  @Input() channel: any; //Channel, Chat, Thread

  message=new Message();

  constructor(private firebaseMessageService: MessageFirebaseService){
   
  }

  createMessage(){
    console.log(this.message.content);
    this.message.content;
    this.firebaseMessageService.update(this.message);
    if(true){
      this.channel.messages.push("messageId");
    }
  }
}
