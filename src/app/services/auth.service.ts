import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
//import { Firestore , doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth /*, private firestore: Firestore*/) { }

  initAuthListener() {
    this.auth.beforeAuthStateChanged(fuser => {
      console.log(fuser);
    });
  }

  crearUsuario(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginUsuario(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logoutUsuario() {
    return signOut(this.auth);
  }

  isAuth(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((fbUser) => fbUser !== null)
    );
  }
}
