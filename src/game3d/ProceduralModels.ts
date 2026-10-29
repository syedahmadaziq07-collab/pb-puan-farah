import * as THREE from 'three';

// Material cache to prevent redundant allocations and draw call fragmentation
export class MaterialCache {
  static coatMaterial = new THREE.MeshStandardMaterial({
    color: 0x2b4c7e, // Classic deep navy detective coat
    roughness: 0.65,
    metalness: 0.1
  });

  static hatMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e3a5f,
    roughness: 0.6,
    metalness: 0.15
  });

  static ribbonMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Amber ribbon accent
    roughness: 0.4,
    metalness: 0.2
  });

  static skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf6d7b0, // Friendly warm skin tone
    roughness: 0.8,
    metalness: 0.0
  });

  static darkWood = new THREE.MeshStandardMaterial({
    color: 0x5c3d2e,
    roughness: 0.7,
    metalness: 0.05
  });

  static lightWood = new THREE.MeshStandardMaterial({
    color: 0xb58a63,
    roughness: 0.6,
    metalness: 0.05
  });

  static blueBoxMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8, // Vibrant blue box for "Kotak Biru"
    roughness: 0.35,
    metalness: 0.2
  });

  static goldLatchMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.25,
    metalness: 0.8
  });

  static chalkboardMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e392a, // Deep school green
    roughness: 0.9,
    metalness: 0.0
  });

  static wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9, // Light cream/slate school interior
    roughness: 0.85,
    metalness: 0.0
  });

  static floorHallway = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.3,
    metalness: 0.1
  });

  static floorClassroom = new THREE.MeshStandardMaterial({
    color: 0xd4a373, // Parquet wood classroom
    roughness: 0.5,
    metalness: 0.05
  });

  static floorCanteen = new THREE.MeshStandardMaterial({
    color: 0xfef3c7, // Warm canteen tile
    roughness: 0.4,
    metalness: 0.1
  });

  static floorLibrary = new THREE.MeshStandardMaterial({
    color: 0x0f766e, // Calming teal library carpet
    roughness: 0.95,
    metalness: 0.0
  });

  static metalFrame = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.7
  });

  static companionMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Warm fawn/deer tone
    roughness: 0.7,
    metalness: 0.05
  });

  static whiteAccents = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.0
  });
}

// -------------------------------------------------------------
// 1. DETECTIVE CHARACTER (3-12 parts composite model)
// -------------------------------------------------------------
export interface CharacterNodes {
  root: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  magnifyingGlass: THREE.Group;
}

