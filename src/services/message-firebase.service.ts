import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { Message } from '../models/message.class';
import { ChannelFirebaseService } from './channel-firebase.service';
import { UserFirebaseService } from './user-firebase.service';
import { Reaction } from 'src/models/reaction.class';

@Injectable({
    providedIn: 'root'
})
export class MessageFirebaseService {

    public loadedMessage: Message | undefined;
    public loadedMessages: Message[] = [];
    private unsubMessage: any;
    private unsubMessages: any;
    public isOwnMessage: boolean = false;

    private unsubReactions: any;
    public loadedReactions: Reaction[] = [];

    constructor(
        private firestore: Firestore,
        public channelFirebaseService: ChannelFirebaseService,
        private userFirebaseService: UserFirebaseService
    ) {
    }

    /**
     * checks wether the reaction.path value ==""
     * if yes, it creates a reaction else it updates
     */
    async updateReaction(reaction: Reaction, path?: string) {
        if (reaction.path) {
            const docInstance = doc(this.firestore, reaction.path);
            updateDoc(docInstance, reaction.toJSON());
        } else {
            const reactionId = (this.cyrb53(String(reaction.name) + new Date().getTime()));
            const docInstance = doc(this.firestore, `${path}/${reactionId}`);
            await setDoc(docInstance, reaction.toJSON());
            console.log("channelEmoji updated");
        }
    }

    async deleteReaction(reaction: Reaction, path: string) {
        await deleteDoc(doc(this.firestore, `${path}/${reaction.id}`));
    }

    async loadReactions(message: Message) {
        console.log(this.channelFirebaseService.selectedChannel);

        if (this.channelFirebaseService.selectedChannel && message) {
            const path = `channels/${this.channelFirebaseService.selectedChannel.id}/messages/${message.id}/reactions/`;
            this.unsubReactions = onSnapshot(collection(this.firestore, path), (querySnapshot: any) => {
                this.loadedReactions = [];
                querySnapshot.forEach((doc: any) => {
                    if (doc.data()) {
                        let reaction = new Reaction(doc.data());
                        reaction.id = doc.id;
                        reaction.path = path + doc.id
                        this.loadedReactions.push(reaction);
                        console.log(this.loadedReactions);
                    }
                })
            });
        }
    }

    /**
    * Generates a Firestore query to retrieve message data with optional index-based filtering.
    *
    * @param {any} indexName - (Optional) The name of the index to filter Messages.
    * @param {String} indexValue - (Optional) The value to filter Messages by within the specified index.
    * @returns {Query} A Firestore query for message data with optional filtering.
    */
    getQuery(indexName?: any, indexValue: String = "") {
        if (indexName) {
            return query(collection(this.firestore, "messages"), where(indexName, "==", indexValue));
        } else {
            return query(collection(this.firestore, "messages"));
        }
    }

    openThread(message: any) {
        debugger;
        console.log(message.id);
        console.log(this.channelFirebaseService.selectedChannel?.channelName);
        this.message = message;
        console.log('Globally message is', this.message);
    }

    message: any = {};

    /**
    * Retrieves a message by its unique identifier.
    *
    * @param {string} messageId - The unique identifier of the thread to retrieve.
    */
    getById(messageId: string) {
        const message = doc(collection(this.firestore, "messages"), messageId);
        this.unsubMessage = onSnapshot(message, (doc) => {
            this.loadedMessage = undefined;
            let docData = doc.data();
            if (docData) {
                const message = new Message(docData);
                message.id = messageId;
                this.loadedMessage = message;
            }
        })
    };


    cyrb53 = (str: string, seed = 0) => {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
        h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
        h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    };

    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        if (this.unsubMessages) {
            this.unsubMessages();
        }

        if (this.unsubMessage) {
            this.unsubMessage();
        }

        if (this.unsubReactions) {
            this.unsubReactions();
        }
    }


}