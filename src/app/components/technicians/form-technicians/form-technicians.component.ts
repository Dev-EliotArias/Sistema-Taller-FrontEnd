import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TechniciansService } from '../../../core/services/technicians.service';
import { Technician } from '../../../core/models/Technician';
import { Observable } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DateInputConverterDirective } from '../../../shared/directives/date-input-converter.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-form-technicians',
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
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DateInputConverterDirective
  ],
  templateUrl: './form-technicians.component.html',
  styleUrl: './form-technicians.component.css',
})
export class FormTechniciansComponent {

  private formGroup = inject(FormBuilder);
  private techServices = inject(TechniciansService);

  form?: FormGroup;
  tech?: Technician;
  techUpdated?: Technician;

  especialidades: string[] = ["MECANICA_GENERAL",
    "ELECTRICIDAD",
    "PLANCHADO",
    "PINTURA",
    "TRANSMISION",
    "SUSPENSION",
    "MOTORES"]

  estados: string[] = ["ACTIVO",
    "INACTIVO",
    "LICENCIA",
    "RETIRADO"]

  constructor(
    public dialogRef: MatDialogRef<FormTechniciansComponent>,
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
          tech => {
            this.tech = tech;
            this.createForm();
            console.log(tech)
          }
        )
    } else {
      this.createForm();
    }
  }


  private createForm() {
    this.form = this.formGroup.group({
      nombre: [this.tech?.nombre || '', [Validators.required]],
      apellido: [this.tech?.apellido || '', [Validators.required]],
      dni: [this.tech?.dni || '', [Validators.required]],
      fechaNacimiento: [this.tech?.fechaNacimiento ? this.formatDate(this.tech.fechaNacimiento) : '', [Validators.required]],
      // fechaNacimiento: [this.datePipe.transform(this.tech?.fechaNacimiento, 'yyyy-MM-dd') || '', [Validators.required]],
      telefono: [this.tech?.telefono || '', [Validators.required]],
      direccion: [this.tech?.direccion || '', Validators.required],
      correo: [this.tech?.correo || '', [Validators.required, Validators.email]],
      especialidad: [this.tech?.especialidad || '', [Validators.required]],
      sueldo: [this.tech?.sueldo || [Validators.required]],
      fechaIngreso: [this.tech?.fechaIngreso ? this.formatDate(this.tech.fechaIngreso) : '', [Validators.required]],
      estado: [this.tech?.estado || '', [Validators.required]]
    });
  }

  save() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const techForm = this.form?.value;
    let FechNac = this.formatDate(techForm.fechaNacimiento);
    let fechaIng = this.formatDate(techForm.fechaIngreso);
    techForm.fechaIngreso = fechaIng;
    techForm.fechaNacimiento = FechNac;

    console.log('Form Value:', techForm);
    let request: Observable<Technician>;

    if (this.tech) {
      console.log('Updating Techi:', techForm);
      request = this.techServices.update(this.tech.id, techForm);
    } else {
      console.log('Saving new Techi:', techForm);
      request = this.techServices.save(techForm);
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

  private formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  private reFormatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  imprimir() {
    console.log(this.form?.get('fechaNacimiento')?.value);
    console.log(this.formatDate(this.form?.get('fechaNacimiento')?.value))
  }

  close() {
    this.dialogRef.close();
  }

  borrarContenido(controlName: string) {
    this.form?.get(controlName)?.setValue('');
  }


}
