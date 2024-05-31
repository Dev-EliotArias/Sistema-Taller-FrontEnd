import { Component, ViewChild, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MechServicesService } from '../../../core/services/mech-services.service';
import { TechService } from '../../../core/models/TechServices';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormServicesComponent } from '../form-services/form-services.component';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-table-services',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, CurrencyPipe],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent {

  private techServService = inject(MechServicesService);

  servicies: TechService[] = [];

  dataSourceServicies = new MatTableDataSource<TechService>();

  columnsVehicle: string[] = ['id', 'nombre', 'costo', 'tiempoEstimado', 'funciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listServicies();
  }

  listServicies() {
    this.techServService.list().subscribe(servicies => {
      this.dataSourceServicies.data = servicies;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceServicies.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceServicies.paginator) {
      this.dataSourceServicies.paginator.firstPage();
    }

  }

  openDialog(id?: number): void {
    let dialogRef: MatDialogRef<FormServicesComponent>;
    if (id) {
      dialogRef = this.dialog.open(FormServicesComponent, {
        data: {
          id: id
        }
      })
    } else {
      dialogRef = this.dialog.open(FormServicesComponent, {
        width: '500px',
        enterAnimationDuration: 700,
        exitAnimationDuration: 500
      })
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.listServicies();

    });
  }



  deleteService(id: number) {
    this.techServService.delete(id)
      .subscribe(() => {
        this.listServicies();
      })
    this.listServicies();
  }

  ngAfterViewInit() {

    if (this.paginator) {
      this.dataSourceServicies.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
    this.dataSourceServicies.sort = this.sort;
  }

}
