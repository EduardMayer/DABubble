import { ObserversModule } from '@angular/cdk/observers';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Chat } from 'src/models/chat.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { ChatFirebaseService } from 'src/services/chat-firebase.service';
import { IfChangedService } from 'src/services/if-changed-service.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

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

  chatPartner: User = new User();
  selectedChat: Chat | undefined;
  currentSelectedChat = new Observable();

  private selectedChatSubscription: Subscription;

  constructor(
    public chatFirebaseService: ChatFirebaseService,
    public userFirebaseService: UserFirebaseService
  ) {
    this.selectedChatSubscription = this.chatFirebaseService.selectedChat$.subscribe((chat) => {
      this.selectedChat = chat;
      // Perform actions when the selected chat changes in the chat component
      // For example, update the chat messages in the UI
      this.loadChat(this.selectedChat);
    });
  }

  /*
    if (chatFirebaseService.selectedChat) {
      
      chatFirebaseService.loadChatMessages(chatFirebaseService.selectedChat.id);
      this.messagePath = `chats/${chatFirebaseService.selectedChat.id}/messages/`;
      this.userFirebaseService.getUserByUID(this.chatFirebaseService.getChatPartner(chatFirebaseService.selectedChat))
        .then((chatPartner) => {
          this.chatPartner = chatPartner;
        })
    }
    */


  private loadChat(newSelectedChat: Chat) {
    this.chatFirebaseService.loadChatMessages(newSelectedChat.id);
    this.messagePath = `chats/${newSelectedChat.id}/messages/`;

    this.userFirebaseService
      .getUserByUID(this.chatFirebaseService.getChatPartner(newSelectedChat))
      .then((chatPartner) => {
        this.chatPartner = chatPartner;
      });
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



  searchText: string = "";
  searchResults: string[] = [];

  testData: string[] = ["hallo", "Test", "Search"];


  ngOnInit(): void {
    //this.searchResults = ["Hallo", "Test", "Search"]; 
    //this.userService.load(); 
  }







}
