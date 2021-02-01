import { createAppContainer, createSwitchNavigator } from "react-navigation";

import Login from "../windows/Login";
import Home from "../windows/Home";
import Main from "../windows/Main";

export default createAppContainer(
  createSwitchNavigator({
    Login: Login,
    Home: Home,
    Main: Main,
  })
);
