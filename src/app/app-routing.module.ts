import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OneComponent } from './steppers/one/one.component';
import { TwoComponent } from './steppers/two/two.component';
import { ThreeComponent } from './steppers/three/three.component';
import { FourComponent } from './steppers/four/four.component';
import { LoginComponent } from './sesion/login/login.component';
import { RegisterComponent } from './sesion/register/register.component';
import { TableComponent } from './tables/table/table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'one/:id',
    component: OneComponent
  },
  {
    path: 'two/:id',
    component: TwoComponent
  },
  {
    path: 'three/:id',
    component: ThreeComponent
  },
  {
    path: 'four/:id',
    component: FourComponent
  },
  { 
    path: 'reg',
    component: RegisterComponent
  },
  {
    path: 'log',
    component: LoginComponent
  },
  {
    path: 'table',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }