import React from 'react';
import { Link } from 'react-router'

import moment from 'moment';

export const WorkbookListItem = ({
  workbook: {
    id,
    thumbnailUrl,
    name,
    ownerName,
    projectName,
    updatedAt,
    size
  },
  isFav,
  onFavorite
}) =>
<div className={`row workbook-item ${parseInt(size) > 1 ? 'multi' : ''}`}>
  <div className="col-xs-6">
    <Link to={`/viz/${id}`}  className="workbook-thumbnail-container">
      <img className="workbook-thumbnail" src={thumbnailUrl} />
    </Link>
  </div>
  <div className="col-xs-6">
    <p>{name}</p>
    <p>{ownerName}</p>
    <p>{moment(updatedAt).format('L, LT')}</p>
    <p>{projectName}</p>
    <a onClick={onFavorite}>
      { isFav ? 
        <img src="/img/star_selected_small_normal.svg"/>
          : 
        <img src="/img/star_empty_small_hover.svg"/>
      }
    </a>
  </div>
</div>
