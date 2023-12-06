import { ObserversModule } from '@angular/cdk/observers';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Chat } from 'src/models/chat.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../../../styles.scss'],
  providers: [IfChangedService]
})
export class ChatComponent {

  messageTime: string = "";
  messagePath: string = "";
  memberName: string = "";

  chatPartner: User | undefined;
  selectedChat: Chat | undefined | null = undefined;

  private selectedChatSubscription: Subscription | undefined;

  constructor(
    public chatFirebaseService: ChatFirebaseService,
    public userFirebaseService: UserFirebaseService,
    private userProfilService: UserProfilService,
    private activeSelectionService: ActiveSelectionService
  ) {
    this.initChat();
  }


  initChat() {
    //On init the Observable Value doesnt change but gets set so it has toe be done once
    if (this.activeSelectionService.getActiveSelectionObject() instanceof Chat) {
      this.selectedChat = this.activeSelectionService.getActiveSelectionObject();
      if (this.selectedChat) {
        this.loadChat(this.selectedChat);
      }
    }

    this.selectedChatSubscription = this.chatFirebaseService.selectedChat$.subscribe((chat) => {
      this.selectedChat = chat;
      // Perform actions when the selected chat changes in the chat component
      // For example, update the chat messages in the UI
      this.loadChat(this.selectedChat);
    });
  }


  private async loadChat(newSelectedChat: Chat) {
    if (newSelectedChat != null) {
      this.chatFirebaseService.loadChatMessages(newSelectedChat.id);
      this.messagePath = `chats/${newSelectedChat.id}/messages/`;

      try {
        const chatPartner = await this.userFirebaseService.getUserByUID(this.chatFirebaseService.getChatPartner(newSelectedChat));
        this.chatPartner = chatPartner;
      } catch (error) {
        // Handle errors here
        console.error("Error loading chat:", error);
      }
    }
  }




  openProfil() {
    if (this.chatPartner) {
      this.userProfilService.openUserProfil(this.chatPartner);
    }
  }



  searchText: string = "";
  searchResults: string[] = [];

  testData: string[] = ["hallo", "Test", "Search"];

  ngOnDestroy() {
    if(this.selectedChatSubscription){
      this.selectedChatSubscription.unsubscribe();
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
