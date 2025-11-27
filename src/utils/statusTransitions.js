import { statusEnum } from "@/data/statusEnum.js";

/**
 * Define las transiciones de estado permitidas según el rol del usuario
 * Developer: VALID -> IN PROGRESS -> DONE (solo puede cambiar cuando está en VALID)
 * Manager: puede cambiar a VALID, CANCELLED, DONE desde cualquier estado
 */

export const statusTransitions = {
  developer: {
    [statusEnum.VALID]: [statusEnum.IN_PROGRESS],
    [statusEnum.IN_PROGRESS]: [statusEnum.DONE],
    [statusEnum.DONE]: [],
    [statusEnum.PENDING]: [],
    [statusEnum.CANCELLED]: [],
    [statusEnum.TO_DO]: [],
  },
  manager: {
    [statusEnum.VALID]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
    [statusEnum.IN_PROGRESS]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
    [statusEnum.DONE]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
    [statusEnum.PENDING]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
    [statusEnum.CANCELLED]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
    [statusEnum.TO_DO]: [statusEnum.VALID, statusEnum.CANCELLED, statusEnum.DONE],
  },
};

/**
 * Obtiene los estados disponibles para transición según el rol y estado actual
 * @param {string} currentStatus - Estado actual de la tarea
 * @param {string} userRole - Rol del usuario ('developer' o 'manager')
 * @returns {array} Array de estados disponibles para transición
 */
export const getAvailableStatusTransitions = (currentStatus, userRole) => {
  const transitions = statusTransitions[userRole];
  
  if (!transitions) {
    return [];
  }

  return transitions[currentStatus] || [];
};

/**
 * Verifica si un usuario puede cambiar el estado de una tarea
 * @param {string} currentStatus - Estado actual de la tarea
 * @param {string} newStatus - Nuevo estado deseado
 * @param {string} userRole - Rol del usuario
 * @returns {boolean} True si la transición es permitida
 */
export const canChangeStatus = (currentStatus, newStatus, userRole) => {
  const availableTransitions = getAvailableStatusTransitions(currentStatus, userRole);
  return availableTransitions.includes(newStatus);
};
