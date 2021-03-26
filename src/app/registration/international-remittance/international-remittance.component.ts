import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import SuggestionListHelper from 'src/app/utils/suggestion-list-helper';
import * as moment from 'moment';
import commaNumber from 'comma-number';

const defaultComboData = {
  text: '-',
  value: '-',
};

const defaultForm = {
  t1: '-', // transactionPurpose
  t4: '', // Bank Name/Branch / MyanmarPost(Name)/ Wallet Name
  t5: '', // Owner’s Name / MyanmarPost(NRC) / Wallet Phone No.
  t6: '', // Account No. / MyanmarPost(Phone No)
  t7: '', // MyanmarPost(Address)
  t8: '', // MyanmarPost(Postal Code)
  n1: '-', // payment method
  n2: '-', // collection method
  fromcountry: '-',
  tocountry: '-',
  savedate: '',
  amount: '0.00',
  fromremark: '',
  fromname: '',
  fromnrcno: '',
  fromunit: '',
  frombuildingname: '',
  fromtownship: '',
  fromdivision: '',
  fromphoneno: '',
  fromdob: '',
  frompassportno: '',
  fromblock: '',
  fromstreet: '',
  sendercountry: '',
  frompostalcode: '',
  fromemail: '',
  toname: '',
  tonrc: '',
  tounit: '',
  tobuildingname: '',
  totownship: '',
  todivision: '',
  tophoneno: '',
  todob: '',
  topassportno: '',
  toblock: '',
  tostreet: '',
  receivercountry: '',
  topostalcode: '',
  toemail: '',
  fromcustomerid: '',
  tocustomerid: '',
  currencycode: '-',
  tocurrencycode: '',
};

