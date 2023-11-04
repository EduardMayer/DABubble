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
  updateEmail,
  verifyBeforeUpdateEmail,
  applyActionCode
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserFirebaseService } from './user-firebase.service';
import { throwError } from 'rxjs';

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
  UserData: any;


  /**
   * Constructur provides the FirebaseAutentiction and create Observable that is triggerd on AuthStateChanges in Firebase.
   * 
   * @param auth - Firebase Authentication 
   * @param router - Angular Router
   * @param ngZone 
   */
  constructor(private auth: Auth, private router: Router, public ngZone: NgZone, private userService: UserFirebaseService) {
    onAuthStateChanged(this.auth, async (user: any) => {
      //console.log("AuthStateChanged"); 
      if (user) {
        this.UserData = user;
        localStorage.setItem('user', JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem('user')!);
        //console.log(this.UserData.uid);
        await this.userService.setUIDToCurrentUser(this.UserData.uid);
        this.userService.syncMail(this.UserData.email);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    })
  }

  ngOnInit(): void {
    if (this.UserData.email != this.userService.currentUser.mail) {
      this.userService.currentUser.mail = this.UserData.email;
      this.userService.updateCurrentUserToFirebase();
    }
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
          this.router.navigate(['/main']);
        });
      })
  }

  /**
   * Loggout the User and redirect to startscreen. 
   */
  logout() {
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


  getErrorMessage(errorCode: string) {
    return this.firebaseAuthErrorMessages[errorCode as keyof typeof this.firebaseAuthErrorMessages];
  }

  async sendUpdateEmail(newEmail: string) {

    //this.UserData.email = newEmail;

    verifyBeforeUpdateEmail(this.UserData, newEmail).then(() => {

      // Email updated!
      console.log("E-Mail-Verifizierung wurde versendet!");
      //this.userService.updateEmail(newEmail);

    }).catch((error) => {
      console.log("ERROR at Email update!");
      console.log(error.code);
      console.log(error.message);
      console.log(this.UserData);
    });
    /*
        await updateEmail(this.UserData, newEmail).then(() => {
          // Email updated!
          console.log("Email updated!");
          this.userService.updateEmail(newEmail); 
     
        }).catch((error) => {
          console.log("ERROR at Email update!");
          console.log(error.code);
          console.log(error.message);
          console.log(this.UserData);
        });
        */
  }

  async updateMail(newEmail: string) {
    await updateEmail(this.UserData, newEmail).then(() => {
      // Email updated!
      //console.log("Email updated!");
      //this.userService.updateEmail(newEmail); 

    }).catch((error) => {
      console.log("ERROR at Email update!");
      console.log(error.code);
      console.log(error.message);
      console.log(this.UserData);
    });
  }

  async applyActionCode(code: string) {
    await applyActionCode(this.auth, code)
      .then(() => {

      })
      .catch((error) => {
        // Invalid or expired code
        console.error('Error verifying oobCode:', error);
      });
  }


  resetPassword(email: string) {

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        console.log("Password reset email sent");
      })
      .catch((error) => {
        console.log(error.code , error.message);
      });
  }
}

