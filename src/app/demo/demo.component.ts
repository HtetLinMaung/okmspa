import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(n: number) {
    switch (n) {
      case 1:
        this.router.navigate(['/registration/customer-registration']);
        break;
      case 2:
        this.router.navigate(['/registration/international-remittance']);
        break;
    }
  }
}
