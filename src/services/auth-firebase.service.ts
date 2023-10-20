import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  constructor() { }

  createUser(email:string , password:string){
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email , password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }
}
