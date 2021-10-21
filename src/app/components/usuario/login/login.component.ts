import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { ErrorService } from 'src/app/services/error.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private _errorService: ErrorService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  login() {
    console.log(this.loginForm);

    const usuario = this.loginForm.get('usuario')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(usuario, password).then(
      (respuesta) => {
        if (respuesta.user?.emailVerified == false) {
          this.router.navigate(['/usuario/verificarCorreo']);
        } else {
          //Lo redireccionamos al dashboard
          this.setLocalStorage(respuesta.user)
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastr.error(this._errorService.error(error.code), 'Error');
        this.loginForm.reset();
      }
    );
  }

  setLocalStorage(user: any){
    const usuario: User = {
      uid: user.uid,
      email: user.email
    }
    localStorage.setItem('user', JSON.stringify(usuario));
  }
}
