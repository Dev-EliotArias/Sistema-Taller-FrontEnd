import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/Cliente';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent {

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  form?: FormGroup;
  cliente?: Cliente;

  constructor(
    public dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    if (data) {
      this.clienteService.get(parseInt(data.id))
        .subscribe(cliente => {
          this.cliente = cliente;
          console.log(this.cliente)
          this.form = this.fb.group({
            nombreRazonSocial: [cliente.nombreRazonSocial, [Validators.required]],
            tipoDocumento: [cliente.tipoDocumento, [Validators.required]],
            tipoCliente: [cliente.tipoCliente, [Validators.required]],
            numeroDoc: [cliente.numeroDoc, [Validators.required]],
            telefono: [cliente.telefono, [Validators.required]],
            correo: [cliente.correo, [Validators.required, Validators.email]],
            direccion: [cliente.direccion, [Validators.required]],
            tipoPago: [cliente.tipoPago, [Validators.required]],
          })
        })
    } else {
      this.form = this.fb.group({
        nombreRazonSocial: ['', [Validators.required]],
        tipoDocumento: ['DNI', [Validators.required]],
        tipoCliente: ['', [Validators.required]],
        numeroDoc: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        direccion: ['', [Validators.required]],
        tipoPago: ['', [Validators.required]],
      })
    }
  }
  save() {

    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const clienteForm = this.form!.value
    let request: Observable<Cliente>;
    console.log(clienteForm)
    if (this.cliente) {
      request = this.clienteService.update(this.cliente.id, clienteForm)
    } else {
      request = this.clienteService.save(clienteForm)
    }

    request.subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: response => {
        console.log(response)
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  borrarContenido(controlName: string) {
    this.form?.get(controlName)?.setValue('');
  }

}
