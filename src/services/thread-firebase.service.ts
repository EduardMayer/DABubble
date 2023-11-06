import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Thread } from '../models/thread.class';
import { MessageFirebaseService } from './message-firebase.service';
import { Message } from 'src/models/message.class';


@Injectable({
    providedIn: 'root'
})
export class ThreadFirebaseService {
    public loadedThread: Thread | undefined;
    message: Message;
    threadAnswers: Message[] = [];
    threadOpen: boolean = false;
    path: string = "";
    private unsubThreads: any;
    private unsubThread: any;



    constructor(private firestore: Firestore, private messageFirebaseService: MessageFirebaseService) {
        this.message = new Message;
    }

    openThread(message: Message) {
        this.threadOpen = true;
        this.message = message;
        this.message.path = this.path;
    }

    async updateThread(thread: Thread, path: string) {
        if (thread.id == "") {
            const docInstance = doc(collection(this.firestore, path + "threads"));
            setDoc(docInstance, thread.toJSON());
            console.log("thread created");
        } else {
            const docInstance = doc(this.firestore, 'threads', thread.id);
            updateDoc(docInstance, thread.toJSON());
            console.log("thread updated");
        }
    }

}



//     /**
//     * Generates a Firestore query to retrieve thread data with optional index-based filtering.
//     // *
//     * @param {any} indexName - (Optional) The name of the index to filter Threads.
//     * @param {String} indexValue - (Optional) The value to filter Threads by within the specified index.
//     * @returns {Query} A Firestore query for thread data with optional filtering.
//     */
//     // getQuery(indexName?: any, indexValue: String = "") {
//     //     if (indexName) {
//     //         return query(collection(this.firestore, "threads"), where(indexName, "==", indexValue));
//     //     } else {
//     //         return query(collection(this.firestore, "threads"));
//     //     }
//     // }

//     // /**
//     // * Asynchronously loads thread data from Firestore based on optional index parameters.
//     // *
//     // * @param {any} indexName - (Optional) The name of the index to filter Threads.
//     // * @param {String} indexValue - (Optional) The value to filter Threads by within the specified index.
//     // */
//     // async load(indexName?: any, indexValue: String = "") {
//     //     const q = this.getQuery(indexName, indexValue);
//     //     this.unsubThreads = onSnapshot(q, (querySnapshot) => {
//     //         this.loadedThreads = [];
//     //         querySnapshot.forEach((doc) => {
//                 let docData = doc.data();
//                 docData["users"] = JSON.parse(docData["users"]);
//                 docData["messages"] = JSON.parse(docData["messages"]);
//                 const thread = new Thread(docData);
//                 this.loadedThreads.push(thread);
//             })
//         });
//     };

//openThread(message: any) {
//    debugger;
//    console.log(message.id);
//    console.log(this.channelFirebaseService.selectedChannel?.channelName);
//}

// message: any;

//     /**
//     * Retrieves a thread by its unique identifier.
//     *
//     * @param {string} threadId - The unique identifier of the thread to retrieve.
//     */
//     getById(threadId: string) {
//         const thread = doc(collection(this.firestore, "threads"), threadId);
//         this.unsubThread = onSnapshot(thread, (doc) => {
//             this.loadedThread = undefined;
//             let docData = doc.data();
//             if (docData) {
//                 const thread = new Thread(docData);
//                 this.loadedThread = thread;
//             }
//         })
//     };


//     /**
//     * Updates Or Creates a thread document in Firestore.
//     * Depending on if thread.is i given
//     * @param {Thread} thread - The thread object to be updated or created.
//      */
//     async update(thread: Thread) {
//         if (thread.id == "") {
//             const docInstance = doc(collection(this.firestore, "threads"));
//             setDoc(docInstance, thread.toJSON());
//             console.log("thread created");
//         } else {
//             const docInstance = doc(this.firestore, 'threads', thread.id);
//             updateDoc(docInstance, thread.toJSON());
//             console.log("thread updated");
//         }
//     }

//     /**
//     * Lifecycle hook called when the component is about to be destroyed.
//     * Unsubscribes from any active subscription.
//     */
//     ngOnDestroy() {
//         this.unsubThreads();
//         this.unsubThread();
//     }


// }