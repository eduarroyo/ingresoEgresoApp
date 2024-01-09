import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore , addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  initAuthListener() {
    this.auth.beforeAuthStateChanged(fuser => {
      console.log(fuser);
    });
  }

  crearUsuario(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
            .then(({user}) => {
              const newUser = new Usuario(user.uid, name, user.email ?? "" );
              const userRef = collection(this.firestore, 'user');
              return addDoc(userRef, {...newUser});
            });
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
