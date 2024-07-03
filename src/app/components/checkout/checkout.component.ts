import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup! : FormGroup;
  totalPrice : number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries : Country[] = [];
  shippingStates : State[] = [];
  billingStates : State[] = [];


  constructor(private formBuilder: FormBuilder, private luv2ShopService : Luv2ShopFormService) { }

  ngOnInit(): void {
      const startMonth : number = new Date().getMonth() + 1;
    
      
      this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
        data => {
          this.creditCardMonths = data;
        }
      );

      this.luv2ShopService.getCreditCardYears().subscribe(
        data => {
          this.creditCardYears = data;
        }
      )


      this.luv2ShopService.getCountries().subscribe(
        data => {
          this.countries = data
        }
      );


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName : [''],
        lastName: [''],
        email : ['']
      }),
      shippingAddress : this.formBuilder.group({
        street: [''],
        city: [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      billingAddress : this.formBuilder.group({
        street: [''],
        city: [''],
        state : [''],
        country : [''],
        zipCode : ['']
      }),
      creditCard : this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber : [''],
        securityCode : [''],
        expirationMonth : [''],
        expirationYear : [''],
      }),
    });








  }


  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
  }


  copyShippingAddressToBillingAddress($event: Event) {
    if(($event.target as HTMLInputElement)?.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
      this.billingStates = this.shippingStates;
    }else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingStates = [];
    }
  }


  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear : number = new Date().getFullYear();

    const selectedYear : number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth : number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );


  }



  getStates(formGroupName : string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;

    this.luv2ShopService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingStates = data;
        }
        if(formGroupName === 'billingAddress'){
          this.billingStates = data;
        }


        formGroup?.get('state')?.setValue(data[0]);
      }
    )

  }

}
