import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { AutorComponent } from './demo/pages/autor/autor.component';
import { PrestamoComponent } from './demo/pages/prestamo/prestamo.component';
import { LibroComponent } from './demo/pages/libro/libro.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    children: [      
      { path: 'usuarios', component: UsuarioComponent, data: { title: 'Usuarios' }},   
      { path: 'autores', component: AutorComponent, data: { title: 'autores' }},
      { path: 'prestamos', component: PrestamoComponent, data: { title: 'prestamos' }} ,
      { path: 'libro', component: LibroComponent, data: { title: 'libro' }}
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
