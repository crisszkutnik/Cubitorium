import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardBody } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface Props {
  text: string;
  type: 'success' | 'error';
  onPress?: () => void;
}

export function Alert({ text, onPress, type }: Props) {
  const [timeoutNumber, setTimeoutNumber] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutNumber) {
      clearTimeout(timeoutNumber);
    }

    const n = setTimeout(() => onPress && onPress(), 10000);
    setTimeoutNumber(n);

    return () => {
      if (timeoutNumber) {
        clearTimeout(timeoutNumber);
      }
    };
  }, [text, onPress, type]);

  return (
    <div className="fixed right-10 top-24 z-30">
      <Card
        onPress={onPress}
        isPressable={true}
        isHoverable={true}
        classNames={{
          body:
            type === 'success'
              ? 'bg-green-500 hover:bg-green-400 text-white'
              : 'bg-red-500 hover:bg-red-400 text-white',
        }}
      >
        <CardBody>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={type === 'success' ? faCircleCheck : faCircleExclamation}
            />
            <p className="ml-2">{text}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
