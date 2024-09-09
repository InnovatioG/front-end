export const installedWallets = ['nami', 'eternl'];

export const isWalletInstalled = (walletName: string): boolean => {
  return installedWallets.includes(walletName);
};