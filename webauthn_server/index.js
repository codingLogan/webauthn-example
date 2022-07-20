function createArrayBuffer(base64value) {
  const length = base64value.length;

  var bytes = new Uint8Array(length);
  for (var i = 0; i < length; i++) {
    bytes[i] = base64value.charCodeAt(i);
  }
  return bytes.buffer;
}

export function parseCredential(credential) {
  // Decode clientDataJSOn - make it a UTF string
  const utf8Decoder = new TextDecoder("utf-8");
  const decodedClientData = utf8Decoder.decode(
    credential.response.clientDataJSON
  );

  // Now take the string, make it an object
  const clientDataObj = JSON.parse(decodedClientData);
  return clientDataObj;
}

export function decodeCredential(credential) {
  console.warn("TODO: decode properly, here's the raw credential", credential);

  // TODO: properly decode the PublicKeyCredential from the client
  // const parsedCredential = {
  //   ...credential,
  //   rawId: createArrayBuffer(rawId),
  //   response: {
  //     attestationObject: createArrayBuffer(response.attestationObject),
  //     clientDataJSON: createArrayBuffer(response.clientDataJSON),
  //   },
  // };

  // parseCredential(parsedCredential);
}
