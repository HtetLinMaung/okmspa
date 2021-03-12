import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

const defaultComboData = {
  text: '-',
  value: '-',
};

@Component({
  selector: 'app-international-remittance',
  templateUrl: './international-remittance.component.html',
  styleUrls: ['./international-remittance.component.css'],
})
export class InternationalRemittanceComponent implements OnInit {
  form = {
    t1: '-', // transactionPurpose
    n1: '-', // payment method
    n2: '-', // collection method
    fromcountry: '-',
    tocountry: '-',
  };
  currencies = [];
  countries = [];
  transactionPurposes = [defaultComboData];
  paymentMethods = [defaultComboData];
  collectionMethods = [defaultComboData];

  constructor(private http: HttpService) {}

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
