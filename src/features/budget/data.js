export const brl = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

export const brlFull = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const trendData = [
  { mes: "Jan", previsto: 380, realizado: 340 },
  { mes: "Fev", previsto: 410, realizado: 395 },
  { mes: "Mar", previsto: 425, realizado: 460 },
  { mes: "Abr", previsto: 440, realizado: 412 },
  { mes: "Mai", previsto: 460, realizado: 478 },
  { mes: "Jun", previsto: 470, realizado: 455 },
  { mes: "Jul", previsto: 485, realizado: 470 },
  { mes: "Ago", previsto: 500, realizado: 480 },
  { mes: "Set", previsto: 520, realizado: 480 },
  { mes: "Out", previsto: 540, realizado: 480 },
  { mes: "Nov", previsto: 560, realizado: 480 },
  { mes: "Dez", previsto: 580, realizado: 480 },
];

export const costCenters = [
  {
    codigo: "CC-01202",
    departamento: "Marketing",
    gestor: "Gabriel Moaco",
    orcamento: 1200000,
    realizado: 840000,
  },
  {
    codigo: "CC-01550",
    departamento: "Engenharia de Produto",
    gestor: "Michel Mener",
    orcamento: 2450000,
    realizado: 2082500,
  },
  {
    codigo: "CC-02100",
    departamento: "Operações Fabris",
    gestor: "Eduardo Ramos",
    orcamento: 1850000,
    realizado: 1480000,
  },
  {
    codigo: "CC-02400",
    departamento: "Tecnologia & Infra",
    gestor: "Marcos Santos",
    orcamento: 3200000,
    realizado: 2304000,
  },
  {
    codigo: "CC-03050",
    departamento: "Recursos Humanos",
    gestor: "Sheila Diniz",
    orcamento: 640000,
    realizado: 288000,
  },
  {
    codigo: "CC-04010",
    departamento: "Comercial Brasil",
    gestor: "Pascifico Brandão",
    orcamento: 1980000,
    realizado: 1940400,
  },
  {
    codigo: "CC-05002",
    departamento: "Jurídico & Compliance",
    gestor: "Nayana Ribeiro",
    orcamento: 420000,
    realizado: 168000,
  },
];

export function approvalLevelForAmount(valor) {
  if (valor > 250_000) return "N3 Comitê";
  if (valor > 50_000) return "N2 Diretor";
  return "N1 Gerente";
}

export const approvals = [
  {
    id: "REQ-2841",
    titulo: "Campanha Performance Q4",
    centro: "Marketing",
    valor: 145000,
    nivel: "N2 Diretor",
    solicitante: "Marcos Paulo",
    prazo: "em 2 dias",
    status: "urgente",
  },
  {
    id: "REQ-2840",
    titulo: "Renovação Licenças AWS",
    centro: "Tecnologia & Infra",
    valor: 82400,
    nivel: "N2 Diretor",
    solicitante: "Ana Clara",
    prazo: "em 5 dias",
    status: "pendente",
  },
  {
    id: "REQ-2839",
    titulo: "Manutenção Frota Logística",
    centro: "Operações Fabris",
    valor: 12500,
    nivel: "N1 Gerente",
    solicitante: "Marcos Silva",
    prazo: "em 3 dias",
    status: "pendente",
  },
  {
    id: "REQ-2838",
    titulo: "Expansão Datacenter SP",
    centro: "Tecnologia & Infra",
    valor: 1120000,
    nivel: "N3 Comitê",
    solicitante: "Ana Clara",
    prazo: "em 7 dias",
    status: "pendente",
  },
  {
    id: "REQ-2837",
    titulo: "Treinamento Liderança",
    centro: "Recursos Humanos",
    valor: 38500,
    nivel: "N1 Gerente",
    solicitante: "Juliana Costa",
    prazo: "em 1 dia",
    status: "urgente",
  },
  {
    id: "REQ-2836",
    titulo: "Consultoria Tributária",
    centro: "Jurídico & Compliance",
    valor: 64000,
    nivel: "N2 Diretor",
    solicitante: "Camila Rocha",
    prazo: "em 4 dias",
    status: "pendente",
  },
  {
    id: "REQ-2835",
    tipo: "antecipacao_saldo",
    titulo: "Antecipação de saldo · Operações Fabris",
    centro: "Operações Fabris",
    valor: 280000,
    nivel: "N2 Diretor",
    solicitante: "Eduardo Ramos",
    prazo: "em 2 dias",
    status: "pendente",
    detalhes: { tipoLabel: "Antecipação de saldo", justificativa: "Fechamento antecipado Q4" },
  },
  {
    id: "REQ-2834",
    tipo: "adiantamento_mes",
    titulo: "Adiantamento Maio → Dezembro · Marketing",
    centro: "Marketing",
    valor: 95000,
    nivel: "N2 Diretor",
    solicitante: "Gabriel Moaco",
    prazo: "em 5 dias",
    status: "pendente",
    detalhes: { tipoLabel: "Adiantamento entre meses", mesOrigem: "Maio", mesDestino: "Dezembro" },
  },
  {
    id: "REQ-2833",
    tipo: "transferencia_conta",
    titulo: "Transferência Tecnologia → Comercial (entre setores)",
    centro: "Tecnologia & Infra",
    valor: 150000,
    nivel: "N2 Diretor",
    solicitante: "Marcos Santos",
    prazo: "em 3 dias",
    status: "urgente",
    detalhes: {
      tipoLabel: "Transferência entre contas",
      centroOrigem: "Tecnologia & Infra",
      centroDestino: "Comercial Brasil",
      mesmoSetor: false,
    },
  },
];

