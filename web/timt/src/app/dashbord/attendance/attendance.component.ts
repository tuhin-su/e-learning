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

  constructor(private service: AttendanceService) { }

  ngOnInit():void {
    if (this.user) {
      this.user = JSON.parse(this.user);
      this.group = localStorage.getItem('group');
      console.log(this.group);
    
      // Simulate stored location for comparison (you might get this from localStorage or a service)
      this.attend();
    }
  }

  async attend() {
    await firstValueFrom(this.service.getDefualt().pipe(
      tap(
        (res)=>{
          if (res) {
            this.storedLocation = res
          }
        }
      )
    ))

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
            this.success=false;
          }
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  async add() {
    await firstValueFrom(this.service.addAttendance().pipe(
      tap(
        (res)=>{
          if (res) {
            this.success = true;
          }
        }
      )
    ))    
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
