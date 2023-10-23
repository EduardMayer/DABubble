import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Message } from '../models/message.class';


@Injectable({
    providedIn: 'root'
})
export class MessageFirebaseService {
    public loadedMessages: Message[] = [];
    public loadedMessage: Message | undefined;
    private unsubMessage: any;
    private unsubMessages: any;

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
        console.log(message);
        this.unsubMessage = onSnapshot(message, (doc) => {
            this.loadedMessage = undefined;
            let docData = doc.data();
            console.log(doc.data());
            if (docData) {
                const message = new Message(docData);
                message.id=messageId;
                console.log(message);
                this.loadedMessage = message;
            }
        })
    };


    /**
    * Updates Or Creates a message document in Firestore.
    * Depending on if message.is i given
    * @param {Message} message - The message object to be updated or created.
     */
    async update(message: Message) {
        if (message.id === "") {
            const docInstance = doc(collection(this.firestore, "messages"));
            setDoc(docInstance, message.toJSON());
            console.log("message created");
        } else {
            const docInstance = doc(this.firestore, 'messages', message.id);
            updateDoc(docInstance, message.toJSON());
            console.log("message updated");
        }
    }


    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        this.unsubMessages();
        this.unsubMessage();
    }


}