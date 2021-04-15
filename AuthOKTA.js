import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  TokenResponse,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import {
  Button,
  Platform,
  TouchableOpacity,
  Text,
  Image,
  View,
} from "react-native";
import AuthSession from "expo-auth-session";
import { get_claims_OKTA } from "./scripts/API";
import { authOKTA, global } from "./Styles/Styles";
import {
  oktaLogoSetWidth,
  oktaLogoGetWidth,
  setAuthInfo,
  getAuthInfo,
  getTriggerAuth,
  setTriggerAuth,
} from "./App";

//TOKEN:
//00L30UCVXxJFzHPC5tOg0-d0hHoP_7YVaza7CuzCbo

WebBrowser.maybeCompleteAuthSession();

let triggerAuth = "";

const useProxy = Platform.select({ web: false, default: true });

export default function App(props) {
  // Endpoint
  //this is the state. this is where the components data is stored.
  const discovery = useAutoDiscovery(
    "https://dev-75313886.okta.com/oauth2/default"
  );
  // console.log(discovery);
  // Request
  // console.log("AUTH INFO INFO INFO", getAuthInfo("OKTA"));
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "0oag2oh3vsHaP1fdM5d6",
      scopes: ["openid", "profile"],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: "com.okta.dev-75313886:/callback",
        useProxy,
      }),
    },
    discovery
  );
  console.log(request);
  // console.log(response);
  React.useEffect(() => {
    if (
      response?.type === "success" &&
      getAuthInfo("OKTA") === "none" &&
      getTriggerAuth() === true
    ) {
      const { code } = response.params;
      // console.log(response, request);
      // const something = TokenResponse.fromQueryParams();
      // console.log("SOMETHING THIS IS THE TOKEN", something);
      // console.log(response?.type);
      // setTimeout(() => {
      setTriggerAuth(false);
      setAuthInfo("OKTA", request, response);
      // props.doSomething(response);
      props.onLoginClicked(response?.type);

      // }, 10000);
      // setAuthInfo("OKTA", request, response);
      // if (getAuthInfo() != "none") {
      //   // props.onLoginClicked(response?.type);
      //   console.log("SOMEBODY NOBODY");
      // } else {
      //   console.log("SOMEBODY");
      // }

      //handle all code and stuff here
      //now im pretending everything is successful
      // alert(":DKFJ");
      //  props.onLoginClicked();
      // props.onLoginClicked();
    }
  }, [response]);
  // console.log(response);

  // if (response?.type === "success") {
  //   const { code } = response.params;
  //   //handle all code and stuff here
  //   //now im pretending everything is successful
  //   // alert(":DKFJ");
  //   props.onLoginClicked();
  //   // props.onLoginClicked();
  // }
  //TokenResponse

  // getImageWidth = (e) => {
  //   alert(e);
  // };

  return (
    <React.Fragment>
      <TouchableOpacity
        // onPress={() => signInWithMicrosoft()}
        onPress={() => {
          promptAsync({ useProxy });
        }}
        style={authOKTA.oktaButton}
        disabled={!request}
      >
        <Image
          onLayout={(event) => {
            oktaLogoSetWidth(event.nativeEvent.layout.width);
          }}
          style={authOKTA.oktaIcon}
          source={require("./assets/vectoricons/okta.png")}
        />
        <View style={global.marginAuto}>
          <Text
            style={[
              authOKTA.oktaButtonText,
              { marginLeft: 0 - oktaLogoGetWidth() },
            ]}
          >
            Sign in with OKTA
          </Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        // onPress={() => signInWithMicrosoft()}
        onPress={() => {
          trySigningOut();
        }}
        style={authOKTA.oktaButton}
        disabled={!request}
      >
        <Image
          onLayout={(event) => {
            oktaLogoSetWidth(event.nativeEvent.layout.width);
          }}
          style={authOKTA.oktaIcon}
          source={require("./assets/vectoricons/okta.png")}
        />
        <View style={global.marginAuto}>
          <Text
            style={[
              authOKTA.oktaButtonText,
              { marginLeft: 0 - oktaLogoGetWidth() },
            ]}
          >
            Sign outwith OKTA
          </Text>
        </View>
      </TouchableOpacity> */}
    </React.Fragment>
  );
}
