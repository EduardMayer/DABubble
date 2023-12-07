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

  hoverTitle = false;
  showEditChannel: boolean = false;
  channelCopy: Channel | undefined;

  constructor(
    public channelFirebaseService: ChannelFirebaseService,
    public chatFirebaseService: ChatFirebaseService, 
    public userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService,
    private activeSelectionService: ActiveSelectionService
  ) {
    this.loadChannelMessages();
  }

  loadChannelMessages(){
    let channel=this.activeSelectionService.getActiveSelectionObject() ;
    if (channel instanceof Channel) {
      this.channelFirebaseService.loadChannelMessages(channel.id);// to be changed to currentChannel
      this.messagePath = `channels/${channel.id}/messages/`;
    }
  }


  closeMenus() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.closeMenu();
    }
  }

  closeMenuViewUsersOnChannel() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }

  }

  shouldOpenAddMemberMenu = false;


  openAddMemberMenu() {
    // Verzögerung hinzufügen
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
    if (this.addMemberTrigger) {
      this.addMemberTrigger.openMenu();
    }

  }

  cancelSelection() {
    this.newAddedToChannelUser.fullName = '';

  }


  closeEditDialog() {
    this.showEditChannel = false;
  }

  openProfil(user: User) {
    this.closeMenus()
    this.userProfilService.openUserProfil(user);
  }

  handleChannelUserUpdate(newChannel: Channel) {
    this.channelCopy = newChannel;
  }

  saveUserChanges() {
    if (this.channelCopy) {
      debugger;
      this.channelFirebaseService.selectedChannel = this.channelCopy;
      this.channelFirebaseService.updateChannel(this.channelCopy);
      this.channelFirebaseService.loadallChannelusers();
    }
  }














  getMessageTime(message: Message) {
    const currentDay = this.formatDateToDmy(new Date());
    const messageDmy = this.formatDateToDmy(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }

  formatDateToDmy(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');      // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (add 1 because months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear();                              // Get year
    return `${day}.${month}.${year}`;
  }

}
