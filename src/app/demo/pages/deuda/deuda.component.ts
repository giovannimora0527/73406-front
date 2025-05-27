import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { Deuda } from 'src/app/models/deuda';
import { DeudaService } from './service/deuda.service';

declare const bootstrap: any;

@Component({
  selector: 'app-deuda',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './deuda.component.html',
  styleUrl: './deuda.component.scss',
})
export class DeudaComponent {
  nombreBuscado = '';
  deudas: Deuda[] = [];

  deudaSeleccionada: Deuda | null = null;
  tipoPagoSeleccionado = '';
  tiposPago: string[] = ['Efectivo', 'Nequí', 'Débito'];
  pagando = false;

  modalPagoInstance: any;
  modalExitoInstance: any;

  constructor(private readonly deudaService: DeudaService) {}

  buscarPorUsuario() {
    if (!this.nombreBuscado.trim()) {
      alert('Por favor ingresa un nombre para buscar.');
      return;
    }

    this.deudaService.buscarDeudasPorUsuario(this.nombreBuscado.trim()).subscribe({
      next: (data) => (this.deudas = data),
      error: (err) => {
        console.error(err);
        alert('Error al buscar deudas');
      },
    });
  }

  pagarDeuda(deuda: Deuda) {
    if (deuda.estado?.toLowerCase() === 'pagada') return;

    this.tipoPagoSeleccionado = '';
    this.deudaSeleccionada = deuda;

    const modalElement = document.getElementById('modalPago');
    if (modalElement) {
      this.modalPagoInstance = new bootstrap.Modal(modalElement);
      this.modalPagoInstance.show();
    }
  }

  confirmarPago() {
    if (!this.deudaSeleccionada) return;

    this.pagando = true;

    this.deudaService.pagarDeuda(this.deudaSeleccionada.idDeuda).subscribe({
      next: () => {
        this.pagando = false;
        this.modalPagoInstance.hide();
        this.mostrarModalExito();
        this.buscarPorUsuario(); // refresca
      },
      error: (err) => {
        console.error(err);
        this.pagando = false;
      },
    });
  }

  mostrarModalExito() {
    const modalElement = document.getElementById('modalExito');
    if (modalElement) {
      this.modalExitoInstance = new bootstrap.Modal(modalElement);
      this.modalExitoInstance.show();
    }
  }
}
