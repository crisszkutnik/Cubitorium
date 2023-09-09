import React, { useState, createContext, useContext } from 'react';
import { Alert } from '../Alert';

interface Context {
  success: (text: string) => void;
  error: (text: string) => void;
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

  const error = (text: string) => {
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
          />
        )}
      </>
    </AlertContext.Provider>
  );
}

export const useAlertContext = () => {
  return useContext(AlertContext);
};
