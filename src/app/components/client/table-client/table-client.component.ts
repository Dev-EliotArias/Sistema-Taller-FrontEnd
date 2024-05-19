import { Component, OnInit, inject, AfterViewInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../../core/services/cliente.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Cliente } from '../../../core/models/Cliente';
import { ClientFormComponent } from '../client-form/client-form.component';
@Component({
  selector: 'app-table-client',
  standalone: true,
  imports: [
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  templateUrl: './table-client.component.html',
  styleUrl: '../../../shared/styles/tables.css'
})
export class TableClientComponent implements OnInit {

  private clienteService = inject(ClienteService);
  clientes: Cliente[] = []

  displayedColumns: string[] = ['idCliente', 'nombreRazonSocial', 'tipoDocumento', 'numeroDocumento', 'telefono', 'correo', 'direccion', 'funciones'];

  dataSource = new MatTableDataSource<Cliente>(this.clientes);

  constructor(public dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.clienteService.list()
      .subscribe(clientes => {
        this.dataSource.data = clientes;
      })
  }

  openDialog(id?: number): void {
    let dialogRef: MatDialogRef<ClientFormComponent>;

    if (id) {
      dialogRef = this.dialog.open(ClientFormComponent, {
        width: "500px",
        data: {
          id: id
        },
        enterAnimationDuration: 700,
        exitAnimationDuration: 500
      });
    } else {
      dialogRef = this.dialog.open(ClientFormComponent, {
        width: "500px",
        enterAnimationDuration: 700,
        exitAnimationDuration: 500
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.list();
    });
  }

  viewClient(id: any) {
    // code to view client details
  }

  deleteClient(id: number) {
    this.clienteService.delete(id)
      .subscribe(() => {
        this.list();
      })
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
