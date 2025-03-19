import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatState {
  messages: Message[];
  loading: boolean;
}

const initialState: ChatState = { messages: [], loading: false };

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addMessage, setLoading } = chatSlice.actions;
export default chatSlice.reducer;