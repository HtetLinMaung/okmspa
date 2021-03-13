import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import SuggestionListHelper from 'src/app/utils/suggestion-list-helper';

const defaultComboData = {
  text: '-',
  value: '-',
};

@Component({
  selector: 'app-international-remittance',
  templateUrl: './international-remittance.component.html',
  styleUrls: ['./international-remittance.component.css'],
})
export class InternationalRemittanceComponent
  extends SuggestionListHelper
  implements OnInit {
  form = {
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
  };
  currencies = [];
  countries = [];
  transactionPurposes = [defaultComboData];
  paymentMethods = [defaultComboData];
  collectionMethods = [defaultComboData];

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
    ] = await this.http.doGetManyAsync([
      'customer-registrations/countries',
      'international-remittances/transaction-purposes',
      'international-remittances/payment-methods',
      'international-remittances/collection-methods',
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
  }
}
