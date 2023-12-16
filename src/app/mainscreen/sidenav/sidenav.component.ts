import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddChannelDialogComponent } from 'src/app/add-channel-dialog/add-channel-dialog.component';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { User } from 'src/models/user.class';
import { UserProfileService } from 'src/services/user-profile.service';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { WindowSizeService } from 'src/services/window-size.service';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { FormatService } from 'src/services/format.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss', '../../../styles.scss']
})
export class SidenavComponent implements OnInit {

  unpackChannels = false;
  unpackMessages = false;
  currentUser: User = new User();

  selectedChannelID = "";
  windowWidth = 1024; 

  constructor(
    public dialog: MatDialog,
    public channelFirebaseService: ChannelFirebaseService,
    public chatFirebaseService: ChatFirebaseService,
    public userFirebaseService: UserFirebaseService,
    private userProfileService: UserProfileService, 
    private windowSizeService: WindowSizeService,
    private activeSelectionService: ActiveSelectionService,
    public formatService: FormatService
  ) { }

  /**
   * Gets logged in user and sets the current window size in service. 
   */
  ngOnInit(): void {
    this.userFirebaseService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid)
      .then((user) => {
        this.currentUser = user
      })
      .catch((error) => {
        console.log(error);
      });
      this.windowSizeService.windowWidth$.subscribe(windowWidth => {
        this.windowWidth = windowWidth; 
      });
      this.windowSizeService.setWindowSize(); 
  }

 /**
   * Defines if channels in sidenav are visible. 
   */
  showChannels() {
    if (this.unpackChannels == false) {
      this.unpackChannels = true;
    } else {
      this.unpackChannels = false;
    }
  }

  /**
   * Defines if messages (chats) in sidenav are visible. 
   */
  showMessages() {
    if (this.unpackMessages == false) {
      this.unpackMessages = true;
    } else {
      this.unpackMessages = false;
    }
  }

  /**
   * Opens addNewChannelDialog
   */
  openDialog() {
    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Opens view to create a new chat or channel. 
   */
  openNewChatOrChannel(){
    this.activeSelectionService.activeSelection = undefined; 
  }


}





