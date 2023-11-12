import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, orderBy } from "firebase/firestore";
import { Thread } from '../models/thread.class';
import { MessageFirebaseService } from './message-firebase.service';
import { Message } from 'src/models/message.class';


@Injectable({
    providedIn: 'root'
})
export class ThreadFirebaseService {
    public loadedThread: Thread | undefined;
    message?: Message;
    public loadedAnswers!: Message[];
    path: string = "";
    unsubAnswers: any;

    constructor(
        private firestore: Firestore,
    ) { }

    openThread(message: Message) {
        this.message = message;
        this.path = message.path;
        this.loadAnswers(message);
    }

    loadAnswersQuery(path: string) {
        return query(collection(this.firestore, path), orderBy("timestamp"));
    }

    async loadAnswers(message: Message) {
        let path = message.path + `/answers/`;
        this.unsubAnswers = onSnapshot(this.loadAnswersQuery(path), (querySnapshot: any) => {
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

    async updateThread(thread: Thread, path: string) {
        if (thread.id == "") {
            const docInstance = doc(collection(this.firestore, path + "threads"));
            setDoc(docInstance, thread.toJSON());
        } else {
            const docInstance = doc(this.firestore, 'threads', thread.id);
            updateDoc(docInstance, thread.toJSON());
        }
    }

    ngOnDestroy() {
        if (this.unsubAnswers) {
            this.unsubAnswers();
        }
    }

}