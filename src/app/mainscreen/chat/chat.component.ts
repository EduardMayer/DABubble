import { ObserversModule } from '@angular/cdk/observers';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Chat } from 'src/models/chat.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ActiveSelectionService } from 'src/services/active-selection.service';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { FormatService } from 'src/services/format.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { UserProfileService } from 'src/services/user-profile.service';

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

  searchText: string = "";
  searchResults: string[] = [];
  testData: string[] = ["hallo", "Test", "Search"];

  constructor(
    public chatService: ChatFirebaseService,
    public userService: UserFirebaseService,
    private userProfileService: UserProfileService,
    private activeSelectionService: ActiveSelectionService,
    public formatService: FormatService
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

    this.selectedChatSubscription = this.chatService.selectedChat$.subscribe((chat) => {
      this.selectedChat = chat;
      // Perform actions when the selected chat changes in the chat component
      // For example, update the chat messages in the UI
      this.loadChat(this.selectedChat);
    });
  }

  
  /**
   * Loads a given chat and opens ist. 
   * @param newSelectedChat - Chat that should be loaded
   */
  private async loadChat(newSelectedChat: Chat) {
    if (newSelectedChat != null) {
      this.chatService.loadChatMessages(newSelectedChat.id);
      this.messagePath = `chats/${newSelectedChat.id}/messages/`;
      try {
        const chatPartner = await this.userService.getUserByUID(this.chatService.getChatPartner(newSelectedChat));
        this.chatPartner = chatPartner;
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    }
  }


  /**
   * Opens profile of chatparter. 
   */
  openProfil() {
    if (this.chatPartner) {
      this.userProfileService.openUserProfil(this.chatPartner);
    }
  }


   /**
   * Returns the time (in a formated form) of a given Message. 
   * @param message - message for that a Time is needed.
   * @returns - Time or string "heute" when it is today. 
   */
  getMessageTime(message: Message) {
    const currentDay = this.formatService.formatDateToDMY(new Date());
    const messageDmy = this.formatService.formatDateToDMY(new Date(message.timestamp));
    if (currentDay == messageDmy) {
      return "heute";
    } else {
      return messageDmy;
    }
  }


  /**
   * Unsubscribe from chat update on destroy 
   */
  ngOnDestroy() {
    if(this.selectedChatSubscription){
      this.selectedChatSubscription.unsubscribe();
    }
  }
}
