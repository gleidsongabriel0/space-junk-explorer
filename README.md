# 🛰️ Space Junk Explorer — Museu Interativo do Espaço (3D)

O **Space Junk Explorer** é um museu espacial interativo e educativo em 3D desenvolvido com **Three.js** e **React**. O projeto permite navegar livremente pelo Sistema Solar, explorar planetas, órbitas e descobrir detalhes históricos e técnicos sobre 12 equipamentos e artefatos espaciais abandonados pela humanidade no espaço.

---

## 🌟 Funcionalidades Principais

- **Ambiente Solar em 3D Real:**
  - O Sol e os 8 planetas (Mercúrio, Vênus, Terra com a Lua, Marte, Júpiter, Saturno com anéis e Divisão de Cassini, Urano e Netuno).
  - Texturas procedurais e iluminação realista com relevo (*bump maps*) e halos atmosféricos.
  - Órbitas planetárias, campo estelar profundo e cinturão de asteroides.
- **Movimentação Livre de Câmera (OrbitControls):**
  - **Botão Esquerdo + Arrastar:** Girar a visão em 360°.
  - **Scroll do Mouse:** Aproximar e afastar (*zoom in / zoom out*).
  - **Botão Direito + Arrastar (ou Shift + Esquerdo):** Deslocamento lateral (*pan*).
- **12 Objetos Espaciais Detalhados:**
  - Modelos 3D compostos (sondas desativadas, módulos lunares, satélites de comunicação, estágios de foguetes, painéis solares, rovers marcianos, telescópios orbitais, etc.).
  - Efeito hover com identificação e anéis de seleção no espaço tridimensional.
  - Clique em qualquer objeto para voo suave e aproximação automática da câmera.
- **Painel Educativo Inferior (Catálogo):**
  - Esquema técnico em vetor (Blueprint/SVG) e telemetria (massa, dimensões, velocidade orbital).
  - Metadados completos: Missão relacionada, agência responsável, ano de lançamento e localização atual.
  - Finalidade original, motivo do abandono e curiosidade científica.
  - Botões **Objeto Anterior / Próximo Objeto** (e teclas de setas `←` e `→` do teclado) para um tour guiado e sincronizado com o mapa 3D.
- **Painel Lateral dos Planetas:**
  - Navegação direta para qualquer planeta com um clique.
  - Legenda interativa com filtros de categorias de equipamentos.
- **Barra Superior HUD:**
  - Campo de busca instantânea por nome ou missão.
  - Filtros rápidos por tipo de equipamento.
  - Contador dinâmico de objetos visíveis.
  - Alternador para exibir/ocultar os marcadores 3D.
  - Botão **Visão Geral** para retornar a perspectiva panorâmica.
  - Modal de **Ajuda** com manual de controles.

---

## 🚀 Como Executar Localmente

### Opção 1: Duplo-clique no arquivo `index.html`
Como o projeto é empacotado de forma autocontida em `dist/app.bundle.js`, você pode simplesmente dar um **duplo-clique no arquivo `index.html`** para abrir diretamente no seu navegador.

### Opção 2: Servidor Local (Python / Batch)
Dê um duplo-clique no arquivo **`iniciar-museu.bat`** ou execute no terminal dentro da pasta do projeto:

```powershell
python -m http.server 8080
```
Em seguida, acesse no navegador: **`http://localhost:8080`**

---

## 🌐 Como Publicar em Hospedagens Gratuitas

O projeto é **100% estático**, sem necessidade de build em servidor:

### 1. GitHub Pages
1. Crie um novo repositório no GitHub e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: Space Junk Explorer 3D"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```
2. No repositório, acesse **Settings > Pages**.
3. Em **Branch**, selecione `main` e a pasta `/(root)`. Clique em **Save**.
4. Em 1 a 2 minutos seu link público estará ativo!

### 2. Vercel ou Netlify
- **Netlify Drop:** Acesse [app.netlify.com/drop](https://app.netlify.com/drop) e apenas arraste a pasta do projeto. O deploy é instantâneo.
- **Vercel:** Importe o repositório do GitHub em [vercel.com](https://vercel.com) com configurações padrão (Framework: *Other*).

---

## 📁 Estrutura de Arquivos

```text
NASA-test/
├── index.html                   # Ponto de entrada HTML da aplicação
├── iniciar-museu.bat            # Atalho de inicialização do servidor local no Windows
├── dist/
│   └── app.bundle.js            # Bundle autocontido e otimizado (Three.js + React + App)
├── src/
│   ├── main.js                  # Ponto de entrada modular
│   ├── App.js                   # Componente raiz da interface e orquestrador de estado
│   ├── data/
│   │   ├── solarSystem.js       # Dados astronômicos dos planetas, Sol e órbitas
│   │   └── spaceObjects.js      # Base estruturada dos 12 artefatos espaciais
│   ├── three/
│   │   ├── SolarSystemCanvas.js # Cena 3D, câmeras, iluminação, raycaster e loop de animação
│   │   ├── SpaceObjectModels.js # Construtor geométrico dos 12 modelos espaciais
│   │   └── PlanetTextures.js    # Gerador procedural de texturas planetárias em alta resolução
│   ├── components/
│   │   ├── Header.js            # Barra de cabeçalho, busca e filtros
│   │   ├── LeftSidebar.js       # Lista dos planetas e legenda
│   │   ├── BottomCatalogPanel.js# Painel educativo inferior e navegação de objetos
│   │   ├── ObjectSchematicCard.js # Diagrama técnico SVG e telemetria
│   │   └── HelpModal.js         # Modal explicativo dos controles de navegação
│   └── styles/
│       └── main.css             # Folha de estilos com tema NASA/Mission Control
└── README.md                    # Documentação do projeto
```

---

## 🛠️ Tecnologias Utilizadas

- **[Three.js](https://threejs.org/):** Renderização 3D WebGL, câmeras, malhas, materiais PBR e controles orbitais.
- **[React](https://react.dev/):** Gerenciamento de estado, reatividade e interface de usuário.
- **[HTM](https://github.com/developit/htm):** JSX-like puro sem compiladores pesados em tempo de execução.
- **Canvas 2D API:** Geração procedural das texturas dos astros e relevo em tempo real.
- **CSS Moderno:** Glassmorphism, Flexbox, CSS Grid e variáveis personalizadas inspiradas em interfaces aeroespaciais.

---

## 📜 Licença e Contexto Educativo

Os registros de equipamentos apresentados nesta demonstração possuem a identificação discreta de *"Simulação • Objeto Fictício"*, baseados em arquétipos tecnológicos reais da história da exploração espacial, estruturados para fácil substituição por catálogos históricos oficiais da NASA, ESA ou agências parceiras.
