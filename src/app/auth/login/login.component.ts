import { Component, OnInit } from '@angular/core';
import { validatePassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if(!this.loginForm.valid) return;

    const {email, password} = this.loginForm.value;
    this.authService
      .loginUsuario(email, password)
      .then(user => {
        console.log(user);
        this.router.navigate(['/']);
      })
      .catch(err =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message
        }));
  }
}
