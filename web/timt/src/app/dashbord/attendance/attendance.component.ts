import { Component, OnInit } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttendanceService } from 'src/service/attendance/attendance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  success: boolean = false;
  user: any = localStorage.getItem('info');
  group?: any;
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare
  tableData?:any;

  constructor(private service: AttendanceService) { }

  ngOnInit(): void {
    if (this.user) {
      this.user = JSON.parse(this.user);
      this.group = localStorage.getItem('group');
      if (this.group == 1) {
        this.myatt();
      }
    }
  }

  async myatt(){
    await firstValueFrom(this.service.getDefualt().pipe(
      tap(
        (res) => {
          if (res) {
            if (res.record) {
              this.tableData= res.record;
            }
          }
        },
        error => {
          Swal.fire({
            title: 'TIMT SAY',
            text: "Data Not found About you",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }); 
        }
      )
    ));
  }
  async getAllStudents(data: any) {
    this.service.getAllStudent(data).subscribe(
      (res)=>{
        console.log(res);
      }
    );
  }
}
