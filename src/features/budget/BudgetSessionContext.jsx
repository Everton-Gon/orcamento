import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  approvals as approvalsSeed,
  approvalLevelForAmount,
  costCenters,
} from "@/features/budget/data";
import {
  buildRequestDetalhes,
  buildRequestTitle,
  canUserApproveStep,
  createWorkflowSteps,
  getCurrentWorkflowStep,
  normalizeRequest,
} from "@/features/budget/lib/workflow";
import { REQUEST_TYPES } from "@/features/budget/lib/requestTypes";
import { toast } from "sonner";

const BudgetSessionContext = createContext(null);

function simulateApprovalEmail(step, requestId) {
  toast.info(
    `E-mail enviado para ${step.nome} (${step.email})`,
    {
      description: `Aprovação pendente: ${requestId} · ${step.label}`,
      duration: 6000,
    },
  );
}

export function BudgetSessionProvider({ children }) {
  const [approvals, setApprovals] = useState(() =>
    approvalsSeed.map((a) => normalizeRequest(a)),
  );

  const addRequest = useCallback((input) => {
    const tipo = input.tipo ?? REQUEST_TYPES.orcamento;
    const centro =
      input.centro ?? input.centroOrigem ?? costCenters[0]?.departamento ?? "Marketing";

    const id = input.id ?? `REQ-${Date.now()}`;
    const valor = Number(input.valor) || 0;
    const fields = { ...input, centro, tipo };

    const row = normalizeRequest({
      id,
      tipo,
      titulo: buildRequestTitle(tipo, fields),
      centro,
      valor,
      solicitante: input.solicitante?.trim() || "Solicitante",
      solicitanteEmail: input.solicitanteEmail?.trim() || "solicitante@axiom.finance",
      nivel: approvalLevelForAmount(valor),
      prazo: input.prazo ?? "em 7 dias",
      status: input.status ?? "pendente",
      detalhes: buildRequestDetalhes(tipo, fields),
      workflow: createWorkflowSteps(centro),
      createdAt: new Date().toISOString(),
    });

    setApprovals((prev) => [row, ...prev]);

    const analista = row.workflow[0];
    simulateApprovalEmail(analista, row.id);

    return row;
  }, []);

  const addApproval = useCallback(
    (input) => addRequest({ ...input, tipo: REQUEST_TYPES.orcamento }),
    [addRequest],
  );

  const rejectRequest = useCallback((id, userEmail, comentario) => {
    setApprovals((prev) => {
      const req = prev.find((r) => r.id === id);
      if (!req) return prev;

      const step = getCurrentWorkflowStep(req);
      if (!canUserApproveStep(req, userEmail)) return prev;

      toast.error(`Requisição ${id} rejeitada por ${step?.nome ?? "aprovador"}.`, {
        description: comentario || "Sem comentário.",
      });

      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const advanceRequestStep = useCallback((id, userEmail) => {
    setApprovals((prev) => {
      const index = prev.findIndex((r) => r.id === id);
      if (index < 0) return prev;

      const req = prev[index];
      if (!canUserApproveStep(req, userEmail)) {
        toast.error("Esta conta não pode aprovar esta etapa.", {
          description: `Aguardando: ${getCurrentWorkflowStep(req)?.email ?? "—"}`,
        });
        return prev;
      }

      const workflow = req.workflow.map((s) => ({ ...s }));
      const stepIndex = workflow.findIndex((s) => s.status === "aguardando");
      if (stepIndex < 0) return prev;

      const now = new Date().toISOString();
      workflow[stepIndex].status = "aprovado";
      workflow[stepIndex].decidedAt = now;

      const nextIndex = stepIndex + 1;
      if (nextIndex < workflow.length) {
        workflow[nextIndex].status = "aguardando";
        workflow[nextIndex].notifiedAt = now;
        simulateApprovalEmail(workflow[nextIndex], id);

        const updated = [...prev];
        updated[index] = { ...req, workflow };
        toast.success(`Etapa "${workflow[stepIndex].label}" concluída.`, {
          description: `Próximo aprovador notificado por e-mail.`,
        });
        return updated;
      }

      toast.success(`Requisição ${id} totalmente aprovada.`, {
        description: "Todas as etapas foram concluídas.",
      });
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const removeApproval = useCallback((id) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      approvals,
      addRequest,
      addApproval,
      advanceRequestStep,
      rejectRequest,
      removeApproval,
      canUserApproveStep,
      getCurrentWorkflowStep,
    }),
    [
      approvals,
      addRequest,
      addApproval,
      advanceRequestStep,
      rejectRequest,
      removeApproval,
    ],
  );

  return (
    <BudgetSessionContext.Provider value={value}>
      {children}
    </BudgetSessionContext.Provider>
  );
}

export function useBudgetSession() {
  const ctx = useContext(BudgetSessionContext);
  if (!ctx) {
    throw new Error("useBudgetSession deve estar dentro de BudgetSessionProvider.");
  }
  return ctx;
}
