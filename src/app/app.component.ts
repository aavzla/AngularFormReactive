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
  //This property will hold the forbidden usernames.
  forbiddenUsernames = ['user', 'superuser'];

  /*
   * There are 3 types of implementing custom validators for binding the keyword this:
   * 1) A function definition as a method with a bind of the keyword this, in order to keep the reference.
   * 2) An arrow function definition without the bind of the keyword 'this'. Arrow functions keep the reference this.
   * 3) A function definition to a class property. Not implemented here.
  */

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
        'username': new FormControl(null, [
          Validators.required,
          //1) The binding to our custom validator is only needed for the use of .indexOf solution.
          //this.forbiddenNames.bind(this)
          //2)  Arrow functions will keep the reference to this.
          this.forbiddenNames
        ]),
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

  //1) Definition as a method
  //forbiddenNames(control: FormControl): { [s: string]: boolean } {
  //2) Definition as a arrow function
  forbiddenNames = (control: FormControl): { [s: string]: boolean } => {
    //console.log('this is the control: ', control);
    const userNameGiven: string = control.value == null ? null : control.value.toLowerCase();
    //console.log('this is the userName given as lower case: ', userNameGiven);

    if (
      //1) The line will check the index of the username given and it will return the index or -1 if it doen't exist in the array.
      //this.forbiddenUsernames.indexOf(userNameGiven) !== -1

      /*
       * 2) A better approach is with arrow functions.
       * Please visit, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
       * and https://caniuse.com/#feat=arrow-functions.
       * This is the stackoverflow where i found these links, https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e.
       * We can have 3 options: some (bool), filter (array).length === 1 or find (object in array) !== undefine.
      */
      this.forbiddenUsernames.some(username => username.toLowerCase() === userNameGiven)
    ) {
      return { 'nameIsForbidden': true }
    }
    return null;
  }
}
