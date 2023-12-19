import { Injectable, Component, inject, NgZone, OnInit } from '@angular/core';
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
  User,
  confirmPasswordReset,
  updateEmail,
  verifyBeforeUpdateEmail,
  applyActionCode
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserFirebaseService } from './user-firebase.service';
import { throwError } from 'rxjs';
import { UserStatusFirebaseService } from './user-status-firebase.service';
import { ChannelFirebaseService } from './channel-firebase.service';
import { ChatFirebaseService } from './chat-firebase.service';
import { ActiveSelectionService } from './active-selection.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService implements OnInit {

  private firebaseAuthErrorMessages = {
    'auth/argument-error': 'Fehler im Argument',
    'auth/app-deleted': 'App gelöscht',
    'auth/app-not-authorized': 'App nicht autorisiert',
    'auth/app-not-installed': 'App nicht installiert',
    'auth/captcha-check-failed': 'Captcha-Überprüfung fehlgeschlagen',
    'auth/code-expired': 'Code abgelaufen',
    'auth/cors-unsupported': 'CORS nicht unterstützt',
    'auth/custom-token-mismatch': 'Passendes Custom-Token nicht gefunden',
    'auth/email-already-in-use': 'E-Mail-Adresse wird bereits verwendet',
    'auth/invalid-api-key': 'Ungültiger API-Schlüssel',
    'auth/invalid-continue-uri': 'Ungültige Weiterleitungs-URI',
    'auth/invalid-credential': 'Ungültige Anmeldeinformation',
    'auth/invalid-disabled-field': 'Ungültiges deaktiviertes Feld',
    'auth/invalid-display-name': 'Ungültiger Anzeigename',
    'auth/invalid-email': 'Ungültige E-Mail-Adresse',
    'auth/invalid-email-verified': 'Ungültige E-Mail-Verifizierung',
    'auth/invalid-id-token': 'Ungültiges ID-Token',
    'auth/invalid-identifier': 'Ungültiger Identifier',
    'auth/invalid-password': 'Ungültiges Passwort',
    'auth/invalid-phone-number': 'Ungültige Telefonnummer',
    'auth/invalid-photo-url': 'Ungültige Profilbild-URL',
    'auth/invalid-provider-id': 'Ungültige Provider-ID',
    'auth/invalid-session-cookie-duration': 'Ungültige Sitzungs-Cookie-Dauer',
    'auth/invalid-tenant-id': 'Ungültige Tenant-ID',
    'auth/missing-android-pkg-name': 'Fehlender Android-Paketname',
    'auth/missing-continue-uri': 'Fehlende Weiterleitungs-URI',
    'auth/missing-iframe-start': 'Fehlender Iframe-Start',
    'auth/missing-ios-bundle-id': 'Fehlende iOS-Bundle-ID',
    'auth/missing-oauth-client-id': 'Fehlende OAuth-Client-ID',
    'auth/missing-or-invalid-nonce': 'Fehlender oder ungültiger nonce',
    'auth/missing-tenant-id': 'Fehlende Tenant-ID',
    'auth/network-request-failed': 'Netzwerkanfrage fehlgeschlagen',
    'auth/operation-not-allowed': 'Diese Aktion ist nicht erlaubt',
    'auth/phone-number-already-exists': 'Telefonnummer existiert bereits',
    'auth/project-not-found': 'Projekt nicht gefunden',
    'auth/provider-already-linked': 'Provider bereits verknüpft',
    'auth/quota-exceeded': 'Kontingent überschritten',
    'auth/redirect-cancelled-by-user': 'Weiterleitung abgebrochen vom Benutzer',
    'auth/redirect-operation-pending': 'Weiterleitungsvorgang ausstehend',
    'auth/tenant-id-mismatch': 'Tenant-ID passt nicht',
    'auth/timeout': 'Zeitüberschreitung',
    'auth/user-disabled': 'Benutzerkonto ist deaktiviert',
    'auth/user-mismatch': 'Benutzer stimmt nicht überein',
    'auth/user-not-found': 'Benutzer nicht gefunden',
    'auth/weak-password': 'Schwaches Passwort',
    'auth/web-storage-unsupported': 'Web-Speicher nicht unterstützt',
    'auth/second-factor-not-enrolled': 'Zweiter Faktor nicht registriert',
    'auth/maximum-second-factor-count-exceeded': 'Maximale Anzahl an zweiten Faktoren überschritten',
    'auth/unsupported-persistence-type': 'Nicht unterstützter Persistenz-Typ',
    'auth/unsupported-tenant-operation': 'Nicht unterstützte Tenant-Operation',
    'auth/unverified-email': 'Nicht verifizierte E-Mail',
    'auth/user-cancelled': 'Benutzer abgebrochen',
    'auth/user-signed-out': 'Benutzer abgemeldet',
    'auth/uid-already-exists': 'UID existiert bereits',
    'auth/missing-password': 'Bitte Passwort eingeben',
    'auth/invalid-login-credentials': "Ungültige Anmeldedaten. E-Mail oder Passwort falsch"
  };

  firebaseUserService = inject(UserFirebaseService);
  channelFirebaseService = inject(ChannelFirebaseService);
  chatFirebaseService = inject(ChatFirebaseService);
  UserData: any;

  /**
   * Constructur provides the FirebaseAutentiction and create Observable that is triggerd on AuthStateChanges in Firebase.
   * 
   * @param auth - Firebase Authentication 
   * @param router - Angular Router
   * @param ngZone 
   */
  constructor(
      private auth: Auth, 
      private router: Router, 
      public ngZone: NgZone, 
      private userService: UserFirebaseService, 
      private userStatusService: UserStatusFirebaseService, 
      private activeSelectionService: ActiveSelectionService) {
    onAuthStateChanged(this.auth, async (user: any) => {
      if (user) {
        this.loginFunction(user); 
        await this.userStatusService.writeUserStatus(this.UserData.uid, "online");
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })
  }


  /**
   * Checks if mail from authentication is the same as in user firestore and syncs if not match. E.g. after email change.
   */
  ngOnInit(): void {
    /*
    if (this.UserData.email != this.userService.currentUser.mail) {
      this.userService.currentUser.mail = this.UserData.email;
      this.userService.updateCurrentUserToFirebase();
    }
    */
  }

  async loginFunction(user:any){
    this.UserData = user;
    localStorage.setItem('user', JSON.stringify(this.UserData));
    JSON.parse(localStorage.getItem('user')!);
    await this.userService.setUIDToCurrentUser(this.UserData.uid);
    await this.userService.syncMail(this.UserData.email);
    await this.userService.setCurrentUserStatus("online");
    this.firebaseUserService.currentUser.id=this.UserData.uid;
    await this.firebaseUserService.load();
    await this.channelFirebaseService.load(this.UserData.uid);
    await this.chatFirebaseService.load(this.UserData.uid);
  }

  /**
   * Login with Firebase
   * 
   * @param {string} email - Email address of the user how wants to log in.
   * @param {string} password - Password of the user how wants to log in.
   * @returns {Promise} - Retruns Promise (User Objekt) if login was successfull. Otherwise a errormessage with the reason of failure.
   */
  login(email: string, password: string) {

    //Restore Login
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(async (result: any) => {
        this.UserData = result.user;
        await this.userService.syncMail(this.UserData.email);
        this.ngZone.run(() => {
          //this.firebaseUserService.currentUser=this.UserData;
          this.router.navigate(['/index']);
        });
      })
  }


  /**
   * Loggout the User and redirect to startscreen. 
   */
  logout() {
    this.activeSelectionService.activeSelection = undefined; 
    this.channelFirebaseService.selectedChannelId = ""; 
    this.channelFirebaseService.selectedChannel = undefined; 
   
    this.userStatusService.writeUserStatus(this.UserData.uid, "offline");
    signOut(this.auth).then(() => { this.router.navigate(['']) })
  }

  
  /**
 * Register a user with the provided email and password.
 * @param {string} email - The email of the user to register.
 * @param {string} password - The password for the user's account.
 */
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.UserData = result.user;
        this.userService.registUser.id = this.UserData.uid;
        //this.firebaseUserService.update(this.UserData);
        this.firebaseUserService.setCurrentUser(this.UserData)
        this.ngZone.run(() => {
          //this.router.navigate(['/avatar']);
        });
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
  loginExprired() {
    const token = localStorage.getItem('user');
    if (token != null) {
      const expirationTime = JSON.parse(token).stsTokenManager.expirationTime;
      if (expirationTime > new Date().getTime()) {
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
    this.loginWithPopup(new GoogleAuthProvider());
  }

  /**
   * LoginMethod for Google Login.
   * @param {GoogleAuthProvider} provider 
   * @returns {Promise} - returns a promise whether the user was logged in with Google
   */
  async loginWithPopup(provider: any) {
     signInWithPopup(this.auth, provider).then(async (result) => {
      console.log(result);
      this.UserData = result.user;
      this.userService.registUser.id = this.UserData.uid;
      this.userService.registUser.fullName = this.UserData.displayName;
      this.userService.addRegistUserWithUID(this.UserData.uid); 
      this.firebaseUserService.setCurrentUser(this.UserData); 
      this.loginFunction(result.user); 
      this.router.navigate(['index']);
    });
  }

  /**
   * Returns the firebase errormessage for the given errorcode.
   * @param errorCode - firebase errorcode
   * @returns - firebase errormessage
   */
  getErrorMessage(errorCode: string) {
    return this.firebaseAuthErrorMessages[errorCode as keyof typeof this.firebaseAuthErrorMessages];
  }

  /**
   * Send a a email for verification to the given email address.
   * @param newEmail - new email adress
   */
  async sendUpdateEmail(newEmail: string): Promise<boolean> {
  
    return verifyBeforeUpdateEmail(this.UserData, newEmail).then(() => {
      return true; 
    }).catch((error) => {
      console.error(error.code);
      console.error(error.message);
      return false;
    });
  }

  /**
   * Updates given email address in firebase authentication. 
   * @param newEmail - new email adress
   */
  async updateMail(newEmail: string) {

    await updateEmail(this.UserData, newEmail).then(() => {

    }).catch((error) => {
      console.error(error.code);
      console.error(error.message);
    });
  }

  /**
   * Confirm action in firebase authentication user change with oobCode
   * @param code - unique oobCode from firebase 
   */
  async applyActionCode(code: string) {
    await applyActionCode(this.auth, code)
      .then(() => {
      
      })
      .catch((error) => {
        console.error('Error verifying oobCode:', error);
      });
  }

  /**
   * Send email for verification to change the user password
   * @param email - email adress of User
   * @returns 
   */
  resetPassword(email: string) {

    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
       
      })
      .catch((error) => {
        console.error(error.code, error.message);
      });
  }

  /**
   * Confirm new Passwort and change passwort in firebase authentication
   * @param oobCode - unique verification code from firebase
   * @param newPassword - new password for user
   */
  async confirmPasswordReset(oobCode: string, newPassword: string) {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      console.error('Fehler bei der Passwortänderung:', error);
    }
  }
}

