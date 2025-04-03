import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private routes: Router, private AuthService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.http.post('http://localhost:8080/api/auth/login', credentials).subscribe(
        (response) => {
          console.log('Login exitoso', response);
          this.routes.navigate(['/nextRoute']); // Redirigir o manejar el éxito
        },
        (error) => {
          console.error('Error en el login', error);
        }
      );
    }
  }
  
}
