import { HttpClient } from '@angular/common/http';
import { Component,ElementRef,ViewChild } from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationService } from '../animationService/animation.service';
import { PythonApiService } from '../pythonApi/python-api.service';


@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent {
  title = 'mSL';
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;
  private container: any;
  private mixer!: THREE.AnimationMixer;
  private clock!: THREE.Clock;

  // private animationList: string[] = ['lui', 'moi', 'nous'];
  private userTextInput: string = ''; // Ajout de la variable pour stocker le texte saisi par l'utilisateur
  private animationWords: string[] = []; // Tableau pour stocker les mots découpés


  private animationClips = [];
  private currentAnimationIndex: number = 0;

  @ViewChild('avatar3D') avatar3DRef!: ElementRef;
  private avatar3D!: HTMLElement;

  constructor(private animationService: AnimationService, private pythonApiService: PythonApiService, private http: HttpClient) {}

  fetchAnimation(animationName: string) {
    return new Promise((resolve, reject) => {
      this.animationService.getAnimation(animationName).subscribe(
        (animationData: ArrayBuffer) => {
          resolve(animationData);
        },
        error => {
          reject(error);
        }
      );
    });
  }



  ngOnInit() {
    this.initializeScene();
  }

  initializeScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // this.camera.position.set(0, 0, 4);
    /*modif*/
    this.camera.position.set(0, 1, 2);

    // this.camera.position.set(0, 1, 2); // Ajustez les coordonnées Y et Z de la position de la caméra

    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.position.set(0,1,2)
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 3, 0);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 5, 10); // Augmentez l'intensité ici
    pointLight.position.set(0, 1,1); // Ajustez les coordonnées X, Y, Z de la position de la lumière
    this.scene.add(pointLight);

    this.clock = new THREE.Clock();


  }

  loadScene() {
    const scenePath = 'assets/classroom.glb';
    const loader = new GLTFLoader();

    loader.load(scenePath, (gltf) => {
      gltf.scene.position.set(0, -1, -5); // Ajustez les valeurs des coordonnées X, Y, Z pour rapprocher la scène
      gltf.scene.scale.set(2, 1, 1);

      this.scene.add(gltf.scene);
    });
  }
  // ...

  // ...

  // ...
  checkWordInAssets(word: string) {
    // Spécifiez l'URL du fichier GLB dans le dossier /assets
    const glbUrl = `/assets/${word}.glb`;

    return this.http.head(glbUrl, { observe: 'response' })
      .toPromise()
      .then(response => {
        // @ts-ignore
        return response.status === 200; // Le fichier GLB existe
      })
      .catch(error => {
        return false; // Le fichier GLB n'existe pas
      });
  }


  async loadNextAvatar() {
    if (this.currentAnimationIndex < this.animationWords.length) {
      const avatarName = this.animationWords[this.currentAnimationIndex];

      const wordExistsInAssets = await this.checkWordInAssets(avatarName);

      if (wordExistsInAssets) {
        // Le fichier GLB existe dans /assets, chargez l'avatar et effectuez l'animation
        this.loadAvatar(avatarName);
        this.animate();
      } else {

        console.log(`${avatarName}.glb n'existe pas dans le dossier /assets.`);
      }


      // this.loadAvatar(avatarName);
      // this.animate();
    } else {
      // Reset animation loop
      this.currentAnimationIndex = 0;
      // this.loadNextAvatar();
    }
  }


  loadAvatar(avatarName: string) {
    const avatarPath = `assets/${avatarName}.glb`;
    const loader = new GLTFLoader();
    const existingAvatar = this.scene.getObjectByName('avatar');

    if (existingAvatar) {
      this.scene.remove(existingAvatar);
    }

    loader.load(avatarPath, (gltf) => {
      this.loadScene();
      gltf.scene.name = 'avatar';
      gltf.scene.position.set(0, -2, 0);
      gltf.scene.scale.set(2, 2, 2);

      this.mixer = new THREE.AnimationMixer(gltf.scene);
      const animationClip = gltf.animations[0];
      const animationDuration = animationClip.duration;
      const animation = this.mixer.clipAction(animationClip);

      animation.play();
      this.scene.add(gltf.scene);

      const animationTextElement = document.getElementById('animationText');
      if (animationTextElement) {
        animationTextElement.innerText = `Animation en cours : ${avatarName}`;
      }



      setTimeout(() => {
        // this.loadScene();
        this.currentAnimationIndex++;
        this.loadNextAvatar();
      }, animationDuration * 1000); // Convert duration to milliseconds
    });
  }


  onTranslateButtonClick() {
    const textareaValue = (
      document.querySelector('#textarea') as HTMLTextAreaElement
    ).value;
    if (textareaValue) {
      this.userTextInput = textareaValue; // Stockez le texte saisi par l'utilisateur
      this.pythonApiService.traiterTexte(this.userTextInput)
        .subscribe(response => {
          this.animationWords = response.mots;

          // @ts-ignore
          this.animationWords  = this.newliste(this.animationWords)


        });
      // this.animationWords = this.userTextInput.split(' '); // Découpez le texte en mots

      this.loadNextAvatar();
      this.animate();
    }
  }

  newliste(elements:string[]){
    const newElements : String[] = [];
    elements.forEach(async (element)=>{
      const elementExistsInAssets = await this.checkWordInAssets(element);
      if(elementExistsInAssets){
        console.log(element+' existe bein !');
        newElements.push(element)
      }else {
        console.log(element +" n'existe pas !");
        console.log('la taille de '+element+' est : '+element.length)
        if (element.length<=1){
          newElements.push(element)
        }else {
          const lettres = element.split('');
          lettres.forEach((lettre)=>{
              newElements.push(lettre)
          }
          )
        }

      }

    })
    console.log("Notres liste finale : ",newElements);
    return newElements;
  }

  ngAfterViewInit() {
    this.avatar3D = this.avatar3DRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setSize(
      this.avatar3D.clientWidth,
      this.avatar3D.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.avatar3D.appendChild(this.renderer.domElement);

    // this.animate();
  }

  animate() {
    const delta = this.clock.getDelta();
    requestAnimationFrame(() => this.animate());

    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }




}
