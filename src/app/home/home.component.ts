import { Component, OnInit } from '@angular/core';
import { encuestas } from '../Interfaces/models';
import { Router } from '@angular/router';
import { EncuestaService } from '../services/encuesta.service';  // Import the service

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor() { }  // Inject the service

  ngOnInit(): void { }



}
