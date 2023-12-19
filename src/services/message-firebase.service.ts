import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { Message } from '../models/message.class';
import { ChannelFirebaseService } from './channel-firebase.service';
import { UserFirebaseService } from './user-firebase.service';
import { Reaction } from 'src/models/reaction.class';
import { ThreadFirebaseService } from './thread-firebase.service';
import { GenerateIdService } from './generate-id.service';

@Injectable({
    providedIn: 'root'
})
export class MessageFirebaseService {
    private unsubMessage: any;
    private unsubMessages: any;
    public isOwnMessage: boolean = false;

    private unsubReactions: any;
    public loadedReactions: Reaction[] = [];

    private unsubAnswers: any;
    public loadedAnswers: Message[] = [];

    constructor(
        private firestore: Firestore,
        public channelService: ChannelFirebaseService,
        private idService: GenerateIdService
    ) {
    }

    /**
    * Updates a reaction in Firestore based on the provided reaction object and path (optional).
    *
    * If a path is provided in the reaction object, the existing Firestore document will be updated.
    * If no path is provided, a new document will be created with a generated reaction ID in the specified path.
    *
    * @param {Reaction} reaction - The reaction object to be updated or added.
    * @param {string} [path] - (Optional) The path to the Firestore document where the reaction should be updated or added.
    * @returns {Promise<void>} A promise that resolves when the update or addition is complete.
    */
    async updateReaction(reaction: Reaction, path: string) {
        if (reaction.path) {
            const docInstance = doc(this.firestore, reaction.path);
            if (reaction.users.length == 0) {
                deleteDoc(docInstance);
            } else {
                updateDoc(docInstance, reaction.toJSON());
            }
        } else {
            const reactionId = this.idService.generateRandomId(20);
            const docInstance = doc(this.firestore, `${path}/${reactionId}`);
            await setDoc(docInstance, reaction.toJSON());
        }
    }


    /**
    * Deletes a reaction from Firestore based on its path and reaction object.
    *
    * @param {Reaction} reaction - The reaction object to be deleted.
    * @param {string} path - The path to the Firestore document containing the reaction.
    * @returns {Promise<void>} A promise that resolves when the deletion is complete.
    */
    async deleteReaction(reaction: Reaction, path: string) {
        await deleteDoc(doc(this.firestore, `${path}/${reaction.id}`));
    }


    /**
    * Loads reactions for a specific message from Firestore.
    *
    * @param {Message} message - The message for which reactions are to be loaded.
    * @returns {void}
    */
    async loadReactions(message: Message) {
        if (message) {
            const path = message.path + `/reactions/`;
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


    /**
     * Loads answers for a specific message from Firestore.
     *
     * @param {Message} message - The message for which answers are to be loaded.
     * @returns {void}
     */
    async loadAnswers(message: Message) {
        let path = message.path + `/answers/`;
        this.unsubAnswers = onSnapshot(collection(this.firestore, path), (querySnapshot: any) => {
            this.loadedAnswers = [];
            querySnapshot.forEach((doc: any) => {
                if (doc.data()) {
                    let answer = new Message(doc.data());
                    answer.id = doc.id;
                    answer.path = path + doc.id;
                    this.loadedAnswers.push(answer);
                }
            })
        });
    }


    /**
    * Creates or updates a message in Firestore with the given path and message object.
    *
    * If the message has an empty ID, a new message will be created.
    * If the message has an existing ID, the corresponding message will be updated.
    *
    * @param {string} path - The path to the Firestore document where the message should be created or updated.
    * @param {Message} message - The message object to be created or updated.
    * @returns {void}
    */
    async createMessage(path: string, message: Message) {
        if (message.id == "") {
            message.id = this.idService.generateRandomId(20);
            path = path + message.id;
            const docInstance = doc(this.firestore, path);
            await setDoc(docInstance, message.toJSON());
        } else {
            const docInstance = doc(this.firestore, path);
            await updateDoc(docInstance, message.toJSON());
        }
    }


    /**
    * Deletes a message from the specified Firestore path.
    *
    * @param {string} path - The Firestore path where the message is stored.
    * @param {Message} message - The message to be deleted.
    * @returns {Promise<void>} - A promise that resolves when the message is successfully deleted.
    */
    async deleteMessage(path: string) {
        await deleteDoc(doc(this.firestore, `${path}`));
    }

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

        if (this.unsubAnswers) {
            this.unsubAnswers();
        }
    }


}