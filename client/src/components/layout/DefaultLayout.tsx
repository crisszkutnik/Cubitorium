import React from 'react';

interface Props {
  children: React.ReactNode;
  column?: boolean;
}

export function DefaultLayout({ children, column }: Props) {
  return (
    <div className="flex justify-center w-full mt-4 p-4">
      <div
        className={'flex w-full max-w-screen-xl' + (column ? ' flex-col' : '')}
      >
        {children}
      </div>
    </div>
  );
}
