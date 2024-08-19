import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { EmployeeService } from '../../services/employees.service';
import { ConfirmationComponent } from '../../models/confirmation/confirmation.component';
import Modal from 'bootstrap/js/dist/modal';


@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule,ConfirmationComponent],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent implements OnInit{
  selectedItem: any;
  employeesList: any = [];
  @Output() edit = new EventEmitter<any>();

  constructor(private employeeService: EmployeeService,private ngZone: NgZone) {}

  ngOnInit(): void {
    this.getAllEmployeeList();
  }

  getAllEmployeeList() {
    this.employeeService.getAllEmployeeList().subscribe({
      next: (res: any) => {
        this.employeesList = res.data;
        console.log(this.employeesList);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  openDeleteModal(item: any) {
    this.selectedItem = item;
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      this.ngZone.runOutsideAngular(() => {
        const modal = new Modal(modalElement);
        modal.show();
      });
    }
  }
  

  handleDelete() {
    this.employeeService.deleteEmployee(this.selectedItem._id).subscribe({
      next: (res: any) => {
        alert("Employee deleted");
        this.employeesList = this.employeesList.filter((emp: any) => emp._id !== this.selectedItem._id);
        
        const modalElement = document.getElementById('deleteConfirmationModal');
        if (modalElement) {
          const modal = Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
  editRecords(record: any) {
    this.edit.emit(record);
  }
}