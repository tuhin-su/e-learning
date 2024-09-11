import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, tap } from 'rxjs';
import { AttendanceService } from 'src/service/attendance/attendance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent implements OnInit {
  show: Number = 0;
  user: any = localStorage.getItem('info');
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare
  distent?:number;
  
  msg="";

  @ViewChild('navImg') navImg!: ElementRef<HTMLImageElement>;

  constructor(private router:Router,private service: AttendanceService) { }

  detectType() {
    this.show = Number(localStorage.getItem('group'));
  }

  ngOnInit(): void {
    if (this.user) {
      this.user = JSON.parse(this.user);
      this.attend();
    }
    setTimeout(() => {
      if (this.user?.img && this.navImg) {
        this.navImg.nativeElement.src = this.user.img;
      }
    }, 0);
  }
  setting(){
    this.router.navigate(['setting'])
  }
  notify(){
    this.router.navigate(['notify'])

  }

  // auto attend
  async attend() {
    await firstValueFrom(this.service.getLocation().pipe(
      tap(position => {
        this.storedLocation = {
          lat: position.locations.lat,
          lng: position.locations.lon
        };
        this.distent = position.locations.distend;
      })
    ));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
  
          const distance = this.calculateDistance(currentLocation, this.storedLocation);
          if (this.distent != undefined && distance <= this.distent) {
            this.add();
          } else {
            Swal.fire({
              title: 'TIMT SAY',
              text: "You are too far from the collage location.",
              icon: 'error',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
              });
          }
        },
        (error) => {
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              
              this.msg = "Permission denied. Please allow location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              this.msg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              this.msg = "Location request timed out.";
              break;
            default:
              this.msg = "An unknown error occurred.";
              break;
          }
          Swal.fire({
            title: 'TIMT SAY',
            text: this.msg,
            icon: 'warning',
            confirmButtonColor: '#1474f5',
            confirmButtonText: 'OK'
            });
        },
        {
          enableHighAccuracy: true, // Use GPS accuracy
          timeout: 10000, // Wait for 10 seconds
          maximumAge: 0 // Do not use cached location
        }
      );
    } else {
      Swal.fire({
        title: 'TIMT SAY',
        text: "Geolocation is not supported by this browser.",
        icon: 'warning',
        confirmButtonColor: '#1474f5',
        confirmButtonText: 'OK'
        });
    }
  }
  
  async add() {
    try {
      const res = await firstValueFrom(this.service.addAttendance().pipe(
        tap(
          (response) => {
            if (!response.message) {
              Swal.fire({
                title: 'TIMT SAY',
                text: "Attendees Update successfully!",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
                });
            }
          }
        )
      ));
    } catch (error) {
      Swal.fire({
        title: 'TIMT SAY',
        text: "Error updating attendance. Please try again.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
        }); 
    }
  }

  calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    // Convert degrees to radians
    const toRad = (value: number) => value * Math.PI / 180;

    // Radius of the Earth in meters (6371 km)
    const R = 6371e3; // in meters

    // Destructure latitude and longitude
    const φ1 = toRad(loc1.lat); // Latitude of point 1 (in radians)
    const φ2 = toRad(loc2.lat); // Latitude of point 2 (in radians)

    const Δφ = toRad(loc2.lat - loc1.lat); // Difference in latitude (in radians)
    const Δλ = toRad(loc2.lng - loc1.lng); // Difference in longitude (in radians)

    // Haversine formula
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters
    const distance = R * c;

    // Return distance in kilometers (divide by 1000)
    return distance / 1000; // Convert to kilometers
}

}
