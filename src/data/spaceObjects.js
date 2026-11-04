/**
 * Catálogo estruturado dos 12 objetos e equipamentos espaciais do Space Junk Explorer.
 *
 * NOTA: Estes registros pertencem ao modo "Simulação Educativa" (Objetos Fictícios),
 * projetados com estrutura padronizada para fácil substituição futura por bancos de dados
 * históricos verificados de agências espaciais.
 */

export const SPACE_OBJECTS_DATA = [
  {
    id: 'obj-01',
    code: 'SJE-001',
    name: 'Sonda Helios-Vanguard I',
    typeLabel: 'Sonda Espacial Desativada',
    modelType: 'probe',
    category: 'sondas-satelites',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Missão Solar Corona Recon (SCR-1)',
    agency: 'Consórcio Espacial Heliocêntrico (CEH — Simulação)',
    launchYear: 1998,
    location: 'Órbita Heliocêntrica Interna (próximo a Mercúrio — 0,43 UA)',
    nearbyPlanetId: 'mercury',
    position: [26, 3.5, 22],
    scale: 1.35,
    purpose:
      'Medir o fluxo de vento solar, ejeções de massa coronal e anomalias do campo magnético nas proximidades da órbita de Mercúrio.',
    abandonmentReason:
      'Degradação térmica severa nos sensores ópticos primários e esgotamento do gás frio (hidrazina) para controle de atitude após 9 anos de operação.',
    curiosity:
      'Seu escudo térmico revestido em folhas de kapton dourado suportou temperaturas superiores a 420 °C, mantendo o gravador de estado sólido intacto em silêncio absoluto.',
    telemetry: {
      mass: '680 kg',
      dimensions: '3,4 m × 2,8 m',
      status: 'Inativa / Deriva Estável',
      orbitVelocity: '44,8 km/s'
    }
  },
  {
    id: 'obj-02',
    code: 'SJE-002',
    name: 'Satélite AetherCom-IV',
    typeLabel: 'Satélite de Comunicação Abandonado',
    modelType: 'comsat',
    category: 'sondas-satelites',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Rede Orbital Transcontinental Aether',
    agency: 'Agência Internacional de Telecomunicações Orbitais (AITO — Simulação)',
    launchYear: 2004,
    location: 'Órbita Cemitério Super-Geossíncrona (vizinhança da Terra — 1,04 UA)',
    nearbyPlanetId: 'earth',
    position: [-58, 5.2, -56],
    scale: 1.35,
    purpose:
      'Retransmissão de sinais de telemetria científica e comunicações de banda Ka entre estações terrestres e plataformas orbitais.',
    abandonmentReason:
      'Falha nas baterias de níquel-hidrogênio durante eclipses orbitais, levando ao envio do satélite para uma órbita cemitério segura antes da perda total de comando.',
    curiosity:
      'Suas duas asas de painéis solares medem quase 18 metros de envergadura simulada e ainda refletem flashes de luz solar visíveis por telescópios amadores.',
    telemetry: {
      mass: '2.450 kg',
      dimensions: '18,2 m × 3,6 m',
      status: 'Órbita Cemitério',
      orbitVelocity: '3,07 km/s'
    }
  },
  {
    id: 'obj-03',
    code: 'SJE-003',
    name: 'Módulo Selene Lander MK-II',
    typeLabel: 'Módulo de Pouso Lunar',
    modelType: 'lander',
    category: 'modulos-veiculos',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Programa Artemis-Selene deTeste Automatizado',
    agency: 'Instituto de Exploração Cislunar (IEC — Simulação)',
    launchYear: 1976,
    location: 'Órbita Alta Cislunar / Ponto de Lagrange Terra-Lua',
    nearbyPlanetId: 'earth',
    position: [-72, -4.2, -38],
    scale: 1.4,
    purpose:
      'Validar o sistema de pouso autônomo por radar Doppler e amortecimento mecânico de quatro sapatas para missões lunares não tripuladas.',
    abandonmentReason:
      'Após cumprir todos os testes de ignição e separação em órbita lunar, o estágio de descida foi descartado em uma trajetória cislunar de longo prazo.',
    curiosity:
      'As sapatas circulares possuem sensores de contato de alumínio que jamais tocaram o solo, pois esta unidade serviu exclusivamente como protótipo de voo orbital.',
    telemetry: {
      mass: '4.120 kg',
      dimensions: '4,3 m × 4,1 m',
      status: 'Preservado no Vácuo',
      orbitVelocity: '1,18 km/s'
    }
  },
  {
    id: 'obj-04',
    code: 'SJE-004',
    name: 'Tanque Criogênico Centaur-X9',
    typeLabel: 'Tanque de Combustível Descartado',
    modelType: 'tank',
    category: 'propulsao-tanques',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Injeção Transmarciana Cargo-7',
    agency: 'Divisão de Logística Interplanetária (DLI — Simulação)',
    launchYear: 2011,
    location: 'Corredor de Transferência Terra-Marte (1,28 UA)',
    nearbyPlanetId: 'mars',
    position: [45, -6.0, 82],
    scale: 1.4,
    purpose:
      'Armazenar hidrogênio e oxigênio líquidos super-resfriados para a queima de escape que impulsionou cargas científicas rumo a Marte.',
    abandonmentReason:
      'Ejetado programadamente após o consumo completo do propelente e passivação das válvulas de pressão para evitar explosões por aquecimento solar.',
    curiosity:
      'A espuma isolante alaranjada adquiriu um tom âmbar escuro devido à exposição contínua aos raios ultravioleta do espaço profundo.',
    telemetry: {
      mass: '1.890 kg (seco)',
      dimensions: '9,2 m × 3,8 m',
      status: 'Despressurizado',
      orbitVelocity: '26,4 km/s'
    }
  },
  {
    id: 'obj-05',
    code: 'SJE-005',
    name: 'Estágio Superior Titan-Nova S-IV',
    typeLabel: 'Estágio de Foguete',
    modelType: 'rocket_stage',
    category: 'propulsao-tanques',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Lançamento da Sonda Atmosférica Cytherea',
    agency: 'Centro de Propulsão Orbital Atlântico (CPOA — Simulação)',
    launchYear: 1989,
    location: 'Órbita Heliocêntrica próxima a Vênus (0,75 UA)',
    nearbyPlanetId: 'venus',
    position: [-42, 4.8, 34],
    scale: 1.45,
    purpose:
      'Fornecer o empuxo final de inserção interplanetária por meio de duas câmaras de combustão gêmeas de alto impulso específico.',
    abandonmentReason:
      'Desacoplado minutos após posicionar a sonda principal na trajetória de Vênus, permanecendo em uma órbita solar elíptica perpétua.',
    curiosity:
      'Por décadas, astrônomos chegaram a confundi-lo com um pequeno asteroide próximo à Terra devido ao brilho metálico de sua fuselagem de liga de alumínio-lítio.',
    telemetry: {
      mass: '3.350 kg (seco)',
      dimensions: '11,5 m × 4,0 m',
      status: 'Rotação Lenta (2,4 rpm)',
      orbitVelocity: '34,9 km/s'
    }
  },
  {
    id: 'obj-06',
    code: 'SJE-006',
    name: 'Módulo Fotovoltaico Solaris Wing-B',
    typeLabel: 'Painel Solar Desprendido',
    modelType: 'solar_panel',
    category: 'fragmentos-componentes',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Manutenção da Plataforma Orbital Solaris-II',
    agency: 'Agência Espacial Euro-Pacífica (AEEP — Simulação)',
    launchYear: 2007,
    location: 'Órbita Terrestre Alta / Cinturão de Detritos (1,08 UA)',
    nearbyPlanetId: 'earth',
    position: [-84, 7.0, -48],
    scale: 1.35,
    purpose:
      'Gerar até 14 kW de energia elétrica em corrente contínua a partir de células fotovoltaicas de arsenieto de gálio de tripla junção.',
    abandonmentReason:
      'Trava mecânica no pino de retração durante uma substituição robótica levou ao descarte controlado da asa antiga para instalação de um novo conjunto.',
    curiosity:
      'Um de seus seis subpainéis apresenta uma leve inclinação causada pelo impacto de um micrometeorito milimétrico registrado três anos após o descarte.',
    telemetry: {
      mass: '410 kg',
      dimensions: '12,0 m × 3,2 m',
      status: 'Deriva Controlada',
      orbitVelocity: '29,2 km/s'
    }
  },
  {
    id: 'obj-07',
    code: 'SJE-007',
    name: 'Antena Parabólica DeepSpace K-19',
    typeLabel: 'Antena de Comunicação',
    modelType: 'antenna',
    category: 'fragmentos-componentes',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Repetidora Interplanetária Ares-Relay',
    agency: 'Rede de Espaço Profundo Unificada (REPU — Simulação)',
    launchYear: 2001,
    location: 'Cinturão Interior além de Marte (1,68 UA)',
    nearbyPlanetId: 'mars',
    position: [98, 6.2, 64],
    scale: 1.4,
    purpose:
      'Amplificar transmissões de vídeo e dados espectrais enviados por sondas situadas no Cinturão de Asteroides de volta para a Terra.',
    abandonmentReason:
      'Separada do módulo de serviço principal após uma pane no atuador cardan que travou o apontamento da parábola de malha metálica.',
    curiosity:
      'Sua parábola de 4,8 metros é tecida com fios de molibdênio banhados a ouro mais finos que um fio de cabelo humano para reduzir a massa estrutural.',
    telemetry: {
      mass: '295 kg',
      dimensions: '4,8 m de diâmetro',
      status: 'Sem Telemetria Ativa',
      orbitVelocity: '21,7 km/s'
    }
  },
  {
    id: 'obj-08',
    code: 'SJE-008',
    name: 'Cápsula Orionis-3 (Teste Térmico)',
    typeLabel: 'Cápsula Espacial Desativada',
    modelType: 'capsule',
    category: 'modulos-veiculos',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Voo de Qualificação Não Tripulado Orionis-3',
    agency: 'Programa de Voo Espacial Avançado (PVEA — Simulação)',
    launchYear: 2015,
    location: 'Órbita de Transferência Profunda (entre Vênus e Terra — 0,88 UA)',
    nearbyPlanetId: 'venus',
    position: [-24, -5.5, 58],
    scale: 1.4,
    purpose:
      'Testar a integridade estrutural da cabine pressurizada cônica, escotilhas e aviônica de navegação autônoma sob radiação cósmica.',
    abandonmentReason:
      'Falha na ignição do motor do módulo de serviço impediu a manobra de retorno atmosférico, deixando a cápsula de testes em órbita solar estável.',
    curiosity:
      'No interior da cabine viaja um manequim instrumentado com 32 dosímetros passivos que continuam acumulando registros físicos de radiação cósmica.',
    telemetry: {
      mass: '5.600 kg',
      dimensions: '5,0 m × 3,9 m',
      status: 'Cabine Despressurizada',
      orbitVelocity: '31,5 km/s'
    }
  },
  {
    id: 'obj-09',
    code: 'SJE-009',
    name: 'Rover Explorador Ares Pathfinder XR-2',
    typeLabel: 'Rover Explorador',
    modelType: 'rover',
    category: 'modulos-veiculos',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Expedição Geológica Vallis-Meridiani',
    agency: 'Laboratório de Robótica Planetária (LRP — Simulação)',
    launchYear: 2006,
    location: 'Setor Marciano / Planície de Chryse (Marte — 1,52 UA)',
    nearbyPlanetId: 'mars',
    position: [72, 2.2, 86],
    scale: 1.4,
    purpose:
      'Analisar a composição mineralógica de rochas sedimentares e buscar assinaturas de antigos leitos fluviais por meio de câmeras multiespectrais.',
    abandonmentReason:
      'Tempestade global de poeira cobriu mais de 92% dos painéis solares horizontais, reduzindo a energia abaixo do limite mínimo dos aquecedores internos.',
    curiosity:
      'Projetado para operar por apenas 90 dias marcianos (sóis), o rover percorreu 24 quilômetros ao longo de quase 7 anos antes de enviar seu último pacote de dados.',
    telemetry: {
      mass: '185 kg',
      dimensions: '1,6 m × 2,3 m × 1,5 m',
      status: 'Hibernação Permanente',
      orbitVelocity: '24,1 km/s (Marte)'
    }
  },
  {
    id: 'obj-10',
    code: 'SJE-010',
    name: 'Módulo Orbital Mir-Horizon Node-4',
    typeLabel: 'Módulo Orbital',
    modelType: 'orbital_module',
    category: 'modulos-veiculos',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Laboratório Automatizado de Microgravidade Horizon',
    agency: 'Diretório de Estações Científicas Orbitais (DECO — Simulação)',
    launchYear: 1994,
    location: 'Órbita Estável Exterior ao Cinturão Interno (2,95 UA)',
    nearbyPlanetId: 'jupiter',
    position: [-122, 6.5, 88],
    scale: 1.45,
    purpose:
      'Servir como nó pressurizado de acoplamento múltiplo e laboratório autônomo para crescimento de cristais proteicos em microgravidade.',
    abandonmentReason:
      'Desativado após a conclusão do programa científico e transferido por rebocador robótico para uma órbita de armazenamento de longa duração.',
    curiosity:
      'Possui quatro anéis de acoplamento andróginos dispostos em cruz e vigias de quartzo fundido com persianas térmicas externas ainda entreabertas.',
    telemetry: {
      mass: '8.900 kg',
      dimensions: '8,6 m × 4,2 m',
      status: 'Selado Hermeticamente',
      orbitVelocity: '16,2 km/s'
    }
  },
  {
    id: 'obj-11',
    code: 'SJE-011',
    name: 'Telescópio Spectra-X Cosmic Eye',
    typeLabel: 'Instrumento Científico',
    modelType: 'telescope',
    category: 'sondas-satelites',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Mapeamento no Infravermelho Profundo (MIP-X)',
    agency: 'Observatório Astrofísico Internacional (OAI — Simulação)',
    launchYear: 2009,
    location: 'Vizinhança Orbital de Urano / Sistema Externo (18,5 UA)',
    nearbyPlanetId: 'uranus',
    position: [228, 9.0, 96],
    scale: 1.5,
    purpose:
      'Observar discos protoplanetários e atmosferas de gigantes gelados utilizando um espelho primário de berílio resfriado a hélio líquido.',
    abandonmentReason:
      'Esgotamento completo do reservatório de hélio superfluido necessário para manter os detectores infravermelhos a 4 Kelvin (-269 °C).',
    curiosity:
      'Mesmo após o fim do líquido refrigerante, sua câmera de canal visível ainda operou em "modo quente" por dois anos extras catalogando luas geladas.',
    telemetry: {
      mass: '1.120 kg',
      dimensions: '4,5 m × 2,4 m',
      status: 'Desativado Termicamente',
      orbitVelocity: '6,8 km/s'
    }
  },
  {
    id: 'obj-12',
    code: 'SJE-012',
    name: 'Segmento Skylab-Omega Truss S7',
    typeLabel: 'Fragmento de Antiga Estação Espacial',
    modelType: 'station_fragment',
    category: 'fragmentos-componentes',
    simulationBadge: 'Simulação • Objeto Fictício',
    mission: 'Plataforma de Ensaio Estrutural Espaço Profundo Omega',
    agency: 'Consórcio Internacional de Engenharia Orbital (CIEO — Simulação)',
    launchYear: 1984,
    location: 'Sistema de Saturno / Órbita Externa de Titã (9,4 UA)',
    nearbyPlanetId: 'saturn',
    position: [-192, -7.5, -62],
    scale: 1.5,
    purpose:
      'Testar treliças modulares de fibra de carbono e giroscópios de controle de momento para futuras bases de apoio no Sistema Solar externo.',
    abandonmentReason:
      'Desmembrado da sonda rebocadora principal após o término do experimento de fadiga estrutural de longa duração nos arredores de Saturno.',
    curiosity:
      'Os cabos de telemetria revestidos em teflon prateado e os radiadores térmicos continuam intactos no frio extremo de -180 °C da região de Saturno.',
    telemetry: {
      mass: '1.640 kg',
      dimensions: '9,8 m × 3,1 m',
      status: 'Fragmento Estrutural',
      orbitVelocity: '9,6 km/s'
    }
  }
];
