// import {
//     defaultDepartment,
//     getCalled,
//     getDefaultDepartment,
//     setAhead,
//     getMultiEditFirstTime,
//     setMultiEditFirstTime,
//     addError,
//   } from "../App";

//   const headers3 = {
//     "Content-Type": "multipart/form-data",
//   };

//   export async function users_post(body) {
//     try {
//       let response = await fetch(
//         URL_PREFIX + "controls/mobileservice.asmx/LogInMobileUser",
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(body),
//         }
//       );

//       let responseJson = await response.text();
//       var json = JSON.parse(responseJson.replace('{"d":null}', ""));
//       let deptsArrayStr = JSON.stringify(json.Model.levelDepartments);
//       let deptsArr = JSON.parse(deptsArrayStr);
//       let defDept = deptsArr[0];
//       defaultDepartment(defDept);

//       return json;
//     } catch (error) {
//       var e = new Error("dummy");
//       const errorObject = {
//         component: constructor.name,
//         function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
//         errorMessage: error,
//       };
//       addError(errorObject);
//       return "network error";
//     }
//   }
