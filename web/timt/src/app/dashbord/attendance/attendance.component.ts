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
  lable?: any;
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare
  tableData?:any;
  months?:any
  selectedMonth: string = '0';

  constructor(private service: AttendanceService) { }

  ngOnInit(): void {
    this.months = [
      { lable: "January", value: 1 },
      { lable: "February",  value: 2 },
      { lable: "March", value: 3 },
      { lable: "April", value: 4 },
      { lable: "May", value:5 },
      { lable: "June", value: 6},
      { lable: "July", value: 7},
      { lable: "August", value: 8 },
      { lable: "Septembe", value:9},
      { lable: "October",value:10},
      { lable: "November",value:11},
      { lable: "December",value:12}
    ]

    if (this.user) {
      this.user = JSON.parse(this.user);
      this.lable = localStorage.getItem('lable');
      if (this.lable == 10) {
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

  selectMonth() {
    console.log(this.selectedMonth);
  }
}
