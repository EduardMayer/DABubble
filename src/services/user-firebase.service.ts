import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { User } from '../models/user.class';


@Injectable({
    providedIn: 'root'
})
export class UserFirebaseService {
    public loadedUsers: any[] = [];
    private unsubUsers: any;

    constructor(private firestore: Firestore) {
    }

    getUsersQuery(indexName?: any, indexValue: String = "") {
        if (indexName) {
            return query(collection(this.firestore, "users"), where(indexName, "==", indexValue));
        } else {
            return query(collection(this.firestore, "users"));
        }
    }

    async loadUsers(indexName?: any, indexValue: String = "") {
        const q = this.getUsersQuery(indexName, indexValue);
        this.unsubUsers = onSnapshot(q, (querySnapshot) => {
            this.loadedUsers = [];
            querySnapshot.forEach((doc) => {
                this.loadedUsers.push(new User(doc.data()));
            });
        });
    }

    ngOnDestroy() {
        this.unsubUsers();
    }

    async updateUserDoc(userId: any = "", user: User) {

        if (userId == "") {
            const docInstance = doc(collection(this.firestore, "users"));
            setDoc(docInstance, user.toJSON());
        } else {
            const docInstance = doc(this.firestore, 'users', userId);
            updateDoc(docInstance, user.toJSON());
        }

    }
}