import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Status } from 'src/app/utils/constants';
import SuggestionListHelper from 'src/app/utils/suggestion-list-helper';
import * as moment from 'moment';
import CommonUtils from 'src/app/utils/common-utils';
import nrc from '../../../constants/nrc';

const defaultComboData = {
  text: '-',
  value: '-',
};

const defaultForm = {
  t2: 'SysAdmin',
  isHasDoc: false,
  status: Status.Save,
  customerType: '1',
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
  sex: '2',
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
  photo: '',
  fileName: '',
  documents: [],
};

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.css'],
})
export class CustomerRegistrationComponent
  extends CommonUtils
  implements OnInit
{
  form = { ...defaultForm };
  sectors = [defaultComboData];
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
    this.form.registrationDate = moment().format('yyyy-MM-DD');
    this.fetchInitialData();
  }

  onNameTitleChanged(e) {
    setTimeout(() => {
      const nameTitle = this.nameTitles.find(
        (v) => v.description == this.form.title
      );
      if (nameTitle) {
        this.form.sex = nameTitle.sex.toString();
      }
    }, 1000);
  }

  async fetchInitialData() {
    const [occupations, nameTitles, countries, addresses] =
      await this.http.doGetManyAsync([
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
    this.autocomplete(
      document.getElementById('nrcNoSuggest'),
      nrc,
      this.form,
      'nrcNo'
    );
    this.fetchCustomerTypes(0, 99);
  }

  chooseFile() {
    document.getElementById('fileInput')?.click();
  }

  onFileChoosen(e) {
    let i = 1;
    for (const file of e.target.files) {
      this.getBase64FileAsync(file).then((src: string) => {
        this.form.documents.push({
          file: src,
          key: i++,
          fileName: file.name,
        });
      });
    }
    e.target.value = '';
  }

  getBase64FileAsync(file) {
    return new Promise((resolve, reject) => {
      if (!file) reject('');
      const fr = new FileReader();
      fr.addEventListener('load', () => {
        resolve(fr.result);
      });
      fr.readAsDataURL(file);
    });
  }

  deleteFile(key: number) {
    this.form.documents = this.form.documents.filter((v) => v.key != key);
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

  new() {
    this.form = { ...defaultForm, documents: [] };
    this.form.registrationDate = moment().format('yyyy-MM-DD');
  }

  isValidated() {
    const requiredFields = [
      // 'customerType',
      'name',
      'nrcNo',
      'fatherName',
      'phone',
      'buildingName',
      'township',
      'division',
      'street',
      'country',
    ];

    for (const field of requiredFields) {
      if (this.form[field] == '-' || !this.form[field]) {
        return false;
      }
    }
    return this.form.documents.length;
  }

  submit() {
    if (this.isValidated()) {
      const body = {
        ...this.form,
        isHasDoc: this.form.isHasDoc ? 'Yes' : 'No',
        dateOfBirth: this.form.dateOfBirth + ' 00:00:00.000',
        registrationDate: this.form.registrationDate + ' 00:00:00.000',
        // dateOfBirth: new Date(this.form.dateOfBirth).toISOString(),
        // registrationDate: new Date(this.form.registrationDate).toISOString(),
      };
      this.http.doPost('customer-registrations', body).subscribe((data) => {
        alert('Submit Successfully');
        this.new();
      });
    } else {
      alert('Please fill all required fields!');
    }
  }

  pickImage() {
    document.getElementById('photoInput').click();
  }

  onPhotoChoosen(e) {
    const file = e.target.files[0];
    if (file) {
      this.form.fileName = file.name;
      const fr = new FileReader();
      fr.addEventListener('load', () => {
        this.form.photo = fr.result as string;
      });
      fr.readAsDataURL(file);
    }
    e.target.value = '';
  }

  checkField(field: string) {
    if (!this.form[field]) {
      return alert('Please fill field first!');
    }
    this.http
      .doPost(
        `customer-registrations/check-${field == 'nrcNo' ? 'nrc' : 'passport'}`,
        {
          nrcNo: this.form.nrcNo,
          passportNo: this.form.passportNo,
        }
      )
      .subscribe((data: { message: string }) => {
        this.alertOptions.message = data.message;
        if (data.message.startsWith('V')) {
          this.alertOptions.background = 'green';
        } else {
          this.alertOptions.background = 'orange';
        }
        this.openAlert();
      });
  }
}
