import { costCenters } from "@/features/budget/data";
import {
  REQUEST_TYPE_LABELS,
  WORKFLOW_STEP_KEYS,
  WORKFLOW_STEP_LABELS,
} from "@/features/budget/lib/requestTypes";

/** Aprovadores fixos de demonstração (simulam destinatários de e-mail). */
export const FIXED_APPROVERS = {
  analista: {
    key: WORKFLOW_STEP_KEYS.analista,
    label: WORKFLOW_STEP_LABELS.analista,
    nome: "Fernanda Lima",
    email: "controladoria@axiom.finance",
    cargo: "Analista · Controladoria",
  },
  diretor_corporativo: {
    key: WORKFLOW_STEP_KEYS.diretor_corporativo,
    label: WORKFLOW_STEP_LABELS.diretor_corporativo,
    nome: "Ricardo Santos",
    email: "ricardo.santos@axiom.finance",
    cargo: "Diretor Corporativo",
  },
};

function emailFromGestor(nome) {
  const slug = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");
  return `${slug}@axiom.finance`;
}

export function getGestorForCentro(departamento) {
  const cc = costCenters.find((c) => c.departamento === departamento);
  if (!cc) {
    return {
      nome: "Gestor da área",
      email: "gestor.setor@axiom.finance",
      cargo: "Gestor · Área solicitante",
    };
  }
  return {
    nome: cc.gestor,
    email: emailFromGestor(cc.gestor),
    cargo: `Gestor · ${cc.departamento}`,
  };
}

export function createWorkflowSteps(centroSolicitante) {
  const gestor = getGestorForCentro(centroSolicitante);
  const now = new Date().toISOString();

  return [
    {
      ...FIXED_APPROVERS.analista,
      status: "aguardando",
      notifiedAt: now,
      decidedAt: null,
      comentario: null,
    },
    {
      key: WORKFLOW_STEP_KEYS.gestor_area,
      label: WORKFLOW_STEP_LABELS.gestor_area,
      nome: gestor.nome,
      email: gestor.email,
      cargo: gestor.cargo,
      status: "bloqueado",
      notifiedAt: null,
      decidedAt: null,
      comentario: null,
    },
    {
      ...FIXED_APPROVERS.diretor_corporativo,
      status: "bloqueado",
      notifiedAt: null,
      decidedAt: null,
      comentario: null,
    },
  ];
}

export function getCurrentWorkflowStep(request) {
  return request.workflow?.find((s) => s.status === "aguardando") ?? null;
}

export function canUserApproveStep(request, userEmail) {
  if (!userEmail || !request.workflow) return false;
  const step = getCurrentWorkflowStep(request);
  if (!step) return false;
  return step.email.toLowerCase() === userEmail.toLowerCase();
}

export function buildRequestTitle(tipo, fields) {
  if (fields.titulo?.trim()) return fields.titulo.trim();

  switch (tipo) {
    case "antecipacao_saldo":
      return `Antecipação de saldo · ${fields.centro}`;
    case "adiantamento_mes":
      return `Adiantamento ${fields.mesOrigem} → ${fields.mesDestino} · ${fields.centro}`;
    case "transferencia_conta": {
      const setor = fields.mesmoSetor ? "mesmo setor" : "entre setores";
      return `Transferência ${fields.centroOrigem} → ${fields.centroDestino} (${setor})`;
    }
    default:
      return `Pedido de orçamento · ${fields.centro}`;
  }
}

export function buildRequestDetalhes(tipo, fields) {
  const base = { tipoLabel: REQUEST_TYPE_LABELS[tipo] };
  if (tipo === "adiantamento_mes") {
    return {
      ...base,
      mesOrigem: fields.mesOrigem,
      mesDestino: fields.mesDestino,
    };
  }
  if (tipo === "transferencia_conta") {
    return {
      ...base,
      centroOrigem: fields.centroOrigem,
      centroDestino: fields.centroDestino,
      mesmoSetor: fields.mesmoSetor,
    };
  }
  if (tipo === "antecipacao_saldo") {
    return { ...base, justificativa: fields.justificativa };
  }
  return base;
}

/** Converte registos antigos para o modelo com workflow. */
export function normalizeRequest(raw) {
  if (raw.workflow?.length) {
    return {
      ...raw,
      tipo: raw.tipo ?? "orcamento",
      workflowStatus: raw.workflowStatus ?? "em_aprovacao",
    };
  }

  const centro = raw.centro;
  const workflow = createWorkflowSteps(centro);
  const firstPending = workflow.find((s) => s.status === "aguardando");
  if (firstPending && raw._legacyApprovedBy) {
    workflow[0].status = "aprovado";
    workflow[0].decidedAt = new Date().toISOString();
    if (workflow[1]) {
      workflow[1].status = "aguardando";
      workflow[1].notifiedAt = new Date().toISOString();
    }
  }

  return {
    ...raw,
    tipo: raw.tipo ?? "orcamento",
    solicitanteEmail: raw.solicitanteEmail ?? "solicitante@axiom.finance",
    workflowStatus: "em_aprovacao",
    detalhes: raw.detalhes ?? { tipoLabel: REQUEST_TYPE_LABELS.orcamento },
    workflow,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export function formatWorkflowProgress(request) {
  const done = request.workflow.filter((s) => s.status === "aprovado").length;
  return `${done}/${request.workflow.length}`;
}
