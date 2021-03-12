import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

const defaultComboData = {
  text: '-',
  value: '-',
};

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css'],
})
export class CustomerRegistrationComponent implements OnInit {
  form = {
    customerType: '-',
    occupation: '-',
  };

  selectedFiles = [];
  occupations = [defaultComboData];
  nameTitles = [];
  countries = [];
  addresses = [];
  customerTypes = [];
  typeFilters = [
    {
      text: 'Personal',
      value: '1',
    },
    {
      text: 'Organization',
      value: '2',
    },
  ];
  selectedFilter = '1';

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.fetchInitialData();
  }

  async fetchInitialData() {
    const [
      occupations,
      nameTitles,
      countries,
      addresses,
    ] = await this.http.doGetManyAsync([
      'customer-registrations/occupations',
      'customer-registrations/name-titles',
      'customer-registrations/countries',
      'customer-registrations/addresses',
    ]);
    this.occupations = [...this.occupations, ...occupations];
    this.nameTitles = nameTitles;
    this.countries = countries;
    this.addresses = addresses;
  }

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

  onTypeFilterChanged(e) {
    let start = 0;
    let end = 0;
    switch (e.target.value) {
      case '1':
        end = 99;
        break;
      default:
        start = 100;
        end = 1000;
    }
    this.http
      .doPost('customer-registrations/customer-types', { start, end })
      .subscribe((data: any) => {
        this.customerTypes = [defaultComboData, ...data];
      });
  }
}
