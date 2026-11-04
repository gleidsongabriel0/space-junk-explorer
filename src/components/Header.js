import { html } from '../utils/html.js';
import { OBJECT_CATEGORIES } from '../data/solarSystem.js';

export function Header({
  totalObjectsCount,
  visibleObjectsCount,
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  showIdentifiers,
  onToggleIdentifiers,
  onResetOverview,
  onOpenHelp,
  searchResults,
  onSelectSearchResult
}) {
  return html`
    <header className="top-hud-header" role="banner">
      <!-- Bloco Esquerdo: Identidade do Museu e Propósito -->
      <div className="brand-block">
        <div className="brand-emblem" aria-hidden="true">
          <svg viewBox="0 0 40 40" className="brand-logo-svg">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 3" />
            <ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(-28 20 20)" fill="none" stroke="#22d3ee" strokeWidth="1.6" />
            <circle cx="20" cy="20" r="5.5" fill="#f59e0b" />
            <circle cx="32" cy="13" r="2.6" fill="#38bdf8" />
          </svg>
        </div>
        <div className="brand-copy">
          <div className="brand-title-row">
            <h1 className="brand-title">SPACE JUNK EXPLORER</h1>
            <span className="brand-badge">MUSEU 3D • SIMULAÇÃO</span>
          </div>
          <p className="brand-subtitle">
            Explore em 3D sondas, satélites, módulos e artefatos abandonados por missões pelo Sistema Solar.
          </p>
        </div>
      </div>

      <!-- Bloco Central: Pesquisa, Filtro de Categorias e Contador -->
      <div className="controls-center-block">
        <div className="search-field-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="8.5" cy="8.5" r="5.5" strokeWidth="1.8" />
            <line x1="13" y1="13" x2="17.5" y2="17.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Buscar equipamento ou missão..."
            value=${searchQuery}
            onInput=${(e) => onSearchChange(e.target.value)}
            aria-label="Pesquisar equipamento pelo nome"
          />
          ${searchQuery &&
          html`
            <button
              type="button"
              className="search-clear-btn"
              onClick=${() => onSearchChange('')}
              title="Limpar pesquisa"
            >
              ×
            </button>
          `}

          ${searchQuery.trim().length > 0 &&
          searchResults.length > 0 &&
          html`
            <div className="search-dropdown" role="listbox">
              ${searchResults.map(
                (item) => html`
                  <button
                    key=${item.id}
                    type="button"
                    className="search-dropdown-item"
                    onClick=${() => onSelectSearchResult(item.id)}
                  >
                    <span className="search-item-code">${item.code}</span>
                    <span className="search-item-name">${item.name}</span>
                    <span className="search-item-type">${item.typeLabel}</span>
                  </button>
                `
              )}
            </div>
          `}
        </div>

        <div className="category-pills" role="group" aria-label="Filtrar por categoria de equipamento">
          ${OBJECT_CATEGORIES.map(
            (cat) => html`
              <button
                key=${cat.id}
                type="button"
                className=${`category-pill ${activeCategory === cat.id ? 'is-active' : ''}`}
                style=${{ '--cat-color': cat.color }}
                onClick=${() => onCategoryChange(cat.id)}
                title=${cat.description}
              >
                <span className="category-pill-dot" />
                <span>${cat.shortLabel}</span>
              </button>
            `
          )}
        </div>
      </div>

      <!-- Bloco Direito: Contador, Identificadores, Visão Geral e Ajuda -->
      <div className="hud-actions-block">
        <div className="object-counter-pill" title="Quantidade de objetos visíveis no mapa 3D">
          <span className="counter-pulse" />
          <span className="counter-numbers">${visibleObjectsCount}/${totalObjectsCount}</span>
          <span className="counter-label">Objetos</span>
        </div>

        <button
          type="button"
          className=${`hud-btn ${showIdentifiers ? 'is-toggled' : ''}`}
          onClick=${onToggleIdentifiers}
          title="Ocultar ou exibir os identificadores dos objetos no espaço 3D"
        >
          <svg viewBox="0 0 20 20" className="btn-icon" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10" cy="10" r="3" />
            <path d="M2 10c2.2-4 5-6 8-6s5.8 2 8 6c-2.2 4-5 6-8 6s-5.8-2-8-6z" />
          </svg>
          <span>${showIdentifiers ? 'Marcadores: ON' : 'Marcadores: OFF'}</span>
        </button>

        <button
          type="button"
          className="hud-btn hud-btn-primary"
          onClick=${onResetOverview}
          title="Retornar a câmera para a visão geral do Sistema Solar"
        >
          <svg viewBox="0 0 20 20" className="btn-icon" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10" cy="10" r="7" />
            <ellipse cx="10" cy="10" rx="9" ry="3.5" transform="rotate(-20 10 10)" />
          </svg>
          <span>Visão Geral</span>
        </button>

        <button
          type="button"
          className="hud-btn"
          onClick=${onOpenHelp}
          title="Abrir instruções de navegação 3D"
          aria-label="Instruções de navegação"
        >
          <svg viewBox="0 0 20 20" className="btn-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M7.8 7.8a2.3 2.3 0 1 1 3.1 2.1c-.7.3-1.1.8-1.1 1.6v.4" strokeLinecap="round" />
            <circle cx="10" cy="14.6" r="0.9" fill="currentColor" stroke="none" />
          </svg>
          <span>Ajuda</span>
        </button>
      </div>
    </header>
  `;
}
