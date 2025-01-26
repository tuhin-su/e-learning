import { environment } from "../../environments/environment";
import { formatDate } from "@angular/common";
export function debug(msg: any | null) {
    if (!environment.production) {
        console.log(msg);
    }    
}

export function capitalizeUserName(name: string): string {
    return name
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ');
}

export function convertToMySQLDate(isoDate: string): string {
    const date = new Date(isoDate); // Parse the ISO date string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  }
export function convertToISODate(mysqlDate: string): string {
    const dateParts = mysqlDate.split('-'); // Split the MySQL date into [year, month, day]
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(dateParts[2], 10);
    
    const date = new Date(Date.UTC(year, month, day)); // Create a UTC Date object
    return date.toISOString(); // Convert to ISO 8601 format
  }

export function formatDates(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two-digit format
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

export function extractHttpsLinks(paragraph: string): string[] {
    // Regular expression to match `https://` links
    const httpsRegex = /https:\/\/[^\s]+/g;
  
    // Return matched links or an empty array if no matches are found
    return paragraph.match(httpsRegex) || [];
  }

export function downloadContentInformation(id:String|any){
  if (!id) {
    return;
  }
    let link = environment.api+"/public/download/" +id;
    // window.open(link, "_blank");
    window.location.href = link;
  }


export function convertDate(dateStr: string): string {
  // Convert the date string to a Date object
  const dateObj = new Date(dateStr);

  // Format the date to "hh:mm a dd/MM/yyyy" format
  return formatDate(dateObj, 'hh:mm a dd/MM/yyyy', 'en-US');
}

import { FormGroup } from '@angular/forms';
export function getInvalidFields(formGroup: FormGroup): string[] {
  const invalidFields: string[] = [];

  Object.keys(formGroup.controls).forEach((controlName) => {
    const control = formGroup.controls[controlName];
    if (control.invalid && (control.dirty || control.touched)) {
      invalidFields.push(controlName);
    }
  });

  return invalidFields;
}

export function back() {
  window.history.back();
}

export function compareObjectsAndReturnSecondValue(newObj: any, oldObj: any): any {
  const result: any = {};

  for (const key in oldObj) {
    if (oldObj.hasOwnProperty(key) && newObj.hasOwnProperty(key)) {
      if ((!(oldObj[key] === newObj[key]))) {
        result[key] = newObj[key];
      }
    }
  }

  return result;
}
