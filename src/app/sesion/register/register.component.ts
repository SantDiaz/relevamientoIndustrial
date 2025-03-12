import { Component, OnInit } from '@angular/core';
import { profile } from 'src/app/Interfaces/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar FormBuilder y Validators
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Definir la variable para perfiles
  profi = profile;

  // Crear el formulario de registro
  registerForm: FormGroup;

  // Inyectamos AuthService y FormBuilder
  constructor(private authService: AuthService, private fb: FormBuilder) {
    // Inicializamos el formulario
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      profile: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  // Método para enviar el formulario
  onRegister(): void {
    if (this.registerForm.valid) {
      const { firstName, lastName, username, password, profile } = this.registerForm.value;

      // Usamos el servicio de AuthService para registrar el usuario
      this.authService.register(username, password).subscribe({
        next: (response) => {
          console.log('Usuario registrado con éxito', response);
          // Aquí puedes redirigir al usuario a la página de login o de inicio
        },
        error: (error) => {
          console.error('Error al registrar usuario', error);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
