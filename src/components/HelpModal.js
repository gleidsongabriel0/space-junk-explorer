import { html } from '../utils/html.js';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return html`
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick=${(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="help-modal-card">
        <div className="help-modal-header">
          <div>
            <span className="sidebar-kicker">MANUAL DE CONTROLE DE VOO</span>
            <h2 id="help-modal-title" className="help-modal-title">
              Como Explorar o Space Junk Explorer 3D
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick=${onClose}
            aria-label="Fechar ajuda"
          >
            ×
          </button>
        </div>

        <div className="help-modal-grid">
          <div className="help-control-box">
            <div className="help-control-icon">🖱️ Botão Esquerdo + Arrastar</div>
            <h3>Girar a Câmera Orbital</h3>
            <p>
              Clique e arraste com o botão esquerdo do mouse em qualquer ponto do espaço para girar o ângulo de visão ao redor do Sistema Solar ou do objeto selecionado.
            </p>
          </div>

          <div className="help-control-box">
            <div className="help-control-icon">🔍 Scroll do Mouse (Roda)</div>
            <h3>Aproximar e Afastar (Zoom)</h3>
            <p>
              Role o scroll para aproximar-se dos detalhes dos modelos 3D (painéis solares, antenas, propulsores) ou afastar-se para ver todas as órbitas planetárias.
            </p>
          </div>

          <div className="help-control-box">
            <div className="help-control-icon">✋ Botão Direito + Arrastar</div>
            <h3>Deslocamento Lateral (Pan)</h3>
            <p>
              Segure o botão direito do mouse (ou Shift + botão esquerdo) e arraste para deslocar livremente o centro de observação da câmera pelo espaço.
            </p>
          </div>

          <div className="help-control-box">
            <div className="help-control-icon">🛰️ Seleção de Objetos e Tour</div>
            <h3>Inspeção 3D e Catálogo Inferior</h3>
            <p>
              Clique em qualquer marcador ou modelo 3D para que a câmera voe suavemente até ele. Use também os botões <strong>Objeto Anterior / Próximo Objeto</strong> (ou as setas <code>←</code> e <code>→</code> do teclado).
            </p>
          </div>
        </div>

        <div className="help-modal-note">
          <strong>Nota Educativa sobre os Dados:</strong> Os 12 equipamentos apresentados nesta demonstração estão identificados como <em>Simulação / Objeto Fictício</em> e representam arquétipos tecnológicos reais da exploração espacial (sondas, estágios superiores, módulos lunares, rovers e satélites).
        </div>

        <div className="help-modal-footer">
          <button type="button" className="start-tour-btn" onClick=${onClose}>
            Entendido, Retornar ao Espaço 3D
          </button>
        </div>
      </div>
    </div>
  `;
}
