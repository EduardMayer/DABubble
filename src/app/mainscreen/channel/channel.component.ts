import { Component, ViewChild, Input } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserProfilService } from 'src/services/user-profil.service';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  providers: [IfChangedService] // Provide the service at the component level
})
export class ChannelComponent {
  @ViewChild('menuTrigger') menuTrigger?: MatMenuTrigger;
  @ViewChild('addMemberTrigger') addMemberTrigger?: MatMenuTrigger;

  messageTime: string = "";
  messagePath: string = "";
  memberName: string = "";
  newAddedToChannelUser = new User();

  shouldOpenAddMemberMenu = false;

  hoverTitle = false;
  showEditChannel: boolean = false;
  showEditChannelUsers: boolean = false;
  showChannelUsers: boolean = false;


  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public chatFirebaseService: ChatFirebaseService,
    public userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService,
    private activeSelectionService: ActiveSelectionService
  ) {
    this.loadChannelMessages();
  }

  /**
   * Loads the conversation of the channel. 
   */
  loadChannelMessages() {
    let channel = this.activeSelectionService.getActiveSelectionObject();
    if (channel instanceof Channel) {
      this.channelFirebaseService.loadChannelMessages(channel.id);// to be changed to currentChannel
      this.messagePath = `channels/${channel.id}/messages/`;
    }
  }

  /**
   * Closes pop up menu für add members dialog. 
   */
  closeMenus() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.closeMenu();
    }
  }

  /**
  * Closes pop up menu for channel members dialog. 
  */
  closeMenuViewUsersOnChannel() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }

  /**
  * Open add member dialog. 
  */
  openAddMemberMenu() {
    // Verzögerung hinzufügen
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.openMenu();
    }
  }



  /**
 * Closes edit channel dialog
 */
  closeEditDialog() {
    this.showEditChannel = false;
  }

  /**
  * Closes edit channel dialog
  */
  closeEditUsersDialog() {
    this.showEditChannelUsers = false;
  }


  closeShowUsersDialog(option: string="") {
    if(option=='editChannelUser'){
      this.showEditChannelUsers = true;
    }
    this.showChannelUsers = false;
  }


  /**
   * Shows userprofile of given user. 
   * @param user - user for showing in profil
   */
  openProfil(user: User) {
    this.closeMenus()
    this.userProfilService.openUserProfil(user);
  }





  /**
   * Returns the time (in a formated form) of a given Message. 
   * @param message - message for that a Time is needed.
   * @returns - Time or string "heute" when it is today. 
   */
  getMessageTime(message: Message) {
    const currentDay = this.formatDateToDmy(new Date());
    const messageDmy = this.formatDateToDmy(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  /**
   * Formats a given date to a readable pattern. 
   * @param date - date to format
   * @returns - Date as string in Format DD.MM.YYYY like. 01.01.2024 
   */
  formatDateToDmy(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year
    return `${day}.${month}.${year}`;
  }

  closeEditChannelUsers() {
    this.showEditChannelUsers = false;
  }

}
