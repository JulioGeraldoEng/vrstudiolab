
import { Pagination } from "./Pagination";

type Status = "Disponível" | "Em uso" | "Manutenção" | "Baixado";

type Equipment = {
  id: number;
  name: string;
  category: string;
  assetNumber: string;
  serialNumber: string;
  location: string;
  status: Status;
  operatingSystem: string;
  notes: string;
};

type InventoryTableProps = {
  items: Equipment[];
  ready: boolean;
  onEdit?: (item: Equipment) => void;
  onDelete?: (item: Equipment) => void;
  showActions?: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

const statusStyles: Record<Status, string> = {
  Disponível: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Em uso": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Manutenção: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Baixado: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function InventoryTable({
  items,
  ready,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  showActions = true,
}: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.02]">
          <tr>
            <th className="px-5 py-4 font-medium text-slate-400">
              Equipamento
            </th>
            <th className="px-5 py-4 font-medium text-slate-400">
              Patrimônio
            </th>
            <th className="px-5 py-4 font-medium text-slate-400">
              Localização
            </th>
            <th className="px-5 py-4 font-medium text-slate-400">
              Status
            </th>
            {showActions && (
              <th className="px-5 py-4 font-medium text-slate-400">
                Ações
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {!ready ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                Carregando inventário...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-5 py-10 text-center">
                <p className="font-medium text-slate-300">
                  Nenhum equipamento encontrado
                </p>
                <p className="mt-1 text-slate-500">
                  Cadastre um equipamento ou ajuste os filtros.
                </p>
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="transition hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-200">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.category}
                    {item.serialNumber
                      ? ` · Série: ${item.serialNumber}`
                      : ""}
                    {item.operatingSystem
                      ? ` · SO: ${item.operatingSystem}`
                      : ""}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {item.assetNumber || "Não informado"}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {item.location || "Não informada"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[item.status]
                      }`}
                  >
                    {item.status}
                  </span>
                </td>

                {showActions && (
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="text-blue-400 transition-colors duration-200 hover:text-blue-300"
                        >
                          Editar
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(item)}
                          className="text-red-400 transition-colors duration-200 hover:text-red-300"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
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

