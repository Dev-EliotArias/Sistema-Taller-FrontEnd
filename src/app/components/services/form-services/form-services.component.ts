import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MechServicesService } from '../../../core/services/mech-services.service';
import { TechService } from '../../../core/models/TechServices';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-services',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle],
  templateUrl: './form-services.component.html',
  styleUrl: './form-services.component.css'
})
export class FormServicesComponent {

  private formGroup = inject(FormBuilder);
  private techServices = inject(MechServicesService);

  form?: FormGroup;
  service?: TechService;
  serviceUpdated?: TechService;

  constructor(
    public dialogRef: MatDialogRef<FormServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.iniciarForm(data);
  }

  ngOnInit(): void {
    // this.generarAutocomplete();
  }

  ngAfterViewInit(): void {
    // this.generarAutocomplete();
  }

  private iniciarForm(data: any) {
    if (data) {
      this.techServices.get(parseInt(data.id))
        .subscribe(
          service => {
            this.service = service;
            this.createForm();
            console.log(service)
          }
        )
    } else {
      this.createForm();
    }
  }

  private createForm() {
    this.form = this.formGroup.group({
      nombre: [this.service?.nombre || '', [Validators.required]],
      costo: [this.service?.costo || '', [Validators.required]],
      descripcion: [this.service?.descripcion || '', [Validators.required]],
      tiempoEstimado: [this.service?.tiempoEstimado || '', [Validators.required]],
    });
  }


  save() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const serviceForm = this.form?.value;

    console.log('Form Value:', serviceForm);
    let request: Observable<TechService>;

    if (this.service) {
      console.log('Actualizando Servicios:', serviceForm);
      request = this.techServices.update(this.service.id, serviceForm);
    } else {
      console.log('Guardando nuevos servicios:', serviceForm);
      request = this.techServices.save(serviceForm);
    }
    request.subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: response => {
        console.log(response);
      }
    })
  }

  close() {
    this.dialogRef.close();
  }

  borrarContenido(controlName: string) {
    this.form?.get(controlName)?.setValue('');
  }

}
