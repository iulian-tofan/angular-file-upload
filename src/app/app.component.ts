import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { GptFileUploaderComponent } from './components/gpt-file-uploader/gpt-file-uploader.component';
import { GptFormControlFileUploaderComponent } from './components/gpt-form-control-file-uploader/gpt-form-control-file-uploader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    GptFileUploaderComponent,
    GptFormControlFileUploaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    files: [[]], // Initialize the form control for files as an empty array
  });

  formControl = this.fb.control([]);

  onSubmit() {
    console.log('Form submitted:', this.form.value);
  }

  log(value: any) {
    console.log(value);
  }
}
