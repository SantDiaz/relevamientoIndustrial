import { Component, OnInit } from '@angular/core';
import { profile } from 'src/app/Interfaces/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  profi = profile;

  constructor() { }

  ngOnInit(): void {
  }

}
