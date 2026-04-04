import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export interface FeedEvent {
  id: string;
  type: 'MILESTONE_ADDED' | 'PROJECT_COMPLETED' | 'PROJECT_CREATED' | 'COMMENT_ADDED';
  data: any;
  timestamp: Date;
}

export const useFeedSocket = () => {
  const [feedItems, setFeedItems] = useState<FeedEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const socket: Socket = io('http://localhost:3000', {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to Mzansi Builds Live Feed!');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('feed_update', (payload: Omit<FeedEvent, 'id' | 'timestamp'>) => {
      console.log('New Feed Event:', payload);
      
      const newEvent: FeedEvent = {
        id: crypto.randomUUID(), 
        type: payload.type,
        data: payload.data,
        timestamp: new Date(),
      };

      setFeedItems((prevItems) => [newEvent, ...prevItems]);
    });


    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { feedItems, isConnected };
};