
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

export async function importBackup(file: File): Promise<boolean> {
  const content = await file.text();
  const backup: BackupData = JSON.parse(content);

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

  if (!confirmed) return false;

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

    return true;
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
      console.error(
        "Erro ao restaurar os dados anteriores:",
        restoreError
      );
    }

    throw error;
  }
}