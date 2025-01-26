import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private apiUrl = 'http://127.0.0.1:5000/upload';
  private apiSelfieUrl = 'http://127.0.0.1:5000/upload/selfie';
  constructor(private http: HttpClient) {}

  uploadPhotos(idPhoto: File, personPhoto: File) {
    const formData = new FormData();
    formData.append('idPhoto', idPhoto);
    formData.append('personPhoto', personPhoto);

    return this.http.post(this.apiUrl, formData);
  }

  uploadSelfiePhoto(selfiePhoto: File, task_id:string) {
    const formData = new FormData();
    formData.append('idSelfie', selfiePhoto);
    formData.append('task_id', task_id);
    return this.http.post(this.apiSelfieUrl, formData);
  }
}
