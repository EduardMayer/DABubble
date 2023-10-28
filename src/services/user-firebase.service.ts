import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, getDoc } from "firebase/firestore";
import { User } from '../models/user.class';


@Injectable({
    providedIn: 'root'
})
export class UserFirebaseService {

    public loadedUsers: User[] = [];
    private unsubUsers: any;

    public loadedUser: User | undefined;
    private unsubUser: any;

    public currentUser: User = new User(
        {
            id: "",
            fullName: "Guest",
            firstName: "Guest",
            lastName: "",
            mail: "guest@guest.at",
            avatar: ""
        }
    )

    constructor(private firestore: Firestore) {
    }

    setCurrentUser(UserData: any) {
        this.currentUser = new User(UserData);
    }

    /**
    * Asynchronously loads user data from Firestore based on optional index parameters.
    */
    async load() {
        const q = query(collection(this.firestore, "users"));
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


    async getById(userId: string) {
        const user = doc(collection(this.firestore, "users"), userId);
        const docSnap = await getDoc(user);
        if (docSnap.exists()) {
            return new User(docSnap.data());
        } else {
            console.log(`User with id: ${userId} not found`);
            return undefined;
        }
    };


    /**
     * Check if a given email exists in the array of loaded users.
     *
     * @param {string} mail - The email to check for in the user data.
     * @returns {boolean} Returns `true` if the email exists in the loaded users, or `false` otherwise.
     */
    mailExists(mail: string) {
        this.load();
        console.log(this.loadedUsers);
        if (this.loadedUsers[0]) {
            for (let i = 0; i < this.loadedUsers.length; i++) {
                if (this.loadedUsers[i].mail === mail) {
                    return true;
                }
            }
            return false;
        } else {
            console.log("Error: User Data could not be loaded");
            return false;
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