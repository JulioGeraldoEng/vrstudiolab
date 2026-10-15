type Status = "Disponível" | "Em uso" | "Manutenção" | "Baixado";

type EquipmentFormValues = {
  name: string;
  category: string;
  assetNumber: string;
  serialNumber: string;
  location: string;
  status: Status;
  operatingSystem: string;
  notes: string;
};

type EquipmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  form: EquipmentFormValues;
  setForm: (form: EquipmentFormValues) => void;
  isEditing: boolean;
};

const categories = [
  "Óculos VR",
  "Computadores",
  "Acessórios",
  "Sensores",
  "Áudio e vídeo",
  "Iluminação",
  "Outros",
];

const statuses: Status[] = ["Disponível", "Em uso", "Manutenção", "Baixado"];

export default function EquipmentModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
}: EquipmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-form-title"
        className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#101c2e] p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="equipment-form-title" className="text-xl font-bold text-white">
              {isEditing ? "Editar equipamento" : "Novo equipamento"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Preencha os dados do equipamento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Fechar formulário"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="equipment-name" className="mb-2 block text-sm text-slate-300">
              Nome do equipamento *
            </label>
            <input
              id="equipment-name"
              required
              autoFocus
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ex.: Meta Quest 3"
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="equipment-category" className="mb-2 block text-sm text-slate-300">
              Categoria *
            </label>
            <select
              id="equipment-category"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-[#0b1424] text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="equipment-status" className="mb-2 block text-sm text-slate-300">
              Status
            </label>
            <select
              id="equipment-status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value as Status })}
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              {statuses.map((status) => (
                <option key={status} value={status} className="bg-[#0b1424] text-white">
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="equipment-asset" className="mb-2 block text-sm text-slate-300">
              Número patrimonial
            </label>
            <input
              id="equipment-asset"
              value={form.assetNumber}
              onChange={(event) => setForm({ ...form, assetNumber: event.target.value })}
              placeholder="Ex.: PAT-001"
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="equipment-serial" className="mb-2 block text-sm text-slate-300">
              Número de série
            </label>
            <input
              id="equipment-serial"
              value={form.serialNumber}
              onChange={(event) => setForm({ ...form, serialNumber: event.target.value })}
              placeholder="Opcional"
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="equipment-location" className="mb-2 block text-sm text-slate-300">
              Localização
            </label>
            <input
              id="equipment-location"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              placeholder="Ex.: Armário A1"
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="equipment-operating-system"
              className="mb-2 block text-sm text-slate-300"
            >
              Sistema operacional
            </label>
            <select
              id="equipment-operating-system"
              value={form.operatingSystem}
              onChange={(event) =>
                setForm({ ...form, operatingSystem: event.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="">Não se aplica / Não informado</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Windows 11">Windows 11</option>
              <option value="Linux">Linux</option>
              <option value="macOS">macOS</option>
              <option value="Android">Android</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="equipment-notes" className="mb-2 block text-sm text-slate-300">
              Observações
            </label>
            <textarea
              id="equipment-notes"
              rows={3}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Detalhes adicionais..."
              className="w-full rounded-xl border border-white/10 bg-[#0b1424] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-3 pt-2 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-[#07111f] hover:bg-cyan-300"
            >
              {isEditing ? "Salvar alterações" : "Cadastrar equipamento"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}