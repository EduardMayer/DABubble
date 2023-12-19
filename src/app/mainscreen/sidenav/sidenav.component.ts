import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { User } from 'src/models/user.class';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { WindowSizeService } from 'src/services/window-size.service';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { FormatService } from 'src/services/format.service';
import { AddChannelDialogComponent } from 'src/app/mainscreen/channel/add-channel-dialog/add-channel-dialog.component';

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

  /**
   * Defines services
   * @param dialog 
   * @param channelService 
   * @param chatService 
   * @param userService 
   * @param windowSizeService 
   * @param activeSelectionService 
   * @param formatService 
   */
  constructor(
    public dialog: MatDialog,
    public channelService: ChannelFirebaseService,
    public chatService: ChatFirebaseService,
    public userService: UserFirebaseService,
    private windowSizeService: WindowSizeService,
    private activeSelectionService: ActiveSelectionService,
    private formatService: FormatService
  ) { }


  /**
   * Gets logged in user and sets the current window size in service. 
   */
  ngOnInit(): void {
    this.userService.getUserByUID(JSON.parse(localStorage.getItem('user')!).uid)
      .then((user) => {
        this.currentUser = user
      })
      .catch((error) => {
        console.error(error);
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
    const dialogRef = this.dialog.open(AddChannelDialogComponent, { });
    dialogRef.afterClosed().subscribe(result => { });
  }


  /**
   * Opens view to create a new chat or channel. 
   */
  openNewChatOrChannel(){
    this.activeSelectionService.activeSelection = undefined; 
  }


  /**
   * Shorten a give string 
   * @param stringToShort - string to short
   * @returns - shortened string
   */
    getShortenedString( stringToShort: string) {
      return this.formatService.cutStrLen(stringToShort);
    }
}





