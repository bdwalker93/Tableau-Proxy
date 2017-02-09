import React from 'react';

const FavoriteStar = ({
  onClick,
  isFavorite
}) => <a className="fav-star" onClick={onClick}>
  { isFavorite ? 
      <img src="/img/star_selected_small_normal.svg"/>
      : 
      <img src="/img/star_empty_small_hover.svg"/>
  }
</a>;

export default FavoriteStar;
