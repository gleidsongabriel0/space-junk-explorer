/**
 * Dados estruturados do Sistema Solar para o ambiente 3D.
 * As escalas de tamanho e distância são ajustadas artisticamente (escala logarítmica/comprimida)
 * para permitir navegação fluida e visualização clara de todos os astros e detritos no museu 3D.
 */

export const SUN_DATA = {
  id: 'sun',
  name: 'Sol',
  subtitle: 'Estrela Central (G2V)',
  radius: 14,
  distance: 0,
  color: '#ffaa22',
  CoronaColor: '#ff5500',
  description: 'Estrela central do Sistema Solar que concentra 99,86% de toda a massa do sistema e governa as órbitas planetárias e de artefatos interplanetários.'
};

export const PLANETS_DATA = [
  {
    id: 'mercury',
    name: 'Mercúrio',
    subtitle: 'Planeta Rochoso Interior',
    radius: 1.8,
    distance: 32,
    orbitSpeed: 0.0042,
    rotationSpeed: 0.003,
    initialAngle: 0.8,
    tilt: 0.03,
    color: '#9ca3af',
    accentColor: '#cbd5e1',
    atmosphereColor: null,
    textureType: 'mercury',
    distanceAU: '0,39 UA',
    description: 'O planeta mais próximo do Sol, marcado por crateras de impacto e variações térmicas extremas onde sondas enfrentam intensa radiação solar.'
  },
  {
    id: 'venus',
    name: 'Vênus',
    subtitle: 'Planeta Rochoso Denso',
    radius: 2.9,
    distance: 52,
    orbitSpeed: 0.0031,
    rotationSpeed: -0.0015,
    initialAngle: 2.4,
    tilt: 3.09,
    color: '#e6b872',
    accentColor: '#f59e0b',
    atmosphereColor: '#fbbf24',
    textureType: 'venus',
    distanceAU: '0,72 UA',
    description: 'Coberto por densas nuvens de ácido sulfúrico e efeito estufa extremo; diversas sondas orbitais e atmosféricas encerraram suas missões ao seu redor.'
  },
  {
    id: 'earth',
    name: 'Terra',
    subtitle: 'Berço da Exploração Espacial',
    radius: 3.2,
    distance: 78,
    orbitSpeed: 0.0024,
    rotationSpeed: 0.01,
    initialAngle: 4.1,
    tilt: 0.41,
    color: '#3b82f6',
    accentColor: '#38bdf8',
    atmosphereColor: '#60a5fa',
    textureType: 'earth',
    hasMoon: true,
    distanceAU: '1,00 UA',
    description: 'Ponto de origem de todas as missões humanas. Sua órbita concentra a maior densidade de satélites desativados, estágios de foguetes e fragmentos.'
  },
  {
    id: 'mars',
    name: 'Marte',
    subtitle: 'O Planeta Vermelho',
    radius: 2.4,
    distance: 108,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.0095,
    initialAngle: 1.3,
    tilt: 0.44,
    color: '#ef4444',
    accentColor: '#f87171',
    atmosphereColor: '#fca5a5',
    textureType: 'mars',
    distanceAU: '1,52 UA',
    description: 'O destino mais explorado por rovers, módulos de pouso e orbitadores científicos em busca de vestígios de água e vida passada.'
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    subtitle: 'Gigante Gasoso',
    radius: 7.4,
    distance: 155,
    orbitSpeed: 0.0011,
    rotationSpeed: 0.022,
    initialAngle: 5.2,
    tilt: 0.05,
    color: '#d97706',
    accentColor: '#fbbf24',
    atmosphereColor: '#fde68a',
    textureType: 'jupiter',
    distanceAU: '5,20 UA',
    description: 'O maior planeta do Sistema Solar, com um poderoso campo magnético e cinturões de radiação que desafiam a eletrônica das sondas espaciais.'
  },
  {
    id: 'saturn',
    name: 'Saturno',
    subtitle: 'Gigante dos Anéis',
    radius: 6.2,
    distance: 208,
    orbitSpeed: 0.0008,
    rotationSpeed: 0.02,
    initialAngle: 3.1,
    tilt: 0.47,
    color: '#eab308',
    accentColor: '#fde047',
    atmosphereColor: '#fef08a',
    textureType: 'saturn',
    hasRings: true,
    ringInnerRadius: 7.8,
    ringOuterRadius: 14.5,
    distanceAU: '9,58 UA',
    description: 'Famoso por seu complexo sistema de anéis de gelo e poeira, explorado por sondas históricas que estudaram também suas dezenas de luas.'
  },
  {
    id: 'uranus',
    name: 'Urano',
    subtitle: 'Gigante de Gelo',
    radius: 4.3,
    distance: 258,
    orbitSpeed: 0.00055,
    rotationSpeed: -0.014,
    initialAngle: 0.4,
    tilt: 1.71,
    color: '#22d3ee',
    accentColor: '#67e8f9',
    atmosphereColor: '#a5f3fc',
    textureType: 'uranus',
    hasRings: true,
    ringInnerRadius: 5.4,
    ringOuterRadius: 7.2,
    ringOpacity: 0.28,
    distanceAU: '19,20 UA',
    description: 'Gigante de gelo com eixo de rotação extremamente inclinado e atmosfera fria de hidrogênio, hélio e metano.'
  },
  {
    id: 'neptune',
    name: 'Netuno',
    subtitle: 'Fronteira Planetária Externa',
    radius: 4.1,
    distance: 305,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.015,
    initialAngle: 4.7,
    tilt: 0.49,
    color: '#2563eb',
    accentColor: '#60a5fa',
    atmosphereColor: '#93c5fd',
    textureType: 'neptune',
    distanceAU: '30,05 UA',
    description: 'O mais distante dos oito planetas, varrido pelos ventos mais velozes do Sistema Solar nos limites do Cinturão de Kuiper.'
  }
];

export const OBJECT_CATEGORIES = [
  {
    id: 'all',
    label: 'Todos os Objetos',
    shortLabel: 'Todos',
    color: '#38bdf8',
    description: 'Todos os 12 artefatos espaciais catalogados no museu.'
  },
  {
    id: 'sondas-satelites',
    label: 'Sondas & Satélites',
    shortLabel: 'Sondas/Satélites',
    color: '#22d3ee',
    description: 'Sondas interplanetárias, satélites de comunicação e telescópios orbitais.'
  },
  {
    id: 'modulos-veiculos',
    label: 'Módulos & Rovers',
    shortLabel: 'Módulos/Rovers',
    color: '#a855f7',
    description: 'Cápsulas tripuladas, módulos de pouso, habitats orbitais e veículos de superfície.'
  },
  {
    id: 'propulsao-tanques',
    label: 'Estágios & Tanques',
    shortLabel: 'Propulsão',
    color: '#f59e0b',
    description: 'Estágios superiores de foguetes e tanques criogênicos descartados após manobras.'
  },
  {
    id: 'fragmentos-componentes',
    label: 'Componentes & Estruturas',
    shortLabel: 'Estruturas',
    color: '#10b981',
    description: 'Painéis solares, antenas parabólicas e segmentos estruturais de estações.'
  }
];
