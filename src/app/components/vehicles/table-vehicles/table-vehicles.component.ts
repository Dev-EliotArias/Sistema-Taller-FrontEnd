import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehiculo } from '../../../core/models/Vehiculo';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormVehiclesComponent } from '../form-vehicles/form-vehicles.component';

@Component({
  selector: 'app-table-vehicles',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table-vehicles.component.html',
  styleUrl: './table-vehicles.component.css'
})
export class TableVehiclesComponent implements OnInit, AfterViewInit {

  private vehiclesService = inject(VehicleService);

  vehicles: Vehiculo[] = [];

  // dataSourceVehicles = new MatTableDataSource<Vehiculo>(this.vehicles);
  dataSourceVehicles = new MatTableDataSource<Vehiculo>();

  columnsVehicle: string[] = ['id', 'marca', 'modelo', 'color', 'anio', 'placa', 'funciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listVehicles();
  }

  listVehicles() {
    this.vehiclesService.list().subscribe(vehicles => {
      this.dataSourceVehicles.data = vehicles;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceVehicles.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceVehicles.paginator) {
      this.dataSourceVehicles.paginator.firstPage();
    }

  }


  openDialog(id?: number): void {
    let dialogRef: MatDialogRef<FormVehiclesComponent>;
    if (id) {
      dialogRef = this.dialog.open(FormVehiclesComponent,{
        data: {
          id: id
        }
      })
    } else {
      dialogRef = this.dialog.open(FormVehiclesComponent, {
        width: '500px',
        enterAnimationDuration: 700,
        exitAnimationDuration: 500
      })
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.listVehicles();

    });
  }

  deleteVehicle(id: number) {
    this.vehiclesService.delete(id)
      .subscribe(() => {
        this.listVehicles();
      })
    this.listVehicles();
  }

  ngAfterViewInit() {

    if (this.paginator) {
      this.dataSourceVehicles.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
    this.dataSourceVehicles.sort = this.sort;
  }




}
