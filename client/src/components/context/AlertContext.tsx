import React, { useState, createContext, useContext } from 'react';
import { Alert } from '../Alert';
import { SendTransactionError } from '@solana/web3.js';

interface Context {
  success: (text: string) => void;
  error: (text: string, e?: Error | unknown) => void;
}

const AlertContext = createContext<Context>({
  success: () => {},
  error: () => {},
});

interface Props {
  children: React.ReactNode;
}

type AlertTypes = 'success' | 'error';

export function AlertProvider(props: Props) {
  const [alertType, setAlertType] = useState<AlertTypes | undefined>(undefined);
  const [text, setText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const success = (text: string) => {
    setText(text);
    setAlertType('success');
    setShowAlert(true);
  };

  const error = (text: string, e?: Error | unknown) => {
    if (e instanceof SendTransactionError) {
      const { message } = e;
      console.log(message);
      if (message.includes('no record of a prior credit')) {
        setText('Your account does not have funds to perform this operation');
      } else if (message.includes('Treasury is broke')) {
        setText(
          'This operation is funded by the program tresury and the treasury is out of funds',
        );
      }
    } else {
      setText(text);
    }

    setAlertType('error');
    setShowAlert(true);
  };

  return (
    <AlertContext.Provider
      value={{
        success: success,
        error: error,
      }}
    >
      <>
        {props.children}
        {showAlert && (
          <Alert
            onPress={() => setShowAlert(false)}
            type={alertType || 'success'}
            text={text}
          />
        )}
      </>
    </AlertContext.Provider>
  );
}

export const useAlertContext = () => {
  return useContext(AlertContext);
};
