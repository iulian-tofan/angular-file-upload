import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigKeys } from '../../../../../../apps/frontend/src/app/shared/interfaces/config.interface';
import { ConfigService } from '../../../../../../apps/frontend/src/app/shared/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  protected basePath = 'http://localhost:3333/api';
  protected defaultHeaders = new HttpHeaders();

  public getEntityServiceEndpoint() {
    return `${this.basePath}/file`;
  }

  constructor(
    public httpClient: HttpClient,
    public config: ConfigService,
  ) {
    this.basePath = config.get(ConfigKeys.API_BASE_PATH) || this.basePath;
  }

  public async getFIleInfo(id: string): Promise<any> {
    const headers = this.defaultHeaders;
    const url = this.getEntityServiceEndpoint();
    return this.httpClient
      .get<any>(`${url}/info/${id}`, {
        withCredentials: true,
        headers,
      })
      .toPromise<any>();
  }

  public upload(formData: any): Observable<HttpEvent<unknown>> {
    const headers = this.defaultHeaders;
    const url = this.getEntityServiceEndpoint();

    const req = new HttpRequest<FormData>('POST', url, formData, {
      withCredentials: true,
      headers,
      reportProgress: true,
    });

    return this.httpClient.request(req);
  }

  public download(id: string): Promise<any> {
    const headers = this.defaultHeaders;
    const url = this.getEntityServiceEndpoint();

    return this.httpClient
      .get(`${url}/${id}`, {
        withCredentials: true,
        headers,
        responseType: 'blob',
      })
      .toPromise<any>();
  }

  public async delete(id: string): Promise<any> {
    const headers = this.defaultHeaders;
    const url = this.getEntityServiceEndpoint();
    return this.httpClient
      .delete<any>(`${url}/${id}`, {
        withCredentials: true,
        headers,
      })
      .toPromise<any>();
  }

  public async deleteMultiple(ids: string[]): Promise<boolean> {
    const headers = this.defaultHeaders;
    const url = this.getEntityServiceEndpoint();
    return this.httpClient
      .post<any>(`${url}/delete-multiple`, ids, {
        withCredentials: true,
        headers,
      })
      .toPromise<boolean>();
  }
}
