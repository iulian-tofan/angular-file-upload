import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-gpt-form-control-file-uploader',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GptFormControlFileUploaderComponent),
      multi: true,
    },
  ],
  templateUrl: './gpt-form-control-file-uploader.component.html',
  styleUrl: './gpt-form-control-file-uploader.component.scss',
})
export class GptFormControlFileUploaderComponent
  implements ControlValueAccessor
{
  files: File[] = [];
  isFileOver: boolean = false;

  // Callbacks for ControlValueAccessor
  private onChange: (files: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  // ControlValueAccessor: Write a value to the component
  writeValue(files: File[]): void {
    if (files) {
      this.files = files;
    }
  }

  // ControlValueAccessor: Register a callback function that should be called when the model value changes
  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  // ControlValueAccessor: Register a callback function that should be called when the control is touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Call onTouched when the user interacts with the component
  markAsTouched(): void {
    this.onTouched();
  }

  // Triggered when files are dragged over the drop area
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = true;
  }

  // Triggered when files are dragged out of the drop area
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = false;
  }

  // Triggered when files are dropped into the drop area
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFileOver = false;

    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  // Triggered when files are selected from the file dialog
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
  }

  // Add files to the list and handle duplicates
  addFiles(fileList: FileList): void {
    const newFiles = Array.from(fileList).filter(
      (file) =>
        !this.files.some((existingFile) => existingFile.name === file.name),
    );
    this.files.push(...newFiles);
    this.onChange(this.files); // Notify Angular forms of the change
  }
}
