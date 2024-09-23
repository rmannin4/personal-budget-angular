import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements AfterViewInit {

  @ViewChild('chart', { static: false }) chartContainer!: ElementRef;

  public dataSource = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#8a89a6',
        ],
      }
    ],
  };

  constructor(private dataService: DataService) {}

 ngAfterViewInit(): void {
   this.dataService.fetchBudgetData().subscribe((res: any) => {
     for (let i = 0; i < res.myBudget.length; i++) {
       this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
       this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
  }

  createChart(): void {

    if (!this.chartContainer) {
      console.error('Chart container is undefined');
      return;
    }
    const element = this.chartContainer.nativeElement;


    d3.select(element).select('svg').remove();

    const data = this.dataSource.datasets[0].data;
    const labels = this.dataSource.labels;
    const colors = this.dataSource.datasets[0].backgroundColor;

    const width = 450;
    const height = 450;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const color = d3.scaleOrdinal<string, string>()
      .domain(labels)
      .range(colors);

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<number>()
      .value((d) => d);

    const data_ready = pie(data);

    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg
      .selectAll('slices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(labels[i]))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    svg
      .selectAll('labels')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d, i) => labels[i])
      .attr('transform', (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }
}

 // createChart(): void {
   // const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
   // new Chart(ctx!, {
    //  type: 'pie',
     // data: this.dataSource
    //});
 // }

