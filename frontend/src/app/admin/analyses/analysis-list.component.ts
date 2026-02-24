import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-analysis-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analysis-list.component.html'
})
export class AnalysisListComponent implements OnInit {
  analyses: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAnalyses().subscribe((res: any) => {
      this.analyses = res;
    });
  }
}