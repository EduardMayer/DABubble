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

    private unsubAnswers: any;
    public loadedAnswers: Message[] = [];

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
        if (this.channelFirebaseService.selectedChannel && message) {
            const path = `channels/${this.channelFirebaseService.selectedChannel.id}/messages/${message.id}/reactions/`;
            this.unsubReactions = onSnapshot(collection(this.firestore, path), (querySnapshot: any) => {
                this.loadedReactions = [];
                querySnapshot.forEach((doc: any) => {
                    if (doc.data()) {
                        let reaction = new Reaction(doc.data()); path
                        reaction.id = doc.id;
                        reaction.path = path + doc.id
                        this.loadedReactions.push(reaction);
                    }
                })
            })
        }
    }


    async loadAnswers(message: Message) {
        console.log(message);
        let path = message.path + `/answers/`;

        this.unsubAnswers = onSnapshot(collection(this.firestore, path), (querySnapshot: any) => {
            this.loadedAnswers = [];
            querySnapshot.forEach((doc: any) => {
                if (doc.data()) {
                    let answer = new Message(doc.data());
                    answer.id = doc.id;
                    answer.path = path + doc.id;
                    this.loadedAnswers.push(answer);
                    console.log(this.loadedAnswers);
                }
            })
        });

    }


    async createMessage(path: string, message: Message) {
        if (message.id == "") {
            message.id = String(this.cyrb53(String(path) + String(message.content)));
            path = path + message.id;
            const docInstance = doc(this.firestore, path);
            await setDoc(docInstance, message.toJSON());
            console.log("Message created");
        } else {
            const docInstance = doc(this.firestore, path);
            await updateDoc(docInstance, message.toJSON());
            console.log("Message updated");
        }
    }


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