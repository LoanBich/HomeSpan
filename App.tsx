import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";

import { AppRoute } from "./AppRoute";
import { store } from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppRoute />
      <StatusBar style="auto" />
    </Provider>
  );
};

export default App;
