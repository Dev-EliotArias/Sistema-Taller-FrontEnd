import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { TechniciansService } from '../../core/services/technicians.service';
import { Technician } from '../../core/models/Technician';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule ,NgxEchartsDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [
    provideEcharts(),
  ]
})
export class DashboardComponent implements OnInit{

  private techServices = inject(TechniciansService);
  technicians: Technician[] = [];

  option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [15, 40, 25, 10, 15, 35, 30, 70, 50, 55, 25, 45],
        type: 'bar'
      }
    ]
  };


  pie: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '1%',
      left: 'center'
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 35, name: 'Lavado' },
          { value: 20, name: 'Cambio de Aceite' },
          { value: 28, name: 'Cambio de LLantas' },
          { value: 44, name: 'Planchado' },
          { value: 30, name: 'Mantenimiento Electrico' }
        ]
      }
    ]
  };

  line: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Julio', 'Ago', 'Set', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Junio']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [1550, 1540, 1325, 1810, 1215, 2435, 2430, 1770, 1750, 3655, 5425, 2445],
        type: 'line'
      }
    ]
  };


  ngOnInit(): void {
    this.techServices.listActive().subscribe(tech => {
      this.technicians = tech;
      console.log(this.technicians + ' técnicos activos');
    });
  }



}
