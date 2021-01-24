import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';

/**
 * Represents form that submits assignment documents for grading.
 */
@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {

  fileForm: FormGroup;
  displayLoading: boolean;
  errors: Array<string>;
  submitted: boolean;
  uploader: FileUploader;

  /**
   * Defines FormBuilder object and intializes fileForm and uploader.
   * @param fb  FormBuilder
   */
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.fileForm = this.fb.group({
      documentSelect: [null, null],
    });
    this.displayLoading = false;
    this.errors = [];
    this.submitted = false;
    this.uploader = new FileUploader({
      isHTML5: true
    });
  }

  ngOnInit(): void { }

  /**
   * Removes all documents from uploader object.
   */
  removeAll(): void {
    this.submitted = false;
    this.displayLoading = false;
    this.uploader = new FileUploader({
      isHTML5: true
    });
  }

  /**
   * Submits files as a post request to Java API.
   */
  uploadSubmit(): void {
    // Display booleans
    this.errors = [];
    this.displayLoading = true;

    // Look for invalid input
    const queue = this.uploader.queue;
    console.log(typeof queue);
    if (queue.length === 0) {
      this.errors.push('You did not upload any documents.');
    } else {
      this.validateQueue(queue);
    }

    // Display errors if they exist
    if (this.errors.length !== 0) {
      this.displayLoading = false;
      this.submitted = false;
    } else {
      this.postUpload(queue);
    }
  }

  /**
   * Posts files to JGRAM Rest API.
   * @param uploader FileUploader
   */
  private postUpload(queue: FileItem[]): void {
    // Gather files into a FormData object
    const formData = new FormData();
    for (const doc of queue) {
      formData.append('document', doc._file);
    }
    console.log(formData);
    console.log(formData.getAll('document'));

    // Post form data and handle response
    this.http.post('http://localhost:8080/grade/uploadDocuments', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
}

  /**
   * Validates documents found in the queue. Adds to error messages if the
   * document is not a .docx file or is larger than 10mb.
   * @param queue FileItem[]
   */
  private validateQueue(queue: FileItem[]): void {
    for (const doc of queue) {
        if (!this.isDocx(doc.file.name)) {
          this.errors.push('Attempted to upload a file that is not a Word document: '
            + doc.file.name);
        }
        if (doc.file.size > 10000000) {
          this.errors.push('Attempted to upload a file that is larger than 10mb: '
            + doc.file.name);
        }
      } // end for
  }

  /**
   * Determines if doc parameter references a .docx file type.
   * @param doc string
   */
  private isDocx(doc: string): boolean {
    const type: string = doc.split('.')[1];
    return type === 'docx';
  }

}
