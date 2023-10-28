import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from 'src/models/message.class';
import { MatCardModule } from '@angular/material/card';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageFirebaseService]
})
export class MessageComponent {

  public _message: Message | undefined;
  public autorName: string="";
  @Output() messageTimestampEvent = new EventEmitter<number>();

  constructor(
    public messageFirebaseService: MessageFirebaseService,
    public userFirebaseService: UserFirebaseService
  ) {

  }

  @Input()
  public set message(value: Message){
   this._message=value;
   this.setAutorName(this._message.autorId);
   
 }

  async setAutorName(autorId: string){
    const autorValues=await this.userFirebaseService.getUserByUID(autorId);
    this.autorName=autorValues.firstName;
  }
  

   

  formatTimestampToHHMM(timestamp: number) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits with leading zero

    return hours + ':' + minutes;
  }
}
