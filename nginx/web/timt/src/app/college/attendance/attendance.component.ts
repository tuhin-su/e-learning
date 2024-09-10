import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { CollegeService } from '../../services/college.service';
import { Location } from '@angular/common';
import { FaceRecognitionService } from '../../services/face-recognition.service';
import { AfterViewInit } from '@angular/core';
import * as faceapi from 'face-api.js';
import { OnDestroy } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-attendance',
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlayRef!: ElementRef<HTMLCanvasElement>;
  detectionInterval:any;

  success: boolean = false;
  user: any = localStorage.getItem('info');
  lable?: any;
  storedLocation: { lat: number; lng: number } = { lat: 0, lng: 0 }; // Store the location to compare
  attAble:boolean=false;
  months?:any
  selectedDate: string = '0';
  semester?:any;
  selectedsem: string ='0';
  stream?:any = undefined;
  selectedstream: string = "0";
  
  msg="";
  distent?:number;
  alradyDetected: boolean = false;
  enableReset:boolean = false;

  currentStream:any
  giveUser:any = undefined;
  usersList?: any[];

  scan: boolean = false;


  constructor(
    private service: CollegeService, 
    private location: Location,
    private attService: CollegeService,
    private faceRecognitionService: FaceRecognitionService,
    private alertService: AlertService
  ) { }
  ngOnDestroy(): void {
    clearInterval(this.detectionInterval);
    this.releaseStream();
  }

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
      { lable: "BCA", value: 3 },
      { lable: "BBA",  value: 1 },
      { lable: "BHM", value: 2 },
      { lable: "MSC", value: 4 },
      
    ]

    if (this.user) {
      this.user = JSON.parse(this.user);
      this.lable = localStorage.getItem('lable');
      if (this.lable == 3) {
        let pddate = localStorage.getItem('presentDate');
        if (pddate != null) {
          const storedDate = new Date(pddate);
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          storedDate.setHours(0, 0, 0, 0);
          if (currentDate.getTime() !== storedDate.getTime()) {
            this.attAble=true;
          }
        }else{
          this.attAble=true;
        }
      }
    }
  }

  ngAfterViewInit() {
    // this.startVideo();
  }

  enableScan() {
    this.scan = true;
    this.startVideo();
  }
  startVideo(){
    this.releaseStream();
    navigator.mediaDevices.getUserMedia({ video: true }).then(
      stream => {
        this.videoRef.nativeElement.srcObject = stream;
        this.startDetection();
        this.currentStream = stream;
      }
    ).catch(err => {
      console.log(err);
    });
  }

  releaseStream() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
      this.videoRef.nativeElement.srcObject = null; // Detach the stream from the video element
      this.currentStream = null;
    }
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
        // faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);
  
        if (detections.length > 0) {
          const bestFace = detections[0];
          if (!this.alradyDetected) {
            this.alradyDetected = true;
            this.captureFaceImage(video);
            clearInterval(this.detectionInterval);
          }
        }
      }
    }, 100);
  }
  
  captureFaceImage(video: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1]; // Remove the header if needed
      this.sendImageToBackend(base64Image);
    }
  }
  
 async sendImageToBackend(base64Image: string) {
   await firstValueFrom(this.attService.getStudentByface(base64Image).pipe(
      tap(
        (res)=>{
          if(res){
            this.giveUser = res
          }
        },
        (error)=>{
          this.alertService.showErrorAlert(error.error.massage)
          this.back();
        }
      )
   ))
  }
  


  async getAllStudents() {
    if (this.selectedDate == '0' || this.selectedsem == '0' || this.selectedstream == '0') {
      return
    }

    const data = {
      sem: this.selectedsem,
      stream: this.selectedstream,
      month: this.selectedDate,
    }
    this.service.getAllStudent(data).subscribe(
      (res)=>{
        if (res.attendance) {
          this.usersList = res.attendance;
        }
      }
    );
  }

  selectSem(value: any){
    this.selectedsem = value;
    this.getAllStudents();
  }

  selectStream(value: any){
    this.selectedstream = value;
    this.getAllStudents();
  }
  back(){
    this.location.back();
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
                    console.log(this.distent);
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
                        this.add();
                      } else {
                        this.alertService.showErrorAlert("You are too far from the collage location.")
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
                      this.alertService.showErrorAlert(this.msg);
                    },
                    {
                      enableHighAccuracy: true, // Use GPS accuracy
                      timeout: 10000, // Wait for 10 seconds
                      maximumAge: 0 // Do not use cached location
                    }
                  );
                } else {
                  this.alertService.showWarningAlert("Geolocation is not supported by this browser.");
                }

              }else{
                const currentDate = new Date();
                localStorage.setItem('presentDate', currentDate.toISOString());
                this.attAble= false;
              }
             
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
              this.alertService.showSuccessAlert("Attendees Update successfully!");
              const currentDate = new Date();
              localStorage.setItem('presentDate', currentDate.toISOString());
              this.attAble=false
            }
          }
        )
      ));
    } catch (error) {
      this.alertService.showErrorAlert("Error updating attendance. Please try again.");
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
    this.alradyDetected=false;
    this.startDetection();
  }

  async giveTOHaven(){
    if (this.giveUser.user_id != null) {
      if (navigator.geolocation) {
        await firstValueFrom(this.attService.getLocation().pipe(
          tap(position => {
            this.storedLocation = {
              lat: position.locations.lat,
              lng: position.locations.lon
            };
            this.distent = position.locations.distend;
          })
        ));
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
    
            const distance = this.calculateDistance(currentLocation, this.storedLocation);
            if (this.distent != undefined && distance <= String(this.distent)) {
              const currentDate = new Date();
              localStorage.setItem('presentDate', currentDate.toISOString()); // Store the current date
              /// give att
              await firstValueFrom(this.attService.sendHaven(this.giveUser.user_id).pipe(
                tap(
                  (response) => {
                    if (response.message) {
                      this.alertService.showSuccessAlert(response.message);
                      this.giveUser=undefined;
                    }else{
                      this.alertService.showErrorAlert("Error updating attendance. Please try again.");
                    }
                  },
                  (error)=>{
                    this.alertService.showErrorAlert("Error updating attendance. Please try again.");
                  }
                )
              ))
            } else {
              this.alertService.showErrorAlert("You are too far from the collage location.");
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
            this.alertService.showWarningAlert(this.msg);
          },
          {
            enableHighAccuracy: true, // Use GPS accuracy
            timeout: 10000, // Wait for 10 seconds
            maximumAge: 0 // Do not use cached location
          }
        );
      } else {
        this.alertService.showWarningAlert("Geolocation is not supported by this browser.");
      }
    }
  }

  onDateChange(selectedDate: Date): void {
    // console.log('Selected date:', `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`);
    this.selectedDate = selectedDate.getMonth().toString();
    this.getAllStudents();
  }
}
