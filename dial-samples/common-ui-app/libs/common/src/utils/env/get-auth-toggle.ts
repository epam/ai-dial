export const getIsEnableAuthToggle = (): boolean => {
  return !!process.env.NEXTAUTH_URL;
};
