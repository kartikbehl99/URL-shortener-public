import { baseUrl, URL } from './URLs';
import { RequestData, RepsonseData } from './data.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlShorteningService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  shortUrl: string;
  longUrl: string;
  status: number;

  constructor(private httpClient: HttpClient) {}

  private handleError<T>(result: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  private redirect<T>(result?: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      if (error.url) {
        this.longUrl = error.url;
      }
      if (error.status) {
        this.status = error.status;
      }
      return of(result as T);
    };
  }

  generateShortUrl(body: RequestData): Observable<RepsonseData> {
    return this.httpClient
      .post<RepsonseData>(
        `${baseUrl}/${URL.GENERATE_ENDPOINT}`,
        body,
        this.httpOptions
      )
      .pipe(
        catchError(
          this.handleError<RepsonseData>({ short_url: '' })
        )
      );
  }

  handleRedirect(shortUrl: string): Observable<any> {
    return this.httpClient
      .get<any>(`${baseUrl}/${shortUrl}`)
      .pipe(catchError(this.redirect('')));
  }
}
