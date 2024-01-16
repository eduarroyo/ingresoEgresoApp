import { Component, OnDestroy, OnInit } from '@angular/core';
import { validatePassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    
    this.uiSubscription = this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      console.log('cargando subs');
    });
  }
                
  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }

  login() {
    if(!this.loginForm.valid) return;

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Accediendo...',
    //   showConfirmButton: false,
    //   showCloseButton: false,
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });

    const {email, password} = this.loginForm.value;
    this.authService
      .loginUsuario(email, password)
      .then(user => {
        console.log(user);
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        });
      });
  }
}
