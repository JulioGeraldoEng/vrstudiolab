import { Pagination } from "./Pagination";

type MaintenanceStatus =
  | "Aberta"
  | "Em andamento"
  | "Aguardando peças"
  | "Concluída";

type MaintenanceOrder = {
  id: string;
  orderNumber: string;
  equipment: string;
  problem: string;
  responsible: string;
  openingDate: string;
  status: MaintenanceStatus;
};

type MaintenanceTableProps = {
  orders: MaintenanceOrder[];
  statusStyles: Record<MaintenanceStatus, string>;
  onStatusChange?: (id: string, status: MaintenanceStatus) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showActions?: boolean;
};

export default function MaintenanceTable({
  orders,
  statusStyles,
  onStatusChange,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  showActions = true,
}: MaintenanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-white/[0.03] text-xs uppercase text-slate-400">
          <tr>
            <th className="px-5 py-4">Equipamento / problema</th>
            <th className="px-5 py-4">Responsável</th>
            <th className="px-5 py-4">Abertura</th>
            <th className="px-5 py-4">Status</th>
            {showActions && onStatusChange && (
              <th className="px-5 py-4">Atualizar</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="transition hover:bg-white/[0.02]"
            >
              <td className="px-5 py-4">
                <p className="text-xs font-semibold text-cyan-300">
                  {order.orderNumber || "OS antiga"}
                </p>

                <p className="mt-1 font-medium">
                  {order.equipment}
                </p>

                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  {order.problem}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-300">
                {order.responsible}
              </td>

              <td className="px-5 py-4 text-slate-300">
                {order.openingDate.split("-").reverse().join("/")}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </td>

              {showActions && onStatusChange&& (
                <td className="px-5 py-4">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      onStatusChange(
                        order.id,
                        event.target.value as MaintenanceStatus
                      )
                    }
                    className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-xs text-white outline-none transition hover:border-white/20 focus:border-blue-400"
                    aria-label={`Status da ordem de ${order.equipment}`}
                  >
                    <option value="Aberta">Aberta</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Aguardando peças">
                      Aguardando peças
                    </option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
