export default {
  oidc: {
    clientId: "0oag2oh3vsHaP1fdM5d6",
    redirectUri: "com.SignShareByPangea:/",
    // redirectUri: "com.okta.dev-75313886:/callback",
    endSessionRedirectUri: "com.SignShareByPangea:/",
    discoveryUri: "https://dev-75313886.okta.com/oauth2/default",
    Issuer: "https://dev-75313886.okta.com/oauth2/default",
    scopes: ["openid", "profile", "offline_access"],
    requireHardwareBackedKeyStore: false,
  },
};
