export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Inicio',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'usuario',
        title: 'Gestión de Usuarios',
        type: 'item',
        url: '/inicio/usuarios',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'autores',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-users',
        classes: 'nav-item'
<<<<<<< HEAD
<<<<<<< HEAD
      },
      {
        id: 'libros',
        title: 'Gestión de libros',
        type: 'item',
        url: '/inicio/libros',
        icon: 'feather icon-users',
=======
      },
      {
        id: 'libros',
        title: 'Gestión de Libros',
        type: 'item',
        url: '/inicio/libros',
        icon: 'feather icon-book',
>>>>>>> 9183468b8f20567f89ca8f82363756ab1a6b8229
        classes: 'nav-item'
      },
      {
        id: 'prestamos',
<<<<<<< HEAD
        title: 'Gestión de prestamos',
=======
        title: 'Gestión de Prestamos',
>>>>>>> 9183468b8f20567f89ca8f82363756ab1a6b8229
        type: 'item',
        url: '/inicio/prestamos',
        icon: 'feather icon-users',
        classes: 'nav-item'
<<<<<<< HEAD
      },
=======
=======
>>>>>>> 9183468b8f20567f89ca8f82363756ab1a6b8229
      }
>>>>>>> ae502ab8b99c6ea1b1da4245176a489f866fdfe3
    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];
