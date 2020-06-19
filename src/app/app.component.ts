import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  //This property will hold our reactive form.
  signupForm: FormGroup;
  //This class property will hold the forbidden usernames.
  forbiddenUsernames = ['user', 'superuser'];
  //This class property will hold the forbidden emails.
  forbiddenEmailList = ['test@test.com'];

  /*
   * For our custom validation for username. Use the case to test. Comment/Uncommment the other cases.
   * There are 3 types of implementing custom validators for binding the keyword this:
   * 1) A function definition as a method with a bind of the keyword this, in order to keep the reference to the class property.
   * 2) An arrow function definition without the bind of the keyword 'this'. Arrow functions keep the reference this.
   * 3) A function definition to a class property. Not implemented here.
  */

  /*
   * For our async custom validation for email. Use the case to test. Comment/Uncommment the other cases.
   * The numbers were selected to avoid confusion and doen't represent a continuation of the first list.
   * 4) A function without any reference to a property class. This doesn't need a binding. We use a promise implementation.
   * 5) A function with a reference to a property class, therefore a binding. We use an Observable implementation.
   * 6) An arrow function with a reference to a property class. Arrow functions keep the reference this.
   * We use an Observable with RxJS’s operators as implementation.
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
          //1) The binding to our custom validator is only needed to keep reference to the class property.
          //this.forbiddenNames.bind(this)
          //2)  Arrow functions will keep the reference to this.
          this.forbiddenNames
        ]),
        'email': new FormControl(null,
          [Validators.required, Validators.email],
          //4) The custom validator doesn't need a bind, because we don't use a reference to the class property.
          this.forbiddenEmails
          //5)  The binding to our custom validator is only needed to keep reference to the class property.
          //this.forbiddenEmails.bind(this)
          //6) The custom validator doesn't need a bind, because we use an arrow function that will keept reference to the class property.
          //this.forbiddenEmails
        ),
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

  //4) This is the Async function using a Promise.
  //Because, we do not use a reference to property in this class, we don't need the binding.
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>(
      (resolve, reject) => {
        setTimeout(() => {
          if (control.value === 'test@test.com') {
            resolve({ 'emailIsForbidden': true });
          } else {
            resolve(null);
          }
        }, 1500);
      }
    );
    return promise;
  }

  //5) This is the Async function using an Observable.
  //Because, we use a reference to property in this class, we need the binding.
  /*
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    return new Observable<any>(observer => {
      setTimeout(() => {
        const email = control.value ? control.value.toLowerCase() : '';
        if (this.forbiddenEmailList.some(e => e.toLowerCase() === email)) {
          observer.next({ emailIsForbidden: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }
  */

  //6) This is the Async arrow function using an rxjs operators.
  //Because, we use a reference to property in this class, we don't need the binding.
  /*
  forbiddenEmails = (control: FormControl): Promise<any> | Observable<any> => {
    return of(control.value).pipe(
      map(value => this.forbiddenEmailList.some(e => e.toLowerCase() === value.toLowerCase()) ? { 'emailIsForbidden': true } : null),
      delay(1500)
    );
  }
  */
}