export function createDetectiveCharacter(): CharacterNodes {
  const root = new THREE.Group();
  root.name = 'DetectiveCharacter';

  // Torso / Trench Coat (Primary silhouette)
  const torsoGeo = new THREE.CylinderGeometry(0.28, 0.36, 0.8, 10);
  const torso = new THREE.Mesh(torsoGeo, MaterialCache.coatMaterial);
  torso.position.y = 0.9;
  torso.castShadow = true;
  root.add(torso);

  // Belt & Buckle
  const beltGeo = new THREE.CylinderGeometry(0.32, 0.33, 0.08, 10);
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.5 });
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.y = 0.82;
  root.add(belt);

  const buckleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
  const buckle = new THREE.Mesh(buckleGeo, MaterialCache.goldLatchMaterial);
  buckle.position.set(0, 0.82, 0.33);
  root.add(buckle);

  // Head Group
  const head = new THREE.Group();
  head.position.y = 1.45;

  // Head sphere
  const headGeo = new THREE.SphereGeometry(0.22, 16, 14);
  const headMesh = new THREE.Mesh(headGeo, MaterialCache.skinMaterial);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Detective Eyes
  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.08, 0.04, 0.19);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.08, 0.04, 0.19);
  head.add(leftEye, rightEye);

  // Detective Fedora Hat (Crown + Brim + Ribbon)
  const hatGroup = new THREE.Group();
  hatGroup.position.y = 0.16;

  // Brim
  const brimGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.03, 16);
  const brim = new THREE.Mesh(brimGeo, MaterialCache.hatMaterial);
  brim.castShadow = true;
  hatGroup.add(brim);

  // Crown
  const crownGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.28, 14);
  const crown = new THREE.Mesh(crownGeo, MaterialCache.hatMaterial);
  crown.position.y = 0.14;
  crown.castShadow = true;
  hatGroup.add(crown);

  // Ribbon
  const ribbonGeo = new THREE.CylinderGeometry(0.252, 0.255, 0.06, 14);
  const ribbon = new THREE.Mesh(ribbonGeo, MaterialCache.ribbonMaterial);
  ribbon.position.y = 0.04;
  hatGroup.add(ribbon);

  head.add(hatGroup);
  root.add(head);

  // Left Arm (Shoulder pivot)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.38, 1.2, 0);
  const armGeo = new THREE.CapsuleGeometry(0.09, 0.45, 6, 8);
  const leftArmMesh = new THREE.Mesh(armGeo, MaterialCache.coatMaterial);
  leftArmMesh.position.y = -0.22;
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);

  // Left hand
  const handGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const leftHand = new THREE.Mesh(handGeo, MaterialCache.skinMaterial);
  leftHand.position.y = -0.46;
  leftArm.add(leftHand);
  root.add(leftArm);

  // Right Arm (Holding magnifying glass)
  const rightArm = new THREE.Group();
  rightArm.position.set(0.38, 1.2, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, MaterialCache.coatMaterial);
  rightArmMesh.position.y = -0.22;
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);

  const rightHand = new THREE.Mesh(handGeo, MaterialCache.skinMaterial);
  rightHand.position.y = -0.46;
  rightArm.add(rightHand);

  // Magnifying Glass
  const magnifyingGlass = new THREE.Group();
  magnifyingGlass.position.set(0, -0.46, 0.15);
  magnifyingGlass.rotation.x = Math.PI / 4;

  const handleGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.24, 8);
  const handle = new THREE.Mesh(handleGeo, MaterialCache.darkWood);
  handle.position.y = -0.1;
  magnifyingGlass.add(handle);

  const rimGeo = new THREE.TorusGeometry(0.09, 0.015, 8, 16);
  const rim = new THREE.Mesh(rimGeo, MaterialCache.goldLatchMaterial);
  rim.position.y = 0.05;
  magnifyingGlass.add(rim);

  const lensGeo = new THREE.CircleGeometry(0.08, 16);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    metalness: 0.1
  });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.y = 0.05;
  magnifyingGlass.add(lens);

  rightArm.add(magnifyingGlass);
  root.add(rightArm);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, 0.55, 0);
  const legGeo = new THREE.CapsuleGeometry(0.09, 0.42, 6, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 });
  const leftLegMesh = new THREE.Mesh(legGeo, legMat);
  leftLegMesh.position.y = -0.22;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);

  // Left shoe
  const shoeGeo = new THREE.BoxGeometry(0.14, 0.08, 0.22);
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(0, -0.48, 0.04);
  leftShoe.castShadow = true;
  leftLeg.add(leftShoe);
  root.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, 0.55, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, legMat);
  rightLegMesh.position.y = -0.22;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);

  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(0, -0.48, 0.04);
  rightShoe.castShadow = true;
  rightLeg.add(rightShoe);
  root.add(rightLeg);

  // Contact shadow under character
  const shadowGeo = new THREE.CircleGeometry(0.42, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.25
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  root.add(shadow);

  return { root, torso, head, leftArm, rightArm, leftLeg, rightLeg, magnifyingGlass };
}

