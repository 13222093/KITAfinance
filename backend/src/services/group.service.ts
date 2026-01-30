export const getStreakInfo = (createdAt: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diffInDays = Math.floor((now - createdAt) / 86400);

    let badgeColor = "gray";
    if (diffInDays >= 200) badgeColor = "blue";
    else if (diffInDays >= 100) badgeColor = "purple";
    else if (diffInDays >= 30) badgeColor = "red-orange";
    else if (diffInDays >= 10) badgeColor = "orange";
    else if (diffInDays >= 3) badgeColor = "yellow";

    const weeks = Math.floor(diffInDays / 7);
    const fireCount = weeks >= 5 ? 5 : weeks >= 3 ? 3 : weeks >= 1 ? 1 : 0;

    return { diffInDays, badgeColor, fireCount };
};