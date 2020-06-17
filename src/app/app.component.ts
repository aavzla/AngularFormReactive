import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  //This property will hold our reactive form.
  signupForm: FormGroup;

  ngOnInit() {

    //The second argument of the FormControl allow to have one or an array of validators.
    //These validators should be passed as reference, not call the methods by adding at the end ().
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
      }),
      'gender': new FormControl('male')
    });
  }

  onSubmit() {
    console.log(this.constructor.name + ' form submitted!', this.signupForm);
  }
}
