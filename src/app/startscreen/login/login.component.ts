import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthFirebaseService } from 'src/services/auth-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorInfo: any = false;
  isInputActive = false;
  isPasswordInputActive = false;
  isPasswordVisible: boolean = false;
  showPasswordImage: string = 'assets/img/icons/eye.png';
  hidePasswordImage: string = 'assets/img/icons/hideeye.png';

  guestLoginName = 'guest@guest.at';
  guestLoginPassword = 'DABubbleGuest';

  contactForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  loginFailed = false; 
  loginErrorMessage = ""; 
  firebaseAuthErrorMessages = {
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
  

  constructor(private authService: AuthFirebaseService) { }

  firebaseUserService = inject(UserFirebaseService);

  ngOnInit(): void {
    console.log('User Logged In: ' + this.authService.isLoggedIn());
  }

  async login() {
    console.log(this.contactForm.value.emailInput);
    console.log(this.contactForm.value.passwordInput);
    if (
      this.contactForm.value.emailInput != null &&
      this.contactForm.value.passwordInput != null
    ) {
        this.authService.login(this.contactForm.value.emailInput,this.contactForm.value.passwordInput)
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          
          if(errorCode != null && errorCode != undefined){
            this.loginErrorMessage = this.firebaseAuthErrorMessages[errorCode as keyof typeof this.firebaseAuthErrorMessages];
            this.loginFailed = true; 
          }
        });
      }
      
      /*
      .then(() => {
        // Handle successful login
        console.log('logged in successfully');
      })
      .catch((error) => {
        // Handle login error here
        console.error('Login failed:', error.message);
      });
      */
    
  }

  async guestLogin() {
    this.authService
      .login(this.guestLoginName, this.guestLoginPassword)
    /*
    .then((result) => {
      // Handle successful login
      console.log('logged in successfully');
    })
    .catch((error) => {
      // Handle login error here
      console.error('Login failed:', error.message);
    });
    */
  }

  loginWithGoogle() {
    this.authService.GoogleAuth();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
