import React from 'react';

const FavoriteStar = ({
  onClick,
  isFavorite,
  style
}) => <a className="fav-star" style={style} onClick={onClick}>
  { isFavorite ? 
      <img src="/img/star_selected_small_normal.svg"/>
      : 
      <img src="/img/star_empty_small_hover.svg"/>
  }
</a>;

export default FavoriteStar;
