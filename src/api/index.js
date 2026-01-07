// 通过此方法，不用import
const apiModuleFiles = require.context("./modules", true, /\.js$/);
let ALLAPI = {};
apiModuleFiles.keys().forEach(key => {
  let tmp = key.match(/\w+/g)[0];
  ALLAPI[tmp] = apiModuleFiles(key).default;
  // ALLAPI = {
  //   ...ALLAPI,
  //   ...apiModuleFiles(key).default
  // };
});
// const API = {
//   ...ALLAPI
// };
const API = ALLAPI;

export default API;
