import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/sesion/services/auth.service';

@Component({
  selector: 'app-home-adm',
  templateUrl: './home-adm.component.html',
  styleUrls: ['./home-adm.component.css']
})
export class HomeAdmComponent implements OnInit {
  users: any[] = [];

  constructor(private AuthService: AuthService) { }

  ngOnInit(): void {
    this.AuthService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    );
  }

}
