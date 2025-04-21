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
        icon: 'feather icon-users',
        classes: 'nav-item'
      },
      {
        id: 'autor',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
<<<<<<< HEAD
        id: 'libro',
        title: 'Gestión de Libros',
        type: 'item',
        url: '/inicio/libro',
        icon: 'feather icon-book',
        classes: 'nav-item'
      },
      {
        id: 'prestamo',
        title: 'Gestión de Prestamos',
        type: 'item',
        url: '/inicio/prestamo',
        icon: 'feather icon-refresh-cw',
=======
        id: 'autores',
        title: 'Gestión de Autores',
        type: 'item',
        url: '/inicio/autores',
        icon: 'feather icon-users',
>>>>>>> d09bdfa (Ajustes de modulos)
        classes: 'nav-item'
      }
    ]
  },
  /* ---------- Nuevos menus aqui -------------  */
];