// -------------------------------------------------------------
// 2. COMPANION MASCOT ("Si Kancil" - Friendly encouragement)
// -------------------------------------------------------------
export function createCompanionMascot(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'CompanionMascot';

  // Body
  const bodyGeo = new THREE.CapsuleGeometry(0.16, 0.25, 6, 8);
  const body = new THREE.Mesh(bodyGeo, MaterialCache.companionMaterial);
  body.position.y = 0.35;
  body.castShadow = true;
  root.add(body);

  // White chest
  const chestGeo = new THREE.SphereGeometry(0.13, 8, 8);
  const chest = new THREE.Mesh(chestGeo, MaterialCache.whiteAccents);
  chest.position.set(0, 0.35, 0.1);
  chest.scale.set(0.8, 1, 0.4);
  root.add(chest);

  // Head
  const headGeo = new THREE.SphereGeometry(0.16, 12, 10);
  const head = new THREE.Mesh(headGeo, MaterialCache.companionMaterial);
  head.position.set(0, 0.58, 0.1);
  head.castShadow = true;

  // Snout
  const snoutGeo = new THREE.ConeGeometry(0.08, 0.14, 8);
  const snout = new THREE.Mesh(snoutGeo, MaterialCache.whiteAccents);
  snout.position.set(0, 0.54, 0.24);
  snout.rotation.x = Math.PI / 2;
  root.add(snout);

  // Black nose
  const noseGeo = new THREE.SphereGeometry(0.03, 6, 6);
  const nose = new THREE.Mesh(noseGeo, new THREE.MeshBasicMaterial({ color: 0x111827 }));
  nose.position.set(0, 0.54, 0.31);
  root.add(nose);

  // Friendly big eyes
  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
  const lEye = new THREE.Mesh(eyeGeo, eyeMat);
  lEye.position.set(-0.08, 0.62, 0.22);
  const rEye = new THREE.Mesh(eyeGeo, eyeMat);
  rEye.position.set(0.08, 0.62, 0.22);
  root.add(lEye, rEye);

  // Ears
  const earGeo = new THREE.ConeGeometry(0.06, 0.16, 6);
  const lEar = new THREE.Mesh(earGeo, MaterialCache.companionMaterial);
  lEar.position.set(-0.1, 0.76, 0.05);
  lEar.rotation.z = -0.25;
  const rEar = new THREE.Mesh(earGeo, MaterialCache.companionMaterial);
  rEar.position.set(0.1, 0.76, 0.05);
  rEar.rotation.z = 0.25;
  root.add(lEar, rEar);

  root.add(head);

  // Mini detective badge on neck ribbon
  const ribbonGeo = new THREE.TorusGeometry(0.14, 0.015, 6, 12);
  const ribbon = new THREE.Mesh(ribbonGeo, MaterialCache.ribbonMaterial);
  ribbon.position.set(0, 0.48, 0.05);
  ribbon.rotation.x = Math.PI / 2;
  root.add(ribbon);

  // Contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.25, 12);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  root.add(shadow);

  root.scale.set(0.75, 0.75, 0.75);
  return root;
}

// -------------------------------------------------------------
// 3. THE MYSTERY "KOTAK BIRU" (The missing blue box with art supplies)
// -------------------------------------------------------------
export function createBlueBox(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'KotakBiru';

  // Blue Box base
  const boxGeo = new THREE.BoxGeometry(0.8, 0.48, 0.55);
  const box = new THREE.Mesh(boxGeo, MaterialCache.blueBoxMaterial);
  box.position.y = 0.24;
  box.castShadow = true;
  box.receiveShadow = true;
  group.add(box);

  // Box lid
  const lidGeo = new THREE.BoxGeometry(0.84, 0.08, 0.58);
  const lid = new THREE.Mesh(lidGeo, MaterialCache.blueBoxMaterial);
  lid.position.y = 0.51;
  lid.castShadow = true;
  group.add(lid);

  // Gold Latches
  const latchGeo = new THREE.BoxGeometry(0.08, 0.1, 0.03);
  const latch1 = new THREE.Mesh(latchGeo, MaterialCache.goldLatchMaterial);
  latch1.position.set(-0.2, 0.38, 0.285);
  const latch2 = new THREE.Mesh(latchGeo, MaterialCache.goldLatchMaterial);
  latch2.position.set(0.2, 0.38, 0.285);
  group.add(latch1, latch2);

  // Label: "ALATAN SENI" (Art materials tag)
  const tagGeo = new THREE.PlaneGeometry(0.3, 0.15);
  const tagMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tag = new THREE.Mesh(tagGeo, tagMat);
  tag.position.set(0, 0.32, 0.28);
  group.add(tag);

  // Golden handle on top
  const handleGeo = new THREE.TorusGeometry(0.1, 0.02, 6, 12, Math.PI);
  const handle = new THREE.Mesh(handleGeo, MaterialCache.goldLatchMaterial);
  handle.position.set(0, 0.55, 0);
  handle.rotation.z = Math.PI;
  group.add(handle);

  return group;
}

