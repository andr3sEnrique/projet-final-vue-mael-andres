export const seedData = {
    users: [
      { id: '1', name: 'Laura Manager', email: 'manager@test.com', password: '123', roles: ['manager'] },
      { id: '2', name: 'David Dev', email: 'dev@test.com', password: '123', roles: ['developer'] },
      { id: '3', name: 'Sophie Dual', email: 'dual@test.com', password: '123', roles: ['manager', 'developer'] },
    ],
    projects: [
      { id: '1', title: 'Web Corporativa', description: 'Redesign completo', managerIds: ['1', '3'], tasks: ['101', '102'] },
      { id: '2', title: 'App Interna', description: 'Gestión de inventario', managerIds: ['3'],  tasks: [] },
    ],
    tasks: [
      { id: '101', projectId: '1', title: 'Setup Vue', description: 'Instalar Vite y Pinia', status: 'VALIDE', assignedTo: '1', comments: [] },
      { id: '102', projectId: '1', title: 'Diseñar Login', description: 'Crear formulario', status: 'EN_COURS', assignedTo: '1', comments: [] },
    ]
  };