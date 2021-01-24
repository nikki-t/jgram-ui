import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GradeComponent } from './grade/grade.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',          component: HomeComponent },
  { path: 'grade',     component: GradeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
