export const requiredApprovalCount = (memberCount: number) => {
  // 50% + 1
  return Math.floor(memberCount / 2) + 1;
};

export const isApproved = (yesCount: number, required: number) => {
  return yesCount >= required;
};
