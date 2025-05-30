import { Message } from "@/models/message";
import { create } from "zustand";

type State = {
  messages: Message[];
};

type Action = {
  addMessage: (newMessage: Message) => void;
  setMessages: (newList: Message[]) => void;
};

export const initialState = {
  messages: [],
};

export const useMessageStore = create<State & Action>((set) => ({
  messages: initialState.messages,
  addMessage: (newMessage: Message) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
  setMessages: (newList: Message[]) => set(() => ({ messages: [...newList] })),
}));
