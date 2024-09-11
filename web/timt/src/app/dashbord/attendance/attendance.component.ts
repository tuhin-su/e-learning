import { Component, OnInit } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttendanceService } from 'src/service/attendance/attendance.service';

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
  faildMsg: string = "Update Unsuccessful";

  constructor(private service: AttendanceService) { }

  ngOnInit(): void {
    if (this.user) {
      this.user = JSON.parse(this.user);
      this.group = localStorage.getItem('group');
      const pm = { "stream": "BCA", "sem":1}
      switch (this.group) {
        case "ST":
          break;
        
        case "FA":
          this.getAllStudents(pm);
          break;

        default:
          break;
      }
    }
  }

  async getAllStudents(data: any) {
    this.service.getAllStudent(data).subscribe(
      (res)=>{
        console.log(res);
      }
    );
  }

}
