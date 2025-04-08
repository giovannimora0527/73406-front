import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { AutorComponent } from './demo/pages/autor/autor.component';
<<<<<<< HEAD
<<<<<<< HEAD
import { LibroComponent } from './demo/pages/libros/libro.component';
import { PrestamosComponent } from './demo/pages/prestamos/prestamos.component';
=======
>>>>>>> ae502ab8b99c6ea1b1da4245176a489f866fdfe3
=======
import { LibroComponent } from './demo/pages/libro/libro.component';
import { PrestamoComponent } from './demo/pages/prestamo/prestamo.component';
>>>>>>> 9183468b8f20567f89ca8f82363756ab1a6b8229

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
<<<<<<< HEAD
<<<<<<< HEAD
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }} ,
      { path: 'libros', component: LibroComponent, data: { title: 'libros' }},
      { path: 'prestamos', component: PrestamosComponent, data: { title: 'prestamos' }}
=======
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }}     
>>>>>>> ae502ab8b99c6ea1b1da4245176a489f866fdfe3
=======
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }},
      { path: 'libros', component: LibroComponent, data: { title: 'Libros' }} ,
      { path: 'prestamos', component: PrestamoComponent, data: { title: 'Prestamos' }}     
>>>>>>> 9183468b8f20567f89ca8f82363756ab1a6b8229
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
