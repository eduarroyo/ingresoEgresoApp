import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  public registroForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: [ '', Validators.required ],
      correo: [ '', Validators.required ],
      password: [ '', Validators.required ]
    });
  }

  crearUsuario() {
    console.log(this.registroForm);
    console.log(this.registroForm?.valid);
    console.log(this.registroForm?.value);
  }
}
