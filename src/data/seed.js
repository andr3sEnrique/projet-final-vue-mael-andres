import { statusEnum } from "./statusEnum.js";

export const seedData = {
  users: [
    { id: "1", name: "Laura Manager", email: "manager@test.com", password: "123", roles: ["manager"] },
    { id: "2", name: "David Dev", email: "dev@test.com", password: "123", roles: ["developer"] },
    { id: "3", name: "Sophie Dual", email: "dual@test.com", password: "123", roles: ["manager", "developer"] },
  ],
  projects: [
    { id: "1", title: "Corporative Website", description: "Complete redesign", managerIds: ["1", "3"], tasks: ["101", "102"], startDate: new Date(), endDate: new Date(), status: "2" },
    { id: "2", title: "Internal System", description: "Inventory", managerIds: ["3"], tasks: ["103", "104"], startDate: new Date(), endDate: new Date(), status: "3"  },
  ],
  tasks: [
    { id: "101", projectId: "1", title: "Setup Vue", description: "Install Vite and Pinia", status: "5", assignedTo: "1", comments: [] },
    { id: "102", projectId: "1", title: "Design Login", description: "Create form", status: "2", assignedTo: "1", comments: [] },
    { id: "103", projectId: "2", title: "Design Login", description: "Create form", status: "2", assignedTo: "2", comments: [] },
    { id: "104", projectId: "2", title: "Design Login 2", description: "Create form 2", status: "5", assignedTo: "", comments: [] },
  ],
  status: [
    { id: "1", name: statusEnum.VALID },
    { id: "2", name: statusEnum.IN_PROGRESS },
    { id: "3", name: statusEnum.CANCELLED },
    { id: "4", name: statusEnum.TO_DO },
    { id: "5", name: statusEnum.DONE },
    { id: "6", name: statusEnum.PENDING },
  ]
};