
type ExportEquipment = {
  id: number;
  name: string;
  assetNumber?: string;
  status: string;
  category?: string;
  serialNumber?: string;
  location?: string;
  notes?: string;
};

type ExportMaintenanceOrder = {
  id: string;
  orderNumber?: string;
  equipment: string;
  problem: string;
  responsible?: string;
  openingDate?: string;
  status: string;
  serviceNotes?: string;
  completionDate?: string;
  assignedPersonName?: string;
  performedByName?: string;
  releasedByName?: string;
};

type ExportPerson = {
  id: string;
  name: string;
  role: string;
  sector?: string;
  active: boolean;
};

const fieldLabels: Record<string, string> = {
  name: "Nome do equipamento",
  assetNumber: "Patrimônio",
  category: "Categoria",
  serialNumber: "Número de série",
  location: "Localização",
  equipmentStatus: "Status do equipamento",
  notes: "Observações do equipamento",
  orderNumber: "Número da OS",
  equipment: "Equipamento da OS",
  problem: "Problema relatado",
  responsible: "Responsável",
  openingDate: "Data de abertura",
  orderStatus: "Status da OS",
  serviceNotes: "Serviço realizado",
  completionDate: "Data de conclusão",
  personName: "Nome da pessoa",
  personRole: "Função da pessoa",
  personSector: "Setor da pessoa",
  personStatus: "Situação do cadastro",
};

function getEquipmentValue(
  item: ExportEquipment,
  field: string
): string {
  const values: Record<string, string | undefined> = {
    name: item.name,
    assetNumber: item.assetNumber,
    category: item.category,
    serialNumber: item.serialNumber,
    location: item.location,
    equipmentStatus: item.status,
    notes: item.notes,
  };

  return values[field] ?? "";
}

function formatDateBR(value?: string): string {
  if (!value) return "";

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (dateOnly) {
    return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function getOrderValue(
  order: ExportMaintenanceOrder,
  field: string
): string {
  const values: Record<string, string | undefined> = {
    orderNumber: order.orderNumber || order.id,
    equipment: order.equipment,
    problem: order.problem,
    responsible: order.responsible,
    openingDate: formatDateBR(order.openingDate),
    orderStatus: order.status,
    serviceNotes: order.serviceNotes,
    completionDate: formatDateBR(order.completionDate),
  };

  return values[field] ?? "";
}

function getPersonValue(
  person: ExportPerson,
  field: string
): string {
  const values: Record<string, string> = {
    personName: person.name,
    personRole: person.role,
    personSector: person.sector ?? "",
    personStatus: person.active ? "Ativo" : "Inativo",
  };

  return values[field] ?? "";
}

export function exportToCSV(
  equipment: ExportEquipment[],
  orders: ExportMaintenanceOrder[],
  selectedFields: string[],
  people: ExportPerson[]
) {
  const inventoryFields = [
    "name",
    "assetNumber",
    "category",
    "serialNumber",
    "location",
    "equipmentStatus",
    "notes",
  ].filter((field) => selectedFields.includes(field));

  const maintenanceFields = [
    "orderNumber",
    "equipment",
    "problem",
    "responsible",
    "openingDate",
    "orderStatus",
    "serviceNotes",
    "completionDate",
  ].filter((field) => selectedFields.includes(field));

  const peopleFields = [
    "personName",
    "personRole",
    "personSector",
    "personStatus",
  ].filter((field) => selectedFields.includes(field));

  const rows: string[][] = [];

  if (inventoryFields.length > 0) {
    rows.push(["INVENTÁRIO DE EQUIPAMENTOS"]);
    rows.push(inventoryFields.map((field) => fieldLabels[field]));

    equipment.forEach((item) => {
      rows.push(
        inventoryFields.map((field) => getEquipmentValue(item, field))
      );
    });

    rows.push([]);
    rows.push([]);
  }

  if (maintenanceFields.length > 0) {
    rows.push(["ORDENS DE MANUTENÇÃO"]);
    rows.push(maintenanceFields.map((field) => fieldLabels[field]));

    orders.forEach((order) => {
      rows.push(
        maintenanceFields.map((field) => getOrderValue(order, field))
      );
    });
  }

  if (peopleFields.length > 0) {
    rows.push(["PESSOAS CADASTRADAS"]);
    rows.push(peopleFields.map((field) => fieldLabels[field]));

    people.forEach((person) => {
      rows.push(
        peopleFields.map((field) => getPersonValue(person, field))
      );
    });
  }

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(";")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "relatorio-vrstudiolab.csv";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportToPDF(
  equipment: ExportEquipment[],
  orders: ExportMaintenanceOrder[],
  selectedFields: string[],
  people: ExportPerson[]
) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const inventoryFields = [
    "name",
    "assetNumber",
    "category",
    "serialNumber",
    "location",
    "equipmentStatus",
    "notes",
  ].filter((field) => selectedFields.includes(field));

  const maintenanceFields = [
    "orderNumber",
    "equipment",
    "problem",
    "responsible",
    "openingDate",
    "orderStatus",
    "serviceNotes",
    "completionDate",
  ].filter((field) => selectedFields.includes(field));

  const peopleFields = [
    "personName",
    "personRole",
    "personSector",
    "personStatus",
  ].filter((field) => selectedFields.includes(field));

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("VR Studio Lab - Relatorios", 14, 18);

  doc.setFontSize(10);
  doc.text(
    `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`,
    14,
    26
  );

  let currentY = 36;

  if (inventoryFields.length > 0) {
    doc.setFontSize(12);
    doc.text("Inventario de equipamentos", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [inventoryFields.map((field) => fieldLabels[field])],
      body: equipment.map((item) =>
        inventoryFields.map((field) => getEquipmentValue(item, field))
      ),
      styles: { fontSize: 8, overflow: "linebreak" },
      headStyles: { fillColor: [14, 23, 41] },
      horizontalPageBreak: true,
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  if (maintenanceFields.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.text("Ordens de manutencao", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [maintenanceFields.map((field) => fieldLabels[field])],
      body: orders.map((order) =>
        maintenanceFields.map((field) => getOrderValue(order, field))
      ),
      styles: { fontSize: 8, overflow: "linebreak" },
      headStyles: { fillColor: [14, 23, 41] },
      horizontalPageBreak: true,
    });
  }

  if (peopleFields.length > 0) {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(12);
    doc.text("Pessoas cadastradas", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [peopleFields.map((field) => fieldLabels[field])],
      body: people.map((person) =>
        peopleFields.map((field) => getPersonValue(person, field))
      ),
      styles: { fontSize: 8, overflow: "linebreak" },
      headStyles: { fillColor: [14, 23, 41] },
      horizontalPageBreak: true,
    });
  }

  doc.save("relatorio-vrstudiolab.pdf");
}