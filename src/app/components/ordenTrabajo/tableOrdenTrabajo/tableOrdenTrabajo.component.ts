import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OrdenTrabajoService } from '../../../core/services/OrdenTrabajo.service';
import { OrdenTrabajo } from '../../../core/models/OrdenTrabajo';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormOrdenTrabajoComponent } from '../formOrdenTrabajo/formOrdenTrabajo.component';

@Component({
  selector: 'app-table-orden-trabajo',
  standalone: true,
  imports: [
    CommonModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule
  ],
  templateUrl: './tableOrdenTrabajo.component.html',
  styleUrl: './tableOrdenTrabajo.component.css'
})
export class TableOrdenTrabajoComponent implements OnInit, AfterViewInit{

  private ordenTrabajoService = inject(OrdenTrabajoService);

  ordenesDeTrabajos: OrdenTrabajo[] = [];

  dataSourceOrdenesDeTrabajos = new MatTableDataSource<OrdenTrabajo>();

  columns: string[] = ['id', 'fechaIngreso', 'fechaSalida', 'costoTotal', 'comentario', 'estado', 'funciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog){}

  ngOnInit(): void {
    this.listOrdenes();
  }

  listOrdenes(){
    this.ordenTrabajoService.list().subscribe(ordenes => {
      this.dataSourceOrdenesDeTrabajos.data = ordenes;
      console.log(ordenes);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOrdenesDeTrabajos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceOrdenesDeTrabajos.paginator) {
      this.dataSourceOrdenesDeTrabajos.paginator.firstPage();
    }
  }

  openDialog(id?: number): void {
    let dialogRef: MatDialogRef<FormOrdenTrabajoComponent>;
    if (id) {
      dialogRef = this.dialog.open(FormOrdenTrabajoComponent, {
        data: {
          id: id
        },
        width: '500px',
        enterAnimationDuration: '700ms',
        exitAnimationDuration: '500ms'
      });
    } else {
      dialogRef = this.dialog.open(FormOrdenTrabajoComponent, {
        width: '500px',
        enterAnimationDuration: '700ms',
        exitAnimationDuration: '500ms'
      });
    }
    dialogRef.afterClosed().subscribe(result => {
      this.listOrdenes();
    });
  }



  deleteOrdenTrabajo(id: number) {
    this.ordenTrabajoService.delete(id)
      .subscribe(() => {
        this.listOrdenes();
      })
    this.listOrdenes();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSourceOrdenesDeTrabajos.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
    this.dataSourceOrdenesDeTrabajos.sort = this.sort;
  }
}
