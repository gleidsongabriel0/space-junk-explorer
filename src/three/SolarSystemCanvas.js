import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { React, html } from '../utils/html.js';
import { SUN_DATA, PLANETS_DATA, OBJECT_CATEGORIES } from '../data/solarSystem.js';
import {
  createSunTexture,
  createPlanetTextures,
  createSaturnRingTexture,
  createGlowTexture
} from './PlanetTextures.js';
import { createSpaceObjectModel } from './SpaceObjectModels.js';

const { useEffect, useRef, useState, useCallback } = React;

const CATEGORY_COLOR_MAP = OBJECT_CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat.color;
  return acc;
}, {});

export function SolarSystemCanvas({
  objects,
  filteredObjectIds,
  selectedObjectId,
  hoveredObjectId,
  selectedPlanetId,
  showIdentifiers,
  cameraCommand,
  onSelectObject,
  onHoverObject,
  onSelectPlanet
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const objectEntriesRef = useRef(new Map());
  const planetEntriesRef = useRef(new Map());
  const animTargetRef = useRef(null);

  // Coordenadas projetadas em tela para os identificadores 3D interativos
  const [projectedMarkers, setProjectedMarkers] = useState([]);
  const [projectedPlanets, setProjectedPlanets] = useState([]);

  // Refs sincronizadas com estado para uso no loop de animação
  const stateRef = useRef({
    selectedObjectId,
    hoveredObjectId,
    selectedPlanetId,
    showIdentifiers,
    filteredSet: new Set(filteredObjectIds)
  });

  useEffect(() => {
    stateRef.current = {
      selectedObjectId,
      hoveredObjectId,
      selectedPlanetId,
      showIdentifiers,
      filteredSet: new Set(filteredObjectIds)
    };
  }, [selectedObjectId, hoveredObjectId, selectedPlanetId, showIdentifiers, filteredObjectIds]);

  // Função auxiliar para disparar voo suave da câmera
  const flyCameraTo = useCallback((targetPos, cameraPos) => {
    if (!cameraRef.current || !controlsRef.current) return;
    animTargetRef.current = {
      startCam: cameraRef.current.position.clone(),
      startTarget: controlsRef.current.target.clone(),
      endCam: cameraPos.clone(),
      endTarget: targetPos.clone(),
      progress: 0,
      duration: 1.05 // segundos
    };
  }, []);

  // Reage a comandos externos de câmera (Visão Geral, foco em Objeto, foco em Planeta)
  useEffect(() => {
    if (!cameraCommand || !cameraRef.current || !controlsRef.current) return;

    if (cameraCommand.type === 'overview') {
      flyCameraTo(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 185, 345));
    } else if (cameraCommand.type === 'object' && cameraCommand.id) {
      const entry = objectEntriesRef.current.get(cameraCommand.id);
      if (entry) {
        const objPos = entry.root.position.clone();
        // Calcula direção elegante a partir da posição atual ou ângulo radial
        const radialDir = objPos.clone().normalize();
        if (radialDir.lengthSq() < 0.01) radialDir.set(0, 0, 1);
        const sideVec = new THREE.Vector3(-radialDir.z, 0.42, radialDir.x).normalize();
        const camOffset = radialDir.multiplyScalar(6.5).add(sideVec.multiplyScalar(5.8));
        camOffset.y = Math.max(camOffset.y, 3.2);
        flyCameraTo(objPos, objPos.clone().add(camOffset));
      }
    } else if (cameraCommand.type === 'planet' && cameraCommand.id) {
      if (cameraCommand.id === 'sun') {
        flyCameraTo(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 22, 48));
        return;
      }
      const pEntry = planetEntriesRef.current.get(cameraCommand.id);
      if (pEntry) {
        const pPos = pEntry.group.position.clone();
        const dist = pEntry.data.radius * 4.5 + 8;
        const radial = pPos.clone().normalize();
        const camPos = pPos
          .clone()
          .add(new THREE.Vector3(radial.x * dist + dist * 0.45, dist * 0.45, radial.z * dist + dist * 0.45));
        flyCameraTo(pPos, camPos);
      }
    }
  }, [cameraCommand, flyCameraTo]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020611);
    scene.fog = new THREE.FogExp2(0x020611, 0.00045);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 2400);
    camera.position.set(0, 185, 345);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Controles Orbitais (Mouse livre: girar, zoom, deslocamento lateral)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.rotateSpeed = 0.78;
    controls.zoomSpeed = 1.15;
    controls.panSpeed = 0.9;
    controls.minDistance = 3.2;
    controls.maxDistance = 720;
    controls.maxPolarAngle = Math.PI * 0.96;
    controlsRef.current = controls;

    // Interrompe animação automática caso o usuário interaja manualmente com o mouse
    const cancelAutoFlight = () => {
      animTargetRef.current = null;
    };
    renderer.domElement.addEventListener('pointerdown', cancelAutoFlight);
    renderer.domElement.addEventListener('wheel', cancelAutoFlight, { passive: true });

    // 3. Iluminação Espacial Realista + Luz de Preenchimento para Inspeção de Modelos 3D
    const ambientLight = new THREE.AmbientLight(0x3b5278, 1.35);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.PointLight(0xfff3d6, 3.2, 1200, 0.35);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Luz acoplada suavemente à câmera para destacar detalhes metálicos dos objetos inspecionados
    const inspectLight = new THREE.DirectionalLight(0xe0f2fe, 1.15);
    scene.add(inspectLight);

    // 4. Fundo Estelar Multicamadas + Cinturão de Asteroides
    const createStarfield = () => {
      const starCount = 5200;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const palette = [
        new THREE.Color(0xffffff),
        new THREE.Color(0xbae6fd),
        new THREE.Color(0xfef08a),
        new THREE.Color(0x93c5fd),
        new THREE.Color(0xfde68a)
      ];

      for (let i = 0; i < starCount; i++) {
        const r = 460 + Math.random() * 680;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = palette[Math.floor(Math.random() * palette.length)];
        const brightness = 0.65 + Math.random() * 0.35;
        colors[i * 3] = c.r * brightness;
        colors[i * 3 + 1] = c.g * brightness;
        colors[i * 3 + 2] = c.b * brightness;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: 1.55,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
      });

      const stars = new THREE.Points(geo, mat);
      scene.add(stars);
      return stars;
    };
    const starsMesh = createStarfield();

    // Cinturão de Asteroides (entre Marte e Júpiter)
    const createAsteroidBelt = () => {
      const count = 850;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 124 + (Math.random() - 0.5) * 18;
        const y = (Math.random() - 0.5) * 5.5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        const shade = 0.45 + Math.random() * 0.3;
        colors[i * 3] = shade;
        colors[i * 3 + 1] = shade * 0.95;
        colors[i * 3 + 2] = shade * 0.88;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.9,
        vertexColors: true,
        transparent: true,
        opacity: 0.55
      });
      const belt = new THREE.Points(geo, mat);
      scene.add(belt);
      return belt;
    };
    const asteroidBelt = createAsteroidBelt();

    // 5. O Sol
    const sunGroup = new THREE.Group();
    const sunTex = createSunTexture();
    const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(SUN_DATA.radius, 48, 48), sunMat);
    sunMesh.userData = { isPlanetMesh: true, planetId: 'sun' };
    sunGroup.add(sunMesh);

    const sunGlowTex = createGlowTexture(
      'rgba(255, 220, 110, 0.95)',
      'rgba(255, 125, 20, 0.42)',
      'rgba(255, 50, 0, 0)'
    );
    const sunCorona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: sunGlowTex,
        color: 0xffaa33,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    sunCorona.scale.set(SUN_DATA.radius * 4.4, SUN_DATA.radius * 4.4, 1);
    sunGroup.add(sunCorona);
    scene.add(sunGroup);

    // 6. Os Oito Planetas e Suas Órbitas
    planetEntriesRef.current.clear();
    const saturnRingTex = createSaturnRingTexture();
    const moonTex = createPlanetTextures('moon');

    PLANETS_DATA.forEach((pData) => {
      // Linha de órbita
      const orbitPoints = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(
          new THREE.Vector3(Math.cos(theta) * pData.distance, 0, Math.sin(theta) * pData.distance)
        );
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.16
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      scene.add(orbitLine);

      // Grupo do Planeta posicionado na órbita
      const planetGroup = new THREE.Group();
      const px = Math.cos(pData.initialAngle) * pData.distance;
      const pz = Math.sin(pData.initialAngle) * pData.distance;
      planetGroup.position.set(px, 0, pz);

      const { map, bumpMap } = createPlanetTextures(pData.textureType);
      const planetMat = new THREE.MeshStandardMaterial({
        map,
        bumpMap,
        bumpScale: 0.15,
        roughness: 0.72,
        metalness: 0.08
      });
      const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.radius, 40, 40), planetMat);
      planetMesh.rotation.z = pData.tilt || 0;
      planetMesh.userData = { isPlanetMesh: true, planetId: pData.id };
      planetGroup.add(planetMesh);

      // Halo atmosférico sutil
      if (pData.atmosphereColor) {
        const atmoGlow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: createGlowTexture('rgba(255,255,255,0.5)', 'rgba(120,200,255,0.22)', 'rgba(0,0,0,0)'),
            color: new THREE.Color(pData.atmosphereColor),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        atmoGlow.scale.set(pData.radius * 2.55, pData.radius * 2.55, 1);
        planetGroup.add(atmoGlow);
      }

      // Anéis (Saturno e Urano)
      if (pData.hasRings) {
        const ringGeo = new THREE.RingGeometry(pData.ringInnerRadius, pData.ringOuterRadius, 64);
        // Ajusta UV para textura circular em Saturno
        const ringMat =
          pData.id === 'saturn'
            ? new THREE.MeshStandardMaterial({
                map: saturnRingTex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.92,
                roughness: 0.6
              })
            : new THREE.MeshBasicMaterial({
                color: 0x67e8f9,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: pData.ringOpacity || 0.25
              });

        if (pData.id === 'saturn') {
          const pos = ringGeo.attributes.position;
          const uvs = ringGeo.attributes.uv;
          const maxR = pData.ringOuterRadius;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            uvs.setXY(i, vx / (maxR * 2) + 0.5, vy / (maxR * 2) + 0.5);
          }
        }

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2 - 0.32;
        ringMesh.rotation.y = 0.2;
        planetGroup.add(ringMesh);
      }

      // Lua da Terra
      let moonPivot = null;
      if (pData.hasMoon) {
        moonPivot = new THREE.Group();
        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.75, 24, 24),
          new THREE.MeshStandardMaterial({
            map: moonTex.map,
            bumpMap: moonTex.bumpMap,
            bumpScale: 0.12,
            roughness: 0.85
          })
        );
        moonMesh.position.set(6.4, 0.6, 0);
        moonPivot.add(moonMesh);
        planetGroup.add(moonPivot);
      }

      scene.add(planetGroup);
      planetEntriesRef.current.set(pData.id, {
        data: pData,
        group: planetGroup,
        mesh: planetMesh,
        orbitLine,
        moonPivot
      });
    });

    // 7. Os 12 Objetos Espaciais Interativos
    objectEntriesRef.current.clear();
    objects.forEach((objData) => {
      const modelEntry = createSpaceObjectModel(objData);
      scene.add(modelEntry.root);
      objectEntriesRef.current.set(objData.id, {
        ...modelEntry,
        data: objData
      });
    });

    // 8. Raycasting para Hover e Clique Direto no Ambiente 3D
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const getInteractableMeshes = () => {
      const list = [];
      objectEntriesRef.current.forEach((entry, id) => {
        if (stateRef.current.filteredSet.has(id)) {
          list.push(entry.hitbox);
          entry.meshGroup.traverse((c) => {
            if (c.isMesh) list.push(c);
          });
        }
      });
      planetEntriesRef.current.forEach((pEntry) => {
        list.push(pEntry.mesh);
      });
      list.push(sunMesh);
      return list;
    };

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getInteractableMeshes(), false);

      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const objectId = hitObj.userData?.objectId;
        const planetId = hitObj.userData?.planetId;
        if (objectId) {
          renderer.domElement.style.cursor = 'pointer';
          if (stateRef.current.hoveredObjectId !== objectId) {
            onHoverObject(objectId);
          }
          return;
        }
        if (planetId) {
          renderer.domElement.style.cursor = 'pointer';
          if (stateRef.current.hoveredObjectId !== null) {
            onHoverObject(null);
          }
          return;
        }
      }

      renderer.domElement.style.cursor = 'grab';
      if (stateRef.current.hoveredObjectId !== null) {
        onHoverObject(null);
      }
    };

    const handlePointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return; // Foi um arrasto de câmera, não um clique

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getInteractableMeshes(), false);

      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const objectId = hitObj.userData?.objectId;
        const planetId = hitObj.userData?.planetId;
        if (objectId) {
          onSelectObject(objectId);
          return;
        }
        if (planetId) {
          onSelectPlanet(planetId);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // 9. Loop de Animação e Projeção de Coordenadas 3D -> 2D
    let animationFrameId = null;
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      frameCounter++;

      // Atualiza luz direcional acoplada à câmera
      inspectLight.position.copy(camera.position);

      // Rotação suave do Sol, estrelas e cinturão de asteroides
      sunMesh.rotation.y += 0.0012;
      starsMesh.rotation.y += 0.00008;
      asteroidBelt.rotation.y += 0.00025;

      // Rotação dos planetas em seus eixos
      planetEntriesRef.current.forEach((pEntry) => {
        pEntry.mesh.rotation.y += pEntry.data.rotationSpeed;
        if (pEntry.moonPivot) {
          pEntry.moonPivot.rotation.y += 0.008;
        }
      });

      // Animação dos 12 Objetos Espaciais e de seus anéis de destaque 3D
      const { selectedObjectId: selId, hoveredObjectId: hovId, showIdentifiers: showIds, filteredSet } =
        stateRef.current;

      objectEntriesRef.current.forEach((entry, id) => {
        const isVisible = filteredSet.has(id);
        entry.root.visible = isVisible;
        if (!isVisible) return;

        const isSelected = selId === id;
        const isHovered = hovId === id;

        // Rotação lenta de microgravidade no objeto 3D
        entry.meshGroup.rotation.y += 0.0045;
        entry.meshGroup.rotation.x = Math.sin(elapsed * 0.7 + entry.root.position.x) * 0.14;

        // Anel identificador 3D sempre voltado para a câmera (billboard parcial suave)
        entry.beaconRing.lookAt(camera.position);
        entry.outerRing.lookAt(camera.position);

        if (isSelected || isHovered) {
          entry.beaconRing.visible = true;
          entry.outerRing.visible = true;
          const pulse = 1 + Math.sin(elapsed * 4.5) * 0.08;
          entry.beaconRing.scale.setScalar(pulse);
          entry.outerRing.scale.setScalar(1.08 + Math.cos(elapsed * 3.5) * 0.06);
          entry.beaconRing.material.color.setHex(isSelected ? 0x22d3ee : 0x7dd3fc);
          entry.beaconRing.material.opacity = isSelected ? 0.95 : 0.85;
          entry.outerRing.material.opacity = isSelected ? 0.65 : 0.45;
        } else {
          entry.beaconRing.visible = showIds;
          entry.outerRing.visible = false;
          entry.beaconRing.scale.setScalar(1);
          entry.beaconRing.material.color.setHex(0x38bdf8);
          entry.beaconRing.material.opacity = 0.36;
        }
      });

      // Interpolação suave de voo de câmera quando um objeto/planeta é selecionado
      if (animTargetRef.current) {
        const anim = animTargetRef.current;
        anim.progress += dt / anim.duration;
        const t = Math.min(anim.progress, 1);
        // Easing cubic out suave
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(anim.startCam, anim.endCam, ease);
        controls.target.lerpVectors(anim.startTarget, anim.endTarget, ease);

        if (t >= 1) {
          animTargetRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Atualiza projeção 2D dos marcadores já no 1º frame e a cada 2 frames
      if (frameCounter === 1 || frameCounter % 2 === 0) {
        const cw = renderer.domElement.clientWidth || width;
        const ch = renderer.domElement.clientHeight || height;
        const nextMarkers = [];

        objectEntriesRef.current.forEach((entry, id) => {
          if (!filteredSet.has(id)) return;
          tempVec.copy(entry.root.position);
          tempVec.project(camera);

          // Verifica se está na frente da câmera
          if (tempVec.z < 1) {
            const x = (tempVec.x * 0.5 + 0.5) * cw;
            const y = (-(tempVec.y * 0.5) + 0.5) * ch;
            if (x >= -40 && x <= cw + 40 && y >= -40 && y <= ch + 40) {
              const dist = camera.position.distanceTo(entry.root.position);
              nextMarkers.push({
                id,
                code: entry.data.code,
                name: entry.data.name,
                typeLabel: entry.data.typeLabel,
                category: entry.data.category,
                color: CATEGORY_COLOR_MAP[entry.data.category] || '#38bdf8',
                x,
                y,
                dist
              });
            }
          }
        });

        setProjectedMarkers(nextMarkers);

        // Projeção dos rótulos discretos dos planetas
        const nextPlanets = [];
        planetEntriesRef.current.forEach((pEntry, id) => {
          tempVec.copy(pEntry.group.position);
          tempVec.y += pEntry.data.radius + 1.8;
          tempVec.project(camera);
          if (tempVec.z < 1) {
            const x = (tempVec.x * 0.5 + 0.5) * cw;
            const y = (-(tempVec.y * 0.5) + 0.5) * ch;
            if (x >= 0 && x <= cw && y >= 0 && y <= ch) {
              nextPlanets.push({
                id,
                name: pEntry.data.name,
                color: pEntry.data.accentColor,
                x,
                y
              });
            }
          }
        });
        setProjectedPlanets(nextPlanets);
      }
    };

    animate();

    // 10. Responsividade ao redimensionar a janela
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('pointerdown', cancelAutoFlight);
      renderer.domElement.removeEventListener('wheel', cancelAutoFlight);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
    };
  }, [objects]);

  return html`
    <div className="canvas-stage" role="region" aria-label="Mapa Espacial Interativo 3D">
      <div ref=${mountRef} className="three-mount" />

      <!-- Rótulos discretos dos Planetas no espaço 3D -->
      <div className="hud-overlay-layer" aria-hidden="false">
        ${projectedPlanets.map(
          (planet) => html`
            <button
              key=${planet.id}
              type="button"
              className=${`planet-tag-3d ${selectedPlanetId === planet.id ? 'is-active' : ''}`}
              style=${{
                transform: `translate3d(${planet.x}px, ${planet.y}px, 0)`,
                '--planet-accent': planet.color
              }}
              onClick=${() => onSelectPlanet(planet.id)}
              title=${`Aproximar câmera de ${planet.name}`}
            >
              <span className="planet-tag-dot" />
              <span className="planet-tag-name">${planet.name}</span>
            </button>
          `
        )}

        <!-- Identificadores Visuais dos 12 Objetos Espaciais -->
        ${projectedMarkers.map((marker) => {
          const isSelected = selectedObjectId === marker.id;
          const isHovered = hoveredObjectId === marker.id;
          const shouldRender = showIdentifiers || isSelected || isHovered;
          if (!shouldRender) return null;

          return html`
            <button
              key=${marker.id}
              type="button"
              className=${`object-marker-3d ${isSelected ? 'is-selected' : ''} ${
                isHovered ? 'is-hovered' : ''
              }`}
              style=${{
                transform: `translate3d(${marker.x}px, ${marker.y}px, 0)`,
                '--marker-color': marker.color
              }}
              onMouseEnter=${() => onHoverObject(marker.id)}
              onMouseLeave=${() => onHoverObject(null)}
              onClick=${() => onSelectObject(marker.id)}
              aria-label=${`Selecionar ${marker.name} (${marker.typeLabel})`}
            >
              <span className="marker-reticle">
                <span className="marker-core" />
                <span className="marker-ring" />
              </span>
              <span className="marker-Callout">
                <span className="marker-code">${marker.code}</span>
                <span className="marker-title">${marker.name}</span>
                ${(isHovered || isSelected) &&
                html`<span className="marker-subtitle">${marker.typeLabel}</span>`}
              </span>
            </button>
          `;
        })}
      </div>
    </div>
  `;
}
