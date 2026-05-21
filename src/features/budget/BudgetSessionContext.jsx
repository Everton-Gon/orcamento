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
} from "@/features/budget/data";

const BudgetSessionContext = createContext(null);

export function BudgetSessionProvider({ children }) {
  const [approvals, setApprovals] = useState(() =>
    approvalsSeed.map((a) => ({ ...a }))
  );

  const removeApproval = useCallback((id) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addApproval = useCallback(
    (input) => {
      const id = input.id ?? `REQ-${Date.now()}`;
      const row = {
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
    []
  );

  const value = useMemo(
    () => ({ approvals, removeApproval, addApproval }),
    [approvals, removeApproval, addApproval]
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
