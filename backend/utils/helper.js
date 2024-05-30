export const getDateOneWeekAgo = () => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - 7));
};