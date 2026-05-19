import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  approvals as approvalsSeed,
  approvalLevelForAmount,
  type Approval,
} from "@/features/budget/data";

type BudgetSessionValue = {
  approvals: Approval[];
  removeApproval: (id: string) => void;
  addApproval: (input: Omit<Approval, "id" | "nivel" | "status" | "prazo"> & { id?: string }) => void;
};

const BudgetSessionContext = createContext<BudgetSessionValue | null>(null);

export function BudgetSessionProvider({ children }: { children: ReactNode }) {
  const [approvals, setApprovals] = useState<Approval[]>(() =>
    approvalsSeed.map((a) => ({ ...a })),
  );

  const removeApproval = useCallback((id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addApproval = useCallback(
    (input: Omit<Approval, "id" | "nivel" | "status" | "prazo"> & { id?: string }) => {
      const id = input.id ?? `REQ-${Date.now()}`;
      const row: Approval = {
        id,
        titulo: input.titulo,
        centro: input.centro,
        valor: input.valor,
        solicitante: input.solicitante,
        nivel: approvalLevelForAmount(input.valor),
        prazo: "em 7 dias",
        status: "pendente",
      };
      setApprovals((prev) => [row, ...prev]);
    },
    [],
  );

  const value = useMemo(
    () => ({ approvals, removeApproval, addApproval }),
    [approvals, removeApproval, addApproval],
  );

  return (
    <BudgetSessionContext.Provider value={value}>{children}</BudgetSessionContext.Provider>
  );
}

export function useBudgetSession() {
  const ctx = useContext(BudgetSessionContext);
  if (!ctx) {
    throw new Error("useBudgetSession deve estar dentro de BudgetSessionProvider.");
  }
  return ctx;
}
