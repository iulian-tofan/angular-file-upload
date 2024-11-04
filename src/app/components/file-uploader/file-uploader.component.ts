import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploaderConfig } from './interfaces/file-uploader-config';
import { UploadedFile } from './interfaces/uploaded-file.interface';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
})
export class FileUploaderComponent {
  /**
   * Keeps track of the alread uploaded files
   */
  @Input()
  uploadedFiles: UploadedFile[] = []; //TODO: initil value

  /**
   * Config for the angular-file package
   */
  @Input()
  config: FileUploaderConfig = {
    theme: 'inline',
    selectable: true,
    multipleSelection: true,
    fileDropDisabled: false,
    maxSize: 10,
    replaceTexts: {
      selectFiles: 'Select Files',
    },
  };

  /**
   * Used in order to update the state of the form model or to simply
   * inform the parent component that the uploaded files have changed
   */
  @Output()
  filesChanged: EventEmitter<UploadedFile[]> = new EventEmitter();

  @Output()
  uploading: EventEmitter<boolean> = new EventEmitter();

  // Used for local files that will be uploaded
  files: File[] = [];

  // Not used yet. Invalid(due to extension/file size) selected/dropped files are places into this array
  lastInvalids: any;

  // Not used yet. While the files are in the process of being dragged are places into this array
  dragFiles: any;

  // Used in order to set the invalid class on the dropbox in case the files are invalid
  validComboDrag: any;

  // Default texts
  SELECT_FILES: string = 'file-upload.select-files';
  MAXIMUM_FILES_COUNT_WARNING: string =
    'file-upload.maximum-files-count-warning';
  FILE_UPLOAD_ERROR: string = 'file-upload.file-upload-error';
  FILE_UPLOAD_INVALID_EXTENSION_ERROR: string =
    'file-upload.invalid-extension-error';

  // FIXME: Later added
  defaultFileUploaderFileTypes =
    '.pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*';

  // Save the intial state of the form model
  initialUploadedFiles: UploadedFile[] = []; //TODO: initil value

  ngOnInit(): void {
    // If the uploadedFiles come form store we need to make a copy because the array is not extensible
    this.uploadedFiles = this.uploadedFiles ? [...this.uploadedFiles] : [];

    // The user shouldn't be able to select multiple files if only one file is allowed
    if (this.config.maxFileCount === 1) this.config.multipleSelection = false;

    // Angular file uses bytes so the file size must be converted from mb to bytes
    this.config.maxSize *= 1048576;

    // Save the intial state of the form model
    this.initialUploadedFiles = [...(this.uploadedFiles || [])];

    // Set the accept file type to default if the user doesn't define it. If there is no default
    // in the config any file type will be accepted
    if (!this.config.accept) {
      this.config.accept = this.defaultFileUploaderFileTypes || '*';
    }
  }

  /**
   * Used in order to make sure the maximum file count isn't crossed over
   * and dispay a warning if it is
   */
  onFilesChange() {
    if (
      this.config.maxFileCount &&
      this.files.length + this.initialUploadedFiles?.length >
        this.config.maxFileCount
    ) {
      this.files = this.files.slice(
        0,
        this.config.maxFileCount - this.initialUploadedFiles?.length,
      );

      // Display a warning to let a user know that there is a maximum file count
      // that he can upload
      let warningPropertyName = this.MAXIMUM_FILES_COUNT_WARNING;
      if (this.config.replaceTexts?.maximumFilesCountWarning) {
        warningPropertyName = this.config.replaceTexts.maximumFilesCountWarning;
      }

      // TODO: translate the message
      // const translatedWarningMessage = this.translateService
      //   .instant(warningPropertyName)
      //   .replace('{{number}}', this.config.maxFileCount);
      const translatedWarningMessage = warningPropertyName;

      alert(`Warning ${translatedWarningMessage}`);
    }

    // Let the parent component know that there are files currently uploading
    if (
      !this.uploadedFiles ||
      this.uploadedFiles?.length <
        this.files.length + this.initialUploadedFiles?.length
    ) {
      this.uploading.emit(true);
    }
  }

  // Adds the file to the uploaded files array and emit the change event
  onFileUploaded(file: UploadedFile) {
    if (!this.uploadedFiles) this.uploadedFiles = [];

    this.uploadedFiles.push(file);

    if (
      this.uploadedFiles?.length ===
      this.files.length + this.initialUploadedFiles?.length
    ) {
      this.filesChanged.emit(this.uploadedFiles);
      this.uploading.emit(false);
    }
  }

  // THis has 2 cases of usage:
  // 1. Soft deteles the file from whicher file array it belongs to and emits the change event
  // 2. Also deletes the file from the new files array in case there was an failed upload
  onFileDeleted(
    fileId: string,
    fileArray: File[] | UploadedFile[],
    index: number,
  ) {
    fileArray.splice(index, 1);

    // If the fileId is null it means there's been an error while uploading the file
    if (fileId) {
      // Case 1
      this.uploadedFiles = this.uploadedFiles?.filter((x) => x._id !== fileId);

      this.filesChanged.emit(this.uploadedFiles);
    } else if (
      this.uploadedFiles?.length ===
      this.files.length + this.initialUploadedFiles?.length
    ) {
      // Case 1
      // if all the other files finished uploading we should let the parent component know that
      // there is no longer any file beeing uploaded

      this.uploading.emit(false);
    }
  }

  /**
   * Called whenever there is a file drop
   * @param invalidFiles
   */
  public invalidFilesDrop(
    invalidFiles: {
      file: File;
      type: string;
    }[],
  ): void {
    // the event is triggered whenever there is a file drop even if there are no invalid files
    if (!invalidFiles || invalidFiles.length < 1) return;

    // Display a error to let a user know that he is not allowed to upload files with certain extensions
    let errorPropertyName = this.FILE_UPLOAD_INVALID_EXTENSION_ERROR;

    // Check if the dev decided to replace the text
    if (this.config.replaceTexts?.fileUploadInvalidExtentionError) {
      errorPropertyName =
        this.config.replaceTexts?.fileUploadInvalidExtentionError;
    }

    // Get the unique files extensions that are not allowed form the invalid files array
    const invalidFileExtensions = [
      ...new Set(
        invalidFiles.map(
          (invalidFile) => `.${invalidFile.file.name.split('.').pop()}`,
        ),
      ),
    ].reduce(
      (previousValue, currentValue) => `${previousValue}, ${currentValue}`,
    );

    // TODO: Translate the message
    // const translatedErrorMessage = this.translateService
    //   .instant(errorPropertyName)
    //   .replace('{{fileExtensions}}', invalidFileExtensions);

    const translatedErrorMessage = errorPropertyName;

    alert(`Error ${translatedErrorMessage}`);
  }
}
