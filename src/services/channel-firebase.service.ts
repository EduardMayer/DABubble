import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, orderBy } from "firebase/firestore";
import { Channel } from '../models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from './user-firebase.service';
import { GenerateIdService } from './generate-id.service';
import { ChatFirebaseService } from './chat-firebase.service';
import { ActiveSelectionService } from './active-selection.service';




@Injectable({
    providedIn: 'root'
})
export class ChannelFirebaseService {

    public loadedChannels: Channel[] = [];
    private unsubChannels: any;
    private unsubChannel: any;

    channelUsers: User[] = [];

    selectedChannelId: string | undefined;
    selectedChannel: Channel | undefined;
    selectedChannelMessages: Message[] = [];
    unsubChannelMessages: any;

    lastMessageTimeString: string = "01.01.1970";
    previousMessageTimeString: string = "01.01.1970";
    currentChannelMessagePath: string = "";
    finishedLoading = false;


    constructor(
        private firestore: Firestore,
        private generateIdService: GenerateIdService,
        private chatService: ChatFirebaseService,
        private userService: UserFirebaseService,
        private activeSelectionService: ActiveSelectionService
    ) {
    }

    selectChannel(channelId: string) {
        this.selectedChannelId = channelId;
        this.loadChannelMessages(channelId);
        this.chatService.selectedChat = undefined;
        const index = this.loadedChannels.findIndex(channel => channel.id === channelId);
        this.selectedChannel = this.loadedChannels[index];
        this.loadallChannelusers();
        this.currentChannelMessagePath = `channels/${channelId}/messages/`;
        this.activeSelectionService.activeSelection=this.selectedChannel;
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
            this.finishedLoading = false;
            querySnapshot.forEach((doc) => {
                const channel = new Channel(doc.data());
                channel.id = doc.id;
                this.loadedChannels.push(channel);
            });
            this.finishedLoading = true;
            this.loadedChannels = this.sortChannelsByName(this.loadedChannels);
        });
    }


    sortChannelsByName(channels: Channel[]) {
        return channels.slice().sort((a, b) => a.channelName.localeCompare(b.channelName));
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
            this.createChannel(channel);
        } else {
            this.modifyChannel(channel);
        }
    }


    async modifyChannel(channel: Channel) {
        const docInstance = doc(this.firestore, 'channels', channel.id);
        updateDoc(docInstance, channel.toJSON());
    }


    async createChannel(channel: Channel) {
        channel.id = this.generateIdService.generateRandomId(20);
        let channelExists = await this.checkChannelExists(channel.channelName);

        if (!channelExists) {
            channel.creatorOfChannel = this.userService.currentUser.id;
            channel.timestamp = Date.now(); 

            const docInstance = doc(collection(this.firestore, "channels"));
            setDoc(docInstance, channel.toJSON());
        } else {
            console.warn("Channel wurde nicht erstellt, weil bereits ein Channel mit diesem Namen existiert");
        }
    }


    async updateChannelMessage(channelId: string, channelMessage: Message) {
        if (channelId != "") {
            if (channelMessage.id == "") {
                channelMessage.id = this.generateIdService.generateRandomId(20);
                const docInstance = doc(this.firestore, `channels/${channelId}/messages/${channelMessage.id}`);
                await setDoc(docInstance, channelMessage.toJSON());

            } else {
                const docInstance = doc(this.firestore, `channels/${channelId}/messages`, channelMessage.id);
                await updateDoc(docInstance, channelMessage.toJSON());
            }
        }
    }


    getChannelQueryByName(channelName: string) {
        return query(collection(this.firestore, "channels"), where("channelName", '==', channelName));
    }

    async checkChannelExists(channelName: string): Promise<boolean> {
        let query = this.getChannelQueryByName(channelName);

        return getDocs(query)
            .then((docs) => {
                let docId = "";
                docs.forEach((doc) => {
                    docId = doc.id;
                })

                if (docId == "") {
                    return false;
                } else {
                    return true;
                }
            });
    }

    getSelectedChannelID() {
        return this.selectedChannelId;
    }


    leaveSelectedChannel() {
        if (this.selectedChannel != null) {
            const userID = this.userService.currentUser.id;
            const userIndex = this.selectedChannel.users.indexOf(userID);
            const loadedChannelIndex = this.loadedChannels.indexOf(this.selectedChannel)
            this.selectedChannel.users.splice(userIndex, 1);
            this.loadedChannels.splice(loadedChannelIndex, 1);
            this.updateChannel(this.selectedChannel);
            if (this.loadedChannels.length > 0) {
                this.selectChannel(this.loadedChannels[0].id);
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

    userOnCurrentChannel: User[] = [];


    loadallChannelusers() {
        this.userOnCurrentChannel = [];
        if (this.selectedChannel) {
            this.selectedChannel.users.forEach((userID) => {
                this.userService.getUserByUID(userID)
                    .then((user) => {
                        this.userOnCurrentChannel.push(user);
                    });
            })
        }
    }
}