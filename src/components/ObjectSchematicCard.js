import { html } from '../utils/html.js';

/**
 * Representação visual técnica estilo diagrama de missão espacial (Blueprint/Holograma)
 * exibida no Painel Educativo Inferior para cada um dos 12 tipos de objetos espaciais.
 */

function renderArtworkByType(modelType) {
  switch (modelType) {
    case 'probe':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <ellipse cx="110" cy="64" rx="44" ry="18" fill="rgba(56, 189, 248, 0.12)" />
          <polygon points="82,68 138,68 128,108 92,108" fill="rgba(245, 158, 11, 0.28)" stroke="#f59e0b" />
          <line x1="110" y1="64" x2="110" y2="28" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="110" cy="26" r="5" fill="#22d3ee" />
          <line x1="133" y1="88" x2="196" y2="88" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="196,82 206,88 196,94" fill="#f59e0b" />
          <line x1="87" y1="92" x2="42" y2="118" stroke="#64748b" strokeWidth="3.5" />
        </g>
      `;
    case 'comsat':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="14" y="54" width="66" height="32" rx="2" fill="rgba(37, 99, 235, 0.32)" />
          <line x1="36" y1="54" x2="36" y2="86" opacity="0.5" />
          <line x1="58" y1="54" x2="58" y2="86" opacity="0.5" />
          <rect x="140" y="54" width="66" height="32" rx="2" fill="rgba(37, 99, 235, 0.32)" />
          <line x1="162" y1="54" x2="162" y2="86" opacity="0.5" />
          <line x1="184" y1="54" x2="184" y2="86" opacity="0.5" />
          <line x1="80" y1="70" x2="140" y2="70" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="92" y="46" width="36" height="48" rx="4" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" />
          <circle cx="110" cy="34" r="9" stroke="#e2e8f0" fill="rgba(56,189,248,0.18)" />
        </g>
      `;
    case 'lander':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <polygon points="88,42 132,42 142,68 78,68" fill="rgba(203, 213, 225, 0.22)" stroke="#e2e8f0" />
          <circle cx="110" cy="55" r="7" fill="rgba(34, 211, 238, 0.45)" />
          <rect x="74" y="68" width="72" height="26" rx="3" fill="rgba(245, 158, 11, 0.32)" stroke="#f59e0b" />
          <line x1="78" y1="88" x2="46" y2="118" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="142" y1="88" x2="174" y2="118" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="94" y1="94" x2="76" y2="118" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="126" y1="94" x2="144" y2="118" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="44" cy="120" rx="12" ry="3.5" fill="#f59e0b" />
          <ellipse cx="176" cy="120" rx="12" ry="3.5" fill="#f59e0b" />
        </g>
      `;
    case 'tank':
      return html`
        <g stroke="#f59e0b" strokeWidth="1.6" fill="none">
          <rect x="46" y="46" width="128" height="48" rx="24" fill="rgba(217, 119, 6, 0.32)" />
          <line x1="82" y1="46" x2="82" y2="94" stroke="#e2e8f0" strokeDasharray="3 2" />
          <line x1="112" y1="46" x2="112" y2="94" stroke="#e2e8f0" />
          <line x1="142" y1="46" x2="142" y2="94" stroke="#e2e8f0" strokeDasharray="3 2" />
          <circle cx="68" cy="70" r="6" stroke="#38bdf8" fill="rgba(56, 189, 248, 0.25)" />
        </g>
      `;
    case 'rocket_stage':
      return html`
        <g stroke="#e2e8f0" strokeWidth="1.6" fill="none">
          <rect x="44" y="46" width="106" height="48" rx="4" fill="rgba(226, 232, 240, 0.18)" />
          <rect x="44" y="46" width="22" height="48" fill="rgba(245, 158, 11, 0.32)" stroke="#f59e0b" />
          <polygon points="150,50 182,40 182,66 150,62" fill="rgba(51, 65, 85, 0.65)" stroke="#38bdf8" />
          <polygon points="150,78 182,74 182,100 150,90" fill="rgba(51, 65, 85, 0.65)" stroke="#38bdf8" />
        </g>
      `;
    case 'solar_panel':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.4" fill="none">
          <line x1="20" y1="70" x2="198" y2="70" stroke="#e2e8f0" strokeWidth="3" />
          <rect x="34" y="30" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <rect x="74" y="30" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <rect x="114" y="30" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <polygon points="156,32 190,22 194,54 156,64" fill="rgba(56, 189, 248, 0.25)" stroke="#f59e0b" />
          <rect x="34" y="76" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <rect x="74" y="76" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <rect x="114" y="76" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
          <rect x="154" y="76" width="34" height="34" fill="rgba(37, 99, 235, 0.35)" />
        </g>
      `;
    case 'antenna':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <path d="M 48 86 Q 110 124 172 86" fill="rgba(56, 189, 248, 0.16)" strokeWidth="2.2" />
          <ellipse cx="110" cy="86" rx="62" ry="14" stroke="#e2e8f0" strokeDasharray="4 2" />
          <line x1="110" y1="98" x2="110" y2="34" stroke="#f59e0b" strokeWidth="2.2" />
          <line x1="68" y1="88" x2="110" y2="38" stroke="#94a3b8" />
          <line x1="152" y1="88" x2="110" y2="38" stroke="#94a3b8" />
          <circle cx="110" cy="34" r="6" fill="#22d3ee" />
        </g>
      `;
    case 'capsule':
      return html`
        <g stroke="#e2e8f0" strokeWidth="1.6" fill="none">
          <polygon points="92,32 128,32 166,94 54,94" fill="rgba(226, 232, 240, 0.2)" />
          <path d="M 54 94 Q 110 118 166 94" fill="rgba(245, 158, 11, 0.35)" stroke="#f59e0b" strokeWidth="2" />
          <rect x="96" y="20" width="28" height="12" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" />
          <circle cx="96" cy="64" r="7" fill="rgba(34, 211, 238, 0.45)" stroke="#22d3ee" />
          <circle cx="124" cy="64" r="7" fill="rgba(34, 211, 238, 0.45)" stroke="#22d3ee" />
        </g>
      `;
    case 'rover':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <rect x="58" y="58" width="96" height="28" rx="4" fill="rgba(245, 158, 11, 0.28)" stroke="#f59e0b" />
          <line x1="136" y1="58" x2="136" y2="26" stroke="#e2e8f0" strokeWidth="2.5" />
          <rect x="122" y="18" width="28" height="12" rx="2" fill="rgba(56, 189, 248, 0.35)" />
          <circle cx="66" cy="102" r="13" fill="rgba(30, 41, 59, 0.85)" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="106" cy="102" r="13" fill="rgba(30, 41, 59, 0.85)" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="146" cy="102" r="13" fill="rgba(30, 41, 59, 0.85)" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      `;
    case 'orbital_module':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <rect x="38" y="50" width="96" height="42" rx="8" fill="rgba(226, 232, 240, 0.18)" stroke="#e2e8f0" />
          <circle cx="154" cy="71" r="22" fill="rgba(56, 189, 248, 0.2)" />
          <rect x="146" y="36" width="16" height="12" stroke="#f59e0b" />
          <rect x="146" y="94" width="16" height="12" stroke="#f59e0b" />
          <line x1="84" y1="20" x2="84" y2="122" stroke="#22d3ee" strokeWidth="2.5" />
        </g>
      `;
    case 'telescope':
      return html`
        <g stroke="#38bdf8" strokeWidth="1.6" fill="none">
          <g transform="rotate(-18 110 70)">
            <rect x="52" y="48" width="112" height="42" rx="4" fill="rgba(148, 163, 184, 0.24)" stroke="#e2e8f0" />
            <rect x="132" y="44" width="36" height="50" rx="3" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" />
            <line x1="52" y1="48" x2="28" y2="28" stroke="#22d3ee" strokeWidth="2" />
            <ellipse cx="52" cy="69" rx="6" ry="19" fill="rgba(34, 211, 238, 0.45)" />
          </g>
        </g>
      `;
    default:
      return html`
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="26" y="58" width="168" height="24" fill="rgba(148, 163, 184, 0.16)" stroke="#cbd5e1" />
          <line x1="26" y1="58" x2="68" y2="82" />
          <line x1="68" y1="58" x2="110" y2="82" />
          <line x1="110" y1="58" x2="152" y2="82" />
          <line x1="152" y1="58" x2="194" y2="82" />
          <circle cx="110" cy="44" r="14" fill="rgba(245, 158, 11, 0.32)" stroke="#f59e0b" />
          <polygon points="56,82 88,82 78,120 46,120" fill="rgba(37, 99, 235, 0.3)" />
        </g>
      `;
  }
}

export function ObjectSchematicCard({ object }) {
  if (!object) return null;

  return html`
    <div className="schematic-card">
      <div className="schematic-header">
        <span className="schematic-code">${object.code}</span>
        <span className="schematic-sim-tag">${object.simulationBadge}</span>
      </div>

      <div className="schematic-viewport">
        <svg
          viewBox="0 0 220 140"
          className="schematic-svg"
          role="img"
          aria-label=${`Esquema técnico de ${object.name}`}
        >
          <defs>
            <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(56, 189, 248, 0.1)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="220" height="140" fill="url(#blueprintGrid)" />
          <circle
            cx="110"
            cy="70"
            r="56"
            fill="none"
            stroke="rgba(56, 189, 248, 0.18)"
            strokeDasharray="4 4"
          />
          ${renderArtworkByType(object.modelType)}
        </svg>
      </div>

      <div className="schematic-telemetry">
        <div className="telemetry-item">
          <span className="telemetry-label">MASSA</span>
          <span className="telemetry-val">${object.telemetry?.mass || 'N/D'}</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">DIMENSÕES</span>
          <span className="telemetry-val">${object.telemetry?.dimensions || 'N/D'}</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">VEL. ORBITAL</span>
          <span className="telemetry-val">${object.telemetry?.orbitVelocity || 'N/D'}</span>
        </div>
      </div>
    </div>
  `;
}
