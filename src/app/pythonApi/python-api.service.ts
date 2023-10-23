import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PythonApiService {
  private apiUrl = 'http://localhost:5000'; // Remplacez par l'URL de votre API Flask

  constructor(private http: HttpClient) { }

  traiterTexte(texte: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      texte: texte
    };

    return this.http.post(`${this.apiUrl}/traitement-texte`, body, { headers });
  }
}
