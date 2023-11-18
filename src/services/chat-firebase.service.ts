import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, orderBy } from "firebase/firestore";
import { Chat } from '../models/chat.class';
import { Message } from 'src/models/message.class';
import { GenerateIdService } from './generate-id.service';
import { UserFirebaseService } from './user-firebase.service';
import { Observable, Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ChatFirebaseService {
    public loadedChats: Chat[] = [];
    private unsubChats: any;

    public loadedChat: Chat | undefined;
    private unsubChat: any;

    selectedChatId: string | undefined;
    selectedChat: Chat | undefined;
    currentChatMessagePath: string = "";


    unsubChatMessages: any;
    selectedChatMessages: Message[] = [];

    constructor(
        private firestore: Firestore,
        private generateIdService: GenerateIdService,
        private userService: UserFirebaseService
    ) {

    }

    private selectedChatSubject = new Subject<Chat>();
    // This is the observable that components can subscribe to
    selectedChat$: Observable<Chat> = this.selectedChatSubject.asObservable();

    // This is a sample method to update the selected chat
    updateSelectedChat(newSelectedChat: Chat) {
        this.selectedChatSubject.next(newSelectedChat);
    }

    selectChat(chatId: string) {
        this.selectedChatId = chatId;
        this.loadChatMessages(chatId);
        const index = this.loadedChats.findIndex(chat => chat.id === chatId);
        this.selectedChat = this.loadedChats[index];
        this.updateSelectedChat(this.selectedChat);
        this.currentChatMessagePath = `chats/${chatId}/messages/`;
        console.log("Chat selected");
        console.log(this.selectedChat);
    }


    getChatMessagesQuery(chatId: string) {
        return query(collection(this.firestore, `chats/${chatId}/messages`), orderBy("timestamp", "desc"));
    }

    async loadChatMessages(chatId: string) {
        const q = this.getChatMessagesQuery(chatId);
        let path = `chats/${chatId}/messages/`;
        this.unsubChatMessages = onSnapshot(q, (querySnapshot: any) => {
            this.selectedChatMessages = [];
            querySnapshot.forEach((doc: any) => {
                if (doc.data()) {
                    let message = new Message(doc.data());
                    message.path = path + doc.id;
                    message.id = doc.id;
                    this.selectedChatMessages.push(message);
                }
            })
        });
    }

    /**
    * Updates Or Creates a chat document in Firestore.
    * Depending on if chat.is i given
    * @param {Chat} chat - The chat object to be updated or created.
    */
    async update(chat: Chat) {
        console.log(chat);
        if (chat.id == "") {
            chat.id = this.generateIdService.generateRandomId(20);
            const docInstance = doc(collection(this.firestore, "chats"));
            setDoc(docInstance, chat.toJSON());
        } else {
            const docInstance = doc(this.firestore, 'chats', chat.id);
            updateDoc(docInstance, chat.toJSON());
        }
    }


    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        this.unsubChats();
        this.unsubChat();
    }


    getChannelQuery(userId: string) {
        return query(collection(this.firestore, "chats"), where("users", 'array-contains', userId));
    }

    async load(userId: string) {
        const q = this.getChannelQuery(userId);
        this.unsubChats = onSnapshot(q, (querySnapshot) => {
            this.loadedChats = [];
            querySnapshot.forEach((doc) => {
                const chat = new Chat(doc.data());
                chat.id = doc.id;
                this.loadedChats.push(chat);
            });
        })
    }


    /* NO FOR LOOP SINCE there can only be two chat partners */
    getChatPartner(chat: Chat): string {
        if (chat.users[0] != this.userService.currentUser.id) {
            return chat.users[0];
        } else if (chat.users[1] != this.userService.currentUser.id) {
            return chat.users[1];
        } else {
            return "";
        }
    }







    //MUSS überarbeitet werden
    getById(chatId: string) {
        const chat = doc(collection(this.firestore, "chats"), chatId);
        this.unsubChat = onSnapshot(chat, (doc) => {
            this.loadedChat = undefined;
            let docData = doc.data();
            if (docData) {
                const chat = new Chat(docData);
                this.loadedChat = chat;
            }
        })
    };




}