import {
  HttpResponse,
  HttpEvent,
  HttpHeaderResponse,
} from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver'; // "file-saver": "^2.0.2",
import { UploadedFile } from '../interfaces/uploaded-file.interface';
import { FileService } from '../services/file.service';

@Component({
  selector: 'file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnDestroy {
  /**
   * Keeps track of the alread uploaded files
   */
  @Input()
  newFile: boolean = false;

  @Input()
  file!: File | UploadedFile;

  @Input()
  uploadErrorMessage!: string;

  /**
   * Used in order to update the state of the form model or to simply
   * inform the parent component that the uploaded files have changed
   */
  @Output()
  fileUploaded: EventEmitter<UploadedFile> = new EventEmitter();

  @Output()
  fileDeleted: EventEmitter<string> = new EventEmitter();

  uploadedFile!: UploadedFile;

  // Keeps track of upload progress. Updated via ngfUploadStatus directive
  progress!: number;

  // Used by the ngfUploadStatus directive in order to update the progress
  httpEvent!: HttpEvent<{}>;

  // Used solely for calling unsubscribe
  private uploadSubscription!: Subscription;

  // Used solely for calling unsubscribe
  private dialogSubscription!: Subscription;

  constructor(
    private fileService: FileService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.newFile) {
      // If the file is new upload it immediately
      this.uploadFile();
    } else {
      // If not set it's pregress to 100% so that it appears as already uploaded
      this.progress = 100;
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('files', this.file as File, (this.file as File).name);

    this.uploadSubscription = this.fileService.upload(formData).subscribe(
      (event) => {
        this.httpEvent = event;

        // Temporary fix until we decide on how to throw the error forward in the http interceptor
        if (event instanceof HttpHeaderResponse && !event.ok) {
          this.dispayUploadError();
        }

        if (event instanceof HttpResponse) {
          // Add the just uploaded local files to the uploadedFiles array
          this.uploadedFile = (event.body as UploadedFile[])[0];

          this.fileUploaded.emit(this.uploadedFile);
        }
      },
      (error) => {
        // This point is curently never reached because of the http interceptor

        // Display a warning to let a user know that there was an error while uploading this file
        this.dispayUploadError();
      },
    );
  }

  dispayUploadError() {
    // const translatedWarningMessage = this.translateService
    //   .instant(this.uploadErrorMessage)
    //   .replace(
    //     '{{filename}}',
    //     this.newFile
    //       ? (this.file as File).name
    //       : (this.file as UploadedFile).filename,
    //   );
    // this.notification.error(translatedWarningMessage, null, {
    //   disableTimeOut: true,
    //   closeButton: true,
    // });

    alert(this.uploadErrorMessage);

    this.fileDeleted.emit(null);
  }

  // Used in order to download files either from memory or from the server
  async download() {
    if (this.newFile) {
      saveAs(this.file);
    } else {
      const blob = await this.fileService.download(
        (this.file as UploadedFile)._id,
      );
      saveAs(blob, (this.file as UploadedFile).filename);
    }
  }

  // Semds event to the parent to soft delete this file
  async delete() {
    // Open a prompt dialog
    const dialog = this.dialog.open(PromptDialogComponent, {
      width: '33rem',
      data: {
        title: 'delete-file',
        text: 'delete-file-message',
      },
    });

    this.dialogSubscription = dialog
      .afterClosed()
      .subscribe(async (shouldDelete: boolean) => {
        if (!shouldDelete) return;

        if (this.newFile) {
          /*
           * If the file is new we should delete it from the db too
           * I foresee that this will cause a bug in the case when the user will
           * adds a file => hits submit => deletes the file he just added => hits submit
           * Thus I've commented this out
           */
          // await this.fileService.delete(this.uploadedFile._id);

          this.fileDeleted.emit(this.uploadedFile._id);
        } else {
          this.fileDeleted.emit((this.file as UploadedFile)._id);
        }
      });
  }

  ngOnDestroy(): void {
    this.uploadSubscription?.unsubscribe();
    this.dialogSubscription?.unsubscribe();
  }
}
