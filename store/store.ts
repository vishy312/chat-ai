import { mockMessages } from "@/models/mock-messages";
import { Message } from "@/models/message";
import { create } from "zustand";

type State = {
  messages: Message[];
};

type Action = {
  addMessage: (newMessage: Message) => void;
};

export const initialState = {
  messages: mockMessages,
};

export const useMessageStore = create<State & Action>((set) => ({
  messages: initialState.messages,
  addMessage: (newMessage: Message) =>
    set((state) => ({ messages: [...state.messages, newMessage] })),
}));
