import React, { useState, createContext, useContext } from 'react';
import { Alert } from '../Alert';
import { SendTransactionError } from '@solana/web3.js';
import { AnchorError } from '@coral-xyz/anchor';
import { TooManyPendingTransactions } from '../../modules/utils/TooManyPendingTransactions';
import { UserDoesNotHaveUserInfo } from '../../modules/utils/UserDoesNotHaveUserInfo';

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
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const success = (text: string) => {
    if (showAlert) {
      setShowAlert(false);
    }

    if (description) {
      setDescription('');
    }

    setText(text);
    setAlertType('success');
    setShowAlert(true);
  };

  const error = (text: string, e?: Error | unknown) => {
    if (showAlert) {
      setShowAlert(false);
    }

    if (description) {
      setDescription('');
    }

    if (e instanceof AnchorError) {
      setDescription(e.error.errorMessage);
    } else if (e instanceof TooManyPendingTransactions) {
      setDescription(
        'Too many pending pending actions to be save. Save/clear them to continue.',
      );
    } else if (e instanceof UserDoesNotHaveUserInfo) {
      setDescription(
        'Go to "My profile" and complete your information in order to be able to upload and like solutions',
      );
    } else if (e instanceof SendTransactionError && e.message) {
      const msgToFind = 'Error Message: ';
      const msgPosition = e.message.indexOf(msgToFind);

      if (msgPosition >= 0) {
        const msg = e.message.slice(msgPosition + msgToFind.length);

        if (msg) {
          setDescription(msg);
        }
      }
    }

    setText(text);

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
            description={description}
          />
        )}
      </>
    </AlertContext.Provider>
  );
}

export const useAlertContext = () => {
  return useContext(AlertContext);
};
