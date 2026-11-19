import type { MaintenanceRequest } from "../../../types/maintenance";
import { Pagination } from "../Pagination";

type MaintenanceRequestsTableProps = {
  requests: MaintenanceRequest[];
  onConvert: (requestId: string) => void;
  onReject: (requestId: string) => void;
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  canConvert: boolean;
  canReject: boolean;
};

const statusStyles = {
  Pendente: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "Convertida em OS":
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Recusada: "border-red-400/30 bg-red-400/10 text-red-300",
};

export default function MaintenanceRequestsTable({
  requests,
  onConvert,
  onReject,
  canConvert,
  canReject,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: MaintenanceRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10 text-2xl text-blue-300">
          📋
        </div>

        <h3 className="font-semibold text-white">
          Nenhuma solicitação encontrada
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Tente alterar os filtros ou registre uma nova solicitação.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-b border-white/10 bg-[#111827] text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Equipamento</th>
              <th className="px-5 py-4 font-medium">Problema</th>
              <th className="px-5 py-4 font-medium">Solicitante</th>
              <th className="px-5 py-4 font-medium">Data</th>
              <th className="px-5 py-4 font-medium">Status</th>
              {(canConvert || canReject) && (
                <th className="px-5 py-4 font-medium">Ações</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="transition hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-white">
                    {request.equipment}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Patrimônio: {request.assetNumber || "Não informado"}
                  </p>
                </td>

                <td className="max-w-xs px-5 py-4 text-slate-300">
                  <p className="whitespace-normal">{request.problem}</p>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {request.requestedByName}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {request.requestDate.split("-").reverse().join("/")}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[request.status]}`}
                  >
                    {request.status}
                  </span>

                  {request.maintenanceOrderId && (
                    <p className="mt-1 text-xs text-slate-400">
                      OS: {request.maintenanceOrderNumber || request.maintenanceOrderId}
                    </p>
                  )}
                </td>

                {(canConvert || canReject) && (
                  <td className="px-5 py-4">
                    {request.status === "Pendente" && (
                      <div className="flex flex-wrap gap-2">
                        {canConvert && (
                          <button
                            type="button"
                            onClick={() => onConvert(request.id)}
                            className="whitespace-nowrap rounded-lg bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                          >
                            Converter em OS
                          </button>
                        )}

                        {canReject && (
                          <button
                            type="button"
                            onClick={() => onReject(request.id)}
                            className="whitespace-nowrap rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/20"
                          >
                            Recusar
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentPage !== undefined &&
        itemsPerPage !== undefined &&
        totalItems !== undefined &&
        onPageChange && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={onPageChange}
          />
        )}
    </div>
  );
}