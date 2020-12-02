import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../meeting-common/services/meeting.service';

@Component({
  templateUrl: './new-meeting.component.html',
  styleUrls: ['./new-meeting.component.scss']
})
export class NewMeetingComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private meetingService: MeetingService, private router: Router) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    const fields = {
      title: this.formBuilder.control("", [Validators.required]),
      //startDate: this.formBuilder.control(""),
      //endDate: this.formBuilder.control(""),
    }
    return this.formBuilder.group(fields);
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const formValue = this.form.value;
    const title: string = formValue.title;
    this.meetingService.post(title).subscribe(meeting => {
      this.router.navigate(["/meeting", meeting.meeting_id]);
    });
  }

}
