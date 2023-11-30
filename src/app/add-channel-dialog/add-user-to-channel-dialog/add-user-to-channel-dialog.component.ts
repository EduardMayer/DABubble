import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-add-user-to-channel-dialog',
  templateUrl: './add-user-to-channel-dialog.component.html',
  styleUrls: ['./add-user-to-channel-dialog.component.scss']
})
export class AddUserToChannelDialogComponent implements OnInit {

  constructor(public firebaseChannel: ChannelFirebaseService,
    private userService: UserFirebaseService) {

  }

  ngOnInit() {
    console.log(this.channel);
  }

  selectedOption: string = '';
  public channel = new Channel();
  @ViewChild('selectedUsers', { static: false }) selectedUsers!: ElementRef;

  chooseSelection() {
    console.log(this.selectedOption); // Gibt den aktuell ausgewählten Wert aus
  }

  handleChannelUserUpdate(newChannel: Channel) {
    this.channel = newChannel;
    console.log("channel updated");
    console.log(this.channel)
  }

  createChannel() {
    if (this.selectedOption == '1') {
      this.channel.users = this.userService.loadedUsers.map(user => user.id);
      this.firebaseChannel.updateChannel(this.channel);
    } else {

      this.channel.users.push(this.userService.currentUser.id);
      this.firebaseChannel.updateChannel(this.channel);
    }

  }
}
