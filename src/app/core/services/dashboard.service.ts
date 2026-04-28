import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  success: boolean;
  chartDonut: DonutItem[];
  chartBar: BarItem[];
  tableUsers: UserItem[];
}

export interface DonutItem {
  name: string;
  value: number;
  [key: string]: any; 
}

export interface BarItem {
  name: string;
  value: number;
  [key: string]: any;
}

export interface UserItem {
  firstName?: string;
  lastName?: string;
  username?: string;
  [key: string]: any; 
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly API_URL = 'http://test-demo.aemenersol.com/api';

  private http = inject(HttpClient);

  /**
   * Fetch all data for dashboard
   * Token automatically added by AuthInterceptor
   * @returns Observable contains DashboardData
   */
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.API_URL}/dashboard`);
  }
}