export const recentActivity = [
  {
    quando: "há 12 min",
    quem: "Ricardo Santos",
    acao: "aprovou",
    alvo: "REQ-2835 · Mídia Programática",
    valor: 92000,
  },
  {
    quando: "há 1 h",
    quem: "Sistema · ERP TOTVS",
    acao: "sincronizou",
    alvo: "lançamentos do CC-02400",
    valor: null,
  },
  {
    quando: "há 3 h",
    quem: "Ana Oliveira",
    acao: "submeteu",
    alvo: "REQ-2841 · Campanha Q4",
    valor: 145000,
  },
  {
    quando: "há 5 h",
    quem: "Pedro Mendes",
    acao: "ajustou previsão",
    alvo: "Comercial Brasil",
    valor: null,
  },
];

export const totals = {
  orcamento: 11740000,
  realizado: 9102900,
  saldo: 2637100,
  desvio: -2.4,
  burnRate: 412000,
};

export const reportsCatalog = [
  {
    nome: "Demonstrativo de Resultado · Q3",
    periodo: "Jul – Set 2025",
    formato: "PDF",
  },
  {
    nome: "Consolidado por Centro de Custo",
    periodo: "YTD 2025",
    formato: "XLSX",
  },
  {
    nome: "Análise de Desvios Orçamentários",
    periodo: "Ago 2025",
    formato: "PDF",
  },
  {
    nome: "Forecast Q4 · Cenário Base",
    periodo: "Out – Dez 2025",
    formato: "XLSX",
  },
  {
    nome: "Sincronização ERP · Log Mensal",
    periodo: "Set 2025",
    formato: "CSV",
  },
];

export const erpIntegrations = [
  {
    nome: "SAP S/4HANA",
    desc: "Lançamentos contábeis, centros de custo e ordens internas",
    status: "Conectado",
    lastSync: "há 12 min",
  },
  {
    nome: "TOTVS Protheus",
    desc: "Sincronização de notas fiscais e contas a pagar",
    status: "Conectado",
    lastSync: "há 1 h",
  },
  {
    nome: "Oracle ERP Cloud",
    desc: "Consolidação multiempresa e moedas",
    status: "Disponível",
    lastSync: null,
  },
  {
    nome: "Senior Sistemas",
    desc: "Folha de pagamento e provisão de benefícios",
    status: "Disponível",
    lastSync: null,
  },
  {
    nome: "Microsoft Dynamics 365",
    desc: "Ledger, dimensões financeiras e budgeting",
    status: "Disponível",
    lastSync: null,
  },
];
