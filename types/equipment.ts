export type Status =
  | "Disponível"
  | "Em uso"
  | "Manutenção"
  | "Baixado";

export type Equipment = {
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

export const categories = [
  "Óculos VR",
  "Computadores",
  "Notebooks",
  "Televisores",
  "Monitores",
  "Acessórios",
  "Sensores",
  "Áudio e vídeo",
  "Iluminação",
  "Outros",
];

export const statuses: Status[] = [
  "Disponível",
  "Em uso",
  "Manutenção",
  "Baixado",
];