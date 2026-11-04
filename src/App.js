import { React, html } from './utils/html.js';
import { SPACE_OBJECTS_DATA } from './data/spaceObjects.js';
import { PLANETS_DATA, SUN_DATA } from './data/solarSystem.js';
import { SolarSystemCanvas } from './three/SolarSystemCanvas.js';
import { Header } from './components/Header.js';
import { LeftSidebar } from './components/LeftSidebar.js';
import { BottomCatalogPanel } from './components/BottomCatalogPanel.js';
import { HelpModal } from './components/HelpModal.js';

const { useState, useMemo, useEffect, useCallback } = React;

export function App() {
  const [selectedObjectId, setSelectedObjectId] = useState(SPACE_OBJECTS_DATA[0].id);
  const [hoveredObjectId, setHoveredObjectId] = useState(null);
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIdentifiers, setShowIdentifiers] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Comando de câmera com timestamp para sempre acionar transição suave mesmo se clicar no mesmo item
  const [cameraCommand, setCameraCommand] = useState({
    type: 'overview',
    id: null,
    ts: Date.now()
  });

  // Filtra objetos por categoria e texto de busca
  const filteredObjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SPACE_OBJECTS_DATA.filter((obj) => {
      const matchesCat = activeCategory === 'all' || obj.category === activeCategory;
      const matchesQuery =
        !q ||
        obj.name.toLowerCase().includes(q) ||
        obj.typeLabel.toLowerCase().includes(q) ||
        obj.mission.toLowerCase().includes(q) ||
        obj.code.toLowerCase().includes(q) ||
        obj.location.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const filteredObjectIds = useMemo(
    () => filteredObjects.map((o) => o.id),
    [filteredObjects]
  );

  // Resultados do dropdown rápido de pesquisa
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SPACE_OBJECTS_DATA.filter(
      (obj) =>
        obj.name.toLowerCase().includes(q) ||
        obj.typeLabel.toLowerCase().includes(q) ||
        obj.mission.toLowerCase().includes(q) ||
        obj.code.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const selectedObject = useMemo(
    () => SPACE_OBJECTS_DATA.find((o) => o.id === selectedObjectId) || null,
    [selectedObjectId]
  );

  const hoveredObject = useMemo(
    () => SPACE_OBJECTS_DATA.find((o) => o.id === hoveredObjectId) || null,
    [hoveredObjectId]
  );

  // Selecionar objeto no mapa 3D ou pelo painel inferior -> aproxima câmera suavemente
  const handleSelectObject = useCallback((objectId) => {
    setSelectedObjectId(objectId);
    setSelectedPlanetId(null);
    setCameraCommand({
      type: 'object',
      id: objectId,
      ts: Date.now()
    });
  }, []);

  // Selecionar resultado da pesquisa -> limpa filtro restritivo se necessário e foca no objeto
  const handleSelectSearchResult = useCallback((objectId) => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedObjectId(objectId);
    setSelectedPlanetId(null);
    setCameraCommand({
      type: 'object',
      id: objectId,
      ts: Date.now()
    });
  }, []);

  // Navegação Anterior / Próximo no painel inferior
  const navigationList = filteredObjects.length > 0 ? filteredObjects : SPACE_OBJECTS_DATA;

  const handlePrevObject = useCallback(() => {
    if (navigationList.length === 0) return;
    const idx = navigationList.findIndex((o) => o.id === selectedObjectId);
    const prevIdx = idx <= 0 ? navigationList.length - 1 : idx - 1;
    handleSelectObject(navigationList[prevIdx].id);
  }, [navigationList, selectedObjectId, handleSelectObject]);

  const handleNextObject = useCallback(() => {
    if (navigationList.length === 0) return;
    const idx = navigationList.findIndex((o) => o.id === selectedObjectId);
    const nextIdx = idx < 0 || idx >= navigationList.length - 1 ? 0 : idx + 1;
    handleSelectObject(navigationList[nextIdx].id);
  }, [navigationList, selectedObjectId, handleSelectObject]);

  // Selecionar planeta no painel esquerdo ou no mapa 3D
  const handleSelectPlanet = useCallback((planetId) => {
    setSelectedPlanetId(planetId);
    setCameraCommand({
      type: 'planet',
      id: planetId,
      ts: Date.now()
    });
  }, []);

  // Retornar à visão geral do Sistema Solar
  const handleResetOverview = useCallback(() => {
    setSelectedPlanetId(null);
    setCameraCommand({
      type: 'overview',
      id: null,
      ts: Date.now()
    });
  }, []);

  // Atalhos de teclado (Setas Esquerda/Direita para navegar objetos, Esc para Visão Geral)
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevObject();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextObject();
      } else if (e.key === 'Escape') {
        if (isHelpOpen) {
          setIsHelpOpen(false);
        } else {
          handleResetOverview();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrevObject, handleNextObject, handleResetOverview, isHelpOpen]);

  const currentCameraTargetLabel = useMemo(() => {
    if (cameraCommand.type === 'overview') {
      return 'Visão Geral do Sistema Solar';
    }
    if (cameraCommand.type === 'planet') {
      if (cameraCommand.id === 'sun') return `Astro em Foco: ${SUN_DATA.name}`;
      const p = PLANETS_DATA.find((x) => x.id === cameraCommand.id);
      return p ? `Planeta em Foco: ${p.name}` : 'Sistema Solar';
    }
    if (cameraCommand.type === 'object' && selectedObject) {
      return `Objeto Selecionado: ${selectedObject.code} — ${selectedObject.name}`;
    }
    return 'Exploração Orbital Livre';
  }, [cameraCommand, selectedObject]);

  return html`
    <div className="space-explorer-app">
      <!-- Ambiente Tridimensional Interativo (Three.js) -->
      <${SolarSystemCanvas}
        objects=${SPACE_OBJECTS_DATA}
        filteredObjectIds=${filteredObjectIds}
        selectedObjectId=${selectedObjectId}
        hoveredObjectId=${hoveredObjectId}
        selectedPlanetId=${selectedPlanetId}
        showIdentifiers=${showIdentifiers}
        cameraCommand=${cameraCommand}
        onSelectObject=${handleSelectObject}
        onHoverObject=${setHoveredObjectId}
        onSelectPlanet=${handleSelectPlanet}
      />

      <!-- Barra Superior Principal -->
      <${Header}
        totalObjectsCount=${SPACE_OBJECTS_DATA.length}
        visibleObjectsCount=${filteredObjects.length}
        searchQuery=${searchQuery}
        onSearchChange=${setSearchQuery}
        activeCategory=${activeCategory}
        onCategoryChange=${setActiveCategory}
        showIdentifiers=${showIdentifiers}
        onToggleIdentifiers=${() => setShowIdentifiers((v) => !v)}
        onResetOverview=${handleResetOverview}
        onOpenHelp=${() => setIsHelpOpen(true)}
        searchResults=${searchResults}
        onSelectSearchResult=${handleSelectSearchResult}
      />

      <!-- Painel Lateral Esquerdo: Planetas e Legenda -->
      <${LeftSidebar}
        selectedPlanetId=${selectedPlanetId}
        onSelectPlanet=${handleSelectPlanet}
        activeCategory=${activeCategory}
        onSelectCategory=${setActiveCategory}
        objects=${SPACE_OBJECTS_DATA}
      />

      <!-- Indicador Flutuante de Status / Hover e Dica Rápida de Controles -->
      <div className="hud-status-pill" aria-live="polite">
        <div className="status-main">
          <span className="status-beacon" />
          <span className="status-text">
            ${hoveredObject
              ? `Em mira: ${hoveredObject.name} (${hoveredObject.typeLabel}) — Clique para aproximar`
              : currentCameraTargetLabel}
          </span>
        </div>
        <div className="status-controls-hint">
          <span>🖱️ Esq: Girar</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
          <span>•</span>
          <span>Dir: Mover</span>
        </div>
      </div>

      <!-- Painel Educativo Inferior (Catálogo Interativo dos 12 Objetos) -->
      <${BottomCatalogPanel}
        objects=${navigationList}
        selectedObject=${selectedObject}
        onSelectObject=${handleSelectObject}
        onPrevObject=${handlePrevObject}
        onNextObject=${handleNextObject}
        onFocusSelectedIn3D=${() => {
          if (selectedObject) handleSelectObject(selectedObject.id);
        }}
      />

      <!-- Modal de Ajuda com Instruções de Navegação -->
      <${HelpModal} isOpen=${isHelpOpen} onClose=${() => setIsHelpOpen(false)} />
    </div>
  `;
}
