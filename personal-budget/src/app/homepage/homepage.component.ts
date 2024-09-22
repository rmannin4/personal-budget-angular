import { AfterViewInit, Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements AfterViewInit {

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

  constructor(private http: HttpClient) {

  }

  ngAfterViewInit(): void {
      this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (var i= 0; i < res.data.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
     }
     this.createChart();
      });
    }

  createChart() {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    const myPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
        });
        }


}
