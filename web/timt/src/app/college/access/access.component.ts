import { Component, ElementRef } from '@angular/core';
import { OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-access',
  imports: [],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent implements OnInit, OnDestroy {
  @ViewChild('overlay', { static: false }) overlay: ElementRef | undefined;
  @ViewChild('qrReaderVideo', { static: false }) qrReaderVideo: ElementRef | undefined;

  private qrCodeScanner: Html5QrcodeScanner | null = null;

  ngOnInit(): void {
    this.startScanner();
  }

  startScanner(): void {
    const qrCodeReader = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
      disableFlip: false,
    }, false);

    qrCodeReader.render(this.onScanSuccess, this.onScanError);
    this.qrCodeScanner = qrCodeReader;
  }

  onScanSuccess(decodedText: string, decodedResult: any): void {
    console.log('Decoded QR Code:', decodedText);
    // You can add any additional logic here once the QR code is successfully scanned
  }

  onScanError(errorMessage: string): void {
    console.error('QR Scan Error:', errorMessage);
  }

  ngOnDestroy(): void {
    if (this.qrCodeScanner) {
      this.qrCodeScanner.clear().then(() => {
        console.log("QR scanner stopped.");
      }).catch((err) => {
        console.error("Error stopping QR scanner:", err);
      });
    }
  }

  back(): void {
    console.log('Back button clicked');
  }
}
