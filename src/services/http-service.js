import axios from "axios";
// import StringCrypto from "string-crypto";
// import Words from "./../resources/words";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    //logger.log(error);
    // toast.error(Words.unhandled_exception);
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

// function decryptObject(encoded_text) {
//   const password = "123qaz!@#...256QWE%^&)";

//   const options = {
//     salt: "2f0ijf2039j23r09j2fg45o9ng98um4o",
//     iterations: 10,
//     digest: "sha512", // one of: 'blake2b512' | 'blake2s256' | 'md4' | 'md5' | 'md5-sha1' | 'mdc2' | 'ripemd160' | 'sha1' | 'sha224' | 'sha256' | 'sha3-224' | 'sha3-256' | 'sha3-384' | 'sha3-512' | 'sha384' | 'sha512' | 'sha512-224' | 'sha512-256' | 'sm3' | 'whirlpool';
//   };

//   const { decryptString } = new StringCrypto(options);

//   const decoded_text = decryptString(encoded_text, password);
//   return JSON.parse(decoded_text);
// }

const service = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  // decryptObject,
};

export default service;
