export interface SimulatedBrowserWallet {
  getAddress: () => Promise<string>;
  getNetworkId: () => Promise<number>;
}

class SimulatedWallet implements SimulatedBrowserWallet {
  private address: string;
  private networkId: number;

  constructor(address: string, networkId: number) {
    this.address = address;
    this.networkId = networkId;
  }

  async getAddress(): Promise<string> {
    return this.address;
  }

  async getNetworkId(): Promise<number> {
    return this.networkId;
  }
}

const nami = new SimulatedWallet('addr1qxvv3wzk9qt88w2nza6cqg2587uvxfkldnaw8h64gs7au3nrds6y7mv9ejt6z8tp3r755ytap33vaqtvd3mdja60xtds2u9vne', 0);
const eternl = new SimulatedWallet('addr1q93rdw6z8j02mpdw4exp2t4yvzlzlq8qcnp9nrl6knc3eh9glz4js4pan5rq2nyacvy0gmu2ka46865k08yf6zmqsncskn3ssw', 0);

export const getWallet = async (walletName: string): Promise<SimulatedBrowserWallet> => {
  switch (walletName) {
    case 'nami':
      return nami;
    case 'eternl':
      return eternl;
    default:
      throw new Error('Unsupported wallet');
  }
};