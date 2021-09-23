import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SupervisorsService } from 'src/app/services/supervisors.service';
import {BackendResponse, ContactType} from '../../structs/structs';
import { Regex } from '../../structs/structs';
@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})

export class NotificationFormComponent implements OnInit {

  submissionMessage = ''; // for displaying message when hitting "submit"

  contactType = ContactType;

  supervisors = [];
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern(Regex.nameRegex)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern(Regex.nameRegex)]),
    preferredContact: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    phone: new FormControl('', [Validators.pattern(Regex.phoneRegex)]),
    supervisor: new FormControl('', [Validators.required]),
  });
  constructor(private supervisorsService: SupervisorsService) { }

  ngOnInit(): void {
    this.PreferredContactHandler();
    this.GetSupervisors();
  }
  /**
   * http request to get supervisors in format: “jurisdiction - lastName, firstName”
   */
  private GetSupervisors() {
    this.supervisorsService.GetSupervisors().subscribe( (json: any) => {
      this.supervisors = json;
    });
  }

  /**
   * handles choosing preferred contact
   */
  private PreferredContactHandler() {
    this.profileForm.get('phone')?.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.controls.preferredContact.valueChanges.subscribe(value => {
      let phone = this.profileForm.get('phone')!;
      let email = this.profileForm.get('email')!;
      if (value==ContactType.Email) {
        phone.disable();
        email.enable();
        phone.clearValidators();
        email.setValidators([Validators.email]);

      }
      else if (value==ContactType.Phone) {
        phone.enable();
        email.disable();
        phone.setValidators([Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]);
        email.clearValidators();
      }
      else {
        throw new Error("unknown contact type");
      }
    });
  }

  /**
   * Attempts POST request to submit form
   */
  onSubmit() {
    console.log(this.profileForm);
    console.log(this.profileForm.controls);

    // if (this.profileForm.valid) { // valid inputs. Register for notifications
    if (true) { // valid inputs. Register for notifications
        const firstName = this.profileForm.get('firstName')?.value;
      const lastName = this.profileForm.get('lastName')?.value;
      const preferredContact = this.profileForm.get('preferredContact')?.value;
      const email = this.profileForm.get('email')?.value;
      const phone = this.profileForm.get('phone')?.value;
      const supervisor = this.profileForm.get('supervisor')?.value;
      let register;
      if (preferredContact==ContactType.Email) {
        register = this.supervisorsService.Register(firstName, lastName, supervisor, email, '');
      }
      else {
        register = this.supervisorsService.Register(firstName, lastName, supervisor, '', phone);
      }
      register.subscribe({
        next: (res: BackendResponse) => {
          this.submissionMessage = res.msg;
        },
        error: (err) => {
          console.log(err);
          this.submissionMessage = err.error.msg
        }
    });
    }
  }

}