// -------------------------------------------------------------
// 4. FURNITURE & PROPS BUILDERS
// -------------------------------------------------------------
export function createTeacherDesk(): THREE.Group {
  const desk = new THREE.Group();
  // Tabletop
  const topGeo = new THREE.BoxGeometry(2.0, 0.08, 1.1);
  const top = new THREE.Mesh(topGeo, MaterialCache.darkWood);
  top.position.y = 0.85;
  top.castShadow = true;
  top.receiveShadow = true;
  desk.add(top);

  // Pedestal drawers (left and right)
  const sideGeo = new THREE.BoxGeometry(0.5, 0.8, 0.95);
  const leftPedestal = new THREE.Mesh(sideGeo, MaterialCache.lightWood);
  leftPedestal.position.set(-0.7, 0.4, 0);
  leftPedestal.castShadow = true;
  leftPedestal.receiveShadow = true;

  const rightPedestal = new THREE.Mesh(sideGeo, MaterialCache.lightWood);
  rightPedestal.position.set(0.7, 0.4, 0);
  rightPedestal.castShadow = true;
  rightPedestal.receiveShadow = true;

  desk.add(leftPedestal, rightPedestal);

  // Stack of papers and pen holder on top
  const paperGeo = new THREE.BoxGeometry(0.35, 0.05, 0.25);
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const paper = new THREE.Mesh(paperGeo, paperMat);
  paper.position.set(-0.4, 0.91, 0.1);
  paper.castShadow = true;
  desk.add(paper);

  return desk;
}

export function createStudentDesk(hasRedBookUnder: boolean = false): THREE.Group {
  const group = new THREE.Group();

  // Desktop
  const topGeo = new THREE.BoxGeometry(1.0, 0.05, 0.65);
  const top = new THREE.Mesh(topGeo, MaterialCache.lightWood);
  top.position.y = 0.7;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
  const legPositions = [
    [-0.44, 0.35, -0.26],
    [0.44, 0.35, -0.26],
    [-0.44, 0.35, 0.26],
    [0.44, 0.35, 0.26]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, MaterialCache.metalFrame);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    group.add(leg);
  });

  // Chair behind desk
  const chair = new THREE.Group();
  chair.position.set(0, 0, 0.55);
  const seatGeo = new THREE.BoxGeometry(0.45, 0.04, 0.45);
  const seat = new THREE.Mesh(seatGeo, MaterialCache.lightWood);
  seat.position.y = 0.45;
  seat.castShadow = true;
  chair.add(seat);

  const backGeo = new THREE.BoxGeometry(0.45, 0.35, 0.04);
  const back = new THREE.Mesh(backGeo, MaterialCache.lightWood);
  back.position.set(0, 0.72, 0.2);
  back.castShadow = true;
  chair.add(back);

  // Chair legs
  const chairLegGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8);
  [
    [-0.18, 0.225, -0.18],
    [0.18, 0.225, -0.18],
    [-0.18, 0.225, 0.18],
    [0.18, 0.225, 0.18]
  ].forEach(([x, y, z]) => {
    const cLeg = new THREE.Mesh(chairLegGeo, MaterialCache.metalFrame);
    cLeg.position.set(x, y, z);
    cLeg.castShadow = true;
    chair.add(cLeg);
  });
  group.add(chair);

  // If this desk has the red book underneath (Mission 1 task)
  if (hasRedBookUnder) {
    const bookGeo = new THREE.BoxGeometry(0.3, 0.06, 0.22);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const redBook = new THREE.Mesh(bookGeo, redMat);
    redBook.position.set(0.1, 0.03, 0.0);
    redBook.rotation.y = 0.3;
    redBook.castShadow = true;
    group.add(redBook);
  }

  return group;
}

export function createTallBookshelf(): THREE.Group {
  const shelf = new THREE.Group();

  // Frame
  const frameGeo = new THREE.BoxGeometry(2.2, 2.8, 0.55);
  const frame = new THREE.Mesh(frameGeo, MaterialCache.darkWood);
  frame.position.y = 1.4;
  frame.castShadow = true;
  frame.receiveShadow = true;
  shelf.add(frame);

  // 4 Shelves inside
  const innerMat = MaterialCache.lightWood;
  const bookColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899];

  for (let r = 0; r < 4; r++) {
    const shelfY = 0.4 + r * 0.65;
    // Row of books
    for (let b = 0; b < 10; b++) {
      const bHeight = 0.35 + Math.random() * 0.15;
      const bThick = 0.08 + Math.random() * 0.05;
      const bColor = bookColors[Math.floor(Math.random() * bookColors.length)];
      const bookGeo = new THREE.BoxGeometry(bThick, bHeight, 0.35);
      const bookMat = new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.6 });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(-0.85 + b * 0.18, shelfY + bHeight / 2, 0.05);
      book.castShadow = true;
      shelf.add(book);
    }
  }

  return shelf;
}

