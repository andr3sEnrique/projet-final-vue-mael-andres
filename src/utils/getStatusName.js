export const getStatusName = (status, task) => {
    const st = status.find(s => s.id === task.status);
    return st ? st.name : null;
};