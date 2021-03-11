import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InternationalRemittanceComponent } from './international-remittance/international-remittance.component';

@NgModule({
  declarations: [
    CustomerRegistrationComponent,
    InternationalRemittanceComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: 'registration/customer-registration',
        component: CustomerRegistrationComponent,
      },
      {
        path: 'registration/international-remittance',
        component: InternationalRemittanceComponent,
      },
    ]),
  ],
})
export class RegistrationModule {}
