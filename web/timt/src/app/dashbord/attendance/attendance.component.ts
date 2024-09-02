import { Component, OnInit } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
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
          this.attend();
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

  async attend() {
    try {
      const res = await firstValueFrom(this.service.getDefualt().pipe(
        tap(
          (data) => {
            if (data) {
              this.storedLocation = data;
            }
          }
        )
      ));

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            const distance = this.calculateDistance(currentLocation, this.storedLocation);

            if (distance <= 500) {
              this.add();
            } else {
              this.success = false;
              this.faildMsg = "You are too far from the designated location.";
            }
          },
          (error) => {
            console.error('Error getting location', error);
            this.faildMsg = "Error getting location. Please enable location services.";
            this.success = false;
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        this.faildMsg = "Geolocation is not supported by this browser.";
        this.success = false;
      }
    } catch (error) {
      console.error('Error fetching default location', error);
      this.faildMsg = "Error fetching location data.";
      this.success = false;
    }
  }

  async add() {
    try {
      const res = await firstValueFrom(this.service.addAttendance().pipe(
        tap(
          (response) => {
            if (response.message) {
              this.faildMsg = response.message;
              this.success = false;
            } else {
              this.success = true;
              this.faildMsg = "Update Unsuccessful";
            }
          }
        )
      ));
    } catch (error) {
      console.error('Error adding attendance', error);
      this.faildMsg = "Error updating attendance. Please try again.";
      this.success = false;
    }
  }

  retryAttendance() {
    this.attend();
  }

  calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    // Haversine formula to calculate distance between two points
    const toRad = (value: number) => value * Math.PI / 180;
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRad(loc1.lat);
    const φ2 = toRad(loc2.lat);
    const Δφ = toRad(loc2.lat - loc1.lat);
    const Δλ = toRad(loc2.lng - loc1.lng);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }
}
