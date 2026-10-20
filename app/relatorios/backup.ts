
const inventoryKey = "vrstudiolab-inventory-v1";
const maintenanceKey = "vrstudiolab-maintenance-v1";
const peopleKey = "vrstudiolab-maintenance-people-v1";

type BackupData = {
  application: "VR Studio Lab";
  version: 1;
  createdAt: string;
  data: {
    equipment: unknown[];
    maintenanceOrders: unknown[];
    people: unknown[];
  };
};

export function exportBackup(): void {
  try {
    const equipment = JSON.parse(
      localStorage.getItem(inventoryKey) ?? "[]"
    );

    const maintenanceOrders = JSON.parse(
      localStorage.getItem(maintenanceKey) ?? "[]"
    );

    const people = JSON.parse(
      localStorage.getItem(peopleKey) ?? "[]"
    );

    if (
      !Array.isArray(equipment) ||
      !Array.isArray(maintenanceOrders) ||
      !Array.isArray(people)
    ) {
      throw new Error("Os dados armazenados não possuem o formato esperado.");
    }

    const backup: BackupData = {
      application: "VR Studio Lab",
      version: 1,
      createdAt: new Date().toISOString(),
      data: {
        equipment,
        maintenanceOrders,
        people,
      },
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-vrstudiolab-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("Erro ao gerar backup:", error);
    alert("Não foi possível gerar o backup. Verifique os dados do sistema.");
  }
}

export async function importBackup(file: File): Promise<void> {
  const inventoryKey = "vrstudiolab-inventory-v1";
  const maintenanceKey = "vrstudiolab-maintenance-v1";
  const peopleKey = "vrstudiolab-maintenance-people-v1";

  const content = await file.text();
  const backup = JSON.parse(content);

  if (
    backup?.application !== "VR Studio Lab" ||
    backup?.version !== 1 ||
    !backup?.data ||
    !Array.isArray(backup.data.equipment) ||
    !Array.isArray(backup.data.maintenanceOrders) ||
    !Array.isArray(backup.data.people)
  ) {
    throw new Error("Arquivo de backup inválido ou incompatível.");
  }

  const confirmed = window.confirm(
    "Atenção! A importação substituirá os dados atuais de equipamentos, " +
      "manutenção e pessoas neste navegador. Deseja continuar?"
  );

  if (!confirmed) return;

  const previousData = {
    equipment: localStorage.getItem(inventoryKey),
    maintenance: localStorage.getItem(maintenanceKey),
    people: localStorage.getItem(peopleKey),
  };

  try {
    localStorage.setItem(
      inventoryKey,
      JSON.stringify(backup.data.equipment)
    );

    localStorage.setItem(
      maintenanceKey,
      JSON.stringify(backup.data.maintenanceOrders)
    );

    localStorage.setItem(
      peopleKey,
      JSON.stringify(backup.data.people)
    );
  } catch (error) {
    try {
      if (previousData.equipment === null) {
        localStorage.removeItem(inventoryKey);
      } else {
        localStorage.setItem(inventoryKey, previousData.equipment);
      }

      if (previousData.maintenance === null) {
        localStorage.removeItem(maintenanceKey);
      } else {
        localStorage.setItem(maintenanceKey, previousData.maintenance);
      }

      if (previousData.people === null) {
        localStorage.removeItem(peopleKey);
      } else {
        localStorage.setItem(peopleKey, previousData.people);
      }
    } catch (restoreError) {
      console.error("Erro ao restaurar os dados anteriores:", restoreError);
    }

    throw error;
  }
}