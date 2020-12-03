import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/services/authentication.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    const fields = {
      name: this.formBuilder.control("", [Validators.required]),
      email: this.formBuilder.control("", [Validators.required]),
      password: this.formBuilder.control("", [Validators.required]),
    }
    return this.formBuilder.group(fields);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const formValue = this.form.value;
    const name: string = formValue.name;
    const email: string = formValue.email;
    const password: string = formValue.password;
    this.auth.register(name, email, password).subscribe(login => {
      this.router.navigate(["/my-meetings"]);
    });
  }

}
