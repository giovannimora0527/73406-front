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
import { PrestamosComponent } from './demo/pages/prestamos/prestamos.component';
=======
import { PrestamoComponent } from './demo/pages/prestamos/prestamos.component';
>>>>>>> 93388edb1f30850556f6a86be438c61b8bfd57c1
import { LibroComponent } from './demo/pages/libros/libro.component';
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087

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
      { path: 'autores', component: AutorComponent, data: { title: 'Autores' }} ,
      { path: 'libros', component: LibroComponent, data: { title: 'libros' }},
<<<<<<< HEAD
<<<<<<< HEAD
      { path: 'prestamos', component: PrestamosComponent, data: { title: 'prestamos' }}
=======
      { path: 'prestamos', component: PrestamosComponent, data: { title: 'prestamos' }},  
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087
=======
      { path: 'prestamos', component: PrestamoComponent, data: { title: 'prestamos' }},  
>>>>>>> 93388edb1f30850556f6a86be438c61b8bfd57c1
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
