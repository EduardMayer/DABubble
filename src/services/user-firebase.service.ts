import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, updateDoc, doc, getDocs, onSnapshot, query, setDoc, where, getDoc } from "firebase/firestore";
import { User } from '../models/user.class';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { AuthFirebaseService } from './auth-firebase.service';


@Injectable({
    providedIn: 'root'
})
export class UserFirebaseService {

    public loadedUsers: User[] = [];
    private unsubUsers: any;

    public loadedUser: User | undefined;
    private unsubUser: any;

    public currentUser: User;

    public registUser: User = new User();  

    constructor(private firestore: Firestore) {
        this.currentUser = new User(
            {
                id: "",
                fullName: "Guest",
                mail: "guest@guest.at",
                channels: ["F8tiKVNq6FePPOb4BDps","O8ZTH8u2mAbFrrpNFaGp"]
            }
        )
    }

    setCurrentUser(UserData: any) {
        this.currentUser = new User(UserData);
        console.log("current User:" + this.currentUser);
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
    * Depending on if user.id is given
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
     * Creates a new User with a Custom ID. To create a new User you should take UID from Firebase Authentication.  
     * 
     * @param user - new User
     * @param UID - UID from Authentication
     */
    async addNewUserWithUID(user: User, UID: string) {
        setDoc(doc(this.firestore, "users", UID), user.toJSON());
        console.log("user created with UID from Authentication");
    }

    async addRegistUserWithUID(UID: string) {
        setDoc(doc(this.firestore, "users", UID), this.registUser.toJSON());
        console.log("Registuser created with UID from Authentication");
    }


    /**
     *Returns a User for a given User UID. 
     * 
     * @param UID - Unique ID of User
     * @returns - User-Objekt
     */
    async getUserByUID(UID: string) {
        //EVTL ADD If LOADEDUSERS[UID]

        //ELSE-->
        if (UID != "") {
            const docRef = await doc(this.firestore, "users", UID);
            const docSnap = await getDoc(docRef);
            let user=new User(docSnap.data());
            user.id=docSnap.id;
            return user;
        } else {
            debugger;
            return new User();
        }
    }

    /**
     * Sets a User with a given UID to the current logged in User
     * @param UID - Unique ID of User
     */
    async setUIDToCurrentUser(UID: string) {
        //console.log("Set UID TO current User" + UID);
        const user = await this.getUserByUID(UID);
        /*    console.log("User from UID");  
              console.log(user); */
        this.currentUser = new User(user);
        console.log(this.currentUser);
    }

    updateEmail(newEmail:string){
        console.log("newMail");
        console.log(newEmail);
        
        
        this.currentUser.mail = newEmail; 
        console.log("Current User for Edit Email:");
        console.log(this.currentUser);
        this.update(this.currentUser); 
    }

    async updateCurrentUserToFirebase(){
        this.update(this.currentUser); 
    }

    async syncMail(email:string){
        if(this.currentUser.mail != email){
          this.currentUser.mail = email; 
          this.updateCurrentUserToFirebase(); 
          console.log("Email updated @ Login");
        }
    }

    async getUserForSearch(searchString:string){
        console.log("search for: " + searchString);
        
        const q = query(collection(this.firestore, "users"), where("fullName", ">=", searchString));
        console.log(q);
        

        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        const findUsers: User[] = []; 
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    
        });
    }


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