import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, addDoc } from "firebase/firestore";
import { Channel } from '../models/channel.class';


@Injectable({
    providedIn: 'root'
})
export class ChannelFirebaseService {
    public loadedChannels: Channel[] = [];
    private unsubChannels: any; //Whats the type?

    private unsubChannel: any;
    public loadedChannel: Channel | undefined;

    loadedChannelId: number;

    constructor(private firestore: Firestore) {
        this.loadedChannelId = 0;
        this.load();
    }

    get currentChannel() {
        return this.loadedChannels[this.loadedChannelId];
    }

    /**
    * Generates a Firestore query to retrieve channel data with optional index-based filtering.
    *
    * @param {any} indexName - (Optional) The name of the index to filter channels.
    * @param {String} indexValue - (Optional) The value to filter channels by within the specified index.
    * @returns {Query} A Firestore query for channel data with optional filtering.
    */
    getQuery(indexName?: any, indexValue: String = "") {
        if (indexName) {
            return query(collection(this.firestore, "channels"), where(indexName, "==", indexValue));
        } else {
            return query(collection(this.firestore, "channels"));
        }
    }

    /**
    * Asynchronously loads channel data from Firestore based on optional index parameters.
    *
    * @param {any} indexName - (Optional) The name of the index to filter channels.
    * @param {String} indexValue - (Optional) The value to filter channels by within the specified index.
    */
    async load(indexName?: any, indexValue: String = "") {
        const q = this.getQuery(indexName, indexValue);
        this.unsubChannels = onSnapshot(q, (querySnapshot) => {
            this.loadedChannels = [];
            querySnapshot.forEach((doc) => {
                const channel = new Channel(doc.data());
                debugger;

                let colRef = this.getSingleDocRef(this.getColIdFromChannels(), doc.id);
                updateDoc(colRef, {
                  id: doc.id
                });

                /*channel.id = doc.id;*/
                this.loadedChannels.push(channel);
            });
        });
        return this.unsubChannels;
    }

    getColIdFromChannels() {
        return 'channels'
      }

    getSingleDocRef(colId: any, docId: string) {
        return doc(collection(this.firestore, colId), docId);
    
      }

    getById(channelId: string) {
        const channel = doc(collection(this.firestore, "channels"), channelId);
        this.unsubChannel = onSnapshot(channel, (doc) => {
            this.loadedChannel = undefined;
            let docData = doc.data();
            if (docData) {
                const channel = new Channel(docData);
                this.loadedChannel = channel;
            }
        })
    };

    /**
    * Updates Or Creates a channel document in Firestore.
    * Depending on if channel.is i given
    * @param {Channel} channel - The channel object to be updated or created.
     */
    async update(channel: Channel) {
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

    async addChannel(item: any) {
        debugger;
        await addDoc(this.getRefChannels(), item).catch(
          (err) => { console.log(err) }
        ).then(
          (docRef) => {
            console.log('Document writen with ID: ', docRef);
          })
      }

      getRefChannels() {
        return collection(this.firestore, 'channels');
      }


    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        this.unsubChannels();
    }


}