import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttendanceService } from 'src/service/attendance/attendance.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { FaceRecognitionService } from 'src/service/FaceRecognitionService/face-recognition.service';
import { AfterViewInit } from '@angular/core';
import * as faceapi from 'face-api.js';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, AfterViewInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;

  faceSignacture: string | null = null;
  detectionInterval:any;

  success: boolean = false;
  user: any = localStorage.getItem('info');
  lable?: any;
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare
  attAble:boolean=true;
  months?:any
  selectedMonth: string = '0';
  semester?:any;
  selectedsem: string ='0';
  stream?:any;
  selectedstream: string = "0";
  
  msg="";
  distent?:number;
  faceSignature: string | null = null;
  oldfaceSignature: string | null = null;
  enableReset:boolean = false;

  constructor(
    private service: AttendanceService, 
    private location: Location,
    private attService: AttendanceService,
    private faceRecognitionService: FaceRecognitionService
  ) { }

  async ngOnInit() {
    await this.faceRecognitionService.loadModels();
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

    this.semester = [
      { lable: "First sem", value: 1 },
      { lable: "Second sem",  value: 2 },
      { lable: "Third sem", value: 3 },
      { lable: "Fourth sem", value: 4 },
      { lable: "Fifth sem", value:5 },
      { lable: "six sem", value: 6},
      { lable: "Seven sem", value: 7},
      { lable: "Eight sem", value: 8 },
      
    ]


    this.stream = [
      { lable: "BCA", value: 1 },
      { lable: "BBA",  value: 2 },
      { lable: "BHM", value: 3 },
      { lable: "MSC", value: 4 },
      
    ]

    if (this.user) {
      this.user = JSON.parse(this.user);
      this.lable = localStorage.getItem('lable');
      if (this.lable == 10) {
        let pddate = localStorage.getItem('presentDate');
        if (pddate != null) {
          const storedDate = new Date(pddate);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          storedDate.setHours(0, 0, 0, 0);
          if (currentDate.getTime() !== storedDate.getTime()) {
            this.attend();
          }
        }else{
          this.attend();
        }
      }
    }
  }
  ngAfterViewInit() {
    this.startVideo();
  }


  startVideo(){
    navigator.mediaDevices.getUserMedia({ video: true }).then(
      stream => {
        this.videoRef.nativeElement.srcObject = stream;
        this.startDetection();
      }
    ).catch(err => {
      console.log(err);
    });
  }
  async startDetection() {
    const video = this.videoRef.nativeElement;
    const overlay = this.overlayRef.nativeElement;
    const displaySize = { width: video.width, height: video.height };

    faceapi.matchDimensions(overlay, displaySize);

    this.detectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        const ctx = overlay.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, overlay.width, overlay.height);

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);

            if (detections.length > 0) {
                const bestFace = detections[0];
                const landmarks = bestFace.landmarks.positions;
                this.faceSignature = btoa(JSON.stringify(landmarks));
                if (this.oldfaceSignature != this.faceSignacture) {
                  this.enableReset=true;
                  this.matchAndGive();
                }
            }
        }
    }, 100);
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

  back(){
    this.location.back();
  }

  selectsem(){
    console.log(this.selectedsem);
  }

  selectstream(){
    console.log(this.selectedstream);
  }  
  
  // facemath
  matchAndGive(){
    console.log("Face Signature:", this.faceSignature);
    // this.oldfaceSignature=null;
  }
  // auto attend
  async attend() {
    await firstValueFrom(this.service.getDefualt().pipe(
      tap(
        async (res) => {
          if (res) {
            if (res.record) {
              if (res.record.length < 1) {
                await firstValueFrom(this.attService.getLocation().pipe(
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
                      if (this.distent != undefined && distance <= String(this.distent)) {
                        const currentDate = new Date();
                        localStorage.setItem('presentDate', currentDate.toISOString()); // Store the current date
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
              const currentDate = new Date();
              localStorage.setItem('presentDate', currentDate.toISOString());
              this.attAble= false;
            }
          }
        }
      )
    ));
  }
  
  async add() {
    try {
      const res = await firstValueFrom(this.attService.addAttendance().pipe(
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
              this.attAble=false
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

  calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): string {
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
    const distanceInMeters = R * c;
  
    // Check if distance is greater than or equal to 1000 meters
    if (distanceInMeters >= 1000) {
      // Return distance in kilometers
      return (distanceInMeters / 1000).toFixed(2) + ' km';
    } else {
      // Return distance in meters
      return distanceInMeters.toFixed(2) + ' meters';
    }
  }

  reset(){
    this.oldfaceSignature=null;
  }
}
