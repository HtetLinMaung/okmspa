import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css'],
})
export class CustomerRegistrationComponent implements OnInit {
  selectedFiles = [];

  constructor() {}

  ngOnInit(): void {}

  chooseFile() {
    document.getElementById('fileInput')?.click();
  }

  onFileChoosen(e) {
    let i = 1;
    for (const file of e.target.files) {
      this.selectedFiles.push({ file, key: i++ });
    }
    e.target.value = '';
  }

  deleteFile(key: number) {
    this.selectedFiles = this.selectedFiles.filter((v) => v.key != key);
  }
}
