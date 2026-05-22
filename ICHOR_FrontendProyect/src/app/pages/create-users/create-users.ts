import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  templateUrl: 'create-users.html',
  selector:'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
})

export class createUserComponent implements OnInit {
  userForm!: FormGroup;

  hospitals = [
    {id: 1, name: 'Hospital1'},
    {id: 2, name: 'Hospital2'}
  ];

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.initform();
  }

  initform() {
    this.userForm = this.fb.group({
      fullname: [''],
      email: [''],
      dni: [''],
      password:[''],
      role: ['doctor'],
      hospitals: [''],

    });
  }
  onSubmit(): void {
    console.log('Datos : ', this.userForm.value);
  }


}
