export default {
  oidc: {
    clientId: "0oag2oh3vsHaP1fdM5d6",
    redirectUri: "com.okta.dev-75313886:/callback",
    // redirectUri: "com.okta.dev-75313886:/callback",
    endSessionRedirectUri: "com.okta.dev-75313886:/logoutCallback",
    discoveryUri: "https://dev-75313886.okta.com/oauth2/default",
    // issuer: "https://dev-75313886.okta.com/oauth2/default",
    scopes: ["openid", "profile", "offline_access"],
    requireHardwareBackedKeyStore: false,
  },

  // clientId: "0oag2oh3vsHaP1fdM5d6",
  // redirectUri: "com.okta.dev-75313886:/callback",
  // endSessionRedirectUri: "com.okta.dev-75313886:/callback",
  // discoveryUri: "https://dev-75313886.okta.com/oauth2/default",
  // scopes: ["openid", "profile", "offline_access"],
  // requireHardwareBackedKeyStore: false,
};
