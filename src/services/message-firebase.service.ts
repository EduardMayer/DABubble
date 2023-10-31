import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, addDoc } from "firebase/firestore";
import { Message } from '../models/message.class';

@Injectable({
    providedIn: 'root'
})
export class MessageFirebaseService {
    public loadedMessages: Message[] = [];
    public loadedMessage: Message | undefined;
    private unsubMessage: any;
    private unsubMessages: any;
    public isOwnMessage: boolean = false;

    constructor(private firestore: Firestore) {
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

    /**
    * Asynchronously loads message data from Firestore based on optional index parameters.
    *
    * @param {any} indexName - (Optional) The name of the index to filter Messages.
    * @param {String} indexValue - (Optional) The value to filter Messages by within the specified index.
    */
    async load(indexName?: any, indexValue: String = "") {
        const q = this.getQuery(indexName, indexValue);
        this.unsubMessages = onSnapshot(q, (querySnapshot) => {
            this.loadedMessages = [];
            querySnapshot.forEach((doc) => {
                const message = new Message(doc.data());
                message.id = doc.id;
                this.loadedMessages.push(message);
            });
        });
    }


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


    }


}