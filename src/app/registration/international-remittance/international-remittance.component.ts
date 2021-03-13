import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import SuggestionListHelper from 'src/app/utils/suggestion-list-helper';

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

  constructor(private http: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.fetchInitialData();
  }

  async fetchInitialData() {
    const [
      countries,
      transactionPurposes,
      paymentMethods,
      collectionMethods,
      customers,
    ] = await this.http.doGetManyAsync([
      'customer-registrations/countries',
      'international-remittances/transaction-purposes',
      'international-remittances/payment-methods',
      'international-remittances/collection-methods',
      'customer-registrations',
    ]);
    this.customers = [...customers];
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
  }

  browseCustomers(key: string, e) {
    e.stopPropagation();
    this.currentKey = key;
    const dialogEle = document.getElementById('customer-browser');
    dialogEle.style.left = e.pageX + 'px';
    dialogEle.style.top = e.pageY + 'px';
    // dialogEle.style.display = 'block';
  }

  closeBrowser() {
    const dialogEle = document.getElementById('customer-browser');
    // dialogEle.style.display = 'none';
    dialogEle.style.top = '-1000px';
    dialogEle.style.left = '45%';
  }

  clearBrowser(key: string) {
    this.form[key] = '';
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
    this.closeBrowser();
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
      'tocustomerid',
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
        })
        .subscribe((data) => {
          this.new();
        });
    } else {
      alert('Please fill all required fields!');
    }
  }
}
