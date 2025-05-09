interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
  