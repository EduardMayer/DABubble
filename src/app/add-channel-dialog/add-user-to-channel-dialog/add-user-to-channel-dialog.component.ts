import { Component, ElementRef, ViewChild } from '@angular/core';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-add-user-to-channel-dialog',
  templateUrl: './add-user-to-channel-dialog.component.html',
  styleUrls: ['./add-user-to-channel-dialog.component.scss']
})
export class AddUserToChannelDialogComponent {

  selectedOption: string = '';
  public channel = new Channel();
  @ViewChild('selectedUsers', { static: false }) selectedUsers!: ElementRef;

  chooseSelection() {
    console.log(this.selectedOption); // Gibt den aktuell ausgewählten Wert aus
  }

  handleChannelUserUpdate(newChannel: Channel) {
    this.channel = newChannel;
  }
}
