import * as THREE from 'three';

/**
 * Fábrica de modelos 3D compostos e reconhecíveis para os 12 tipos de artefatos espaciais.
 * Utiliza geometrias compostas de alta legibilidade visual, materiais metálicos PBR
 * (folha térmica Kapton dourada, titânio, células solares fotovoltaicas com grade, etc.)
 * e marcadores discretos de seleção 3D.
 */

let sharedMaterials = null;

function createSolarGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0c2d6b';
  ctx.fillRect(0, 0, 256, 256);

  // Células solares individuais
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  const cols = 4;
  const rows = 8;
  const cw = 256 / cols;
  const ch = 256 / rows;

  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cw, 0);
    ctx.lineTo(i * cw, 256);
    ctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * ch);
    ctx.lineTo(256, j * ch);
    ctx.stroke();
  }

  // Trilhas prateadas finas
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < cols * 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * (cw / 2), 0);
    ctx.lineTo(i * (cw / 2), 256);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function getMaterials() {
  if (sharedMaterials) return sharedMaterials;

  const solarTex = createSolarGridTexture();

  sharedMaterials = {
    goldFoil: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.78,
      roughness: 0.28,
      emissive: 0x3b2100,
      emissiveIntensity: 0.25
    }),
    titanium: new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.75,
      roughness: 0.32,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2
    }),
    darkMetal: new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.4,
      emissive: 0x0f172a,
      emissiveIntensity: 0.25
    }),
    whiteHull: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.35,
      roughness: 0.45,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2
    }),
    cryoOrange: new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.25,
      roughness: 0.65,
      emissive: 0x3d1a04,
      emissiveIntensity: 0.22
    }),
    solarPanel: new THREE.MeshStandardMaterial({
      map: solarTex,
      color: 0x60a5fa,
      metalness: 0.6,
      roughness: 0.22,
      emissive: 0x0a2463,
      emissiveIntensity: 0.38,
      side: THREE.DoubleSide
    }),
    dishMesh: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.82,
      roughness: 0.25,
      side: THREE.DoubleSide,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2
    }),
    heatShield: new THREE.MeshStandardMaterial({
      color: 0x1e1b18,
      metalness: 0.2,
      roughness: 0.85
    }),
    sensorCyan: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.8,
      roughness: 0.3
    })
  };

  return sharedMaterials;
}

