const init = {
  views: [],
  site: null,
  viewPath: null
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_VIZ': {
      return {
        views: action.views,
        site: action.site,
        viewPath: action.viewPath
      }
    }
  }
  return state
}
