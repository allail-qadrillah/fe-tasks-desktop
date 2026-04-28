import { Component, inject, OnInit, OnDestroy, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData, UserItem, DonutItem, BarItem } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import * as Plotly from 'plotly.js-dist';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'   // ← tambahkan ini
})
export class DashboardComponent implements OnInit, OnDestroy {

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);

  dashboardData: DashboardData | null = null;
  tableChartDonut: DonutItem[] = [];
  tableChartBar: BarItem[] = [];
  tableUsers: UserItem[] = [];
  isLoading = signal(true);
  errorMessage = '';
  tableColumns: string[] = [];

  constructor() {
    // effect() runs AFTER Angular finishes rendering the view for that signal change
    effect(() => {
      const loading = this.isLoading();   
      if (!loading) {
        setTimeout(() => {
          this.renderDonutChart(this.tableChartDonut);
          this.renderBarChart(this.tableChartBar);
        }, 0);
      }
    });
  }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  ngOnDestroy(): void {
    try {
      Plotly.purge('donut-chart');
      Plotly.purge('bar-chart');
    } catch (e) { }
  }

  fetchDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage = '';

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.tableChartDonut = data.chartDonut || [];
        this.tableChartBar = data.chartBar || [];
        this.tableUsers = data.tableUsers || [];

        if (this.tableUsers.length > 0) {
          this.tableColumns = Object.keys(this.tableUsers[0]);
        }

        this.isLoading.set(false);

        Promise.resolve().then(() => {
          this.renderDonutChart(this.tableChartDonut);
          this.renderBarChart(this.tableChartBar);
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
      }
    });
  }

  private renderDonutChart(data: any[]): void {
    if (!data?.length) return;

    const el = document.getElementById('donut-chart');
    if (!el) return;

    const labels = data.map(item => item.name);
    const values = data.map(item => item.value);
    const colors = ['#b0b0b0', '#d0d0d0', '#888888', '#e0e0e0', '#999999', '#c0c0c0'];

    Plotly.newPlot('donut-chart', [{
      type: 'pie',
      hole: 0.45,
      labels,
      values,
      marker: { colors, line: { color: '#ffffff', width: 2 } },
      textinfo: 'none',
      hoverinfo: 'label+percent+value',
    }], {
      height: 280,
      showlegend: true,
      legend: { orientation: 'h', y: -0.15, font: { size: 12 } },
      margin: { t: 10, b: 10, l: 10, r: 10 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    }, { displayModeBar: false, responsive: true });
  }

  private renderBarChart(data: any[]): void {
    if (!data?.length) return;

    const el = document.getElementById('bar-chart');
    if (!el) return;

    const labels = data.map(item => item.name);
    const values = data.map(item => item.value);

    Plotly.newPlot('bar-chart', [{
      type: 'bar',
      x: labels,
      y: values,
      marker: { color: '#999999' },
      hoverinfo: 'x+y',
    }], {
      height: 280,
      xaxis: { showgrid: false, zeroline: false },
      yaxis: { showgrid: true, gridcolor: '#eeeeee', zeroline: false },
      margin: { t: 10, b: 50, l: 40, r: 10 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    }, { displayModeBar: false, responsive: true });
  }

  getCellValue(row: UserItem, col: string): any {
    return row[col];
  }

  onLogout(): void {
    this.authService.logout();
  }
}