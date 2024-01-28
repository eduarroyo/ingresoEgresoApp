import { Injectable } from '@angular/core';
import { Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: Usuario | null = null;

  constructor(private auth: Auth,
              private firestore: Firestore,
              private store: Store<AppState>) { }

  get user(): Usuario | null {
    
    if(this._user === null) {
      return null;
    }

    return {...this._user};
  }

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
              this._user = new Usuario(tempUsu["uid"], tempUsu["nombre"], tempUsu["email"]);
              this.store.dispatch(authActions.setUser({user: this._user}));
            }
          })
          .catch(e => console.error(e));
      } else {
        this._user = null;
        this.store.dispatch(authActions.unsetUser());
      }
    });
  }

  crearUsuario(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
            .then(async ({user}) => {
              const newUser = new Usuario(user.uid, name, user.email ?? "" );
              setDoc(doc(this.firestore, user.uid, 'user'), {...newUser})
                .then(result => console.log(result));
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