@Component({
  selector: 'app-international-remittance',
  templateUrl: './international-remittance.component.html',
  styleUrls: ['./international-remittance.component.css'],
})
export class InternationalRemittanceComponent
  extends SuggestionListHelper
  implements OnInit {
  form = { ...defaultForm };
  customers = [];
  currencies = [];
  countries = [];
  transactionPurposes = [defaultComboData];
  paymentMethods = [defaultComboData];
  collectionMethods = [defaultComboData];
  currentKey = '';
  browser = false;
  fields = [
    {
      text: 'Customer ID',
      value: 'CustomerId',
    },
    {
      text: 'Name',
      value: 'Name',
    },
    {
      text: 'IC/NRIC/Other ID',
      value: 'NrcNo',
    },
    {
      text: 'Tel (Resident/Office/Mobile)',
      value: 'Phone',
    },
    {
      text: 'Email',
      value: 'Email',
    },
    {
      text: 'Status',
      value: 'Status',
    },
  ];
  operators = [
    {
      text: 'Contains',
      value: '1',
    },
    {
      text: 'Equal',
      value: '2',
    },
    {
      text: 'Start With',
      value: '3',
    },
    {
      text: 'End With',
      value: '4',
    },
  ];
  filters = [
    {
      id: new Date().toISOString(),
      field: 'CustomerId',
      operator: '1',
      search: '',
    },
  ];

  constructor(private http: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.form.savedate = moment().format('yyyy-MM-DD');
    this.fetchInitialData();
  }

  search() {
    this.http
      .doPost('customer-registrations/search', {
        filters: this.filters,
      })
      .subscribe((data: any) => {
        this.customers = data;
      });
  }

  addFilter() {
    this.filters.push({
      id: new Date().toISOString(),
      field: 'CustomerId',
      operator: '1',
      search: '',
    });
  }

  removeFilter({ id }) {
    if (this.filters.length > 1) {
      this.filters = this.filters.filter((filter) => filter.id != id);
    }
  }

  onAmountChanged(e) {
    this.form.amount = commaNumber(
      parseFloat(this.form.amount || '0').toFixed(2)
    );
  }

  async fetchInitialData() {
    const [
      countries,
      transactionPurposes,
      paymentMethods,
      collectionMethods,
      addresses,
    ] = await this.http.doGetManyAsync([
      'customer-registrations/countries',
      'international-remittances/transaction-purposes',
      'international-remittances/payment-methods',
      'international-remittances/collection-methods',
      'customer-registrations/addresses',
    ]);

    this.countries = [{ countryName: '-' }, ...countries];
    this.transactionPurposes = [defaultComboData, ...transactionPurposes];
    this.paymentMethods = [
      defaultComboData,
      ...paymentMethods.map((v) => ({
        ...v,
        value: (v.value - 1).toString(),
        oldValue: v.value,
      })),
    ];
    this.collectionMethods = [
      defaultComboData,
      ...collectionMethods.map((v) => ({
        ...v,
        value: (v.value - 1).toString(),
        oldValue: v.value,
      })),
    ];
    this.autocomplete(
      document.getElementById('senderCountrySuggest'),
      this.countries.map((v) => v.countryName),
      this.form,
      'sendercountry'
    );
    this.autocomplete(
      document.getElementById('receiverCountrySuggest'),
      this.countries.map((v) => v.countryName),
      this.form,
      'receivercountry'
    );

    const addressList = addresses.map((v) => v.descEng);
    this.autocomplete(
      document.getElementById('fromTownshipSuggest'),
      addressList,
      this.form,
      'fromtownship'
    );
    this.autocomplete(
      document.getElementById('toTownshipSuggest'),
      addressList,
      this.form,
      'totownship'
    );
    this.autocomplete(
      document.getElementById('toDivisionSuggest'),
      addressList,
      this.form,
      'todivision'
    );
    this.autocomplete(
      document.getElementById('fromDivisionSuggest'),
      addressList,
      this.form,
      'fromdivision'
    );
  }

  browseCustomers(key: string, e) {
    this.customers = [];
    e.stopPropagation();
    this.currentKey = key;
    this.browser = true;
  }

  closeBrowser(e) {
    e.stopPropagation();
    this.browser = false;
    this.filters = [
      {
        id: new Date().toISOString(),
        field: 'CustomerId',
        operator: '1',
        search: '',
      },
    ];
  }

  clearBrowser(key: string) {
    this.form[key] = '';
    if (key == 'tocustomerid') {
      this.form.toname = '';
      this.form.tonrc = '';
      this.form.tounit = '';
      this.form.tobuildingname = '';
      this.form.totownship = '';
      this.form.todivision = '';
      this.form.tophoneno = '';
      this.form.todob = '';
      this.form.topassportno = '';
      this.form.toblock = '';
      this.form.tostreet = '';
      this.form.receivercountry = '';
      this.form.topostalcode = '';
      this.form.toemail = '';
    } else {
      this.form.fromremark = '';
      this.form.fromname = '';
      this.form.fromnrcno = '';
      this.form.fromunit = '';
      this.form.frombuildingname = '';
      this.form.fromtownship = '';
      this.form.fromdivision = '';
      this.form.fromphoneno = '';
      this.form.fromdob = '';
      this.form.frompassportno = '';
      this.form.fromblock = '';
      this.form.fromstreet = '';
      this.form.sendercountry = '';
      this.form.frompostalcode = '';
      this.form.fromemail = '';
    }
  }

  selectCustomer(customer) {
    this.form[this.currentKey] = customer.customerId;
    switch (this.currentKey) {
      case 'fromcustomerid':
        this.form.fromname = customer.name;
        this.form.fromnrcno = customer.nrcNo;
        this.form.fromunit = customer.houseNo;
        this.form.frombuildingname = customer.buildingName;
        this.form.fromtownship = customer.township;
        this.form.fromdivision = customer.division;
        this.form.fromphoneno = customer.phone;
        this.form.fromdob = customer.dateOfBirth;
        this.form.frompassportno = customer.passportNo;
        this.form.fromblock = customer.ward;
        this.form.fromstreet = customer.street;
        this.form.frompostalcode = customer.postalCode;
        this.form.sendercountry = customer.country;
        this.form.fromemail = customer.email;
        break;
      default:
        this.form.toname = customer.name;
        this.form.tonrc = customer.nrcNo;
        this.form.tounit = customer.houseNo;
        this.form.tobuildingname = customer.buildingName;
        this.form.totownship = customer.township;
        this.form.todivision = customer.division;
        this.form.tophoneno = customer.phone;
        this.form.todob = customer.dateOfBirth;
        this.form.topassportno = customer.passportNo;
        this.form.toblock = customer.ward;
        this.form.tostreet = customer.street;
        this.form.topostalcode = customer.postalCode;
        this.form.receivercountry = customer.country;
        this.form.toemail = customer.email;
    }
    this.browser = false;
    this.filters = [
      {
        id: new Date().toISOString(),
        field: 'CustomerId',
        operator: '1',
        search: '',
      },
    ];
  }

  onCountryChanged(key: string) {
    const currency = this.countries.find((v) => v.countryName == this.form[key])
      .currency;
    switch (key) {
      case 'tocountry':
        this.form.tocurrencycode = currency;
        break;
      default:
        this.form.currencycode = currency;
    }
  }

  new() {
    this.form = { ...defaultForm };
    this.form.savedate = moment().format('yyyy-MM-DD');
  }

  isValidated() {
    const requiredFields = [
      'fromcountry',
      'tocountry',
      'currencycode',
      'amount',
      'fromname',
      'fromnrcno',
      'fromcustomerid',
      'toname',
      'tonrc',
      'tobuildingname',
      'totownship',
      'todivision',
      'tophoneno',
      'tostreet',
      'receivercountry',
    ];
    for (const field of requiredFields) {
      if (this.form[field] == '-' || !this.form[field]) {
        return false;
      }
    }
    return true;
  }

  submit() {
    if (this.isValidated()) {
      this.http
        .doPost('international-remittances/send-money', {
          ...this.form,
          savedate: this.form.savedate + ' 00:00:00.000',
          todob: this.form.todob + ' 00:00:00.000',
          fromdob: this.form.fromdob + ' 00:00:00.000',
          amount: this.form.amount.replace(',', ''),
        })
        .subscribe((data) => {
          alert('Submit Successfully');
          this.new();
        });
    } else {
      alert('Please fill all required fields!');
    }
  }
}