export function createCanteenTable(): THREE.Group {
  const table = new THREE.Group();

  // Long Tabletop
  const topGeo = new THREE.BoxGeometry(3.2, 0.08, 1.0);
  const topMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 0.8;
  top.castShadow = true;
  top.receiveShadow = true;
  table.add(top);

  // Legs & Bench on both sides
  const frameGeo = new THREE.BoxGeometry(0.08, 0.8, 1.8);
  const leftSupport = new THREE.Mesh(frameGeo, MaterialCache.metalFrame);
  leftSupport.position.set(-1.2, 0.4, 0);
  const rightSupport = new THREE.Mesh(frameGeo, MaterialCache.metalFrame);
  rightSupport.position.set(1.2, 0.4, 0);
  table.add(leftSupport, rightSupport);

  // Benches
  const benchGeo = new THREE.BoxGeometry(3.2, 0.06, 0.35);
  const benchMat = MaterialCache.lightWood;
  const frontBench = new THREE.Mesh(benchGeo, benchMat);
  frontBench.position.set(0, 0.45, 0.75);
  frontBench.castShadow = true;
  const backBench = new THREE.Mesh(benchGeo, benchMat);
  backBench.position.set(0, 0.45, -0.75);
  backBench.castShadow = true;
  table.add(frontBench, backBench);

  // Meal Tray on top
  const trayGeo = new THREE.BoxGeometry(0.5, 0.03, 0.35);
  const trayMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
  const tray = new THREE.Mesh(trayGeo, trayMat);
  tray.position.set(0.3, 0.85, 0.0);
  tray.castShadow = true;
  table.add(tray);

  return table;
}

export function createFoodCounter(): THREE.Group {
  const counter = new THREE.Group();

  // Base Counter
  const baseGeo = new THREE.BoxGeometry(5.0, 0.95, 1.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.475;
  base.castShadow = true;
  base.receiveShadow = true;
  counter.add(base);

  // Countertop
  const topGeo = new THREE.BoxGeometry(5.2, 0.08, 1.3);
  const topMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.5 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.y = 0.99;
  top.castShadow = true;
  counter.add(top);

  // Food Trays on display
  for (let i = 0; i < 3; i++) {
    const foodTrayGeo = new THREE.BoxGeometry(0.7, 0.08, 0.5);
    const foodTray = new THREE.Mesh(foodTrayGeo, MaterialCache.metalFrame);
    foodTray.position.set(-1.5 + i * 1.5, 1.07, 0.0);
    foodTray.castShadow = true;
    counter.add(foodTray);
  }

  return counter;
}

export function createChalkboard(): THREE.Group {
  const board = new THREE.Group();

  // Wooden border
  const frameGeo = new THREE.BoxGeometry(4.2, 2.2, 0.08);
  const frame = new THREE.Mesh(frameGeo, MaterialCache.darkWood);
  frame.castShadow = true;
  board.add(frame);

  // Board surface
  const surfaceGeo = new THREE.PlaneGeometry(4.0, 2.0);
  const surface = new THREE.Mesh(surfaceGeo, MaterialCache.chalkboardMaterial);
  surface.position.z = 0.045;
  board.add(surface);

  // Chalk shelf at bottom
  const shelfGeo = new THREE.BoxGeometry(4.0, 0.04, 0.15);
  const shelf = new THREE.Mesh(shelfGeo, MaterialCache.darkWood);
  shelf.position.set(0, -1.02, 0.08);
  board.add(shelf);

  return board;
}

// Glowing Interactive Marker (Station indicator in 3D world)
export function createInteractiveMarker(color: number = 0xf59e0b): THREE.Group {
  const group = new THREE.Group();
  group.name = 'InteractiveMarker';

  // Floating diamond/star
  const diamondGeo = new THREE.OctahedronGeometry(0.24, 0);
  const diamondMat = new THREE.MeshBasicMaterial({
    color: color,
    wireframe: false
  });
  const diamond = new THREE.Mesh(diamondGeo, diamondMat);
  diamond.position.y = 0.8;
  group.add(diamond);

  // Outer pulse ring on floor
  const ringGeo = new THREE.RingGeometry(0.4, 0.5, 16);
  const ringMat = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  group.add(ring);

  return group;
}
