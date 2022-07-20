import {
  createCredential,
  serializeCredential,
} from "./webauthn_client/index.js";

let createdCredential = null;

// This would actually be sent from the server...
// TODO: get this from server
const challenge = Uint8Array.from("randomStringFromServer", (c) =>
  c.charCodeAt(0)
);

// TODO: This would be sent from the server???
const userId = Uint8Array.from("userIdGeneratedByServer", (c) =>
  c.charCodeAt(0)
);

// Set up the button clicks
document.getElementById("register").addEventListener("click", () => {
  registerUser();
});

// Set up the button clicks
document.getElementById("parse").addEventListener("click", () => {
  parseCredential();
});

/**
 * Reference to spec for webauthn
 * https://w3c.github.io/webauthn/#dom-publickeycredentialcreationoptions-challenge
 */
export function registerUser() {
  console.log("registerUser called");

  createCredential(challenge, userId).then((created) => {
    createdCredential = created;

    sendCredentialToServer(created).then((response) =>
      console.log("sendCredentialToServer is done", response)
    );
  });
}

function sendCredentialToServer(credential) {
  return fetch("api/register/credential", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      credential: serializeCredential(credential),
    }),
  })
    .then((resp) => resp.json())
    .then((data) => data);
}

// Used purely for debugging, not really a client function.
// This would be done on the server
export function parseCredential() {
  // Decode clientDataJSOn - make it a UTF string
  const utf8Decoder = new TextDecoder("utf-8");
  const decodedClientData = utf8Decoder.decode(
    createdCredential.response.clientDataJSON
  );

  // Now take the string, make it an object
  const clientDataObj = JSON.parse(decodedClientData);
  console.log({ clientDataObj });
}
