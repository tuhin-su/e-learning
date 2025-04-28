import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ManagementService } from '../../services/management.service';
import { catchError, firstValueFrom, of, switchMap, tap } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DropdownModule } from 'primeng/dropdown';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { convertToISODate, convertToMySQLDate } from '../../utility/function';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollerModule } from 'primeng/scroller';
import { AvatarModule } from 'primeng/avatar';
import { CollegeService } from '../../services/college.service';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-attendence',
  imports: [
    TableModule,
    CardModule,
    CalendarModule,
    ReactiveFormsModule,
    DialogModule,
    AvatarModule,
    DropdownModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    ScrollerModule
  ],

  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.scss',
  providers: [ConfirmationService, MessageService,ManagementService,DatePipe]
})
export class   AttendenceComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;

  attendence: any[] = [];
  loading: boolean = true;
  display: boolean = false;  // Controls dialog visibility
  loadingService: any;
  semester?:any;
  selectedsem: any;
  stream?:any;
  selectedstream: any;
  selectedMonth: number | null = null;
  selectedYear: number | null = null ;
  selectedDate: number| null = null;


    constructor(
       private management : ManagementService,
       private alert: AlertService,
       
    ) {}

    ngOnInit() {
      

      // const now = new Date();
      // this.selectedYear = now.getFullYear(); // number (e.g., 2025)
      // this.selectedMonth = now.getMonth();   // number (0 = January, 11 = December)
      // this.selectedDate = now.getTime();     // number (timestamp in ms since epoch)


      
      this.getCourses()
      
    }


    onGlobalFilter(event: Event) {
      const inputValue = (event.target as HTMLInputElement).value;
      this.dt1.filterGlobal(inputValue, 'contains');
    }



  exportToExcel(): void {
    if(!this.attendence){
      return;
    }
    const filteredattendence = this.attendence.map(attendence => ({
     
      'NO': attendence.position,
      'Name': attendence.name,
      'Roll': attendence.roll,
      'Date':attendence.date ,
    }));
  const worksheet = XLSX.utils.json_to_sheet(filteredattendence);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'attendence');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  saveAs(blob, 'attendence.xlsx');
}



async getAttendance() {
  this.attendence = [];
  this.loading = true; // Start loading

  const payload = {
    stream: this.selectedstream,
    sem: this.selectedsem,
    year: this.selectedYear,
    month: this.selectedMonth,
    date: this.selectedDate
  };

  try {
    const res = await firstValueFrom(this.management.getAttendance(payload).pipe(
      tap((res) => {
        if (res && Array.isArray(res.attendance) && res.attendance.length > 0) {
          for (let index = 0; index < res.attendance.length; index++) {
            this.attendence.push({
              position: index + 1,
              name: res.attendance[index].name,
              roll: res.attendance[index].roll,
              date: res.attendance[index].attendance_date
            });
          }
        } else {
          this.alert.showWarningAlert("No attendance record found");
        }
      })
    ));
  } catch (err) {
    this.alert.showErrorAlert("Failed to fetch attendance");
  } finally {
    this.loading = false; // Stop loading
  }
}



selectStream(event: any){
  if (this.stream){
    const result = this.stream.filter( (item: { id: any }) => item.id == event.value)
    this.semester = Array.from({ length: (result[0].course_duration * 2) }, (_, i) => {
      const val = i + 1;
      return { label: `Semester ${val}`, value: val };
    });
    
  }
}


async getCourses() {
  await firstValueFrom(
    this.management.getStreamInfo().pipe(
      tap((res) => {
        if (res) {
          this.loading = false;
          this.stream = res;
          console.log(res);

          // Set default stream value (e.g., first one)
          if (this.stream.length > 0) {
            this.selectedstream = this.stream[0].id;  // set by default
            this.selectStream({ value: this.selectedstream }); // populate semesters

            // Optionally set a default semester (e.g., first one)
            setTimeout(() => {
              if (this.semester.length > 0) {
                this.selectedsem = this.semester[0].value;
              }
            });
          }
        }
      })
    )
  );
}




selectedYearDate: Date | null = null; // for p-calendar binding
selectYear(event: Date) {
  if (event instanceof Date) {
    this.selectedYearDate = event;
    this.selectedYear = event.getFullYear(); // for actual use
  } else {
    console.warn('Invalid date object:', event);
  }
}


selectedMonthDate: Date | null = null; // for p-calendar binding
selectMonth(event: Date): void {
  this.selectedMonthDate = event;
  this.selectedMonth = event.getMonth() + 1; // JS months are 0-indexed
}

selecteddateDate: Date | null = null; // for p-calendar binding
selectDate(event: Date): void {
  this.selecteddateDate = event;
  this.selectedDate = event.getDate(); // Get the actual date (1-31)
}


}
