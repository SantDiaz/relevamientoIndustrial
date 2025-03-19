import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Profile, User } from 'src/app/Interfaces/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
  profiles: Profile[] = [
    { id: 1, name: 'Supervisor' },
    { id: 2, name: 'Validador' },
    { id: 3, name: 'Ingresador' },
    { id: 4, name: 'Analista' },
    { id: 5, name: 'Coordinador' },
    { id: 6, name: 'Administrador' },
  ];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profile: ['', Validators.required]  // Aquí se guarda el profileId
    });
  }

  ngOnInit(): void {
    // Si necesitas cargar perfiles desde un servicio, puedes hacerlo aquí
  }
// Método para enviar el formulario
onRegister(): void {
  if (this.registerForm.valid) {
    const { username, password, profile } = this.registerForm.value;

    // Preparamos los datos del nuevo usuario con el perfil
    const userData = {
      username,
      password,
      profileId: profile  // Aquí utilizamos el 'profile' que es el ID del perfil seleccionado
    };

    // Usamos el servicio de AuthService para registrar el usuario
    this.authService.register(userData.username, userData.password).subscribe({
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
