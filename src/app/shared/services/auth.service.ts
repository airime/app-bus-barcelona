import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Auth, 
  EmailAuthProvider, 
  User,
  authState,
  browserSessionPersistence,
  createUserWithEmailAndPassword, reauthenticateWithCredential, sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, runTransaction } from '@angular/fire/firestore';
import { isNull, isNullOrEmpty, plainLowerCaseString } from '../util/util';
import { userProfile } from '../model/userProfile';
import { Observable, Subscription, from, of } from 'rxjs';

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

  async resendEmailVerification({ email, password }: { email: string; password: string }) {
    try {
      await this.auth.setPersistence(browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      if (!!credential?.user) {
        if (credential.user.emailVerified) throw new Error("The identity of the e-mail user is already verified.");         
        else await sendEmailVerification(credential.user);
      }
      else throw new Error("Error in user credentials.");
      return credential;
    } catch (error) {
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

  async sendPasswordResetEmail(email: string) {
    try {
      sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw (error);
    }
  }

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


  logout() {
    return signOut(this.auth);
  }
}
