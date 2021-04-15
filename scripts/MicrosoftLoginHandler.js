// //for petsmart
// // create function to just scan items, and if the items dont match
// //have it automatically print,
// //if items match, then press ok maybe

// import React, { useState, useEffect } from "react";
// import { Text, View, Image, TouchableOpacity } from "react-native";
// import { global, MicrosoftLoginHandler } from "../Styles/Styles";
// import {
//   AuthManager,
//   // signInAsync,
//   // getAccessTokenAsync,
//   // signOutAsync,
// } from "./AuthManager";
// import { Client } from "@microsoft/microsoft-graph-client";

// export default function App(props) {
//   const state = {
//     showSuccessModal: "",
//   };
//   // const authContext = React.useMemo(
//   //   () => ({
//   //     signIn: async () => {
//   //       await AuthManager.signInAsync();
//   //       const token = await AuthManager.getAccessTokenAsync();
//   //       dispatch({ type: "SIGN_IN", token: token });
//   //     },
//   //     signOut: async () => {
//   //       await AuthManager.signOutAsync();
//   //       dispatch({ type: "SIGN_OUT" });
//   //     },
//   //   }),
//   //   []
//   // );

//   const signInWithMicrosoft = async () => {
//     // await AuthManager.signInAsync();
//     props.signIn();
//     // try {
//   //   const isLoggedIn = await AuthManager.signInAsync();
//   const accessToken = await AuthManager.getAccessTokenAsync();
//   //   alert(JSON.stringify(accessToken));
//   // TEMPORARY
//   //   console.log(isLoggedIn);
//   this.setState({ userFirstName: accessToken, userLoading: false });
// } catch (error) {
//   Alert.alert(
//     "Error getting token",
//     JSON.stringify(error),
//     [
//       {
//         text: "OK",
//       },
//     ],
//     { cancelable: false }
//   );
//   // }
// };

//   return (
//     <React.Fragment>
//       <TouchableOpacity
//         // onPress={() => signInWithMicrosoft()}
//         onPress={() => {
//           promptAsync();
//           }}
//         style={MicrosoftLoginHandler.microsoftButton}disabled={!request}
//       >
//         <Image
//           style={MicrosoftLoginHandler.microsoftIcon}
//           source={require("../assets/images/microsoft.png")}
//         />
//         <View style={global.marginAuto}>
//           <Text style={MicrosoftLoginHandler.microsoftButtonText}>
//             Sign in with Microsoft
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </React.Fragment>
//   );
// }

import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { global, MicrosoftLoginHandler } from "../Styles/Styles";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  // tenant 464814f1-f5a5-43bc-8bb4-e0e45c3139de
  const discovery = useAutoDiscovery(
    "https://login.microsoftonline.com/common/oauth2/v2.0"
  );
  // Request
  console.log(request);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "46b7cdba-6c43-496d-a901-73fcbefe7b08",
      scopes: ["openid", "profile", "email", "offline_access"],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: "SignShareByPangea://redirect",
      }),
    },
    discovery
  );

  return (
    <React.Fragment>
      <TouchableOpacity
        // onPress={() => signInWithMicrosoft()}
        onPress={() => {
          promptAsync();
        }}
        style={MicrosoftLoginHandler.microsoftButton}
        disabled={!request}
      >
        <Image
          style={MicrosoftLoginHandler.microsoftIcon}
          source={require("../assets/images/microsoft.png")}
        />
        <View style={global.marginAuto}>
          <Text style={MicrosoftLoginHandler.microsoftButtonText}>
            Sign in with Microsoft
          </Text>
        </View>
      </TouchableOpacity>
    </React.Fragment>
  );
}
