import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, orderBy } from "firebase/firestore";
import { Channel } from '../models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from './user-firebase.service';
import { GenerateIdService } from './generate-id.service';




@Injectable({
    providedIn: 'root'
})
export class ChannelFirebaseService {

    public loadedChannels: Channel[] = [];
    private unsubChannels: any;
    private unsubChannel: any;

    channelUsers: User[] = [];
    userService = inject(UserFirebaseService);

    selectedChannelId: string | undefined;
    selectedChannel: Channel | undefined;
    selectedChannelMessages: Message[] = [];
    unsubChannelMessages: any;

    lastMessageTimeString: string = "01.01.1970";
    previousMessageTimeString: string = "01.01.1970";
    currentChannelMessagePath: string = ""

    constructor(
        private firestore: Firestore,
        private generateIdService: GenerateIdService
    ) {
    }

    selectChannel(channelId: string) {
        this.selectedChannelId = channelId;
        this.loadChannelMessages(channelId);
        const index = this.loadedChannels.findIndex(channel => channel.id === channelId);
        this.selectedChannel = this.loadedChannels[index];
        this.currentChannelMessagePath = `channels/${channelId}/messages/`;
    }


    /**
    * Generates a Firestore query to retrieve channel data with optional index-based filtering.
    *
    * @param {any} indexName - (Optional) The name of the index to filter channels.
    * @param {String} indexValue - (Optional) The value to filter channels by within the specified index.
    * @returns {Query} A Firestore query for channel data with optional filtering.
    */
    getChannelQuery(userId: string) {
        return query(collection(this.firestore, "channels"), where("users", 'array-contains', userId));
    }

    async load(userId: string) {
        const q = this.getChannelQuery(userId);
        this.unsubChannels = onSnapshot(q, (querySnapshot) => {
            this.loadedChannels = [];
            querySnapshot.forEach((doc) => {
                const channel = new Channel(doc.data());
                channel.id = doc.id;
                this.loadedChannels.push(channel);
            });
        });
    }


    /**
    * Asynchronously loads messages of the channels messages Subcollection from Firestore.
    *
    * @param {string} channelId - The ID of the channel from which to load messages.
    * @returns {Promise<void>} - A Promise that resolves when the messages have been loaded.
    */
    async loadChannelMessages(channelId: string) {
        const q = this.getChannelMessagesQuery(channelId);
        let path = `channels/${channelId}/messages/`;
        this.unsubChannelMessages = onSnapshot(q, (querySnapshot: any) => {
            this.selectedChannelMessages = [];
            querySnapshot.forEach((doc: any) => {
                if (doc.data()) {
                    let message = new Message(doc.data());
                    message.path = path + doc.id;
                    message.id = doc.id;
                    this.selectedChannelMessages.push(message);
                }
            })
        });
    }



    async loadChannelUsers(currentChannelUsers: string[]) {
        this.channelUsers = [];
        if (currentChannelUsers.length > 0) {
            currentChannelUsers.forEach((uid: string) => {
                this.userService.getUserByUID(uid).
                    then((user) => {
                        if (user.avatar == "") { user.avatar = "assets/img/avatar/avatar0.svg" }
                        this.channelUsers.push(user);
                    });
            })
        }
    }

    getChannelMessagesQuery(channelId: string) {
        return query(collection(this.firestore, `channels/${channelId}/messages`), orderBy("timestamp", "desc"));
    }

    getById(channelId: string) {
        const channel = doc(collection(this.firestore, "channels"), channelId);
        this.unsubChannel = onSnapshot(channel, (doc) => {
            this.selectedChannel = undefined;
            let docData = doc.data();
            if (docData) {
                const channel = new Channel(docData);
                this.selectedChannel = channel;
            }
        })
    };

    /**
    * Updates Or Creates a channel document in Firestore.
    * Depending on if channel.is i given
    * @param {Channel} channel - The channel object to be updated or created.
     */
    async updateChannel(channel: Channel) {
        if (channel.id == "") {
            channel.id = this.generateIdService.generateRandomId(20);
            const docInstance = doc(collection(this.firestore, "channels"));
            setDoc(docInstance, channel.toJSON());
        } else {
            const docInstance = doc(this.firestore, 'channels', channel.id);
            updateDoc(docInstance, channel.toJSON());
        }
    }

    async updateChannelMessage(channelId: string, channelMessage: Message) {
        if (channelId != "") {
            if (channelMessage.id == "") {
                channelMessage.id = this.generateIdService.generateRandomId(20);
                const docInstance = doc(this.firestore, `channels/${channelId}/messages/${channelMessage.id}`);
                await setDoc(docInstance, channelMessage.toJSON());
                console.log("channelMessages updated");

            } else {
                const docInstance = doc(this.firestore, `channels/${channelId}/messages`, channelMessage.id);
                await updateDoc(docInstance, channelMessage.toJSON());
                console.log("channelMessages updated");
            }
        }
    }




    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        if (this.unsubChannels) {
            this.unsubChannels();
        }

        if (this.unsubChannel) {
            this.unsubChannel();
        }

        if (this.unsubChannelMessages) {
            this.unsubChannelMessages()
        }
    }
}