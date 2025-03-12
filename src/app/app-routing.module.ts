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
import { HomeAdmComponent } from './home/homeProfile/home-adm/home-adm.component';
import { HomeAnComponent } from './home/homeProfile/home-an/home-an.component';
import { HomeIngComponent } from './home/homeProfile/home-ing/home-ing.component';
import { HomeSupComponent } from './home/homeProfile/home-sup/home-sup.component';
import { HomeCorComponent } from './home/homeProfile/home-cor/home-cor.component';
import { HomeValComponent } from './home/homeProfile/home-val/home-val.component';

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
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'table',
    component: TableComponent
  },
  {
    path: 'homeAdm',
    component: HomeAdmComponent
  },
  {
    path: 'homeAn',
    component: HomeAnComponent
  },
  {
    path: 'homeIng',
    component: HomeIngComponent
  },
  {
    path: 'homeSup',
    component: HomeSupComponent
  },
  {
    path: 'homeCor',
    component: HomeCorComponent
  },
  {
    path: 'homeVal',
    component: HomeValComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }