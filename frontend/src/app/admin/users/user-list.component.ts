import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  
  private loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.adminService.getUsers().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.error = 'Failed to load users';
        this.loading = false;
        this.users = [];
      }
    });
  }

  suspend(id: number): void {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    this.adminService.suspendUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Failed to suspend user:', error);
        alert('Failed to suspend user');
      }
    });
  }
}