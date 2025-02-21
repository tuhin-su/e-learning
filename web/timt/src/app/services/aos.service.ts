import { AfterViewChecked, Injectable, OnInit } from '@angular/core';
import * as AOS from 'aos';
import 'aos/dist/aos.css';

@Injectable({
  providedIn: 'root'
})
export class AosService implements OnInit, AfterViewChecked{

  ngOnInit(): void {
    
  }

  constructor() { 
     // Initialize AOS for animations
     AOS.init({
      duration: 1000, // Customize the duration or other options
      easing: 'ease-in-out', // Customize easing
      once: true, // Only animate once
    });
  }
  ngAfterViewChecked(): void {
    AOS.refresh();
  }
  
}
