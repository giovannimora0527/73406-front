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
      },
      {
        id: 'libros',
<<<<<<< HEAD
        title: 'Gestión de libros',
        type: 'item',
        url: '/inicio/libros',
        icon: 'feather icon-users',
=======
        title: 'Gestión de Libros',
        type: 'item',
        url: '/inicio/libros',
        icon: 'feather icon-book',
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087
        classes: 'nav-item'
      },
      {
        id: 'prestamos',
<<<<<<< HEAD
        title: 'Gestión de prestamos',
=======
        title: 'Gestión de Prestamos',
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087
        type: 'item',
        url: '/inicio/prestamos',
        icon: 'feather icon-users',
        classes: 'nav-item'
<<<<<<< HEAD
      },
=======
      }
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087
    ]
  }
  /* ---------- Nuevos menus aqui -------------  */
];
