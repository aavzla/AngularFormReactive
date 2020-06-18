import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
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

  //This solution is by a getter
  get controls() {
    //This is an alternative casting solution.
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  ngOnInit() {

    //The second argument of the FormControl allow to have one or an array of validators.
    //These validators should be passed as reference, not call the methods by adding at the end ().
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });
  }

  onSubmit() {
    console.log(this.constructor.name + ' form submitted!', this.signupForm);
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  //This solution is by a method
  getControls() {
    //This a casting solution
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }
}