export function createSpaceObjectModel(objData) {
  const m = getMaterials();
  const root = new THREE.Group();
  root.name = objData.id;
  root.userData = { isSpaceObject: true, objectId: objData.id, objectData: objData };

  const meshGroup = new THREE.Group();
  root.add(meshGroup);

  const type = objData.modelType;

  if (type === 'probe') {
    // 1. Sonda Espacial Desativada (corpo octogonal Kapton, antena parabólica grande, boom RTG e magnetômetro)
    const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.85, 8), m.goldFoil);
    meshGroup.add(bus);

    // Antena parabólica de alto ganho no topo
    const dishPoints = [];
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * 1.65;
      const y = 0.45 + (x * x) * 0.28;
      dishPoints.push(new THREE.Vector2(x, y));
    }
    const dishGeo = new THREE.LatheGeometry(dishPoints, 24);
    const dish = new THREE.Mesh(dishGeo, m.dishMesh);
    meshGroup.add(dish);

    // Sub-refletor central e hastes
    const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.95, 12), m.darkMetal);
    feed.position.y = 0.95;
    meshGroup.add(feed);

    const feedTip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), m.sensorCyan);
    feedTip.position.y = 1.45;
    meshGroup.add(feedTip);

    // Boom de magnetômetro longo
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8), m.titanium);
    boom.rotation.z = Math.PI / 2;
    boom.position.set(1.8, -0.1, 0);
    meshGroup.add(boom);

    const magSensor = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), m.goldFoil);
    magSensor.position.set(3.4, -0.1, 0);
    meshGroup.add(magSensor);

    // Gerador Termoelétrico de Radioisótopos (RTG) com aletas
    const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 10), m.darkMetal);
    rtg.rotation.z = -Math.PI / 3;
    rtg.position.set(-1.3, -0.35, 0);
    meshGroup.add(rtg);
  } else if (type === 'comsat') {
    // 2. Satélite de Comunicação Abandonado (bus prismático + 2 grandes asas solares + 2 tambores de antena)
    const bus = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.5, 1.3), m.goldFoil);
    meshGroup.add(bus);

    const upperModule = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.6, 12), m.titanium);
    upperModule.position.y = 1.0;
    meshGroup.add(upperModule);

    // Duas asas longas de painéis solares
    for (const dir of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.8, 8), m.titanium);
      arm.rotation.z = Math.PI / 2;
      arm.position.x = dir * 2.5;
      meshGroup.add(arm);

      const panel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.06, 1.35), m.solarPanel);
      panel.position.x = dir * 2.85;
      panel.rotation.x = 0.35;
      meshGroup.add(panel);
    }

    // Refletores laterais de banda Ka
    for (const zDir of [-1, 1]) {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.12, 0.25, 18, 1, true), m.dishMesh);
      dish.rotation.x = zDir * (Math.PI / 2);
      dish.position.set(0, 0.25, zDir * 0.95);
      meshGroup.add(dish);
    }
  } else if (type === 'lander') {
    // 3. Módulo de Pouso Lunar (base octogonal dourada + 4 pernas com sapatas + cabine de subida)
    const descentStage = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.9, 8), m.goldFoil);
    meshGroup.add(descentStage);

    const ascentStage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 0), m.titanium);
    ascentStage.position.y = 1.05;
    meshGroup.add(ascentStage);

    const viewport = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), m.sensorCyan);
    viewport.position.set(0, 1.15, 0.8);
    meshGroup.add(viewport);

    // Bocal do motor de descida
    const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.7, 16, 1, true), m.darkMetal);
    nozzle.position.y = -0.7;
    meshGroup.add(nozzle);

    // 4 pernas de pouso com sapatas circulares
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const legGroup = new THREE.Group();
      legGroup.rotation.y = angle;

      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 2.1, 8), m.titanium);
      strut.position.set(1.65, -0.55, 0);
      strut.rotation.z = 0.62;
      legGroup.add(strut);

      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.08, 16), m.goldFoil);
      pad.position.set(2.22, -1.32, 0);
      legGroup.add(pad);

      meshGroup.add(legGroup);
    }
  } else if (type === 'tank') {
    // 4. Tanque de Combustível Descartado (cilindro criogênico laranja com domos, anéis e tubulação)
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3.2, 24), m.cryoOrange);
    cylinder.rotation.z = Math.PI / 5;
    meshGroup.add(cylinder);

    const topDome = new THREE.Mesh(new THREE.SphereGeometry(1.09, 24, 16), m.whiteHull);
    topDome.position.set(-Math.sin(Math.PI / 5) * 1.6, Math.cos(Math.PI / 5) * 1.6, 0);
    meshGroup.add(topDome);

    const bottomDome = new THREE.Mesh(new THREE.SphereGeometry(1.09, 24, 16), m. titanium);
    bottomDome.position.set(Math.sin(Math.PI / 5) * 1.6, -Math.cos(Math.PI / 5) * 1.6, 0);
    meshGroup.add(bottomDome);

    // Anéis estruturais externos
    for (const offset of [-0.9, 0, 0.9]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.13, 0.06, 10, 28), m.darkMetal);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = -Math.PI / 5;
      ring.position.set(-Math.sin(Math.PI / 5) * offset, Math.cos(Math.PI / 5) * offset, 0);
      meshGroup.add(ring);
    }
  } else if (type === 'rocket_stage') {
    // 5. Estágio de Foguete (fuselagem branca/metálica, anel interestágio e 2 bocais de motor)
    const stageGroup = new THREE.Group();
    stageGroup.rotation.z = -0.45;

    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 2.8, 24), m.whiteHull);
    stageGroup.add(body);

    const interstage = new THREE.Mesh(new THREE.CylinderGeometry(1.17, 1.17, 0.65, 16, 1, true), m.darkMetal);
    interstage.position.y = 1.45;
    stageGroup.add(interstage);

    const goldBand = new THREE.Mesh(new THREE.CylinderGeometry(1.16, 1.16, 0.35, 24), m.goldFoil);
    goldBand.position.y = -1.1;
    stageGroup.add(goldBand);

    // Duas câmaras de empuxo gêmeas
    for (const xOff of [-0.48, 0.48]) {
      const bell = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.1, 20, 1, true), m.darkMetal);
      bell.position.set(xOff, -1.85, 0);
      stageGroup.add(bell);
    }

    meshGroup.add(stageGroup);
  } else if (type === 'solar_panel') {
    // 6. Painel Solar Desprendido (treliça central + segmentos fotovoltaicos, sendo um inclinado/danificado)
    const spine = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.14, 0.14), m.titanium);
    meshGroup.add(spine);

    const clamp = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.5, 12), m.goldFoil);
    clamp.rotation.z = Math.PI / 2;
    clamp.position.x = -2.4;
    meshGroup.add(clamp);

    for (let i = 0; i < 4; i++) {
      const px = -1.5 + i * 1.05;
      const segA = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 1.45), m.solarPanel);
      segA.position.set(px, 0, 0.9);
      if (i === 3) {
        segA.rotation.z = 0.28;
        segA.rotation.x = -0.18;
      }
      meshGroup.add(segA);

      const segB = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 1.45), m.solarPanel);
      segB.position.set(px, 0, -0.9);
      meshGroup.add(segB);
    }
  } else if (type === 'antenna') {
    // 7. Antena de Comunicação (grande parábola côncava, tripé de sub-refletor e caixa de aviônica)
    const points = [];
    for (let i = 0; i <= 12; i++) {
      const r = (i / 12) * 2.2;
      const y = (r * r) * 0.25;
      points.push(new THREE.Vector2(r, y));
    }
    const dish = new THREE.Mesh(new THREE.LatheGeometry(points, 28), m.dishMesh);
    dish.rotation.x = 0.4;
    meshGroup.add(dish);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.06, 10, 32), m.goldFoil);
    rim.rotation.x = Math.PI / 2 + 0.4;
    rim.position.y = 0.95;
    rim.position.z = 0.45;
    meshGroup.add(rim);

    const feedHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.8, 12), m.titanium);
    feedHorn.rotation.x = 0.4;
    feedHorn.position.set(0, 0.85, 0.35);
    meshGroup.add(feedHorn);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), m.sensorCyan);
    beacon.position.set(0, 1.65, 0.68);
    meshGroup.add(beacon);

    const avionicsBox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.9), m.goldFoil);
    avionicsBox.position.set(0, -0.45, -0.2);
    meshGroup.add(avionicsBox);
  } else if (type === 'capsule') {
    // 8. Cápsula Espacial Desativada (cone estilo Apollo/Orion + escudo térmico ablativo + anel de docagem + janelas)
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 1.75, 1.85, 24), m.whiteHull);
    meshGroup.add(cone);

    const heatShield = new THREE.Mesh(new THREE.SphereGeometry(1.76, 24, 12, 0, Math.PI * 2, Math.PI * 0.62, Math.PI * 0.38), m.heatShield);
    heatShield.position.y = -0.35;
    meshGroup.add(heatShield);

    const dockingRing = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.4, 16), m.titanium);
    dockingRing.position.y = 1.1;
    meshGroup.add(dockingRing);

    // Vigias de observação
    for (const angle of [-0.45, 0.45]) {
      const win = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), m.sensorCyan);
      win.position.set(Math.sin(angle) * 1.18, 0.15, Math.cos(angle) * 1.18);
      meshGroup.add(win);
    }
  } else if (type === 'rover') {
    // 9. Rover Explorador (chassi com deck solar, 6 rodas articuladas e mastro com câmera estéreo)
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 1.3), m.goldFoil);
    meshGroup.add(chassis);

    const solarDeck = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.65), m.solarPanel);
    solarDeck.position.y = 0.32;
    meshGroup.add(solarDeck);

    // Mastro e cabeça óptica PanCam
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.35, 10), m.titanium);
    mast.position.set(0.65, 0.95, 0);
    meshGroup.add(mast);

    const camHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.65), m.whiteHull);
    camHead.position.set(0.65, 1.65, 0);
    meshGroup.add(camHead);

    for (const zEye of [-0.16, 0.16]) {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12), m.sensorCyan);
      lens.rotation.z = Math.PI / 2;
      lens.position.set(0.84, 1.65, zEye);
      meshGroup.add(lens);
    }

    // 6 rodas estilo rocker-bogie
    for (const xPos of [-0.95, 0, 0.95]) {
      for (const zPos of [-0.95, 0.95]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.26, 16), m.darkMetal);
        wheel.rotation.x = Math.PI / 2;
        wheel.position.set(xPos, -0.52, zPos);
        meshGroup.add(wheel);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 10), m.goldFoil);
        hub.rotation.x = Math.PI / 2;
        hub.position.set(xPos, -0.52, zPos);
        meshGroup.add(hub);
      }
    }
  } else if (type === 'orbital_module') {
    // 10. Módulo Orbital (cilindro pressurizado + nó esférico de acoplamento em cruz + radiadores)
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 2.7, 20), m.whiteHull);
    hull.rotation.z = Math.PI / 2;
    meshGroup.add(hull);

    const nodeSphere = new THREE.Mesh(new THREE.SphereGeometry(1.18, 20, 20), m.titanium);
    nodeSphere.position.x = 1.65;
    meshGroup.add(nodeSphere);

    // Portas de acoplamento no nó
    for (const [rx, ry, rz, px, py, pz] of [
      [0, 0, 0, 1.65, 1.35, 0],
      [0, 0, 0, 1.65, -1.35, 0],
      [Math.PI / 2, 0, 0, 1.65, 0, 1.35],
      [Math.PI / 2, 0, 0, 1.65, 0, -1.35]
    ]) {
      const port = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.35, 16), m.darkMetal);
      port.rotation.set(rx, ry, rz);
      port.position.set(px, py, pz);
      meshGroup.add(port);
    }

    // Painéis radiadores térmicos
    for (const zSide of [-1, 1]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 1.8), m.solarPanel);
      panel.position.set(-0.5, 0, zSide * 1.85);
      meshGroup.add(panel);
    }
  } else if (type === 'telescope') {
    // 11. Instrumento Científico / Telescópio Espacial (tubo óptico, tampa defletora aberta, escudo solar)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 2.9, 20), m.titanium);
    barrel.rotation.z = Math.PI / 3;
    meshGroup.add(barrel);

    const aftShroud = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 1.1, 16), m.goldFoil);
    aftShroud.rotation.z = Math.PI / 3;
    aftShroud.position.set(0.95, -0.55, 0);
    meshGroup.add(aftShroud);

    // Espelho primário interno brilhante
    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.88, 0.1, 20), m.sensorCyan);
    mirror.rotation.z = Math.PI / 3;
    mirror.position.set(-1.1, 0.62, 0);
    meshGroup.add(mirror);

    // Tampa de abertura articulada
    const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 18), m.whiteHull);
    flap.position.set(-1.65, 1.55, 0);
    flap.rotation.z = -0.35;
    meshGroup.add(flap);

    // Duas asas solares laterais do observatório
    for (const zDir of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 2.3), m.solarPanel);
      wing.position.set(0, 0, zDir * 2.0);
      meshGroup.add(wing);
    }
  } else {
    // 12. Fragmento de Estação Espacial (treliça metálica octogonal integrada, giroscópios e painel residual)
    const trussMain = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 4.4, 6, 4, true), m.titanium);
    trussMain.rotation.z = Math.PI / 2;
    meshGroup.add(trussMain);

    for (const xPos of [-1.8, -0.6, 0.6, 1.8]) {
      const bulkhead = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.16, 6), m.darkMetal);
      bulkhead.rotation.z = Math.PI / 2;
      bulkhead.position.x = xPos;
      meshGroup.add(bulkhead);
    }

    const gyroModule = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), m.goldFoil);
    gyroModule.position.set(0, 0.45, 0);
    meshGroup.add(gyroModule);

    const brokenWing = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 2.4), m.solarPanel);
    brokenWing.position.set(-1.1, 0.2, 1.5);
    brokenWing.rotation.set(0.25, 0.15, -0.2);
    meshGroup.add(brokenWing);

    const radiator = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.1), m.whiteHull);
    radiator.position.set(1.1, -0.3, -1.2);
    radiator.rotation.x = -0.35;
    meshGroup.add(radiator);
  }

  // Anel orbital discreto de identificação no espaço 3D ao redor do objeto
  const ringGeo = new THREE.RingGeometry(2.7, 2.92, 36);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.42
  });
  const beaconRing = new THREE.Mesh(ringGeo, ringMat);
  beaconRing.rotation.x = Math.PI / 2;
  beaconRing.name = 'beaconRing';
  root.add(beaconRing);

  // Segundo anel externo que aparece com mais intensidade no hover/seleção
  const outerRingGeo = new THREE.RingGeometry(3.25, 3.42, 36);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 2;
  outerRing.name = 'outerRing';
  root.add(outerRing);

  // Esfera de colisão invisível (hitbox generosa para facilitar clique e hover mesmo de longe)
  const hitboxGeo = new THREE.SphereGeometry(4.2, 12, 12);
  const hitboxMat = new THREE.MeshBasicMaterial({
    visible: false
  });
  const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
  hitbox.userData = { isSpaceObjectHitbox: true, objectId: objData.id };
  root.add(hitbox);

  // Marca todas as sub-malhas com o ID do objeto para raycast preciso
  meshGroup.traverse((child) => {
    if (child.isMesh) {
      child.userData = { isSpaceObjectMesh: true, objectId: objData.id };
    }
  });

  const scale = objData.scale || 1.35;
  meshGroup.scale.setScalar(scale);

  root.position.set(objData.position[0], objData.position[1], objData.position[2]);

  return {
    root,
    meshGroup,
    beaconRing,
    outerRing,
    hitbox
  };
}
