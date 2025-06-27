import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h2>Welcome to the Dashboard</h2>
      <div class="dashboard-cards">
        <div class="card">
          <h3>Quick Stats</h3>
          <p>Your dashboard overview will appear here</p>
        </div>
        <div class="card">
          <h3>Recent Activity</h3>
          <p>Recent activities will be displayed here</p>
        </div>
        <div class="card">
          <h3>Notifications</h3>
          <p>Your notifications will appear here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 1rem;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    h3 {
      color: #34495e;
      margin-bottom: 1rem;
    }

    p {
      color: #7f8c8d;
    }
  `]
})
export class HomeComponent {} 