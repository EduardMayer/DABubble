import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  selectedOption: string = '';
  public channel = new Channel();
  @ViewChild('selectedUsers', { static: false }) selectedUsers!: ElementRef;

  constructor(public firebaseChannel: ChannelFirebaseService,
    private userService: UserFirebaseService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
    ) {
  }

  ngOnInit() {
    console.log(this.channel);
  }

  /**
   * Logs the current selected option. 
   */
  chooseSelection() {
    console.log(this.selectedOption); // Gibt den aktuell ausgewählten Wert aus
  }

  /**
   * updates channel object when adding new users. 
   * @param newChannel - channel to create
   */
  handleChannelUserUpdate(newChannel: Channel) {
    this.channel = newChannel;
    console.log("channel updated");
    console.log(this.channel)
  }

  /**
   * Creates a new channel with users based on selected option. (all or selected users)
   */
  createChannel() {
    if (this.selectedOption == '1') {
      this.channel.users = this.userService.loadedUsers.map(user => user.id);
      this.firebaseChannel.updateChannel(this.channel).then(()=>{
        this.closeDialog(); 
      });
    } else {
      this.channel.users.push(this.userService.currentUser.id);
      this.firebaseChannel.updateChannel(this.channel).then(()=>{
        this.closeDialog(); 
      });
    }
  }

  /**
   * Closes add user dialog. 
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

}



