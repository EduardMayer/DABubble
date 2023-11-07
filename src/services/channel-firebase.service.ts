import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, orderBy } from "firebase/firestore";
import { Channel } from '../models/channel.class';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from './user-firebase.service';




@Injectable({
    providedIn: 'root'
})
export class ChannelFirebaseService {

    public loadedChannels: Channel[] = [];
    private unsubChannels: any; //Whats the type?

    private unsubChannel: any;


    channelUsers: User[] = [];
    userService = inject(UserFirebaseService);

    selectedChannelId: string | undefined;
    selectedChannel: Channel | undefined;
    selectedChannelMessages: Message[] = [];
    unsubChannelMessages: any;

    lastMessageTimeString: string = "01.01.1970";
    previousMessageTimeString: string = "01.01.1970";

    constructor(private firestore: Firestore) {
        setTimeout(() => {
            this.selectChannel("F8tiKVNq6FePPOb4BDps"); // FOR DEVELOPMENT     
        }, 3000)

    }

    selectChannel(channelId: string) {
        this.selectedChannelId = channelId;
        this.loadChannelMessages(channelId);
        const index = this.loadedChannels.findIndex(channel => channel.id === channelId);
        this.selectedChannel = this.loadedChannels[index];
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
            const docInstance = doc(collection(this.firestore, "channels"));
            setDoc(docInstance, channel.toJSON());
            console.log("channel created");
        } else {
            const docInstance = doc(this.firestore, 'channels', channel.id);
            updateDoc(docInstance, channel.toJSON());
            console.log("channel updated");
        }
    }

    async updateChannelMessage(channelId: string, channelMessage: Message) {
        if (channelId != "") {
            if (channelMessage.id == "") {
                channelMessage.id = String(this.cyrb53(String(channelId) + String(channelMessage.content)));
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


    /**
   * Calculates the Cyrb53 hash of the input string.
   *
   * @param {string} str - The input string to be hashed.
   * @param {number} seed - An optional seed value to initialize the hash (default is 0).
   * @returns {number} - The Cyrb53 hash value as a 32-bit unsigned integer.
   */
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

}