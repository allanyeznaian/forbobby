//LOGIN
//DATA FETCH
//print/publish batch
//get batches
//delete sign/s
//edit get by id
//2nd sign
//order stock
//getimageproof

import {
  defaultDepartment,
  getCalled,
  getDefaultDepartment,
  setAhead,
  getMultiEditFirstTime,
  setMultiEditFirstTime,
  addError,
} from "../App";

//PRODUCTION
// const URL_PREFIX = "http://signshare.com/";

//LOCAL DEV
// const URL_PREFIX = "http://pangeaprint.com/";

//MOBILE DEV
const URL_PREFIX = "http://www.pangea-usa.com/";

const headers = {
  Accept: "text/plain",
  "Content-Type": "application/json",
};
const headers2 = {
  "Content-Type": "application/json; charset=utf-8",
};
const headers3 = {
  "Content-Type": "multipart/form-data",
};

//LOGIN
//in windows/Login.js
export async function users_post(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/LogInMobileUser",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    let deptsArrayStr = JSON.stringify(json.Model.levelDepartments);
    let deptsArr = JSON.parse(deptsArrayStr);
    let defDept = deptsArr[0];
    defaultDepartment(defDept);

    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//DATA FETCH
//in windows/MAIN.js

//issues
//search for item, update, then page refreshes with incorrecg data
//make the updates appear locally rather than refreshing everything
let outerState = { wasPrevSearched: "", prevBody: "" };
export async function data_get(
  body,
  isMultiEditFirstTime,
  showMultiEdit,
  action
) {
  let state = {};
  const depObj = getDefaultDepartment();
  if (isMultiEditFirstTime === true) {
    body.batchTypeID = 0;
    if (body.currentDepartmentID == undefined) {
      body.currentDepartmentID = depObj.DepartmentID;
    }
    body.currentSignTypeID = 1;
    body.searchValues =
      "thisIsAPlaceholderSoThatWhenYouPressMultiEditNoSignIsReturned";
  }
  if (body.currentSignTypeID == 6) {
    body.currentSignTypeID = 6;
  }
  if (body.currentSignTypeID == 8) {
    body.currentDepartmentID = 0;
  }
  // if (!body.batchTypeID == 0) {
  //   body.currentDepartmentID = depObj.DepartmentID;
  // }
  if (body.currentDepartmentID == undefined) {
    body.currentDepartmentID = depObj.DepartmentID;
  }
  // if (!body.currentDepartmentID > -1) {
  //   body.currentDepartmentID = depObj.DepartmentID;
  // }
  if (body.currentDepartmentID == undefined) {
    body.currentDepartmentID = depObj.DepartmentID;
  }
  if (
    body.batchTypeID == +0 &&
    body.searchValues.length < 1 &&
    body.currentSignTypeID == 8
    //   ||
    // (showMultiEdit == true && isMultiEditFirstTime != true)
  ) {
    body = state;
  } else if (body.searchValues.length > 0 && isMultiEditFirstTime != true) {
    outerState.wasPrevSearched = true;
    state = body;
    outerState.prevSearchedText = body.searchValues;
  } else {
    state = body;
  }

  // if (outerState.wasPrevSearched == true && isMultiEditFirstTime != true) {
  //   body = state;
  //   body.searchValues = outerState.prevSearchedText;
  // }
  if (
    action == "fromedit" ||
    action == "frompromo" ||
    action == "deleted" ||
    action == "deletedMultiple"
  ) {
    body = outerState.prevBody;
  }
  try {
    if (body.currentDepartmentID.DepartmentID != undefined) {
      body.currentDepartmentID = body.currentDepartmentID.DepartmentID;
    }
    if (body.searchValues.length > 0 && isMultiEditFirstTime != true) {
      outerState.wasPrevSearched = true;
      state = body;
    }
    console.log(body, action);
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/LoadSignsByUserandBucket",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    if (json.Model.AheadInfo[0] == null) {
    } else {
      setAhead(json.Model.AheadInfo);
    }
    setMultiEditFirstTime(false);
    outerState.prevBody = body;

    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//print/publish batch
//in components/PrintScreen.js

// export async function data_get(
//   body,
//   isMultiEditFirstTime,
//   showMultiEdit,
//   action
// ) {
//   let sody = {
//     batchTypeID: 0,
//     currentAhead: -2,
//     currentDepartmentID: 1,
//     currentLevelID: 6155,
//     currentLevelTypeID: 4,
//     currentSignTypeID: 1,
//     searchValues: "",
//   };
//   try {
//     // if (body.searchValues.length > 0 && isMultiEditFirstTime != true) {
//     //   outerState.wasPrevSearched = true;
//     //   state = body;
//     // }
//     let response = await fetch(
//       URL_PREFIX + "controls/mobileservice.asmx/LoadSignsByUserandBucket",
//       {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify(sody),
//       }
//     );
//     let responseJson = await response.text();
//     var json = JSON.parse(responseJson.replace('{"d":null}', ""));
//     return json;
//   } catch (error) {
//     var e = new Error("dummy");
//     const errorObject = {
//       component: constructor.name,
//       function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
//       errorMessage: error,
//     };
//     addError(errorObject);
//     return "network error";
//   }
// }

export async function data_post_publish_print_batches(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/controls/mobileservice.asmx/PublishAndPrint",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//get batches
//in components/PrintSignBatch.js
export async function data_get_batches(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/controls/mobileservice.asmx/GetBatches",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_get_batch_elements_by_id(body) {
  try {
    let response = await fetch(
      URL_PREFIX +
        "/controls/mobileservice.asmx/GetBatchElementsByLevelUserInfoID",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//delete sign/s
//in components/GridData.js
export async function data_delete_sign(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/DeleteLevelSignByLevelSignID",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
//in components/HomeHeader.js
export async function data_delete_signs(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/DeleteLevelSignByLevelSignIDs",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//edit get by id
//in components/GridDataEditModal.js
export async function data_get_data_for_edit(body) {
  try {
    let response = await fetch(
      URL_PREFIX +
        "controls/fieldservice.asmx/GetEditableTemplateFields_MultiManagementSimple",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_save_edited(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/SaveSignFieldsMobile",
      {
        method: "POST",
        headers: headers2,
        body: body,
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_save_edited_object(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/SaveSignFieldsMobileObject",
      {
        method: "POST",
        headers: headers2,
        body: body,
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//2ND SIGN
//in components/GridDataPromoQtyModal.js
export async function data_post_2ndSign(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "controls/mobileservice.asmx/SaveEditStamps",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//order stock
//in components/OrderStock.js
export async function data_get_stock_deploys(body) {
  try {
    let response = await fetch(
      URL_PREFIX +
        "controls/mobileservice.asmx/GetStockDeploysByLevelIDandStockTypeIdandAhead",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_get_stocks(body) {
  try {
    let response = await fetch(
      URL_PREFIX +
        "controls/mobileservice.asmx/GetStocksByLevelIDandStockTypeIdandAhead",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_order_stocks(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "Controls/MobileService.asmx/SaveShellOrders",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_get_ordered_stocks(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "Controls/MobileService.asmx/BuildGridShellOrders",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();

    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_cancel_ordered_stockDeploy(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/Controls/MobileService.asmx/CancelOrderByShellDeployId",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
export async function data_cancel_ordered_stock(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/Controls/MobileService.asmx/CancelOrderByShellId",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    let responseJson = await response.text();

    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//getimageproof
//in griddataeditmodal
export async function data_get_image_proof(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/Controls/fieldService.asmx/GetTemplateProofMobile",
      {
        method: "POST",
        headers: headers,
        body: body,
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}

//checkdate
//in Main.js
export async function data_check_date(body) {
  try {
    let response = await fetch(
      URL_PREFIX + "/Controls/mobileservice.asmx/GetLastUpdatedDatesForSigns",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    let responseJson = await response.text();
    var json = JSON.parse(responseJson.replace('{"d":null}', ""));
    return json;
  } catch (error) {
    var e = new Error("dummy");
    const errorObject = {
      component: constructor.name,
      function: e.stack.split("\n")[0].replace(/\@.*/g, ""),
      errorMessage: error,
    };
    addError(errorObject);
    return "network error";
  }
}
