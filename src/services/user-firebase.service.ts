import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { User } from '../models/user.class';


@Injectable({
    providedIn: 'root'
})
export class UserFirebaseService {
    public loadedUsers: User[] = [];
    private unsubUsers: any;

    public loadedUser: User | undefined;
    private unsubUser: any;

    constructor(private firestore: Firestore) {
    }


    /**
    * Generates a Firestore query to retrieve user data with optional index-based filtering.
    *
    * @param {any} indexName - (Optional) The name of the index to filter users.
    * @param {String} indexValue - (Optional) The value to filter users by within the specified index.
    * @returns {Query} A Firestore query for user data with optional filtering.
    */
    getQuery(indexName?: any, indexValue: String = "") {
        if (indexName) {
            return query(collection(this.firestore, "users"), where(indexName, "==", indexValue));
        } else {
            return query(collection(this.firestore, "users"));
        }
    }

    /**
    * Asynchronously loads user data from Firestore based on optional index parameters.
    *
    * @param {any} indexName - (Optional) The name of the index to filter users.
    * @param {String} indexValue - (Optional) The value to filter users by within the specified index.
    */
    async load(indexName?: any, indexValue: String = "") {
        const q = this.getQuery(indexName, indexValue);
        this.unsubUsers = onSnapshot(q, (querySnapshot) => {
            this.loadedUsers = [];
            querySnapshot.forEach((doc) => {
                const user = new User(doc.data());
                user.id = doc.id;
                this.loadedUsers.push(user);
            });
        });
    }


    /**
    * Retrieves a user by its unique identifier.
    *
    * @param {string} id - The unique identifier of the user to retrieve.
    */
    getById(id: string) {
        const thread = doc(collection(this.firestore, "users"), id);
        this.unsubUser = onSnapshot(thread, (doc) => {
            this.loadedUser = undefined;
            let docData = doc.data();
            if (docData) {
                const thread = new User(docData);
                this.loadedUser = thread;
            }
        })
    };


    /**
    * Updates Or Creates a user document in Firestore.
    * Depending on if user.is i given
    * @param {User} user - The user object to be updated or created.
     */
    async update(user: User) {
        if (user.id == "") {
            const docInstance = doc(collection(this.firestore, "users"));
            setDoc(docInstance, user.toJSON());
            console.log("user created");
        } else {
            const docInstance = doc(this.firestore, 'users', user.id);
            updateDoc(docInstance, user.toJSON());
            console.log("user updated");
        }
    }


    /**
    * Lifecycle hook called when the component is about to be destroyed.
    * Unsubscribes from any active subscription.
    */
    ngOnDestroy() {
        this.unsubUsers();
        this.unsubUser();
    }


}