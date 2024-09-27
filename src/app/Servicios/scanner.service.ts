import { Injectable } from '@angular/core';
//import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BarcodeScanner, BarcodeFormat} from '@capacitor-mlkit/barcode-scanning';


@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor() { }


  scan = async () => {
    const { barcodes } = await BarcodeScanner.scan({
      formats: [BarcodeFormat.Pdf417],
    });
    return barcodes[0];
  };


  // public async test(){

  //   //BarcodeScanner.hideBackground(); // make background of WebView transparent
  //   document.body.classList.add("qrscanner");
  //   const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  //   document.body.classList.remove("qrscanner"); 
  //   // if the result has content
  //   if (result.hasContent) {
  //     return result.content; // log the raw scanned content
  //   }
  // }

  // public stopScan = () => {
  //   BarcodeScanner.showBackground();
  //   BarcodeScanner.stopScan();
  // };

}

