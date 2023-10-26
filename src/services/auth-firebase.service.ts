import { Injectable, Component, inject, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {

  UserData: any;

  /**
   * Constructur provides the FirebaseAutentiction and create Observable that is triggerd on AuthStateChanges in Firebase.
   * 
   * @param auth - Firebase Authentication 
   * @param router - Angular Router
   * @param ngZone 
   */
  constructor(private auth: Auth, private router: Router, public ngZone: NgZone) {
    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        this.UserData = user;
        localStorage.setItem('user', JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })
  }

  /**
   * Login with Firebase
   * 
   * @param {string} email - Email address of the user how wants to log in.
   * @param {string} password - Password of the user how wants to log in.
   * @returns {Promise} - Retruns Promise (User Objekt) if login was successfull. Otherwise a errormessage with the reason of failure.
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result: any) => {
        this.UserData = result.user;
        this.ngZone.run(() => {
          this.router.navigate(['/main']);
        });
      })
  }

  /**
   * Loggout the User and redirect to startscreen. 
   */
  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['']);
    })
  }

  /**
   * Returns whether the user is logged in or not 
   * 
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('user')
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
  }

  /**
   * Checks if Login is expired.
   * @returns {boolean}
   */
  loginExprired(){
    const token = localStorage.getItem('user'); 
    if(token != null){
      const expirationTime = JSON.parse(token).stsTokenManager.expirationTime; 
      if(expirationTime > new Date().getTime() ){
          return true 
      }
    }
    return false; 
  }

  /**
   * Provides googleAuthentication 
   * @returns {Promise} - returns a promise whether the user was logged in with Google
   */
  GoogleAuth() {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  /**
   * LoginMethod for Google Login.
   * @param {GoogleAuthProvider} provider 
   * @returns {Promise} - returns a promise whether the user was logged in with Google
   */
  loginWithPopup(provider: any) {
    return signInWithPopup(this.auth, provider).then(() => {
      this.router.navigate(['main']);
    });
  }
}
