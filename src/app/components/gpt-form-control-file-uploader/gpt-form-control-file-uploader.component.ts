import { Component } from '@angular/core';

@Component({
  selector: 'app-gpt-form-control-file-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gpt-form-control-file-uploader.component.html',
  styleUrl: './gpt-form-control-file-uploader.component.scss',
})
export class GptFormControlFileUploaderComponent {
  files: File[] = [];
  isFileOver: boolean = false;

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
    Array.from(fileList).forEach((file) => {
      if (!this.files.some((existingFile) => existingFile.name === file.name)) {
        this.files.push(file);
      }
    });
  }
}
