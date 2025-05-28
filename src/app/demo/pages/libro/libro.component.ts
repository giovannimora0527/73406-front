/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MessageUtils } from 'src/app/utils/message-utils';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss',
  providers: [CategoriaService],
})
export class LibroComponent {
  msjSpinner = '';
  modalInstance: any;
  modoFormulario = '';
  titleModal = '';
  archivoSeleccionado: File | null = null;

  libroSelected: Libro | null = null;
  currentYear = new Date().getFullYear();

  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl(''),
  });

  constructor(
    private readonly messageUtils: MessageUtils,
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService,
    private readonly categoriaService: CategoriaService
  ) {
    this.getLibros();
    this.getAutores();
    this.cargarCategorias();
    this.cargarFormulario();
  }

  /* ────────────────────────────────
   *  Inicialización de datos
   * ──────────────────────────────── */

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.log(err),
    });
  }

  getAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => (this.autores = data),
      error: (err) => console.log(err),
    });
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => (this.libros = data),
      error: (err) => console.log(err),
    });
  }

  /* ────────────────────────────────
   *  Formulario
   * ──────────────────────────────── */

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', Validators.required],
      autorId: ['', Validators.required],
      anioPublicacion: ['', Validators.required],
      categoriaId: ['', Validators.required],
      existencias: [true, Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /* ────────────────────────────────
   *  Modal alta / edición
   * ──────────────────────────────── */

  crearModal(modoForm: 'C' | 'E') {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Libro' : 'Editar Libro';

    const modalElement = document.getElementById('crearModal');
    modalElement?.setAttribute('aria-hidden', 'false');

    this.modalInstance ??= new bootstrap.Modal(modalElement);
    this.modalInstance.show();

    if (modoForm === 'C') {
      this.form.reset({
        titulo: '',
        autorId: this.autores[0]?.idAutor,
        anioPublicacion: '',
        categoriaId: this.categorias[0]?.categoriaId,
        existencias: '',
      });
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.libroSelected = libro;

    this.form.patchValue({
      titulo: libro.titulo,
      existencias: libro.existencias,
      anioPublicacion: libro.anioPublicacion,
      autorId: libro.autor.idAutor,
      categoriaId: libro.categoria.categoriaId,
    });

    this.crearModal('E');
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.modalInstance?.hide();
    this.libroSelected = null;
  }

  /* ────────────────────────────────
   *  Guardar / Actualizar
   * ──────────────────────────────── */

  guardarActualizar() {
    if (!this.form.valid) {
      this.messageUtils.showMessage(
        'Advertencia',
        'El formulario no es válido',
        'warning'
      );
      return;
    }

    this.msjSpinner = 'Guardando';
    this.spinner.show();

    if (this.modoFormulario === 'C') {
      this.libroService.crearLibro(this.form.getRawValue()).subscribe({
        next: (d) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Éxito', d.message, 'success');
          this.cerrarModal();
          this.getLibros();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Error', err.error.message, 'error');
        },
      });
    } else if (this.libroSelected) {
      const libroActualizado: Libro = {
        idLibro: this.libroSelected.idLibro,
        titulo: this.form.get('titulo')?.value,
        anioPublicacion: this.form.get('anioPublicacion')?.value,
        existencias: this.form.get('existencias')?.value,
        autor: { idAutor: +this.form.get('Idautor')?.value } as Autor,
        categoria: {
          categoriaId: +this.form.get('categoriaId')?.value,
        } as Categoria,
      };

      this.libroService.actualizarLibro(libroActualizado).subscribe({
        next: (d) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Éxito', d.message, 'success');
          this.cerrarModal();
          this.getLibros();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageUtils.showMessage('Error', err.error.message, 'error');
        },
      });
    }
  }

  /* ────────────────────────────────
   *  Validación de input numérico
   * ──────────────────────────────── */

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (parseInt(value, 10) < 1) value = '1';
    if (value.includes('-') || isNaN(+value)) value = value.replace(/\D/g, '');

    input.value = value;
  }

  /* ────────────────────────────────
   *  Carga CSV
   * ──────────────────────────────── */

  onFileSelected(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file && file.name.endsWith('.csv')) {
      this.archivoSeleccionado = file;
    } else {
      this.messageUtils.showMessage('Error', 'Solo se permiten archivos CSV', 'error');
      (event.target as HTMLInputElement).value = '';
    }
  }

  cargarArchivo() {
    if (!this.archivoSeleccionado) {
      this.messageUtils.showMessage('Error', 'Debe seleccionar un archivo CSV', 'error');
      return;
    }

    this.msjSpinner = 'Procesando archivo CSV...';
    this.spinner.show();

    this.libroService.cargarLibrosDesdeCSV(this.archivoSeleccionado).subscribe({
      next: (resp: any) => {
        this.spinner.hide();

        const ok = resp.librosGuardados ?? 0;
        const errores: string[] = resp.errores ?? [];

        let msg = `Se importaron ${ok} libros correctamente.`;
        if (errores.length) {
          msg += `\n\nSe encontraron ${errores.length} errores:\n- ` +
                 errores.slice(0, 5).join('\n- ');
          if (errores.length > 5) {
            msg += `\n...y ${errores.length - 5} errores más.`;
          }
        }

        this.messageUtils.showMessage('Carga de libros', msg, errores.length ? 'warning' : 'success');

        this.getLibros();
        this.archivoSeleccionado = null;
        (document.getElementById('csvFileLibroInput') as HTMLInputElement).value = '';

        bootstrap.Modal.getInstance(document.getElementById('cargarCsvLibroModal'))?.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.messageUtils.showMessage('Error', err.error?.message || 'Error al procesar el archivo', 'error');
      },
    });
  }
}
