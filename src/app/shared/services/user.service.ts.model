import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query, setDoc, updateDoc,
  where
} from "@angular/fire/firestore";
import {Auth, User, UserCredential} from "@angular/fire/auth";
import {Observable, of} from "rxjs";
import {IUser, IVacanca} from "../models/interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: IUser | undefined = undefined;

  constructor(private firestore: Firestore,
              private auth: Auth
  ) { }

  async checkIfUserExists() {
    return new Promise((success, error) => {
      this.getUserById(this.auth.currentUser!.uid).subscribe((user: IUser) => {
        console.log('user', user);
        console.log('auth user', this.auth.currentUser);
        if (user === undefined) {
          const test = this.saveUser(this.auth.currentUser!);
          console.log('test', test);
          success(true);
        } else {
          success(false);
        }
      })
    })
  }

  private getUserById(id: string): Observable<IUser> {
    if (this.user === undefined) {
      const userDocRef = doc(this.firestore, `users/${id}`);
      docData(userDocRef, { idField: 'id' }).forEach((user: any) => {
        console.log('user', user);
        this.user = user;
      })
      return docData(userDocRef, { idField: 'id' }) as Observable<IUser>;
    } else {
      return of(this.user!);
    }
  }

  getUser() {
    return this.getUserById(this.auth.currentUser!.uid);
  }

  saveUser(user: User) {
    const u: IUser = {
      id: user.uid,
      email: user.email || '',
      pushToken: '',
      avatarImg: ''
    }
    return setDoc(doc(this.firestore, 'users', this.auth.currentUser!.uid), u);
  }

  updateUser(user: IUser) {
    const userDocRef = doc(this.firestore, `users/${user.id}`);
    this.user = user;
    console.log('user upadted', this.user);
    return updateDoc(userDocRef, { ...user });
  }

  setUserPushToken(token: string) {
    this.getUserById(this.auth.currentUser!.uid).subscribe((user: IUser) => {
      user.pushToken = token;
      console.log('token',token);
      this.updateUser(user);
    })
  }

  setAvatarImg(img: string) {
    this.getUserById(this.auth.currentUser!.uid).subscribe((user: IUser) => {
      user.avatarImg = img;
      this.updateUser(user);
    })
  }

}
