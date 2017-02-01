const init = {
  site: null,
  viewPath: null
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_VIEW': {
      return {
        site: action.site,
        viewPath: action.viewPath
      }
    }
  }
  return state
}
