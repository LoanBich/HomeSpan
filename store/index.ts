import { configureStore, createSlice } from "@reduxjs/toolkit";

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState: {
    id: null,
    username: null,
    isLoggedIn: false,
  },
  reducers: {
    setSignIn(state, action) {
      return {
        id: action.payload.id,
        username: action.payload.username,
        isLoggedIn: true,
      };
    },

    setSignOut(state) {
      return { id: null, username: null, isLoggedIn: false };
    },
  },
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState: [],
  reducers: {
    setRooms(state, action) {
      return action.payload;
    },
  },
});

export const { setSignIn, setSignOut } = userAuthSlice.actions;
export const { setRooms } = roomsSlice.actions;

export const store = configureStore({
  reducer: {
    userAuth: userAuthSlice.reducer,
    rooms: roomsSlice.reducer,
  },
});
