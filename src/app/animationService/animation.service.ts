import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  // private baseUrl = 'https://votre-nom-d-utilisateur.github.io/nom-depot'; // Mettez l'URL de votre dépôt
  private baseUrl ='https://abouu19.github.io/animations';

  constructor(private http: HttpClient) {}

  getAnimation(animationName: string) {
    const animationUrl = `${this.baseUrl}/animation/${animationName}.glb`; // Mettez le chemin vers le fichier GLB
    const headers = new HttpHeaders({ 'Content-Type': 'model/gltf-binary' });
    return this.http.get(animationUrl, { responseType: 'arraybuffer', headers });
  }
}
