import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Chat } from '../models/chat.class';


@Injectable({
    providedIn: 'root'
})
export class ChatFirebaseService {
    public loadedChats: Chat[] = [];
    private unsubChats: any; 

    public loadedChat: Chat | undefined;
    private unsubChat: any; 

    constructor(private firestore: Firestore) {
    }


    /**
    * Generates a Firestore query to retrieve chat data with optional index-based filtering.
    *
    * @param {any} indexName - (Optional) The name of the index to filter chats.
    * @param {String} indexValue - (Optional) The value to filter chats by within the specified index.
    * @returns {Query} A Firestore query for chat data with optional filtering.
    */
    getQuery(indexName?: any, indexValue: String = "") {
        if (indexName) {
            return query(collection(this.firestore, "chats"), where(indexName, "==", indexValue));
        } else {
            return query(collection(this.firestore, "chats"));
        }
    }


    /**
    * Asynchronously loads chat data from Firestore based on optional index parameters.
    *
    * @param {any} indexName - (Optional) The name of the index to filter chats.
    * @param {String} indexValue - (Optional) The value to filter chats by within the specified index.
    */
    async load(indexName?: any, indexValue: String = "") {
        const q = this.getQuery(indexName, indexValue);
        this.unsubChats = onSnapshot(q, (querySnapshot) => {
            this.loadedChats = [];
            querySnapshot.forEach((doc) => {
                const chat = new Chat(doc.data());
                chat.id = doc.id;
                this.loadedChats.push(chat);
            });
        });
    }

    //MUSS überarbeitet werden
    getById(channelId: string) {
        const channel = doc(collection(this.firestore, "chats"), channelId);
        this.unsubChat = onSnapshot(channel, (doc) => {
            this.loadedChat = undefined;
            let docData = doc.data();
            if (docData) {
                const chat = new Chat(docData);
                this.loadedChat = chat;
            }
        })
    };


    /**
    * Updates Or Creates a chat document in Firestore.
    * Depending on if chat.is i given
    * @param {Chat} chat - The chat object to be updated or created.
     */
    async update(chat: Chat) {
        if (chat.id == "") {
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


}