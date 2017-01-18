export function doLogin(username, password) {
  return {
    meta: { remote: true },
    type: "DO_LOGIN",
    username, password
  }
}

export function loadWorkbooks() {
  return {
    meta: { remote: true },
    type: "LOAD_WORKBOOKS",
  }
}

export function setFavoriteWorkbook(workbookId) {
  console.log("set favorite wb action creator");
  return {
    meta: { remote: true },
    type: "SET_FAVORITE_WORKBOOK",
    workbookId,
  }
}
export function deleteFavoriteWorkbook(workbookId) {
  console.log("delete favorite wb action creator");
  return {
    meta: { remote: true },
    type: "DELETE_FAVORITE_WORKBOOK",
    workbookId,
  }
}
