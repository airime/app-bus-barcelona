import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  User,
  UserCredential,
  authState,
  browserSessionPersistence,
  createUserWithEmailAndPassword, reauthenticateWithCredential, sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updateProfile,
  verifyBeforeUpdateEmail
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, runTransaction } from '@angular/fire/firestore';
import { isNull, isNullOrEmpty, plainLowerCaseString } from '../util/util';
import { userProfile } from '../model/userProfile';
import { Observable, Subscription, from, of } from 'rxjs';

/*
  IDENTITY PROVIDERS
  ==================

  Compte! Aquests valors podrien haver canviat

  EmailAuthProviderID: firebase
  PhoneAuthProviderID: phone
  GoogleAuthProviderID: google.com
  FacebookAuthProviderID: facebook.com
  TwitterAuthProviderID: twitter.com
  GitHubAuthProviderID: github.com
  AppleAuthProviderID: apple.com
  YahooAuthProviderID: yahoo.com
  MicrosoftAuthProviderID: hotmail.com

  Trusted providers:

    Email / Password with email verification
    Google (for @gmail.com addresses)
    Yahoo (for @yahoo.com addresses)
    Microsoft (for @outlook.com and @hotmail.com addresses)
    Apple (always verified, because accounts are always verified and multi-factor-authenticated)

  Only trusted providers offer a verified email address; This service avoids using non trusted ones
  (Facebook, Twitter, GitHub, Email / Password without email verification, and
   Google, Yahoo, and Microsoft for domains not issued by that Identity Provider)
    
  Trusted providers are authomatically linked together when issuing the same email address:
  That is to say that Email / Password with email verification is linked together with:
  - google @gmail.com addresses,
  - Yahoo @yahoo.com addresses,
  - Microsoft @outlook.com and @hotmail.com addresses,
  - Apple @icloud.com, @me.com, and @mac.com addresses

*/

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth);
  private authState$ = authState(this.auth);
  private authStateSubscription: Subscription;

  constructor(
    private db: Firestore
  ) {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      console.log("state subscription:", aUser?.email ?? "empty user");
      //this.auth.updateCurrentUser(aUser).then(() => console.log("state subscription:", aUser?.email ?? "empty user"));
    })
  }

  ngOnDestroy(): void {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }

  /* evita propagar l'objecte User, retornant només les propietats necessàries */
  get currentUser(): userProfile | null {
    const usrCurrent = this.auth.currentUser;
    return usrCurrent ?
      {
        "email": usrCurrent.email,
        "displayName": usrCurrent.displayName,
        "photoURL": usrCurrent.photoURL,
        "emailVerified": usrCurrent.emailVerified
      } as userProfile : null;
  }

  async refreshCurrentUser(): Promise<userProfile | null> {
    await this.auth.authStateReady();
    return this.currentUser;
  }

  userHasDisplayName(): boolean {
    return !isNullOrEmpty(this.auth.currentUser?.displayName);
  }

  async register({ email, password }: { email: string; password: string }) {
    try {
      await this.auth.setPersistence(browserSessionPersistence);
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (!credential?.user?.emailVerified) await sendEmailVerification(credential.user);
      return credential;
    } catch (error) {
      //reportError permet registrar errors
      //reportError({ message: getErrorMessage(error) });
      //Llancem l'error, perquè tenim una gestió centralitzada d'errors
      throw (error);
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      await this.auth.setPersistence(browserSessionPersistence);
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (error) {
      //reportError permet registrar errors
      //reportError({ message: getErrorMessage(error) });
      //Llancem l'error, perquè tenim una gestió centralitzada d'errors
      throw (error);
    }
  }

  logout() {
    return signOut(this.auth);
  }


  /******************************************************/
  /* SERVEIS LIMITATS A L'AUTENTICACIO PER CONTRASSENYA */

  async resendEmailVerification({ email, password }: { email: string; password: string }) {
    await this.auth.setPersistence(browserSessionPersistence);
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    if (!!credential?.user && credential?.user.providerId == 'firebase') {
      if (credential.user.emailVerified) throw new Error("The identity of the e-mail user is already verified.");
      else {
        try {
          await sendEmailVerification(credential.user);
        } catch (error) {
          throw (error);
        }
      }
    }
    else if (!credential?.user) {
      throw new Error("Error in user credentials.");
    } else {
      throw new Error("Service only available for authentication using password.");
    }
    return credential;
  }

  async sendPasswordResetEmail(email: string) {
    await this.auth.setPersistence(browserSessionPersistence);
    const usrCurrent = this.auth.currentUser;
    if (!usrCurrent || usrCurrent.providerId == 'firebase') {
      try {
        sendPasswordResetEmail(this.auth, email);
      } catch (error) {
        throw (error);
      }
    } else {
      throw new Error("Service only available for authentication using password.");
    }
  }

  async updateEmail(newEmail: string, password: string) {
    await this.auth.setPersistence(browserSessionPersistence);
    const currentUser = this.currentUser;
    if (!!currentUser) {
      const oldCredential = EmailAuthProvider.credential(currentUser.email, password);
      if (currentUser.emailVerified) {
        throw new Error("Service only available for non-validated emails.");
      } else {
        await reauthenticateWithCredential(this.auth.currentUser!, oldCredential);
        await this.auth.authStateReady();
        const usrCurrent = this.auth.currentUser;
        if (!!usrCurrent && usrCurrent.providerId == 'firebase') {
          try {
            verifyBeforeUpdateEmail(usrCurrent, newEmail); // updateEmail(usrCurrent, newEmail)
          } catch (error) {
            throw (error);
          }
        } else {
          throw new Error("Service only available for authentication using password.");
        }
      }
    }
  }


  /******************************************************/
  /* SERVEIS PER A LA GESTIO DEL DisplayName / photoURL */

  /* interactive check user display name in GUI for async validator */
  validUserNewDisplayName(newDisplayName: string): Observable<boolean> {
    try {
      const usrCurrent = this.auth.currentUser;
      if (usrCurrent && !isNullOrEmpty(newDisplayName)) {
        newDisplayName = plainLowerCaseString(newDisplayName);
        if (!usrCurrent.displayName || newDisplayName != plainLowerCaseString(usrCurrent.displayName)) {
          return from(getDoc(doc(this.db, "displayNames", newDisplayName)).then((newDisplayNameDoc) => !newDisplayNameDoc.exists()));
        } else { return of(true); }
      } else { return of(false); }
    } catch (error) {
      throw (error);
    }
  }

  async updateUserProfile(password: string, profile: { newDisplayName: string, photoURL: string }) {
    const currentUser = this.currentUser;
    if (currentUser) {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      reauthenticateWithCredential(this.auth.currentUser!, credential);
      await this.auth.authStateReady();
      const usrCurrent = this.auth.currentUser;
      if (usrCurrent && !isNullOrEmpty(profile.newDisplayName)) {
        try {
          const docSnap = await getDoc(doc(this.db, "users", usrCurrent.uid));
          //transformació del perfil per valors únics
          const newDisplayName = plainLowerCaseString(profile.newDisplayName);
          //L'usuari ja te displayName
          if (docSnap.exists()) {
            // Comprovar si s'ha d'actualitzar el displayName
            // probablement user.displayName = oldDisplayName
            // però el perfil no s'actualitza en transacció
            const oldDisplayName = docSnap.data()['displayName'];
            if (oldDisplayName != newDisplayName) {
              //se ha de actualizar
              console.log("before call: ", usrCurrent.uid, oldDisplayName, newDisplayName);
              await this.updateDisplayName(this.db, usrCurrent.uid, oldDisplayName, newDisplayName);
            }
          } else {
            // requereix insert
            // generalmenteel perfil user.displayName està buit
            // però no s'actualitza en transacció
            console.log("before call: ", usrCurrent.uid, newDisplayName);
            await this.insertDisplayName(this.db, usrCurrent.uid, newDisplayName);
          }
          //TRANSACCIÓ AMB èxit (sinó hauria generat error)
          //En profile es desa el perfil sense transformar
          this.auth.authStateReady()
            .then(() => {
              /* la llibreria no permet esborrar photoURL */
              if (isNull(profile.photoURL) && !isNull(this.auth.currentUser!.photoURL)) profile.photoURL = "";
              updateProfile(this.auth.currentUser!, {
                displayName: profile.newDisplayName, photoURL: profile.photoURL
              })
            })
            .then(() => { console.log("Profile updated!"); });
        }
        catch (error) {
          throw (error);
        }
      } else {
        let err = new Error("No user is provided or his displayName is empty.");
        err.name = "Unauthorized access";
        throw err;
      }
    } else {
      let err = new Error("No user is provided.");
      err.name = "Unauthorized access";
      throw err;
    }
  }


  // TODO
  /*************************************************************************/
  /* SERVEIS PER A LA GESTIO DEL Token: Requereix DisplayName ja establert */


  /*******************************************************************/
  /* PROCEDIMENTS PRIVATS (Transaccio per establir DisplayName únic) */


  /* TRANSACTION */
  private async updateDisplayName(db: Firestore, uid: string, oldDisplayName: string, newDisplayName: string) {
    //1) comprobar disponible (deberia estar verificado, ahora en transacción)
    // Create a reference to the DisplayName doc.
    const newDisplayNameDocRef = doc(this.db, "displayNames", newDisplayName);
    await runTransaction(db, async (transaction) => {
      const newDisplayNameDoc = await transaction.get(newDisplayNameDocRef);
      if (newDisplayNameDoc.exists()) {
        console.log(newDisplayName + " exists.")
        throw "The display name already exists!";
      } else {
        // - Eliminar oldDisplayName de displayNames
        transaction.delete(doc(db, "displayNames", oldDisplayName));
        // - Insertar newDisplayName en displayNames
        transaction.set(newDisplayNameDocRef, { uid: uid });
        // - Actualizar users valor de displayName=newDisplayName
        transaction.set(doc(db, "users", uid), { displayName: newDisplayName });
      }
    });
  }

  /* TRANSACTION */
  private async insertDisplayName(db: Firestore, uid: string, newDisplayName: string) {
    //1) comprobar disponible (deberia estar verificado, ahora en transacción)
    // Create a reference to the DisplayName doc.
    const newDisplayNameDocRef = doc(db, "displayNames", newDisplayName);
    await runTransaction(db, async (transaction) => {
      const newDisplayNameDoc = await transaction.get(newDisplayNameDocRef);
      if (newDisplayNameDoc.exists()) {
        console.log(newDisplayName + " exists.")
        throw "The display name already exists!";
      } else {
        //2) INSERT en displayNames + INSERT en users
        transaction.set(newDisplayNameDocRef, { uid: uid });
        transaction.set(doc(db, "users", uid), { displayName: newDisplayName });
      }
    });
  }



  /****************************************************/
  /***      R U L E S   D E   F I R E B A S E      ****/

  // rules_version = '2';
  // service cloud.firestore {
  //   match /databases/{database}/documents {
  //     match /displayNames/{alias} {
  //       allow read: if request.auth != null
  //         && request.auth.token.email_verified;
  //       allow create: if (request.auth != null)
  //         && (request.auth.token.email_verified)
  //         && (resource == null)
  //         && request.resource.data.keys().hasAll(["uid"])
  //         && (request.resource.data.keys().hasOnly(["uid"]))
  //         && request.auth.uid == request.resource.data.uid;
  //         /* 
  //           - only insert by verified owner allowed
  //           - there is no registration yet for this displayName
  //           - just only the uid attribute
  //           - uid must be the owner one
  //         */
  //       allow delete: if request.auth != null
  //         && request.auth.token.email_verified
  //         && request.auth.uid == resource.data.uid;
  //         /* only delete by verified owner allowed */
  //     }
  //     match /users/{uuid} {
  //       allow read: if (request.auth != null)
  //         && (uuid == request.auth.uid)
  //         && request.auth.token.email_verified;
  //         /*
  //           - read is allowed by verified owner only
  //         */
  //       allow write: if (request.auth != null)
  //         && (uuid == request.auth.uid)
  //         && (request.auth.token.email_verified)
  //         && request.resource.data.keys().hasAll(["displayName"])
  //         && request.resource.data.keys().hasOnly(["displayName", "nToken"]);
  //         /* 
  //           - write is allowed by verified owner only
  //           - with mandatory displayName attribute
  //           - where only displayName and token are valid attributes
  //         */
  //     }
  //     match /{document=**} {
  //       allow read, write: if false;
  //     }
  //   }
  // }


}
