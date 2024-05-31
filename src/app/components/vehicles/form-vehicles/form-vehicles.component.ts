import { AfterViewInit, Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ClientFormComponent } from '../../client/client-form/client-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehiculo } from '../../../core/models/Vehiculo';
import { Observable, map, of, startWith, switchMap, tap } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/Cliente';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-form-vehicles',
  standalone: true,
  imports: [
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
  templateUrl: './form-vehicles.component.html',
  styleUrl: './form-vehicles.component.css'
})
export class FormVehiclesComponent implements OnInit, AfterViewInit {

  private clienteService = inject(ClienteService);
  clientes: Cliente[] = [];
  clientesSourceFiltered?: Observable<Cliente[]>

  private formGroup = inject(FormBuilder);
  private vehicleService = inject(VehicleService);

  clienteCalled?: Cliente

  vehicleUpdated?: Vehiculo;

  form?: FormGroup;
  vehicle?: Vehiculo;
  constructor(
    public dialogRef: MatDialogRef<ClientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.iniciarForm(data);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.generarAutocomplete();
  }

  ngAfterViewInit(): void {
    this.generarAutocomplete();
  }



  // private iniciarForm(data: any) {
  //   if (data) {
  //     this.vehicleService.get(data.id).subscribe(vehicle => {
  //       this.vehicle = vehicle;

  //       this.clienteService.get(vehicle.propietarioId).subscribe(cliente => {
  //         console.log(cliente)
  //         console.log(this.clienteCalled = cliente)


  //       this.form = this.formGroup.group({
  //         marca: [[vehicle.marca], [Validators.required]],
  //         modelo: [[vehicle.modelo], [Validators.required]],
  //         color: [[vehicle.color], [Validators.required]],
  //         anio: [[vehicle.anio], [Validators.required]],
  //         placa: [[vehicle.placa], [Validators.required]],
  //         propietario: [[this.clienteCalled?.nombreRazonSocial], Validators.required]
  //       })
  //       this.generarAutocomplete();
  //       })
  //     })


  //   } else {
  //     console.log("Form data is empty")
  //     this.form = this.formGroup.group({
  //       marca: ['', [Validators.required]],
  //       modelo: ['', [Validators.required]],
  //       color: ['', [Validators.required]],
  //       anio: ['', [Validators.required]],
  //       placa: ['', [Validators.required]],
  //       propietario: [null, [Validators.required]]
  //     })

  //   }
  // }

  private iniciarForm(data: any) {
    if (data) {
      this.vehicleService.get(data.id).pipe(
        switchMap(vehicle => {
          this.vehicle = vehicle;
          return this.clienteService.get(vehicle.propietarioId);
        })
      ).subscribe(cliente => {
        this.clienteCalled = cliente;
        this.createForm();
      });
    } else {
      this.createForm();
    }
  }

  private createForm() {
    this.form = this.formGroup.group({
      marca: [this.vehicle?.marca || '', [Validators.required]],
      modelo: [this.vehicle?.modelo || '', [Validators.required]],
      color: [this.vehicle?.color || '', [Validators.required]],
      anio: [this.vehicle?.anio || '', [Validators.required]],
      placa: [this.vehicle?.placa || '', [Validators.required]],
      propietarioId: [this.clienteCalled || null, Validators.required]
    });
    this.generarAutocomplete();
  }

  private generarAutocomplete() {
    if (this.form) {
      this.clientesSourceFiltered = this.form.get('propietarioId')?.valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          if (typeof value === 'string') {
            return this.clienteService.list().pipe(
              map(clientes => this._filter(value, clientes))
            );
          }
          return of([]);
        })
      );
    }
  }

  displayFn(cliente?: Cliente): string {
    return cliente ? cliente.nombreRazonSocial : '';
  }
  private _filter(value: string, clientes: Cliente[]): Cliente[] {
    const filterValue = value.toLowerCase();
    return clientes.filter(option => option.nombreRazonSocial.toLowerCase().includes(filterValue));
  }


  save() {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const vehicleForm = this.form?.value;
    console.log('Form Value:', vehicleForm);


    const propietarioId = this.form?.get('propietarioId')?.value.id;

    if (!propietarioId) {
      console.error("Propietario ID is undefined");
      return;
    }


    vehicleForm.propietarioId = propietarioId;


    let request: Observable<Vehiculo>;


    if (this.vehicle) {
      console.log('Updating vehicle:', vehicleForm);
      request = this.vehicleService.update(this.vehicle.id, vehicleForm);
    } else {
      console.log('Saving new vehicle:', vehicleForm);
      request = this.vehicleService.save(vehicleForm);
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
