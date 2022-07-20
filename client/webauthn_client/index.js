const SPECS = {
  ALGORITHM_SPEC_URL:
    "https://w3c.github.io/webauthn/#typedefdef-cosealgorithmidentifier",
  ALGORITHM_OPTIONS: {
    ES256_ALGORITHM: -7,
  },
  CREDENTIAL_TYPES_SPEC_URL:
    "https://w3c.github.io/webauthn/#enumdef-publickeycredentialtype",
  CREDENTIAL_TYPE_OPTIONS: {
    PUBLIC_KEY: "public-key",
  },
};

/**
 *
 * @param {string} challengeString cryptographic string sent from server
 * @param {string} userId ?? Need to determine more about this value
 * @returns PublicKeyCredentialCreateOption object
 */
function createCredentialOptions(cryptographicChallenge, userId) {
  /**
   * https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-challenge
   * challenge: buffer of random bytes generated on the server
   *
   * https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-rp
   * rp: Relying Party - The org registering the user
   *   id: subset of the domain currently in the browser for scoping
   *
   * https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-user
   * user:
   *   id: used to associate the credential with the user (recommended to not use personal info)
   *
   * https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-pubkeycredparams
   * publicKeyCredParams: Array of object describing what key types are acceptable
   */
  return {
    challenge: cryptographicChallenge,
    rp: {
      name: "webauthn example",
      id: "localhost",
    },
    user: {
      id: userId,
      name: "codingLogan",
      displayName: "Logan Rasmussen",
    },
    pubKeyCredParams: [
      {
        alg: SPECS.ALGORITHM_OPTIONS.ES256_ALGORITHM,
        type: SPECS.CREDENTIAL_TYPE_OPTIONS.PUBLIC_KEY,
      },
    ],
  };
}

export function createCredential(serverChallenge, userId) {
  const publicKeyCredentialCreationOptions = createCredentialOptions(
    serverChallenge,
    userId
  );

  /**
   * returns PublicKeyCredential
   *   https://w3c.github.io/webauthn/#registering-a-new-credential
   *   This data must be sent to and parsed by the server wishing to register the user
   *
   * https://w3c.github.io/webauthn/#ref-for-dom-credential-id
   * id: used to identify the credential when authenticating the user
   *   (base 64 encoded?)
   *
   * https://w3c.github.io/webauthn/#dom-publickeycredential-rawid
   * rawId: binary version of the id
   *
   * response: AuthenticatorAttestationResponse
   *   https://w3c.github.io/webauthn/#dictdef-collectedclientdata
   *   clientDataJSON: data passed from browser to authenticator
   *
   *   https://w3c.github.io/webauthn/#dom-authenticatorattestationresponse-attestationobject
   *   attestationObject: contains the public key, attestationn certificate, metadata about registration
   *
   */
  return navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });
}

// TODO: properly serialize credential for transport
export function serializeCredential(credential) {
  console.log("before serialization", credential);
  const serializedCredential = {
    ...credential,
    rawId: btoa(credential.rawId),
    response: {
      attestationObject: btoa(credential.response.attestationObject),
      clientDataJSON: btoa(credential.response.clientDataJSON),
    },
    type: credential.type,
  };
  console.log("after serialization", serializedCredential);

  return serializedCredential;
}
