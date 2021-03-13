import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Status } from 'src/app/utils/constants';
import SuggestionListHelper from 'src/app/utils/suggestion-list-helper';

const defaultComboData = {
  text: '-',
  value: '-',
};

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css'],
})
export class CustomerRegistrationComponent
  extends SuggestionListHelper
  implements OnInit {
  form = {
    t2: 'SysAdmin',
    isHasDoc: false,
    status: Status.Save,
    customerType: '-',
    title: '',
    name: '',
    aliasName: '',
    nrcNo: '',
    passportNo: '',
    occupation: '-',
    sector: '-',
    fatherName: '',
    registrationDate: '',
    dateOfBirth: '',
    sex: '1',
    mStatus: '1',
    phone: '',
    email: '',
    nationalityStatus: '',
    houseNo: '',
    buildingName: '',
    township: '',
    division: '',
    street: '',
    country: '',
    ward: '',
    postalCode: '',
  };
  sectors = [defaultComboData];
  selectedFiles = [];
  selectedPhoto = {
    file: null,
    src: '',
  };
  occupations = [defaultComboData];
  nameTitles = [];
  countries = [];
  addresses = [];
  customerTypes = [defaultComboData];
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

  constructor(private http: HttpService) {
    super();
  }

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
    this.autocomplete(
      document.getElementById('countrySuggest'),
      this.countries.map((v) => v.countryName),
      this.form,
      'country'
    );
    this.autocomplete(
      document.getElementById('nameTitleSuggest'),
      this.nameTitles.map((v) => v.description),
      this.form,
      'title'
    );
    this.addresses = addresses;
    const addressList = this.addresses.map((v) => v.descEng);
    this.autocomplete(
      document.getElementById('townshipSuggest'),
      addressList,
      this.form,
      'township'
    );
    this.autocomplete(
      document.getElementById('divisionSuggest'),
      addressList,
      this.form,
      'division'
    );
    this.fetchCustomerTypes(0, 99);
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
    this.fetchCustomerTypes(start, end);
  }

  fetchCustomerTypes(start: number, end: number) {
    this.http
      .doPost('customer-registrations/customer-types', { start, end })
      .subscribe((data: any) => {
        this.customerTypes = [defaultComboData, ...data];
      });
  }

  new() {}

  submit() {
    const body = {
      ...this.form,
      isHasDoc: this.form.isHasDoc ? 'Yes' : 'No',
      dateOfBirth: this.form.dateOfBirth + ' 00:00:00.000',
      registrationDate: this.form.registrationDate + ' 00:00:00.000',
      // dateOfBirth: new Date(this.form.dateOfBirth).toISOString(),
      // registrationDate: new Date(this.form.registrationDate).toISOString(),
    };
    this.http.doPost('customer-registrations', body).subscribe((data) => {});
  }

  pickImage() {
    document.getElementById('photoInput').click();
  }

  onPhotoChoosen(e) {
    const file = e.target.files[0];
    if (file) {
      this.selectedPhoto.file = file;
      const fr = new FileReader();
      fr.addEventListener('load', () => {
        this.selectedPhoto.src = fr.result as string;
      });
      fr.readAsDataURL(file);
    }
    e.target.value = '';
  }
}
