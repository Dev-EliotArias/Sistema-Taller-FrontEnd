import { AsyncPipe, CommonModule} from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { OrdenTrabajoService } from '../../../core/services/OrdenTrabajo.service';
import { OrdenTrabajo } from '../../../core/models/OrdenTrabajo';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TechniciansService } from '../../../core/services/technicians.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { MechServicesService } from '../../../core/services/mech-services.service';
import { Observable, map, of, startWith, switchMap } from 'rxjs';
import { Technician } from '../../../core/models/Technician';
import { Vehiculo } from '../../../core/models/Vehiculo';
import { TechService } from '../../../core/models/TechServices';

@Component({
  selector: 'app-form-orden-trabajo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule,
    AsyncPipe,
    MatAutocompleteModule,
  ],
  templateUrl: './formOrdenTrabajo.component.html',
  styleUrl: './formOrdenTrabajo.component.css'
})
export class FormOrdenTrabajoComponent implements OnInit, AfterViewInit {
  private vehiculoService = inject(VehicleService);
  private tecnicoService = inject(TechniciansService);
  private ordenTrabajoService = inject(OrdenTrabajoService);
  private mechServicesService = inject(MechServicesService);


  vehiculoRecibido?: Vehiculo;
  vehiculosParaFiltrar?: Observable<Vehiculo[]>;
  tecnicoRecibido?: Technician;
  tecnicosParaFiltrar?: Observable<Technician[]>;

  estados: string[] = ["PENDIENTE", "EN_PROCESO", "FINALIZADO"]
  servicios: TechService[] = [];

  ordenTrabajoRecibida?: OrdenTrabajo;
  //Formulario
  private formGroup = inject(FormBuilder);

  form?: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FormOrdenTrabajoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.iniciarForm(data);
  }

  ngOnInit(): void {
    this.mechServicesService.list().subscribe(servicios => {
      this.servicios = servicios;
    });
    this.form?.get('serviciosId')?.valueChanges.subscribe(() => {
      this.updateCostoTotal();
    });
  }
  ngAfterViewInit(): void {
  }


  // private iniciarForm(data: any) {
  //   if (data) {
  //     this.ordenTrabajoService.get(data.id).pipe(
  //       switchMap(ordenTrabajo => {
  //         this.ordenTrabajoRecibida = ordenTrabajo;
  //         console.log(ordenTrabajo);
  //         return this.tecnicoService.get(ordenTrabajo.tecnicoId);
  //       })
  //     ).subscribe(vehiculo => {
  //       this.tecnicoRecibido = vehiculo;
  //       this.createForm();
  //     });
  //   } else {
  //     this.createForm();
  //   }
  // }

  private iniciarForm(data: any) {
    if (data) {
      this.ordenTrabajoService.get(data.id)
        .subscribe(ordenTrabajo => {
          this.ordenTrabajoRecibida = ordenTrabajo;
          this.createForm();
          console.log(ordenTrabajo);
        });
    } else {
      this.createForm();
    }
  }

  private createForm() {
    this.form = this.formGroup.group({
      fechaIngreso: [this.ordenTrabajoRecibida?.fechaIngreso ? this.formatDate(this.ordenTrabajoRecibida.fechaIngreso) : '', [Validators.required]],
      fechaSalida: [this.ordenTrabajoRecibida?.fechaSalida ? this.formatDate(this.ordenTrabajoRecibida.fechaSalida) : '', [Validators.required]],
      comentario: [this.ordenTrabajoRecibida?.comentario || '', []],
      estado: [this.ordenTrabajoRecibida?.estado || '', [Validators.required]],
      serviciosId: [this.ordenTrabajoRecibida?.serviciosId || [], [Validators.required]],
      costoTotal: [{value: this.ordenTrabajoRecibida?.costoTotal || 0, disabled: true}, [Validators.required]],
      vehiculoId: [this.ordenTrabajoRecibida?.vehiculoId || '', [Validators.required]],
      tecnicoId: [this.tecnicoRecibido?.nombre || '', [Validators.required]]
    });
    this.generarAutocomplete();
  }

  // Autocomplete for Technicians
  private _filterVehiculos(value: string, vehiculos: Vehiculo[]): Vehiculo[] {
    const filterValue = value.toLowerCase();
    return vehiculos.filter(option => option.marca.toLowerCase().includes(filterValue) || option.modelo.toLowerCase().includes(filterValue));
  }

  displayFnVehiculo(vehiculo?: Vehiculo): string {
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : '';
  }

  private _filterTecnicos(value: string, tecnicos: Technician[]): Technician[] {
    const filterValue = value.toLowerCase();
    return tecnicos.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayFnTecnico(tecnico?: Technician): string {
    return tecnico ? tecnico.nombre : '';
  }


  generarAutocomplete() {
    this.tecnicosParaFiltrar = this.form?.get('tecnicoId')?.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.tecnicoService.list().pipe(
            map(tecnicos => this._filterTecnicos(value, tecnicos))
          );
        }
        return of([]);
      })
    );

    this.vehiculosParaFiltrar = this.form?.get('vehiculoId')?.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.vehiculoService.list().pipe(
            map(vehiculos => this._filterVehiculos(value, vehiculos))
          );
        }
        return of([]);
      })
    );
  }

  updateCostoTotal() {
    if (this.form) {
      const serviciosSeleccionados = this.form.get('serviciosId')?.value || [];
      const costoTotal = serviciosSeleccionados.reduce((acc: number, servicioId: number) => {
        const servicio = this.servicios.find((s) => s.id === servicioId);
        return acc + (servicio?.costo || 0);
      }, 0);
      this.form.get('costoTotal')?.setValue(costoTotal, { emitEvent: false });
    }
  }

  save() {
    if (this.form?.valid) {
      const formData = this.form.getRawValue();

      const tecnico = this.form?.get('tecnicoId')?.value;
      const vehiculo = this.form?.get('vehiculoId')?.value;

      formData.tecnicoId = tecnico.id ? tecnico.id : tecnico;
      formData.vehiculoId = vehiculo.id ? vehiculo.id : vehiculo;


      if (this.ordenTrabajoRecibida) {
        // Editar Orden de Trabajo existente
        console.log(formData)
        this.ordenTrabajoService.update(this.ordenTrabajoRecibida.id, formData).subscribe(() => {
          this.dialogRef.close(true);
        });
      } else {
        // Crear nueva Orden de Trabajo
        console.log(formData)
        this.ordenTrabajoService.save(formData).subscribe(() => {
          this.dialogRef.close(true);
        });
      }
    }
  }


  private formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  private reFormatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

}
