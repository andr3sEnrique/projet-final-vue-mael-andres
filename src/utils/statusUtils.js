import {statusEnum} from "@/data/statusEnum.js";

export const statusUtils = (status, task) => {
    const st = status.find(s => s.id === task.status);
    return st ? st.name : null;
};

export const getStatusColor = (status) => {
    switch (status) {
        case statusEnum.VALID:
            return "bg-success";
        case statusEnum.IN_PROGRESS:
            return "bg-warning text-dark";
        case statusEnum.TO_DO:
            return "bg-secondary";
        case statusEnum.CANCELLED:
            return "bg-danger";
        case statusEnum.DONE:
            return "bg-primary";
        default:
            return "bg-light text-dark border";
    }
}