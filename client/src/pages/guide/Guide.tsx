export function Guide() {
  return (
    <div className="relative h-screen -mt-20 mb-10">
        <div className="relative flex flex-col items-center space-y-12 mt-20 mb-10">
          
          <img className="block -mb-10 h-10 " src="/public/Logo.png" alt="Cubitorium" />
          <p className="text-sm text-gray-900 text-center max-w-lg mt-20 bg-gray-50 -mb-20">
            💡  Before you start enjoying all the features of Cubitorium, please read and follow this series of essential steps to be able to use the site swiftly.
          </p>
          <h1 className="text-4xl font-bold text-accent-dark text-center">Getting Started with Cryptocurrency Wallets</h1>

          <div className="max-w-xl w-full mt-10 mb-10">
            <h2 className="text-2xl font-bold my-4 -mt-3">What is a Cryptocurrency Wallet?</h2>
            <p className="text-gray-900 mb-4">
              A cryptocurrency wallet is a secure digital wallet used to store, send, and receive digital currencies like Bitcoin and Ethereum. It stores your public and private keys, allowing you to manage your cryptocurrencies and interact with the blockchain.
            </p>
            <p className="text-gray-400 font-bold mb-4">
              In the context of Cubitorium, there are really no cryptocurrency transactions per se, but you will use your "Credit" on your wallet to be able to upload your algorithms. You don't have to worry at all in terms of money if you only want to read or practice.
            </p>

            <h1 className="text-2xl font-bold my-4">⚙️ Setting Up A Wallet (Phantom)</h1>
            <p className="text-xs text-gray-500 max-w-sm bg-gray-50 mb-5 ml-1">
              We strongly recommend using Phantom as a wallet, you can choose another wallet that fits your preferences anyway, but this guide is intended for the wallet we recommend.
            </p>
            <ol className="list-decimal ml-10 mb-6">
              <li>Visit the official <a href="https://phantom.app/" className="text-accent text-blue-700">Phantom Wallet</a> website.</li>
              <li>Download and install the wallet app Chrome extension.</li>
              <li>Open Phantom and create a new wallet.</li>
              <li>Securely store your recovery phrase (this phrase is crucial for restoring your wallet if you lose access).</li>
              <li>Once your wallet is set up, you can start using Cubitorium.</li>
            </ol>

            <h2 className="text-xl font-bold my-4">🛡️ Additional Security Tips</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>Never share your private keys or recovery phrase with anyone.</li>
              <li>Enable two-factor authentication for an extra layer of security.</li>
              <li>Regularly update your wallet software to the latest version.</li>
            </ul>
          </div>
        </div>
      </div>

  );
}
