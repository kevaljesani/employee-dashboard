import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employees.service';
import { ConfirmationComponent } from '../../models/confirmation/confirmation.component';
import Modal from 'bootstrap/js/dist/modal';
import { AudioPlayerComponent } from "../audio-player/audio-player.component";
import WaveSurfer from 'wavesurfer.js';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, ConfirmationComponent, AudioPlayerComponent,NgxPaginationModule],
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.css'
})
export class EmployeesListComponent implements OnInit{
  selectedItem: any;
  employeesList: any = [];
  @Output() edit = new EventEmitter<any>();
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('waveform', { static: true }) waveform!: ElementRef;
  wavesurfer!: WaveSurfer;
  currentPlayingAudio: any = null;
  page: number = 1; // Default to page 1
  itemsPerPage: number = 10; // Default items per page
  totalPages: number = 0;
  constructor(private employeeService: EmployeeService,private ngZone: NgZone,private authService:AuthService) {this.loadStaticEmployees();}


  loadStaticEmployees() {
    // Load static data
    // this.employeesList = Array.from({ length: 100 }, (_, i) => ({
    //   firstName: `First ${i + 1}`,
    //   lastName: `Last ${i + 1}`,
    //   userName: `user${i + 1}`,
    //   email: `user${i + 1}@example.com`,
    //   city: `City ${i + 1}`,
    //   salary: (i + 1) * 1000,
    //   audioFile: `audio${i + 1}.mp3` // Example static file names
    // }));
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
  }

  ngOnInit(): void {
    this.getAllEmployeeList();
    this.wavesurfer = WaveSurfer.create({
      container: this.waveform.nativeElement,
      waveColor: 'violet',
      progressColor: 'purple',
      height: 80
    });
  }

  getAllEmployeeList() {
    this.employeeService.getAllEmployeeList(this.page,this.itemsPerPage).subscribe({
      next: (res: any) => {
        this.employeesList = res.data;
        this.totalPages = res.totalPages;
        this.page = res.currentPage;
        console.log(this.employeesList);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  playAudio(item: any): void {
    const audioUrl = `http://localhost:3000/uploads/${item.audioFile}`;

    if (this.currentPlayingAudio === item) {
      // Toggle play/pause if the same audio is clicked again
      this.wavesurfer.playPause();
    } else {
      // Load and play the new audio file
      this.wavesurfer.load(audioUrl);
      this.wavesurfer.play();
      this.currentPlayingAudio = item;
    }
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

  logout(): void {
    this.authService.logout();
  }
}