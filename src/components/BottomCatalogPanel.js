import { React, html } from '../utils/html.js';
import { ObjectSchematicCard } from './ObjectSchematicCard.js';

const { useState } = React;

export function BottomCatalogPanel({
  objects,
  selectedObject,
  onSelectObject,
  onPrevObject,
  onNextObject,
  onFocusSelectedIn3D
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const currentIndex = selectedObject
    ? objects.findIndex((o) => o.id === selectedObject.id)
    : -1;

  const handleSelectChip = (id) => {
    setIsMinimized(false);
    onSelectObject(id);
  };

  const handlePrev = () => {
    setIsMinimized(false);
    onPrevObject();
  };

  const handleNext = () => {
    setIsMinimized(false);
    onNextObject();
  };

  return html`
    <section
      className=${`bottom-catalog-panel ${isMinimized ? 'is-minimized' : ''} ${
        selectedObject ? 'has-selection' : 'no-selection'
      }`}
      aria-label="Catálogo Educativo de Objetos Espaciais"
    >
      <!-- Barra Superior do Catálogo: Tira dos 12 Objetos + Botões Anterior / Próximo -->
      <div className="catalog-toolbar">
        <div className="catalog-nav-buttons">
          <button
            type="button"
            className="catalog-step-btn"
            onClick=${handlePrev}
            disabled=${objects.length === 0}
            title="Ir para o objeto espacial anterior (Tecla Seta Esquerda)"
          >
            <span className="step-arrow">←</span>
            <span>Objeto Anterior</span>
          </button>

          <div className="catalog-index-indicator">
            <span className="index-label">CATÁLOGO</span>
            <strong className="index-value">
              ${currentIndex >= 0 ? `${currentIndex + 1} / ${objects.length}` : `0 / ${objects.length}`}
            </strong>
          </div>

          <button
            type="button"
            className="catalog-step-btn"
            onClick=${handleNext}
            disabled=${objects.length === 0}
            title="Ir para o próximo objeto espacial (Tecla Seta Direita)"
          >
            <span>Próximo Objeto</span>
            <span className="step-arrow">→</span>
          </button>
        </div>

        <!-- Seletor Rápido dos 12 Objetos -->
        <div className="catalog-chips-strip" role="tablist" aria-label="Lista de equipamentos espaciais">
          ${objects.map((obj, idx) => {
            const isSelected = selectedObject && selectedObject.id === obj.id;
            return html`
              <button
                key=${obj.id}
                type="button"
                role="tab"
                aria-selected=${isSelected}
                className=${`catalog-chip ${isSelected ? 'is-selected' : ''}`}
                onClick=${() => handleSelectChip(obj.id)}
                title=${`${obj.code} — ${obj.name} (${obj.typeLabel})`}
              >
                <span className="chip-num">${String(idx + 1).padStart(2, '0')}</span>
                <span className="chip-name">${obj.name}</span>
              </button>
            `;
          })}
        </div>

        <div className="catalog-toolbar-right">
          ${selectedObject &&
          html`
            <button
              type="button"
              className="catalog-focus-btn"
              onClick=${onFocusSelectedIn3D}
              title="Centralizar câmera novamente no objeto selecionado"
            >
              ⌖ Centralizar 3D
            </button>
          `}

          <button
            type="button"
            className="catalog-minimize-btn"
            onClick=${() => setIsMinimized(!isMinimized)}
            title=${isMinimized ? 'Expandir ficha técnica do objeto' : 'Recolher painel inferior'}
          >
            ${isMinimized ? '▲ Expandir Ficha' : '▼ Recolher'}
          </button>
        </div>
      </div>

      <!-- Conteúdo Detalhado do Objeto Selecionado -->
      ${!isMinimized &&
      (selectedObject
        ? html`
            <div key=${selectedObject.id} className="catalog-detail-body animate-object-transition">
              <!-- Coluna 1: Representação Visual / Esquema Técnico -->
              <div className="catalog-col-visual">
                <${ObjectSchematicCard} object=${selectedObject} />
              </div>

              <!-- Coluna 2: Identificação e Metadados de Missão -->
              <div className="catalog-col-identity">
                <div className="object-header-line">
                  <span className="object-type-pill">${selectedObject.typeLabel}</span>
                  <span className="object-sim-pill">${selectedObject.simulationBadge}</span>
                </div>

                <h2 className="object-main-title">${selectedObject.name}</h2>

                <div className="metadata-grid">
                  <div className="meta-card">
                    <span className="meta-label">MISSÃO ESPACIAL RELACIONADA</span>
                    <strong className="meta-value">${selectedObject.mission}</strong>
                  </div>

                  <div className="meta-card">
                    <span className="meta-label">AGÊNCIA RESPONSÁVEL</span>
                    <strong className="meta-value">${selectedObject.agency}</strong>
                  </div>

                  <div className="meta-card">
                    <span className="meta-label">ANO DE LANÇAMENTO</span>
                    <strong className="meta-value meta-highlight">${selectedObject.launchYear}</strong>
                  </div>

                  <div className="meta-card">
                    <span className="meta-label">LOCALIZAÇÃO ATUAL</span>
                    <strong className="meta-value">${selectedObject.location}</strong>
                  </div>
                </div>
              </div>

              <!-- Coluna 3: Finalidade Original, Motivo do Abandono e Curiosidade -->
              <div className="catalog-col-narrative">
                <div className="narrative-grid">
                  <div className="narrative-block">
                    <h3 className="narrative-heading">
                      <span className="heading-dot dot-cyan" />
                      Finalidade Original do Equipamento
                    </h3>
                    <p className="narrative-text">${selectedObject.purpose}</p>
                  </div>

                  <div className="narrative-block">
                    <h3 className="narrative-heading">
                      <span className="heading-dot dot-amber" />
                      Motivo pelo qual foi Abandonado
                    </h3>
                    <p className="narrative-text">${selectedObject.abandonmentReason}</p>
                  </div>
                </div>

                <div className="curiosity-callout">
                  <div className="curiosity-badge">★ CURIOSIDADE CIENTÍFICA</div>
                  <p className="curiosity-text">${selectedObject.curiosity}</p>
                </div>
              </div>
            </div>
          `
        : html`
            <div className="catalog-empty-prompt">
              <div className="empty-prompt-left">
                <span className="empty-prompt-badge">MODO DE EXPLORAÇÃO LIVRE</span>
                <h3>Selecione um equipamento espacial no mapa 3D ou navegue pelo catálogo acima</h3>
                <p>
                  Clique diretamente sobre qualquer um dos <strong>12 objetos espaciais</strong> espalhados pelo Sistema Solar ou utilize os botões <strong>Objeto Anterior / Próximo Objeto</strong> para iniciar o tour guiado.
                </p>
              </div>
              <button
                type="button"
                className="start-tour-btn"
                onClick=${handleNext}
              >
                Iniciar Tour pelos 12 Objetos →
              </button>
            </div>
          `)}
    </section>
  `;
}
