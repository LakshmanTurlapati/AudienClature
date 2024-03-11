import { Component, OnInit,AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer, Scene, AmbientLight, DirectionalLight, Color, Fog } from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import countries from '../../assets/files/globe-data-min.json';
import cablesData from '../../assets/files/globe-cables-data.json';





@Component({
  selector: 'app-sphere',
  templateUrl: './sphere.component.html',
  styleUrls: ['./sphere.component.scss']
})
export class SphereComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef;

  private renderer!: WebGLRenderer;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private controls!: OrbitControls;
  private globe: any; 
  private starField!: THREE.Mesh;

  

  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;

  constructor() { }

  ngAfterViewInit() {
    this.init();
    this.initGlobe();
    this.initGlobeCables();
    this.initStarField(); 

    this.animate();
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    if (this.globe) {
      this.scene.remove(this.globe);
    }
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      if ((object as any).geometry) {
        (object as any).geometry.dispose();
      }
      if ((object as any).material) {
        if ((object as any).material instanceof Array) {
          for (const material of (object as any).material) {
            material.dispose();
          }
        } else {
          (object as any).material.dispose();
        }
      }
      this.scene.remove(object);
    }
    this.renderer.dispose(); 
  }
  

  private init(): void {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.globeContainer.nativeElement.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    // this.scene.background = new Color(0x040d21);
    // this.scene.fog = new Fog(0x535ef3, 400, 2000);
    this.scene.add(new AmbientLight(0xbbbbbb, 0.3));

    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.z = 400;
    this.scene.add(this.camera);

    const dLight = new DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    this.camera.add(dLight);

    const dLight1 = new DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    this.camera.add(dLight1);

    const dLight2 = new THREE.PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    this.camera.add(dLight2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // ... rest of the controls setup
  }
  private initGlobe(): void {
    this.globe = new ThreeGlobe()
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(4)
      .hexPolygonMargin(0.6)
      .hexPolygonColor(() => 'rgba(255, 255, 255, 1)') // Set polygons to white
      // .globeImageUrl('./assets/files/clouds.jpg')


      .showAtmosphere(true)
      .atmosphereColor('#FFFFFF')
      .atmosphereAltitude(0.2);
  
    this.globe.rotateY(-Math.PI * (5 / 9));
    this.globe.rotateZ(-Math.PI / 6);
    
  
    this.scene.add(this.globe);
  
    this.camera.position.z = 400;
  
    const light = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(light);
  
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Enable smooth motion
    this.controls.dampingFactor = 0.1; // Damping inertia
    this.controls.enableZoom = true; // Enable zooming
    this.controls.zoomSpeed = 1.0; // Zoom speed
    this.controls.rotateSpeed = 0.7; 
    this.controls.autoRotate = true; 
    this.controls.autoRotateSpeed = 0.5; 
    this.controls.enablePan = true; 
    this.controls.minDistance = 100; 
    this.controls.maxDistance = 500; 
    this.controls.maxPolarAngle = Math.PI ; 
  }
  
  



  private initGlobeCables(): void {
    // Use the cables data with the globe
    if (this.globe && this.globe.someMethodForCables) {
      this.globe.someMethodForCables(cablesData);
    }
  }
  private initStarField(): void {
    // Create the geometry for the stars
    const starsGeometry = new THREE.SphereGeometry(10000, 64, 64);
  
    // Load the star field texture
    const starsTexture = new THREE.TextureLoader().load('./assets/files/stars.jpg');
  
    const starsMaterial = new THREE.MeshBasicMaterial({
      map: starsTexture,
      side: THREE.BackSide, // Render the inside of the sphere
      transparent: true,
    });
  
    this.starField = new THREE.Mesh(starsGeometry, starsMaterial);
    this.scene.add(this.starField);
  }
  
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update(); 
    this.renderer.render(this.scene, this.camera);
  }
  private onWindowResize(): void {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
 
  



}
