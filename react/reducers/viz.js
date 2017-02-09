const init = {
  views: [],
  site: null,
  viewPath: null
}

export default function(state = init, action) {
  switch (action.type) {
    case 'SET_VIZ': {
      let favIds = action.viewsResult.favorites;
      return {
        views: action.viewsResult.views.map(view => ({
          ...view,
          isFavorite: ~favIds.indexOf(view.id)
        })),
        site: action.site,
        viewPath: action.viewPath
      }
    }
    case 'UPDATE_VIZ_FAV': {
      let views = [...state.views];
      let viz = views.find(v=>v.id === action.id);
      if (!viz) return state;
      viz.isFavorite = action.isFavorite;
      return {
        ...state, views
      }
    }
  }
  return state
}
