import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  CharacterNodes,
  createDetectiveCharacter,
  createCompanionMascot,
  createBlueBox,
  createTeacherDesk,
  createStudentDesk,
  createTallBookshelf,
  createCanteenTable,
  createFoodCounter,
  createChalkboard,
  createInteractiveMarker,
  MaterialCache
} from './ProceduralModels';
import { soundEffects } from '../services/soundEffects';
import { MissionId } from '../types/game';

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

export interface InteractiveSpot {
  id: string;
  name: string;
  locationName: string;
  position: THREE.Vector3;
  radius: number;
  missionId: MissionId;
  type: 'task' | 'door' | 'box';
  targetTaskId?: string;
  targetRoom?: string;
  markerObject?: THREE.Group;
}

// Pre-allocated vectors for zero-garbage collection (skill directive)
const _playerPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _camIdealPos = new THREE.Vector3();

export class SchoolGameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;

  private isRunning: boolean = false;
  private frameId: number = 0;
  private isSoftwareGl: boolean = false;

  // Actors
  public character!: CharacterNodes;
  public companion!: THREE.Group;
  public blueBoxMesh!: THREE.Group;

  // Controls & Kinematics
  private moveSpeed: number = 4.8;
  private playerVelocity: THREE.Vector3 = new THREE.Vector3();
  public inputVector: { x: number; y: number } = { x: 0, y: 0 };
  private walkPhase: number = 0;
  private lastStepTime: number = 0;

  // Camera Settings
  private cameraDistance: number = 4.8;
  private cameraHeight: number = 2.8;
  private cameraPitch: number = 0.28;
  public cameraYaw: number = 0;

  // Collision Obstacles
  private collisionBoxes: BoundingBox2D[] = [];

  // Interaction System
  public interactiveSpots: InteractiveSpot[] = [];
  public activeSpot: InteractiveSpot | null = null;
  public onSpotChanged?: (spot: InteractiveSpot | null) => void;
  public onInteractTriggered?: (spot: InteractiveSpot) => void;

  // Active Mission Filtering
  public unlockedMissions: Set<MissionId> = new Set(['tutorial', 'bilik_darjah']);

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Detect Software GL (skill directive)
    this.detectSoftwareGl();

    // 2. Initialize Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance'
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.Fog(0xf1f5f9, 14, 38);

    this.camera = new THREE.PerspectiveCamera(
      52,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      60
    );

    this.clock = new THREE.Clock();

    // 4. Studio Environment & Lighting
    this.setupLightingAndEnvironment();

    // 5. Build School Architecture & Furniture
    this.buildSchoolEnvironment();

    // 6. Spawn Character & Mascot
    this.spawnActors();

    // 7. Setup Input Listeners
    this.setupKeyboardListeners();

    // 8. Handle Resizing
    window.addEventListener('resize', this.handleResize);

    // Start Loop
    this.isRunning = true;
    this.tick();
  }

  private detectSoftwareGl() {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) {
        this.isSoftwareGl = true;
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      this.isSoftwareGl = false;
    }
  }

  private setupLightingAndEnvironment() {
    // RoomEnvironment reflection
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light (Sunlight/Warm Ceiling light)
    const keyLight = new THREE.DirectionalLight(0xfff8eb, 1.4);
    keyLight.position.set(8, 12, 6);
    keyLight.castShadow = !this.isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.camera.left = -16;
      keyLight.shadow.camera.right = 16;
      keyLight.shadow.camera.top = 16;
      keyLight.shadow.camera.bottom = -16;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    // Cool Sky / Warm Ground Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xfef3c7, 0.85);
    hemiLight.position.set(0, 10, 0);
    this.scene.add(hemiLight);

    // Soft Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  // -------------------------------------------------------------
  // SCHOOL ARCHITECTURE & SPATIAL ENVIRONMENT
  // -------------------------------------------------------------
  private buildSchoolEnvironment() {
    // A. Floors (Corridor, Classroom, Canteen, Library)
    // 1. Central Hallway (Z: -16 to 16, X: -2.5 to 2.5)
    const hallFloorGeo = new THREE.PlaneGeometry(5, 32);
    const hallFloor = new THREE.Mesh(hallFloorGeo, MaterialCache.floorHallway);
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.set(0, 0, 0);
    hallFloor.receiveShadow = true;
    this.scene.add(hallFloor);

    // 2. Classroom (Bilik Darjah): Left North (X: -14 to -2.5, Z: -15 to -1)
    const classFloorGeo = new THREE.PlaneGeometry(11.5, 14);
    const classFloor = new THREE.Mesh(classFloorGeo, MaterialCache.floorClassroom);
    classFloor.rotation.x = -Math.PI / 2;
    classFloor.position.set(-8.25, 0.005, -8);
    classFloor.receiveShadow = true;
    this.scene.add(classFloor);

    // 3. Canteen (Kantin): Right North (X: 2.5 to 14, Z: -15 to -1)
    const canteenFloorGeo = new THREE.PlaneGeometry(11.5, 14);
    const canteenFloor = new THREE.Mesh(canteenFloorGeo, MaterialCache.floorCanteen);
    canteenFloor.rotation.x = -Math.PI / 2;
    canteenFloor.position.set(8.25, 0.005, -8);
    canteenFloor.receiveShadow = true;
    this.scene.add(canteenFloor);

    // 4. Library (Perpustakaan): Left South (X: -14 to -2.5, Z: 1 to 15)
    const libFloorGeo = new THREE.PlaneGeometry(11.5, 14);
    const libFloor = new THREE.Mesh(libFloorGeo, MaterialCache.floorLibrary);
    libFloor.rotation.x = -Math.PI / 2;
    libFloor.position.set(-8.25, 0.005, 8);
    libFloor.receiveShadow = true;
    this.scene.add(libFloor);

    // 5. Lobby / School Entrance: Right South (X: 2.5 to 14, Z: 1 to 15)
    const lobbyFloorGeo = new THREE.PlaneGeometry(11.5, 14);
    const lobbyFloor = new THREE.Mesh(lobbyFloorGeo, MaterialCache.floorHallway);
    lobbyFloor.rotation.x = -Math.PI / 2;
    lobbyFloor.position.set(8.25, 0.005, 8);
    lobbyFloor.receiveShadow = true;
    this.scene.add(lobbyFloor);

    // B. Walls & Partition Boundaries
    this.buildWalls();

    // C. Populate Rooms with Furniture & Interactive Clues
    this.populateClassroom();
    this.populateCanteen();
    this.populateLibrary();
    this.populateHallway();
  }

  private addWall(x: number, z: number, width: number, depth: number, height: number = 3.2) {
    const wallGeo = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(wallGeo, MaterialCache.wallMaterial);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.scene.add(wall);

    // Register 2D Collision Box
    this.collisionBoxes.push({
      minX: x - width / 2,
      maxX: x + width / 2,
      minZ: z - depth / 2,
      maxZ: z + depth / 2,
      name: 'Wall'
    });
  }

  private buildWalls() {
    const wallThickness = 0.3;
    const h = 3.0;

    // Outer Perimeters
    // North outer wall
    this.addWall(0, -15.15, 28.5, wallThickness, h);
    // South outer wall
    this.addWall(0, 15.15, 28.5, wallThickness, h);
    // West outer wall
    this.addWall(-14.15, 0, wallThickness, 30.5, h);
    // East outer wall
    this.addWall(14.15, 0, wallThickness, 30.5, h);

    // Corridor Partition Walls with Doorways
    // West Corridor Wall (leaves door gaps at Z = -8 for Classroom, Z = 8 for Library)
    this.addWall(-2.65, -13.0, wallThickness, 4.0, h);
    this.addWall(-2.65, -3.0, wallThickness, 4.0, h);
    this.addWall(-2.65, 0, wallThickness, 2.0, h);
    this.addWall(-2.65, 3.0, wallThickness, 4.0, h);
    this.addWall(-2.65, 13.0, wallThickness, 4.0, h);

    // East Corridor Wall (leaves door gap at Z = -8 for Canteen, Z = 8 for Lobby)
    this.addWall(2.65, -13.0, wallThickness, 4.0, h);
    this.addWall(2.65, -3.0, wallThickness, 4.0, h);
    this.addWall(2.65, 0, wallThickness, 2.0, h);
    this.addWall(2.65, 3.0, wallThickness, 4.0, h);
    this.addWall(2.65, 13.0, wallThickness, 4.0, h);

    // Cross-dividers between rooms
    this.addWall(-8.5, 0, 11.5, wallThickness, h); // Divider between Classroom & Library
    this.addWall(8.5, 0, 11.5, wallThickness, h);  // Divider between Canteen & Lobby
  }

  private populateClassroom() {
    // Chalkboard on North wall
    const board = createChalkboard();
    board.position.set(-8.5, 1.8, -14.9);
    this.scene.add(board);

    // Teacher Desk in front of chalkboard
    const teacherDesk = createTeacherDesk();
    teacherDesk.position.set(-8.5, 0, -13.0);
    this.scene.add(teacherDesk);
    this.collisionBoxes.push({
      minX: -9.6,
      maxX: -7.4,
      minZ: -13.6,
      maxZ: -12.4,
      name: 'TeacherDesk'
    });

    // Student Desks (2 rows of 2)
    const deskCoords = [
      { x: -10.5, z: -9.5, redBook: true },
      { x: -6.5, z: -9.5, redBook: false },
      { x: -10.5, z: -6.0, redBook: false },
      { x: -6.5, z: -6.0, redBook: false }
    ];

    deskCoords.forEach((c) => {
      const sDesk = createStudentDesk(c.redBook);
      sDesk.position.set(c.x, 0, c.z);
      this.scene.add(sDesk);
      this.collisionBoxes.push({
        minX: c.x - 0.6,
        maxX: c.x + 0.6,
        minZ: c.z - 0.45,
        maxZ: c.z + 0.9,
        name: 'StudentDesk'
      });
    });

    // Bookshelf on West wall
    const shelf = createTallBookshelf();
    shelf.position.set(-13.7, 0, -5.5);
    shelf.rotation.y = Math.PI / 2;
    this.scene.add(shelf);
    this.collisionBoxes.push({
      minX: -14.0,
      maxX: -13.0,
      minZ: -6.7,
      maxZ: -4.3,
      name: 'ClassShelf'
    });

    // Interactive Spots in Classroom
    this.registerInteractiveSpot({
      id: 'spot-bd-1',
      name: 'Siasat Meja Murid (Buku Merah)',
      locationName: 'Bilik Darjah',
      position: new THREE.Vector3(-10.5, 0, -9.5),
      radius: 2.2,
      missionId: 'bilik_darjah',
      type: 'task',
      targetTaskId: 'task-bd-1'
    });

    this.registerInteractiveSpot({
      id: 'spot-bd-2',
      name: 'Periksa Meja Guru (Pemadam & Catatan Seni)',
      locationName: 'Bilik Darjah',
      position: new THREE.Vector3(-8.5, 0, -12.2),
      radius: 2.2,
      missionId: 'bilik_darjah',
      type: 'task',
      targetTaskId: 'task-bd-2'
    });

    this.registerInteractiveSpot({
      id: 'spot-bd-3',
      name: 'Periksa Rak Beg & Pensel Warna Ali',
      locationName: 'Bilik Darjah',
      position: new THREE.Vector3(-13.0, 0, -5.5),
      radius: 2.2,
      missionId: 'bilik_darjah',
      type: 'task',
      targetTaskId: 'task-bd-3'
    });
  }

  private populateCanteen() {
    // Food Counter along North wall
    const counter = createFoodCounter();
    counter.position.set(8.5, 0, -13.5);
    this.scene.add(counter);
    this.collisionBoxes.push({
      minX: 5.8,
      maxX: 11.2,
      minZ: -14.2,
      maxZ: -12.8,
      name: 'FoodCounter'
    });

    // Canteen Dining Tables (2 rows)
    const tables = [
      { x: 8.5, z: -9.0 },
      { x: 8.5, z: -5.0 }
    ];

    tables.forEach((t) => {
      const cTable = createCanteenTable();
      cTable.position.set(t.x, 0, t.z);
      this.scene.add(cTable);
      this.collisionBoxes.push({
        minX: t.x - 1.7,
        maxX: t.x + 1.7,
        minZ: t.z - 1.0,
        maxZ: t.z + 1.0,
        name: 'CanteenTable'
      });
    });

    // Canteen Interactive Spots
    this.registerInteractiveSpot({
      id: 'spot-kn-1',
      name: 'Periksa Dulang Kaunter Kantin',
      locationName: 'Kantin',
      position: new THREE.Vector3(8.5, 0, -12.3),
      radius: 2.4,
      missionId: 'kantin',
      type: 'task',
      targetTaskId: 'task-kn-1'
    });

    this.registerInteractiveSpot({
      id: 'spot-kn-2',
      name: 'Papan Kenyataan & Urutan Perjalanan',
      locationName: 'Kantin',
      position: new THREE.Vector3(13.5, 0, -9.0),
      radius: 2.4,
      missionId: 'kantin',
      type: 'task',
      targetTaskId: 'task-kn-2'
    });

    this.registerInteractiveSpot({
      id: 'spot-kn-3',
      name: 'Tanya Saksi Murid di Meja Makan',
      locationName: 'Kantin',
      position: new THREE.Vector3(8.5, 0, -5.0),
      radius: 2.4,
      missionId: 'kantin',
      type: 'task',
      targetTaskId: 'task-kn-3'
    });
  }

  private populateLibrary() {
    // Tall Bookshelves along West & South walls
    const shelf1 = createTallBookshelf();
    shelf1.position.set(-13.7, 0, 5.0);
    shelf1.rotation.y = Math.PI / 2;
    this.scene.add(shelf1);

    const shelf2 = createTallBookshelf();
    shelf2.position.set(-13.7, 0, 9.5);
    shelf2.rotation.y = Math.PI / 2;
    this.scene.add(shelf2);

    this.collisionBoxes.push({
      minX: -14.0,
      maxX: -13.0,
      minZ: 3.5,
      maxZ: 11.0,
      name: 'LibraryShelves'
    });

    // Reading Table in center of Library
    const tableGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 20);
    const tableTop = new THREE.Mesh(tableGeo, MaterialCache.darkWood);
    tableTop.position.set(-8.5, 0.75, 7.5);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.scene.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.75, 12);
    const tableLeg = new THREE.Mesh(legGeo, MaterialCache.metalFrame);
    tableLeg.position.set(-8.5, 0.375, 7.5);
    this.scene.add(tableLeg);

    this.collisionBoxes.push({
      minX: -10.2,
      maxX: -6.8,
      minZ: 5.8,
      maxZ: 9.2,
      name: 'LibraryRoundTable'
    });

    // -------------------------------------------------------------
    // THE MISSING BLUE BOX! Placed beside the bookshelf in the library!
    // -------------------------------------------------------------
    this.blueBoxMesh = createBlueBox();
    this.blueBoxMesh.position.set(-12.8, 0, 11.2);
    this.blueBoxMesh.rotation.y = 0.25;
    this.scene.add(this.blueBoxMesh);

    this.collisionBoxes.push({
      minX: -13.3,
      maxX: -12.3,
      minZ: 10.7,
      maxZ: 11.7,
      name: 'KotakBiru'
    });

    // Interactive spots in Library
    this.registerInteractiveSpot({
      id: 'spot-pp-1',
      name: 'Periksa Buku Cerita di Rak Perpustakaan',
      locationName: 'Perpustakaan',
      position: new THREE.Vector3(-12.5, 0, 5.0),
      radius: 2.2,
      missionId: 'perpustakaan',
      type: 'task',
      targetTaskId: 'task-pp-1'
    });

    this.registerInteractiveSpot({
      id: 'spot-pp-2',
      name: 'Periksa Murid Membaca di Meja Bulat',
      locationName: 'Perpustakaan',
      position: new THREE.Vector3(-8.5, 0, 7.5),
      radius: 2.5,
      missionId: 'perpustakaan',
      type: 'task',
      targetTaskId: 'task-pp-2'
    });

    this.registerInteractiveSpot({
      id: 'spot-pp-3',
      name: 'Siasat Sebelah Rak Buku (Kotak Biru)',
      locationName: 'Perpustakaan',
      position: new THREE.Vector3(-12.5, 0, 11.2),
      radius: 2.4,
      missionId: 'perpustakaan',
      type: 'task',
      targetTaskId: 'task-pp-3'
    });
  }

  private populateHallway() {
    // School Lockers & Signs in Hallway
    // Directional Floor signs
    this.registerInteractiveSpot({
      id: 'spot-door-bd',
      name: 'Pintu Masuk Bilik Darjah',
      locationName: 'Lorong Sekolah',
      position: new THREE.Vector3(-2.65, 0, -8.0),
      radius: 2.0,
      missionId: 'tutorial',
      type: 'door',
      targetRoom: 'Bilik Darjah'
    });

    this.registerInteractiveSpot({
      id: 'spot-door-kn',
      name: 'Pintu Masuk Kantin Sekolah',
      locationName: 'Lorong Sekolah',
      position: new THREE.Vector3(2.65, 0, -8.0),
      radius: 2.0,
      missionId: 'tutorial',
      type: 'door',
      targetRoom: 'Kantin'
    });

    this.registerInteractiveSpot({
      id: 'spot-door-pp',
      name: 'Pintu Masuk Perpustakaan',
      locationName: 'Lorong Sekolah',
      position: new THREE.Vector3(-2.65, 0, 8.0),
      radius: 2.0,
      missionId: 'tutorial',
      type: 'door',
      targetRoom: 'Perpustakaan'
    });
  }

  private registerInteractiveSpot(spot: InteractiveSpot) {
    // Attach 3D interactive marker above ground
    const marker = createInteractiveMarker(
      spot.type === 'door' ? 0x38bdf8 : spot.type === 'box' ? 0x3b82f6 : 0xf59e0b
    );
    marker.position.copy(spot.position);
    this.scene.add(marker);
    spot.markerObject = marker;
    this.interactiveSpots.push(spot);
  }

  // -------------------------------------------------------------
  // ACTORS SPAWNING (Character & Companion Mascot)
  // -------------------------------------------------------------
  private spawnActors() {
    // Spawn Detective at the start of the central hallway
    this.character = createDetectiveCharacter();
    this.character.root.position.set(0, 0, 0);
    this.scene.add(this.character.root);

    // Spawn Companion "Si Kancil" beside the detective
    this.companion = createCompanionMascot();
    this.companion.position.set(0.7, 0, -0.4);
    this.scene.add(this.companion);
  }

  // -------------------------------------------------------------
  // CONTROLS & INPUT
  // -------------------------------------------------------------
  private keysPressed: { [key: string]: boolean } = {};

  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // Prevent default scrolling for game controls
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      this.keysPressed[e.code] = true;

      // Interaction trigger (E or Space)
      if (e.code === 'KeyE' || e.code === 'Space') {
        if (this.activeSpot && this.onInteractTriggered) {
          soundEffects.playInteract();
          this.onInteractTriggered(this.activeSpot);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.code] = false;
    });
  }

  public triggerInteraction() {
    if (this.activeSpot && this.onInteractTriggered) {
      soundEffects.playInteract();
      this.onInteractTriggered(this.activeSpot);
    }
  }

  public teleportToRoom(room: 'hallway' | 'bilik_darjah' | 'kantin' | 'perpustakaan') {
    if (!this.character) return;
    if (room === 'hallway') {
      this.character.root.position.set(0, 0, 0);
    } else if (room === 'bilik_darjah') {
      this.character.root.position.set(-6.5, 0, -8.0);
    } else if (room === 'kantin') {
      this.character.root.position.set(6.5, 0, -8.0);
    } else if (room === 'perpustakaan') {
      this.character.root.position.set(-6.5, 0, 8.0);
    }
    soundEffects.playInteract();
  }

  // -------------------------------------------------------------
  // COLLISION DETECTION (Lightweight, robust 2D box collision with sliding)
  // -------------------------------------------------------------
  private checkCollision(x: number, z: number, radius: number = 0.35): boolean {
    for (let i = 0; i < this.collisionBoxes.length; i++) {
      const box = this.collisionBoxes[i];
      if (
        x + radius > box.minX &&
        x - radius < box.maxX &&
        z + radius > box.minZ &&
        z - radius < box.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  // -------------------------------------------------------------
  // GAME LOOP TICK
  // -------------------------------------------------------------
  private tick = () => {
    if (!this.isRunning) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. Calculate Input Direction
    let dx = 0;
    let dz = 0;

    if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) dz -= 1;
    if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) dz += 1;
    if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) dx -= 1;
    if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) dx += 1;

    // Merge Virtual Touch Joystick
    if (this.inputVector.x !== 0 || this.inputVector.y !== 0) {
      dx = this.inputVector.x;
      dz = -this.inputVector.y;
    }

    const inputLen = Math.sqrt(dx * dx + dz * dz);
    const isMoving = inputLen > 0.05;

    if (isMoving) {
      // Normalize
      dx /= inputLen;
      dz /= inputLen;

      const currentPos = this.character.root.position;
      const step = this.moveSpeed * delta;

      // Sliding collision resolution: test X and Z separately
      const newX = currentPos.x + dx * step;
      const newZ = currentPos.z + dz * step;

      if (!this.checkCollision(newX, currentPos.z)) {
        currentPos.x = newX;
      }
      if (!this.checkCollision(currentPos.x, newZ)) {
        currentPos.z = newZ;
      }

      // Smooth rotation towards movement direction
      const targetAngle = Math.atan2(dx, dz);
      let angleDiff = targetAngle - this.character.root.rotation.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.character.root.rotation.y += angleDiff * Math.min(1, delta * 12);

      // Walk cycle animation
      this.walkPhase += delta * 10;
      this.character.leftLeg.rotation.x = Math.sin(this.walkPhase) * 0.65;
      this.character.rightLeg.rotation.x = -Math.sin(this.walkPhase) * 0.65;
      this.character.leftArm.rotation.x = -Math.sin(this.walkPhase) * 0.45;
      this.character.rightArm.rotation.x = Math.sin(this.walkPhase) * 0.3; // Holding magnifying glass
      this.character.torso.position.y = 0.9 + Math.abs(Math.sin(this.walkPhase * 2)) * 0.04;

      // Footstep sound trigger
      const now = performance.now();
      if (now - this.lastStepTime > 320) {
        soundEffects.playStep();
        this.lastStepTime = now;
      }
    } else {
      // Idle state
      const idleTime = this.clock.getElapsedTime();
      this.character.leftLeg.rotation.x = THREE.MathUtils.damp(this.character.leftLeg.rotation.x, 0, 10, delta);
      this.character.rightLeg.rotation.x = THREE.MathUtils.damp(this.character.rightLeg.rotation.x, 0, 10, delta);
      this.character.leftArm.rotation.x = THREE.MathUtils.damp(this.character.leftArm.rotation.x, 0, 10, delta);
      this.character.rightArm.rotation.x = THREE.MathUtils.damp(this.character.rightArm.rotation.x, 0.2, 10, delta);
      // Gentle breathing bob
      this.character.torso.position.y = 0.9 + Math.sin(idleTime * 2.5) * 0.015;
    }

    // 2. Companion "Si Kancil" Follow AI
    this.updateCompanion(delta);

    // 3. Follow Camera (Silky damping behind character)
    this.updateCamera(delta);

    // 4. Check Proximity to Interactive Spots
    this.updateInteractionChecks();

    // 5. Animate Markers (gentle floating & rotation)
    const time = this.clock.getElapsedTime();
    this.interactiveSpots.forEach((spot) => {
      if (spot.markerObject) {
        spot.markerObject.children[0].rotation.y = time * 1.5;
        spot.markerObject.children[0].position.y = 0.8 + Math.sin(time * 3 + spot.position.x) * 0.08;
      }
    });

    // Render Scene
    this.renderer.render(this.scene, this.camera);

    this.frameId = requestAnimationFrame(this.tick);
  };

  private updateCompanion(delta: number) {
    if (!this.companion || !this.character) return;
    const charPos = this.character.root.position;

    // Follow offset: 0.8m behind and 0.6m to the right
    const followAngle = this.character.root.rotation.y + Math.PI;
    const targetX = charPos.x + Math.sin(followAngle) * 0.9 + Math.cos(followAngle) * 0.5;
    const targetZ = charPos.z + Math.cos(followAngle) * 0.9 - Math.sin(followAngle) * 0.5;

    this.companion.position.x = THREE.MathUtils.damp(this.companion.position.x, targetX, 5, delta);
    this.companion.position.z = THREE.MathUtils.damp(this.companion.position.z, targetZ, 5, delta);

    // Face player
    const compDx = charPos.x - this.companion.position.x;
    const compDz = charPos.z - this.companion.position.z;
    if (Math.abs(compDx) > 0.01 || Math.abs(compDz) > 0.01) {
      const angle = Math.atan2(compDx, compDz);
      this.companion.rotation.y = THREE.MathUtils.damp(this.companion.rotation.y, angle, 6, delta);
    }
  }

  private updateCamera(delta: number) {
    const charPos = this.character.root.position;

    // Target to look at is player's chest/head
    _camTarget.set(charPos.x, charPos.y + 1.2, charPos.z);

    // Ideal camera position behind character based on cameraYaw & pitch
    const backX = Math.sin(this.cameraYaw) * this.cameraDistance;
    const backZ = Math.cos(this.cameraYaw) * this.cameraDistance;

    _camIdealPos.set(
      charPos.x + backX,
      charPos.y + this.cameraHeight,
      charPos.z + backZ
    );

    // Exponential damping to camera position
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _camIdealPos.x, 8, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _camIdealPos.y, 8, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _camIdealPos.z, 8, delta);

    this.camera.lookAt(_camTarget);
  }

  private updateInteractionChecks() {
    const charPos = this.character.root.position;
    let closestSpot: InteractiveSpot | null = null;
    let minDist = Infinity;

    for (let i = 0; i < this.interactiveSpots.length; i++) {
      const spot = this.interactiveSpots[i];
      // Only check spots if their mission is unlocked or if they are doors
      if (spot.type !== 'door' && !this.unlockedMissions.has(spot.missionId)) {
        if (spot.markerObject) spot.markerObject.visible = false;
        continue;
      }
      if (spot.markerObject) spot.markerObject.visible = true;

      const dist = charPos.distanceTo(spot.position);
      if (dist <= spot.radius && dist < minDist) {
        minDist = dist;
        closestSpot = spot;
      }
    }

    if (closestSpot !== this.activeSpot) {
      this.activeSpot = closestSpot;
      if (this.onSpotChanged) {
        this.onSpotChanged(this.activeSpot);
      }
    }
  }

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
