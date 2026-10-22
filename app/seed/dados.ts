import type { Equipment } from "../../types/equipment";
import type { Person } from "../../types/person";
import type { MaintenanceOrder } from "../../types/maintenance";
import type { Room } from "../../types/room";

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
];

export type SeedMaintenanceOrder = MaintenanceOrder;

export const seedMaintenanceOrders: SeedMaintenanceOrder[] = [
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
];
