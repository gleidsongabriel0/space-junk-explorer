import { React, html } from '../utils/html.js';
import { SUN_DATA, PLANETS_DATA, OBJECT_CATEGORIES } from '../data/solarSystem.js';

const { useState } = React;

export function LeftSidebar({
  selectedPlanetId,
  onSelectPlanet,
  activeCategory,
  onSelectCategory,
  objects
}) {
  const [collapsed, setCollapsed] = useState(false);

  const selectedAstro =
    selectedPlanetId === 'sun'
      ? SUN_DATA
      : PLANETS_DATA.find((p) => p.id === selectedPlanetId) || null;

  const legendCategories = OBJECT_CATEGORIES.filter((c) => c.id !== 'all');

  return html`
    <aside
      className=${`left-hud-sidebar ${collapsed ? 'is-collapsed' : ''}`}
      aria-label="Navegação Planetária e Legenda de Objetos"
    >
      <div className="sidebar-header-row">
        <div className="sidebar-heading">
          <span className="sidebar-kicker">TELEMETRIA SOLAR</span>
          <h2 className="sidebar-title">Astros & Planetas</h2>
        </div>
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick=${() => setCollapsed(!collapsed)}
          title=${collapsed ? 'Expandir painel lateral' : 'Recolher painel lateral'}
        >
          ${collapsed ? '»' : '«'}
        </button>
      </div>

      ${!collapsed &&
      html`
        <div className="sidebar-body">
          <!-- Botão do Sol + Lista dos 8 Planetas -->
          <div className="planet-nav-list" role="list">
            <button
              type="button"
              className=${`planet-nav-item ${selectedPlanetId === 'sun' ? 'is-selected' : ''}`}
              onClick=${() => onSelectPlanet('sun')}
            >
              <span
                className="planet-swatch"
                style=${{
                  background: 'radial-gradient(circle at 30% 30%, #fde047, #f59e0b 65%, #ea580c)',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.7)'
                }}
              />
              <span className="planet-nav-info">
                <span className="planet-nav-name">Sol</span>
                <span className="planet-nav-dist">Centro • 0,00 UA</span>
              </span>
              <span className="planet-nav-arrow">↗</span>
            </button>

            ${PLANETS_DATA.map((planet) => {
              const nearbyCount = objects.filter((o) => o.nearbyPlanetId === planet.id).length;
              return html`
                <button
                  key=${planet.id}
                  type="button"
                  className=${`planet-nav-item ${selectedPlanetId === planet.id ? 'is-selected' : ''}`}
                  onClick=${() => onSelectPlanet(planet.id)}
                >
                  <span
                    className="planet-swatch"
                    style=${{
                      background: `radial-gradient(circle at 30% 30%, ${planet.accentColor}, ${planet.color})`,
                      boxShadow: `0 0 8px ${planet.color}66`
                    }}
                  />
                  <span className="planet-nav-info">
                    <span className="planet-nav-name">${planet.name}</span>
                    <span className="planet-nav-dist">${planet.distanceAU}</span>
                  </span>
                  ${nearbyCount > 0 &&
                  html`
                    <span
                      className="planet-junk-count"
                      title=${`${nearbyCount} objeto(s) nas proximidades de ${planet.name}`}
                    >
                      ${nearbyCount}
                    </span>
                  `}
                </button>
              `;
            })}
          </div>

          <!-- Resumo do Planeta / Astro Selecionado -->
          ${selectedAstro &&
          html`
            <div className="selected-planet-box">
              <div className="selected-planet-top">
                <strong>${selectedAstro.name}</strong>
                <span>${selectedAstro.subtitle}</span>
              </div>
              <p className="selected-planet-desc">${selectedAstro.description}</p>
            </div>
          `}

          <!-- Legenda Explicando os Diferentes Tipos de Objetos -->
          <div className="legend-section">
            <div className="sidebar-heading">
              <span className="sidebar-kicker">CLASSIFICAÇÃO</span>
              <h3 className="sidebar-title">Legenda de Artefatos</h3>
            </div>

            <div className="legend-list">
              ${legendCategories.map(
                (cat) => html`
                  <button
                    key=${cat.id}
                    type="button"
                    className=${`legend-item ${activeCategory === cat.id ? 'is-active' : ''}`}
                    onClick=${() =>
                      onSelectCategory(activeCategory === cat.id ? 'all' : cat.id)}
                    title="Clique para filtrar por esta categoria"
                  >
                    <span
                      className="legend-marker-icon"
                      style=${{ '--legend-color': cat.color }}
                    />
                    <div className="legend-copy">
                      <span className="legend-label">${cat.label}</span>
                      <span className="legend-desc">${cat.description}</span>
                    </div>
                  </button>
                `
              )}
            </div>
          </div>
        </div>
      `}
    </aside>
  `;
}
