import { Component } from '@angular/core';
import { MessageFirebaseService } from 'src/services/message-firebase.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss', '../../../styles.scss']
})
export class ThreadComponent {

constructor(public messageFirebaseService: MessageFirebaseService)  {
  debugger;
console.log(this.messageFirebaseService.message);
this.setmessage();

}

setmessage() {
  setTimeout(() => {
    console.log(this.messageFirebaseService.message);

  }, 9000);
}

}
