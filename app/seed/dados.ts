import type { Equipment } from "../../types/equipment";
import type { Person } from "../../types/person";
import type { MaintenanceOrder } from "../../types/maintenance";
import type { Room } from "../../types/room";
import type { Reservation } from "../../types/reservation";

export type SeedEquipment = Equipment;

export const seedEquipments: SeedEquipment[] = [
  { id: 1001, name: "Meta Quest 3 - Unidade 01", category: "Óculos VR", assetNumber: "VR-001", serialNumber: "MQ3-TEST-001", location: "Armário A1", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento de teste" },
  { id: 1002, name: "Meta Quest 3 - Unidade 02", category: "Óculos VR", assetNumber: "VR-002", serialNumber: "MQ3-TEST-002", location: "Armário A1", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento de teste" },
  { id: 1003, name: "Meta Quest 2 - Unidade 01", category: "Óculos VR", assetNumber: "VR-003", serialNumber: "MQ2-TEST-001", location: "Sala VR", status: "Em uso", operatingSystem: "Meta Horizon OS", notes: "Uso em atividades de treinamento" },
  { id: 1004, name: "Meta Quest 2 - Unidade 02", category: "Óculos VR", assetNumber: "VR-004", serialNumber: "MQ2-TEST-002", location: "Armário A2", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento de teste" },
  { id: 1005, name: "Notebook de Alto Desempenho 01", category: "Notebooks", assetNumber: "TI-001", serialNumber: "NOTE-TEST-001", location: "Bancada 01", status: "Disponível", operatingSystem: "Windows 11", notes: "Estação para realidade virtual" },
  { id: 1006, name: "Notebook de Alto Desempenho 02", category: "Notebooks", assetNumber: "TI-002", serialNumber: "NOTE-TEST-002", location: "Bancada 02", status: "Em uso", operatingSystem: "Windows 11", notes: "Estação para edição" },
  { id: 1007, name: "Computador VR 01", category: "Computadores", assetNumber: "TI-003", serialNumber: "PC-TEST-001", location: "Estação VR 01", status: "Disponível", operatingSystem: "Windows 11", notes: "Computador para aplicações VR" },
  { id: 1008, name: "Computador VR 02", category: "Computadores", assetNumber: "TI-004", serialNumber: "PC-TEST-002", location: "Estação VR 02", status: "Manutenção", operatingSystem: "Windows 11", notes: "Simulação de equipamento em manutenção" },
  { id: 1009, name: "Monitor 27 polegadas 01", category: "Monitores", assetNumber: "MON-001", serialNumber: "MON-TEST-001", location: "Bancada 01", status: "Disponível", operatingSystem: "", notes: "Monitor de teste" },
  { id: 1010, name: "Monitor 27 polegadas 02", category: "Monitores", assetNumber: "MON-002", serialNumber: "MON-TEST-002", location: "Bancada 02", status: "Em uso", operatingSystem: "", notes: "Monitor de teste" },
  { id: 1011, name: "Televisor de apoio 01", category: "Televisores", assetNumber: "TV-001", serialNumber: "TV-TEST-001", location: "Sala de treinamento", status: "Disponível", operatingSystem: "", notes: "Exibição de conteúdo" },
  { id: 1012, name: "Televisor de apoio 02", category: "Televisores", assetNumber: "TV-002", serialNumber: "TV-TEST-002", location: "Sala de reunião", status: "Disponível", operatingSystem: "", notes: "Exibição de conteúdo" },
  { id: 1013, name: "Controle VR 01", category: "Acessórios", assetNumber: "ACC-001", serialNumber: "CTRL-TEST-001", location: "Armário A1", status: "Disponível", operatingSystem: "", notes: "Controle de teste" },
  { id: 1014, name: "Controle VR 02", category: "Acessórios", assetNumber: "ACC-002", serialNumber: "CTRL-TEST-002", location: "Armário A1", status: "Manutenção", operatingSystem: "", notes: "Simulação de reparo" },
  { id: 1015, name: "Sensor de movimento 01", category: "Sensores", assetNumber: "SEN-001", serialNumber: "SEN-TEST-001", location: "Sala VR", status: "Disponível", operatingSystem: "", notes: "Sensor de teste" },
  { id: 1016, name: "Sensor de movimento 02", category: "Sensores", assetNumber: "SEN-002", serialNumber: "SEN-TEST-002", location: "Sala VR", status: "Em uso", operatingSystem: "", notes: "Sensor de teste" },
  { id: 1017, name: "Headset de áudio 01", category: "Áudio e vídeo", assetNumber: "AUD-001", serialNumber: "AUD-TEST-001", location: "Armário A2", status: "Disponível", operatingSystem: "", notes: "Áudio para treinamento" },
  { id: 1018, name: "Microfone USB 01", category: "Áudio e vídeo", assetNumber: "AUD-002", serialNumber: "MIC-TEST-001", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Captação de voz" },
  { id: 1019, name: "Kit de iluminação 01", category: "Iluminação", assetNumber: "ILU-001", serialNumber: "ILU-TEST-001", location: "Estúdio", status: "Baixado", operatingSystem: "", notes: "Simulação de equipamento baixado" },
  { id: 1020, name: "Câmera de gravação 01", category: "Outros", assetNumber: "OUT-001", serialNumber: "CAM-TEST-001", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Gravação de atividades" },
  { id: 1021, name: "Meta Quest 3 - Unidade 03", category: "Óculos VR", assetNumber: "VR-005", serialNumber: "MQ3-TEST-003", location: "Armário A2", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento para testes de realidade virtual" },
  { id: 1022, name: "Meta Quest 3 - Unidade 04", category: "Óculos VR", assetNumber: "VR-006", serialNumber: "MQ3-TEST-004", location: "Armário A2", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento para atividades práticas" },
  { id: 1023, name: "Meta Quest 2 - Unidade 03", category: "Óculos VR", assetNumber: "VR-007", serialNumber: "MQ2-TEST-003", location: "Armário A1", status: "Disponível", operatingSystem: "Meta Horizon OS", notes: "Equipamento para treinamento" },
  { id: 1024, name: "Notebook de Alto Desempenho 03", category: "Notebooks", assetNumber: "TI-005", serialNumber: "NOTE-TEST-003", location: "Bancada 03", status: "Disponível", operatingSystem: "Windows 11", notes: "Estação para edição audiovisual" },
  { id: 1025, name: "Notebook de Alto Desempenho 04", category: "Notebooks", assetNumber: "TI-006", serialNumber: "NOTE-TEST-004", location: "Bancada 04", status: "Disponível", operatingSystem: "Windows 11", notes: "Estação para aplicações VR" },
  { id: 1026, name: "Computador de Edição 01", category: "Computadores", assetNumber: "TI-007", serialNumber: "PC-TEST-003", location: "Estúdio", status: "Disponível", operatingSystem: "Windows 11", notes: "Estação de edição de vídeo" },
  { id: 1027, name: "Computador de Edição 02", category: "Computadores", assetNumber: "TI-008", serialNumber: "PC-TEST-004", location: "Estúdio", status: "Disponível", operatingSystem: "Windows 11", notes: "Estação de edição audiovisual" },
  { id: 1028, name: "Monitor 32 polegadas 01", category: "Monitores", assetNumber: "MON-003", serialNumber: "MON-TEST-003", location: "Bancada 03", status: "Disponível", operatingSystem: "", notes: "Monitor para edição" },
  { id: 1029, name: "Monitor 24 polegadas 01", category: "Monitores", assetNumber: "MON-004", serialNumber: "MON-TEST-004", location: "Bancada 04", status: "Disponível", operatingSystem: "", notes: "Monitor auxiliar" },
  { id: 1030, name: "Televisor de apoio 03", category: "Televisores", assetNumber: "TV-003", serialNumber: "TV-TEST-003", location: "Sala VR", status: "Disponível", operatingSystem: "", notes: "Exibição de apresentações" },
  { id: 1031, name: "Projetor multimídia 01", category: "Televisores", assetNumber: "TV-004", serialNumber: "PROJ-TEST-001", location: "Sala de treinamento", status: "Disponível", operatingSystem: "", notes: "Projeção de conteúdo audiovisual" },
  { id: 1032, name: "Controle VR 03", category: "Acessórios", assetNumber: "ACC-003", serialNumber: "CTRL-TEST-003", location: "Armário A1", status: "Disponível", operatingSystem: "", notes: "Controle para headset VR" },
  { id: 1033, name: "Estação de carregamento VR", category: "Acessórios", assetNumber: "ACC-004", serialNumber: "CHG-TEST-001", location: "Armário A2", status: "Disponível", operatingSystem: "", notes: "Carregamento de headsets" },
  { id: 1034, name: "Sensor de movimento 03", category: "Sensores", assetNumber: "SEN-003", serialNumber: "SEN-TEST-003", location: "Sala VR", status: "Disponível", operatingSystem: "", notes: "Sensor para captura de movimento" },
  { id: 1035, name: "Sensor de movimento 04", category: "Sensores", assetNumber: "SEN-004", serialNumber: "SEN-TEST-004", location: "Sala VR", status: "Disponível", operatingSystem: "", notes: "Sensor auxiliar de rastreamento" },
  { id: 1036, name: "Câmera profissional 02", category: "Áudio e vídeo", assetNumber: "AUD-003", serialNumber: "CAM-TEST-002", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Captação de vídeo" },
  { id: 1037, name: "Gravador de áudio 01", category: "Áudio e vídeo", assetNumber: "AUD-004", serialNumber: "REC-TEST-001", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Gravação de áudio" },
  { id: 1038, name: "Kit de iluminação 02", category: "Iluminação", assetNumber: "ILU-002", serialNumber: "ILU-TEST-002", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Iluminação para gravações" },
  { id: 1039, name: "Tripé profissional 01", category: "Acessórios", assetNumber: "ACC-005", serialNumber: "TRI-TEST-001", location: "Estúdio", status: "Disponível", operatingSystem: "", notes: "Suporte para câmeras" },
  { id: 1040, name: "Mesa digitalizadora 01", category: "Outros", assetNumber: "OUT-002", serialNumber: "TAB-TEST-001", location: "Bancada 03", status: "Disponível", operatingSystem: "", notes: "Apoio à produção audiovisual" },
];

export type SeedPerson = Person;

export const seedPeople: SeedPerson[] = [
  { id: "seed-person-001", name: "Ana Souza", role: "Técnico", sector: "Suporte técnico", phone: "(18) 99100-0001", email: "ana.souza@example.com", active: true },
  { id: "seed-person-002", name: "Bruno Oliveira", role: "Técnico", sector: "Manutenção", phone: "(18) 99100-0002", email: "bruno.oliveira@example.com", active: true },
  { id: "seed-person-003", name: "Carla Santos", role: "Responsável autorizado", sector: "Coordenação", phone: "(18) 99100-0003", email: "carla.santos@example.com", active: true },
  { id: "seed-person-004", name: "Diego Almeida", role: "Professor", sector: "Treinamento", phone: "(18) 99100-0004", email: "diego.almeida@example.com", active: true },
  { id: "seed-person-005", name: "Eduarda Lima", role: "Aluno", sector: "Turma VR 01", phone: "(18) 99100-0005", email: "eduarda.lima@example.com", active: true },
  { id: "seed-person-006", name: "Felipe Costa", role: "Aluno", sector: "Turma VR 01", phone: "(18) 99100-0006", email: "felipe.costa@example.com", active: true },
  { id: "seed-person-007", name: "Gabriela Martins", role: "Professor", sector: "Treinamento", phone: "(18) 99100-0007", email: "gabriela.martins@example.com", active: true },
  { id: "seed-person-008", name: "Henrique Rodrigues", role: "Gestor", sector: "Gestão", phone: "(18) 99100-0008", email: "henrique.rodrigues@example.com", active: true },
  { id: "seed-person-009", name: "Isabela Ferreira", role: "Colaborador", sector: "Operações", phone: "(18) 99100-0009", email: "isabela.ferreira@example.com", active: true },
  { id: "seed-person-010", name: "João Pereira", role: "Técnico", sector: "Suporte técnico", phone: "(18) 99100-0010", email: "joao.pereira@example.com", active: true },
  { id: "seed-person-011", name: "Karen Ribeiro", role: "Responsável autorizado", sector: "Coordenação", phone: "(18) 99100-0011", email: "karen.ribeiro@example.com", active: true },
  { id: "seed-person-012", name: "Lucas Carvalho", role: "Aluno", sector: "Turma VR 02", phone: "(18) 99100-0012", email: "lucas.carvalho@example.com", active: true },
  { id: "seed-person-013", name: "Mariana Gomes", role: "Professor", sector: "Treinamento", phone: "(18) 99100-0013", email: "mariana.gomes@example.com", active: true },
  { id: "seed-person-014", name: "Nicolas Barbosa", role: "Colaborador", sector: "Operações", phone: "(18) 99100-0014", email: "nicolas.barbosa@example.com", active: true },
  { id: "seed-person-015", name: "Olivia Mendes", role: "Aluno", sector: "Turma VR 02", phone: "(18) 99100-0015", email: "olivia.mendes@example.com", active: true },
  { id: "seed-person-016", name: "Paulo Nascimento", role: "Técnico", sector: "Manutenção", phone: "(18) 99100-0016", email: "paulo.nascimento@example.com", active: true },
  { id: "seed-person-017", name: "Queila Azevedo", role: "Colaborador", sector: "Operações", phone: "(18) 99100-0017", email: "queila.azevedo@example.com", active: true },
  { id: "seed-person-018", name: "Rafael Moreira", role: "Aluno", sector: "Turma VR 03", phone: "(18) 99100-0018", email: "rafael.moreira@example.com", active: true },
  { id: "seed-person-019", name: "Sofia Cardoso", role: "Gestor", sector: "Gestão", phone: "(18) 99100-0019", email: "sofia.cardoso@example.com", active: true },
  { id: "seed-person-020", name: "Tiago Fernandes", role: "Responsável autorizado", sector: "Coordenação", phone: "(18) 99100-0020", email: "tiago.fernandes@example.com", active: true },
  { id: "seed-person-021", name: "Amanda Ribeiro", role: "Aluno", sector: "Turma VR 04", phone: "(18) 99100-0021", email: "amanda.ribeiro@example.com", active: true },
  { id: "seed-person-022", name: "Bernardo Martins", role: "Professor", sector: "Audiovisual", phone: "(18) 99100-0022", email: "bernardo.martins@example.com", active: true },
  { id: "seed-person-023", name: "Camila Ferreira", role: "Técnico", sector: "Suporte técnico", phone: "(18) 99100-0023", email: "camila.ferreira@example.com", active: true },
  { id: "seed-person-024", name: "Daniel Costa", role: "Aluno", sector: "Turma VR 04", phone: "(18) 99100-0024", email: "daniel.costa@example.com", active: true },
  { id: "seed-person-025", name: "Elisa Rodrigues", role: "Responsável autorizado", sector: "Coordenação", phone: "(18) 99100-0025", email: "elisa.rodrigues@example.com", active: true },
  { id: "seed-person-026", name: "Fernando Almeida", role: "Colaborador", sector: "Produção audiovisual", phone: "(18) 99100-0026", email: "fernando.almeida@example.com", active: true },
  { id: "seed-person-027", name: "Giovana Carvalho", role: "Aluno", sector: "Turma VR 05", phone: "(18) 99100-0027", email: "giovana.carvalho@example.com", active: true },
  { id: "seed-person-028", name: "Heitor Santos", role: "Gestor", sector: "Gestão do laboratório", phone: "(18) 99100-0028", email: "heitor.santos@example.com", active: true },
  { id: "seed-person-029", name: "Isadora Lima", role: "Professor", sector: "Realidade virtual", phone: "(18) 99100-0029", email: "isadora.lima@example.com", active: true },
  { id: "seed-person-030", name: "João Victor Mendes", role: "Técnico", sector: "Manutenção", phone: "(18) 99100-0030", email: "joao.victor.mendes@example.com", active: true },
];

export type SeedRoom = Room;

export const seedRooms: SeedRoom[] = [
  {
    id: "seed-room-001",
    name: "Sala de Realidade Virtual 01",
    location: "Bloco de Laboratórios",
    capacity: 10,
    active: true,
  },
  {
    id: "seed-room-002",
    name: "Estúdio Audiovisual",
    location: "Bloco de Laboratórios",
    capacity: 8,
    active: true,
  },
  {
    id: "seed-room-003",
    name: "Sala de Edição",
    location: "Laboratório Audiovisual",
    capacity: 6,
    active: true,
  },
  {
    id: "seed-room-004",
    name: "Sala de Captura de Movimento",
    location: "Bloco de Laboratórios",
    capacity: 12,
    active: true,
  },
  {
    id: "seed-room-005",
    name: "Estúdio de Gravação 02",
    location: "Laboratório Audiovisual",
    capacity: 6,
    active: true,
  },
  {
    id: "seed-room-006",
    name: "Sala de Pós-produção",
    location: "Bloco de Laboratórios",
    capacity: 8,
    active: true,
  },
  {
    id: "seed-room-007",
    name: "Sala de Equipamentos",
    location: "Bloco de Laboratórios",
    capacity: 4,
    active: false,
  },
  {
    id: "seed-room-008",
    name: "Sala de Treinamento Audiovisual",
    location: "Bloco de Laboratórios",
    capacity: 15,
    active: true,
  },
];

function getSeedDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export type SeedMaintenanceOrder = MaintenanceOrder;

const seedMaintenanceOrdersBase: SeedMaintenanceOrder[] = [
  { id: "seed-order-001", orderNumber: "OS-SEED-001", equipment: "Meta Quest 3 - Unidade 01", equipmentId: 1001, assetNumber: "VR-001", previousEquipmentStatus: "Disponível", problem: "Falha intermitente no rastreamento", responsible: "Ana Souza", openingDate: "2026-01-05", status: "Concluída", serviceNotes: "Sensores testados e funcionamento validado.", completionDate: "2026-01-06", assignedPersonId: "seed-person-001", assignedPersonName: "Ana Souza", performedByPersonId: "seed-person-002", performedByName: "Bruno Oliveira", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-002", orderNumber: "OS-SEED-002", equipment: "Meta Quest 2 - Unidade 01", equipmentId: 1003, assetNumber: "VR-003", previousEquipmentStatus: "Em uso", problem: "Imagem não inicia corretamente", responsible: "Bruno Oliveira", openingDate: "2026-01-08", status: "Concluída", serviceNotes: "Aplicativo atualizado e equipamento testado.", completionDate: "2026-01-09", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira", performedByPersonId: "seed-person-010", performedByName: "João Pereira", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-003", orderNumber: "OS-SEED-003", equipment: "Notebook de Alto Desempenho 01", equipmentId: 1005, assetNumber: "TI-001", previousEquipmentStatus: "Disponível", problem: "Superaquecimento durante uso", responsible: "Carla Santos", openingDate: "2026-01-12", status: "Concluída", serviceNotes: "Ventilação limpa e teste de carga realizado.", completionDate: "2026-01-13", assignedPersonId: "seed-person-010", assignedPersonName: "João Pereira", performedByPersonId: "seed-person-016", performedByName: "Paulo Nascimento", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-004", orderNumber: "OS-SEED-004", equipment: "Computador VR 02", equipmentId: 1008, assetNumber: "TI-004", previousEquipmentStatus: "Manutenção", problem: "Falha ao iniciar o sistema operacional", responsible: "Diego Almeida", openingDate: "2026-01-15", status: "Aguardando peças", serviceNotes: "Diagnóstico indica possível falha no SSD.", assignedPersonId: "seed-person-001", assignedPersonName: "Ana Souza" },
  { id: "seed-order-005", orderNumber: "OS-SEED-005", equipment: "Controle VR 02", equipmentId: 1014, assetNumber: "ACC-002", previousEquipmentStatus: "Manutenção", problem: "Botão de acionamento sem resposta", responsible: "Eduarda Lima", openingDate: "2026-01-18", status: "Em andamento", serviceNotes: "Inspeção e limpeza em andamento.", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira" },
  { id: "seed-order-006", orderNumber: "OS-SEED-006", equipment: "Monitor 27 polegadas 01", equipmentId: 1009, assetNumber: "MON-001", previousEquipmentStatus: "Disponível", problem: "Oscilação de imagem", responsible: "Felipe Costa", openingDate: "2026-01-20", status: "Concluída", serviceNotes: "Cabo substituído e imagem estabilizada.", completionDate: "2026-01-21", assignedPersonId: "seed-person-016", assignedPersonName: "Paulo Nascimento", performedByPersonId: "seed-person-001", performedByName: "Ana Souza", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-007", orderNumber: "OS-SEED-007", equipment: "Televisor de apoio 01", equipmentId: 1011, assetNumber: "TV-001", previousEquipmentStatus: "Disponível", problem: "Ausência de áudio", responsible: "Gabriela Martins", openingDate: "2026-01-23", status: "Concluída", serviceNotes: "Configuração de áudio corrigida.", completionDate: "2026-01-24", assignedPersonId: "seed-person-010", assignedPersonName: "João Pereira", performedByPersonId: "seed-person-016", performedByName: "Paulo Nascimento", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-008", orderNumber: "OS-SEED-008", equipment: "Sensor de movimento 01", equipmentId: 1015, assetNumber: "SEN-001", previousEquipmentStatus: "Disponível", problem: "Leitura inconsistente de movimento", responsible: "Henrique Rodrigues", openingDate: "2026-01-25", status: "Concluída", serviceNotes: "Posicionamento ajustado e calibração realizada.", completionDate: "2026-01-26", assignedPersonId: "seed-person-001", assignedPersonName: "Ana Souza", performedByPersonId: "seed-person-002", performedByName: "Bruno Oliveira", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-009", orderNumber: "OS-SEED-009", equipment: "Headset de áudio 01", equipmentId: 1017, assetNumber: "AUD-001", previousEquipmentStatus: "Disponível", problem: "Áudio com ruído", responsible: "Isabela Ferreira", openingDate: "2026-02-02", status: "Concluída", serviceNotes: "Conector revisado e áudio testado.", completionDate: "2026-02-03", assignedPersonId: "seed-person-016", assignedPersonName: "Paulo Nascimento", performedByPersonId: "seed-person-010", performedByName: "João Pereira", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-010", orderNumber: "OS-SEED-010", equipment: "Câmera de gravação 01", equipmentId: 1020, assetNumber: "OUT-001", previousEquipmentStatus: "Disponível", problem: "Foco automático instável", responsible: "Mariana Gomes", openingDate: "2026-02-05", status: "Concluída", serviceNotes: "Configuração restaurada e foco validado.", completionDate: "2026-02-06", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira", performedByPersonId: "seed-person-001", performedByName: "Ana Souza", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-011", orderNumber: "OS-SEED-011", equipment: "Meta Quest 3 - Unidade 02", equipmentId: 1002, assetNumber: "VR-002", previousEquipmentStatus: "Disponível", problem: "Espuma facial desgastada", responsible: "Lucas Carvalho", openingDate: "2026-02-08", status: "Concluída", serviceNotes: "Acessório substituído e ajuste conferido.", completionDate: "2026-02-09", assignedPersonId: "seed-person-010", assignedPersonName: "João Pereira", performedByPersonId: "seed-person-016", performedByName: "Paulo Nascimento", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-012", orderNumber: "OS-SEED-012", equipment: "Notebook de Alto Desempenho 02", equipmentId: 1006, assetNumber: "TI-002", previousEquipmentStatus: "Em uso", problem: "Bateria com baixa autonomia", responsible: "Olivia Mendes", openingDate: "2026-02-11", status: "Concluída", serviceNotes: "Bateria avaliada e plano de substituição registrado.", completionDate: "2026-02-12", assignedPersonId: "seed-person-001", assignedPersonName: "Ana Souza", performedByPersonId: "seed-person-002", performedByName: "Bruno Oliveira", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-013", orderNumber: "OS-SEED-013", equipment: "Monitor 27 polegadas 02", equipmentId: 1010, assetNumber: "MON-002", previousEquipmentStatus: "Em uso", problem: "Conexão de vídeo intermitente", responsible: "Rafael Moreira", openingDate: "2026-02-14", status: "Concluída", serviceNotes: "Conexão revisada e monitor testado.", completionDate: "2026-02-15", assignedPersonId: "seed-person-010", assignedPersonName: "João Pereira", performedByPersonId: "seed-person-016", performedByName: "Paulo Nascimento", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-014", orderNumber: "OS-SEED-014", equipment: "Televisor de apoio 02", equipmentId: 1012, assetNumber: "TV-002", previousEquipmentStatus: "Disponível", problem: "Controle remoto sem resposta", responsible: "Sofia Cardoso", openingDate: "2026-02-18", status: "Concluída", serviceNotes: "Pilhas substituídas e comando testado.", completionDate: "2026-02-19", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira", performedByPersonId: "seed-person-001", performedByName: "Ana Souza", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-015", orderNumber: "OS-SEED-015", equipment: "Sensor de movimento 02", equipmentId: 1016, assetNumber: "SEN-002", previousEquipmentStatus: "Em uso", problem: "Sensor perde conexão", responsible: "Tiago Fernandes", openingDate: "2026-02-21", status: "Concluída", serviceNotes: "Conexão revisada e teste de estabilidade concluído.", completionDate: "2026-02-22", assignedPersonId: "seed-person-016", assignedPersonName: "Paulo Nascimento", performedByPersonId: "seed-person-010", performedByName: "João Pereira", releasedByPersonId: "seed-person-011", releasedByName: "Karen Ribeiro" },
  { id: "seed-order-016", orderNumber: "OS-SEED-016", equipment: "Kit de iluminação 01", equipmentId: 1019, assetNumber: "ILU-001", previousEquipmentStatus: "Baixado", problem: "Falha elétrica identificada", responsible: "Ana Souza", openingDate: "2026-02-24", status: "Concluída", serviceNotes: "Equipamento mantido como baixado para fins de teste.", completionDate: "2026-02-25", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira", performedByPersonId: "seed-person-001", performedByName: "Ana Souza", releasedByPersonId: "seed-person-003", releasedByName: "Carla Santos" },
  { id: "seed-order-017", orderNumber: "OS-SEED-017", equipment: "Meta Quest 2 - Unidade 02", equipmentId: 1004, assetNumber: "VR-004", previousEquipmentStatus: "Disponível", problem: "Lentes precisam de inspeção", responsible: "Bruno Oliveira", openingDate: "2026-03-02", status: "Aberta", serviceNotes: "", assignedPersonId: "seed-person-001", assignedPersonName: "Ana Souza" },
  { id: "seed-order-018", orderNumber: "OS-SEED-018", equipment: "Computador VR 01", equipmentId: 1007, assetNumber: "TI-003", previousEquipmentStatus: "Disponível", problem: "Queda de desempenho em aplicações VR", responsible: "Carla Santos", openingDate: "2026-03-04", status: "Em andamento", serviceNotes: "Verificação de drivers em andamento.", assignedPersonId: "seed-person-002", assignedPersonName: "Bruno Oliveira" },
  { id: "seed-order-019", orderNumber: "OS-SEED-019", equipment: "Controle VR 01", equipmentId: 1013, assetNumber: "ACC-001", previousEquipmentStatus: "Disponível", problem: "Desgaste no gatilho", responsible: "Diego Almeida", openingDate: "2026-03-06", status: "Aguardando peças", serviceNotes: "Aguardando componente de reposição.", assignedPersonId: "seed-person-016", assignedPersonName: "Paulo Nascimento" },
  { id: "seed-order-020", orderNumber: "OS-SEED-020", equipment: "Microfone USB 01", equipmentId: 1018, assetNumber: "AUD-002", previousEquipmentStatus: "Disponível", problem: "Microfone não reconhecido pelo computador", responsible: "Gabriela Martins", openingDate: "2026-03-09", status: "Aberta", serviceNotes: "", assignedPersonId: "seed-person-010", assignedPersonName: "João Pereira" },
  {
    id: "seed-order-021",
    orderNumber: "OS-SEED-021",
    equipment: "Meta Quest 3 - Unidade 03",
    equipmentId: 1021,
    assetNumber: "VR-005",
    previousEquipmentStatus: "Disponível",
    problem: "Falha no sensor de proximidade",
    responsible: "Amanda Ribeiro",
    openingDate: getSeedDate(-8),
    status: "Concluída",
    serviceNotes: "Sensor recalibrado e funcionamento validado.",
    completionDate: getSeedDate(-7),
    assignedPersonId: "seed-person-001",
    assignedPersonName: "Ana Souza",
    performedByPersonId: "seed-person-023",
    performedByName: "Camila Ferreira",
    releasedByPersonId: "seed-person-003",
    releasedByName: "Carla Santos",
  },
  {
    id: "seed-order-022",
    orderNumber: "OS-SEED-022",
    equipment: "Notebook de Alto Desempenho 03",
    equipmentId: 1024,
    assetNumber: "TI-005",
    previousEquipmentStatus: "Disponível",
    problem: "Teclado apresenta falhas",
    responsible: "Bernardo Martins",
    openingDate: getSeedDate(-6),
    status: "Concluída",
    serviceNotes: "Teclado revisado e funcionamento testado.",
    completionDate: getSeedDate(-5),
    assignedPersonId: "seed-person-023",
    assignedPersonName: "Camila Ferreira",
    performedByPersonId: "seed-person-030",
    performedByName: "João Victor Mendes",
    releasedByPersonId: "seed-person-025",
    releasedByName: "Elisa Rodrigues",
  },
  {
    id: "seed-order-023",
    orderNumber: "OS-SEED-023",
    equipment: "Computador de Edição 01",
    equipmentId: 1026,
    assetNumber: "TI-007",
    previousEquipmentStatus: "Disponível",
    problem: "Lentidão durante renderização",
    responsible: "Daniel Costa",
    openingDate: getSeedDate(-4),
    status: "Aberta",
    serviceNotes: "",
    assignedPersonId: "seed-person-030",
    assignedPersonName: "João Victor Mendes",
  },
  {
    id: "seed-order-024",
    orderNumber: "OS-SEED-024",
    equipment: "Monitor 32 polegadas 01",
    equipmentId: 1028,
    assetNumber: "MON-003",
    previousEquipmentStatus: "Disponível",
    problem: "Tela apresenta manchas",
    responsible: "Elisa Rodrigues",
    openingDate: getSeedDate(-3),
    status: "Em andamento",
    serviceNotes: "Inspeção do painel em andamento.",
    assignedPersonId: "seed-person-023",
    assignedPersonName: "Camila Ferreira",
  },
  {
    id: "seed-order-025",
    orderNumber: "OS-SEED-025",
    equipment: "Televisor de apoio 03",
    equipmentId: 1030,
    assetNumber: "TV-003",
    previousEquipmentStatus: "Disponível",
    problem: "Falha na conexão HDMI",
    responsible: "Fernando Almeida",
    openingDate: getSeedDate(-2),
    status: "Aguardando peças",
    serviceNotes: "Aguardando cabo e adaptador de reposição.",
    assignedPersonId: "seed-person-001",
    assignedPersonName: "Ana Souza",
  },
  {
    id: "seed-order-026",
    orderNumber: "OS-SEED-026",
    equipment: "Projetor multimídia 01",
    equipmentId: 1031,
    assetNumber: "TV-004",
    previousEquipmentStatus: "Disponível",
    problem: "Imagem com baixa luminosidade",
    responsible: "Giovana Carvalho",
    openingDate: getSeedDate(-1),
    status: "Aberta",
    serviceNotes: "",
    assignedPersonId: "seed-person-030",
    assignedPersonName: "João Victor Mendes",
  },
  {
    id: "seed-order-027",
    orderNumber: "OS-SEED-027",
    equipment: "Sensor de movimento 03",
    equipmentId: 1034,
    assetNumber: "SEN-003",
    previousEquipmentStatus: "Disponível",
    problem: "Perda de rastreamento durante utilização",
    responsible: "Heitor Santos",
    openingDate: getSeedDate(0),
    status: "Em andamento",
    serviceNotes: "Análise de conexão e posicionamento em andamento.",
    assignedPersonId: "seed-person-023",
    assignedPersonName: "Camila Ferreira",
  },
  {
    id: "seed-order-028",
    orderNumber: "OS-SEED-028",
    equipment: "Gravador de áudio 01",
    equipmentId: 1037,
    assetNumber: "AUD-004",
    previousEquipmentStatus: "Disponível",
    problem: "Ruído durante gravação",
    responsible: "Isadora Lima",
    openingDate: getSeedDate(0),
    status: "Aberta",
    serviceNotes: "",
    assignedPersonId: "seed-person-001",
    assignedPersonName: "Ana Souza",
  },
  {
    id: "seed-order-029",
    orderNumber: "OS-SEED-029",
    equipment: "Notebook de Alto Desempenho 04",
    equipmentId: 1025,
    assetNumber: "TI-006",
    previousEquipmentStatus: "Disponível",
    problem: "Bateria não mantém carga",
    responsible: "Amanda Ribeiro",
    openingDate: getSeedDate(-2),
    status: "Em andamento",
    serviceNotes: "Diagnóstico da bateria em andamento.",
    assignedPersonId: "seed-person-030",
    assignedPersonName: "João Victor Mendes",
  },
  {
    id: "seed-order-030",
    orderNumber: "OS-SEED-030",
    equipment: "Kit de iluminação 02",
    equipmentId: 1038,
    assetNumber: "ILU-002",
    previousEquipmentStatus: "Disponível",
    problem: "Uma das luminárias não acende",
    responsible: "Bernardo Martins",
    openingDate: getSeedDate(-1),
    status: "Aguardando peças",
    serviceNotes: "Aguardando substituição do componente elétrico.",
    assignedPersonId: "seed-person-023",
    assignedPersonName: "Camila Ferreira",
  },
];

export const seedMaintenanceOrders: SeedMaintenanceOrder[] =
  seedMaintenanceOrdersBase.map((order, index) => {
    const openingDate = getSeedDate(-(60 - index * 2));

    return {
      ...order,
      openingDate,
      ...(order.status === "Concluída"
        ? { completionDate: getSeedDate(-(59 - index * 2)) }
        : {}),
    };
  });

function getSeedBusinessDate(daysOffset: number): string {
  const date = new Date();
  const direction = daysOffset >= 0 ? 1 : -1;
  let remainingDays = Math.abs(daysOffset);

  while (remainingDays > 0) {
    date.setDate(date.getDate() + direction);

    const day = date.getDay();

    if (day !== 0 && day !== 6) {
      remainingDays--;
    }
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const activeSeedRooms = seedRooms.filter((room) => room.active);

const equipmentWithActiveMaintenance = new Set(
  seedMaintenanceOrders
    .filter((order) => order.status !== "Concluída")
    .map((order) => order.equipmentId)
    .filter((id): id is number => id !== undefined)
);

const availableSeedEquipments = seedEquipments.filter(
  (equipment) =>
    equipment.status === "Disponível" &&
    !equipmentWithActiveMaintenance.has(equipment.id)
);

const seedReservationPeople = seedPeople.filter((person) => person.active);

const seedStaffPeople = seedPeople.filter(
  (person) =>
    person.active &&
    ["Técnico", "Responsável autorizado", "Gestor"].includes(person.role)
);

export const seedReservations: Reservation[] = Array.from(
  { length: 40 },
  (_, index) => {
    const isCompleted = index < 12;
    const isCancelled = index >= 12 && index < 20;
    const status = isCompleted
      ? "Concluída"
      : isCancelled
        ? "Cancelada"
        : "Confirmada";

    const useRoom = index % 2 === 0 || availableSeedEquipments.length === 0;

    const room = activeSeedRooms[index % activeSeedRooms.length];
    const equipment =
      availableSeedEquipments[
      Math.floor(index / 2) % availableSeedEquipments.length
      ];

    const resource = useRoom ? room : equipment;
    const resourceType = useRoom ? "Sala" : "Equipamento";

    const dateOffset = isCompleted
      ? -60 + (index % 12) * 3
      : isCancelled
        ? -24 + ((index - 12) % 8) * 2
        : index - 19;

    const date = getSeedBusinessDate(dateOffset);

    const startTime = index % 3 === 0 ? "08:00" : "13:00";
    const endTime = index % 3 === 0 ? "10:00" : "15:00";

    const person =
      seedReservationPeople[index % seedReservationPeople.length];

    const confirmedBy =
      seedStaffPeople[index % seedStaffPeople.length];

    const createdAt = new Date().toISOString();

    const reservation: Reservation = {
      id: `seed-reservation-${String(index + 1).padStart(3, "0")}`,
      resourceType,
      resourceId: resource.id,
      resourceName: resource.name,
      reservedBy: person.name,
      date,
      startTime,
      endTime,
      status,
      notes: isCompleted
        ? "Reserva de teste concluída."
        : isCancelled
          ? "Reserva de teste cancelada."
          : "Reserva de teste confirmada.",
      createdAt,
      ...(resourceType === "Equipamento"
        ? {
          returnStatus: isCompleted
            ? "Devolvida"
            : isCancelled
              ? "Não se aplica"
              : "Aguardando devolução",
        }
        : {}),
      ...(resourceType === "Equipamento" && isCompleted
        ? {
          returnReportedAt: createdAt,
          returnConfirmedAt: createdAt,
          returnConfirmedBy: confirmedBy.name,
        }
        : {}),
    };

    return reservation;
  }
);