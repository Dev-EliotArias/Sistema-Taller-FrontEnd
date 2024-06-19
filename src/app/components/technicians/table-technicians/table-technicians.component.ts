import { Component, ViewChild, inject } from '@angular/core';
import { Technician } from '../../../core/models/Technician';
import { TechniciansService } from '../../../core/services/technicians.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormTechniciansComponent } from '../form-technicians/form-technicians.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-table-technicians',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table-technicians.component.html',
  styleUrl: './table-technicians.component.css'
})
export class TableTechniciansComponent {

  private techServices = inject(TechniciansService);
  technicians: Technician[] = [];

  dataSourceTechs = new MatTableDataSource<Technician>();

  columsTech: string[] = ['id', 'nombre', 'apellido', 'dni', 'fechaNac', 'telefono', 'direccion', 'estado', 'especialidad', 'correo', 'funciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listTechs();
  }

  listTechs() {
    this.techServices.list().subscribe(techs => {
      this.dataSourceTechs.data = techs;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTechs.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTechs.paginator) {
      this.dataSourceTechs.paginator.firstPage();
    }

  }

  openDialog(id?: number): void {
    let dialogRef: MatDialogRef<FormTechniciansComponent>;
    if (id) {
      dialogRef = this.dialog.open(FormTechniciansComponent, {
        data: {
          id: id
        }
      })
    } else {
      dialogRef = this.dialog.open(FormTechniciansComponent, {
        width: '500px',
        enterAnimationDuration: 700,
        exitAnimationDuration: 500
      })
    }
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.listTechs();

    });
  }

  deleteTech(id: number) {
    this.techServices.delete(id)
      .subscribe(() => {
        this.listTechs();
      })
    this.listTechs();
  }

  ngAfterViewInit() {

    if (this.paginator) {
      this.dataSourceTechs.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
    this.dataSourceTechs.sort = this.sort;
  }

}
