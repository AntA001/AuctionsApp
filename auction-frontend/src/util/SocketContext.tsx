import React, { createContext, useContext, FunctionComponent } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

type SocketProviderProps = {
  children: React.ReactNode;
};

const socket = io(`${process.env.REACT_APP_API_URL}`);

export const SocketProvider: FunctionComponent<SocketProviderProps> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
