import { Timestamp } from 'firebase/firestore';

export type MessageType = {
  date: Timestamp;
  id: string;
  senderId: string;
  text: string;
  imageURL?: string;
};
