import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, addDoc, collection, doc, getDoc, DocumentData, query, where, getDocs } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth,
              private firestore: Firestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.beforeAuthStateChanged(fuser => {
      console.log(fuser);
      
      if(fuser) {
        //logado
        const q = query(collection(this.firestore, "user"), where("uid", "==", fuser.uid));

        getDocs(q)
          .then(qs => {
            if(qs.docs.length === 1) {
              const tempUsu = qs.docs[0].data();
              const usu: Usuario = new Usuario(tempUsu["uid"], tempUsu["nombre"], tempUsu["email"]);
              this.store.dispatch(authActions.setUser({user: usu}));
            }
          })
          .catch(e => console.error(e));
      } else {
        this.store.dispatch(authActions.unsetUser());
      }
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
