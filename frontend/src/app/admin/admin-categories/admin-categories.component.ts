import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { forkJoin, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import { EventService } from '../../services/events.service';

interface Category{
id: string;
name: string;
eventCount?: number;

}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, CommonModule, TopbarComponent, AdminSidebarComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit{
  categories: Category[] = [];
  showAddCategoryModal = false;
  showEditCategoryModal = false;
  showDeleteConfirmModal = false;
  newCategoryName = '';
  editCategoryName = '';
  categoryToEdit: Category | null = null;
  categoryToDelete: Category | null = null;

  constructor(private categoryService: CategoryService,private eventService: EventService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        if (response && response.categories) {
          this.categories = response.categories; 
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  openAddCategoryModal() {
    this.showAddCategoryModal = true;
  }

  closeAddCategoryModal() {
    this.showAddCategoryModal = false;
    this.newCategoryName = '';
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      this.categoryService.createCategory({ name: this.newCategoryName }).subscribe(
        () => {
          this.loadCategories();
          this.closeAddCategoryModal();
        },
        (error) => {
          console.error('Error adding category:', error);
        }
      );
    }
  }

  openEditCategoryModal(category: Category) {
    this.categoryToEdit = category;
    this.editCategoryName = category.name;
    this.showEditCategoryModal = true;
  }

  closeEditCategoryModal() {
    this.showEditCategoryModal = false;
    this.categoryToEdit = null;
    this.editCategoryName = '';
  }

  updateCategory() {
    if (this.categoryToEdit && this.editCategoryName.trim()) {
      this.categoryService.updateCategory(this.categoryToEdit.id, { name: this.editCategoryName }).subscribe(
        () => {
          this.loadCategories();
          this.closeEditCategoryModal();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  openDeleteConfirmModal(category: Category) {
    this.categoryToDelete = category;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.categoryToDelete = null;
  }

  deleteCategory() {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe(
        () => {
          this.loadCategories();
          this.closeDeleteConfirmModal();
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
}
