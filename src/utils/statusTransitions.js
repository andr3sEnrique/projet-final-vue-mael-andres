import { statusEnum } from "@/data/statusEnum.js";

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

export const getAvailableStatusTransitions = (currentStatus, userRole) => {
  const transitions = statusTransitions[userRole];
  
  if (!transitions) {
    return [];
  }

  return transitions[currentStatus] || [];
};
