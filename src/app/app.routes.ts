import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ListeCandidatsComponent } from './pages/liste-candidats/liste-candidats.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { ProfileComponent } from './pages/profile/profile.component'; 
import { NotificationComponent } from './pages/notification/notification.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  {
    path: 'liste-candidats',
    component: ListeCandidatsComponent,
    canActivate: [authGuard],
  },

  {
    path: 'planning',
    component: PlanningComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    component: NotificationComponent,
    canActivate: [authGuard],
  },

];
