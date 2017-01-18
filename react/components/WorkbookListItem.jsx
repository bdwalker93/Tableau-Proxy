import React from 'react';
import { Link } from 'react-router'

import moment from 'moment';

export const WorkbookListItem = ({
  workbook: {
    id,
    thumbnail,
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
      { thumbnail ? <img className="workbook-thumbnail" src={thumbnail} /> : <span>Loading thumbnail...</span>}
    </Link>
  </div>
  <div className="col-xs-6">
    <p>{name}</p>
    <p>{ownerName}</p>
    <p>{moment(updatedAt).format('L, LT')}</p>
    <p>{projectName}</p>
    <button className="fav-star" onClick={onFavorite}>
      <i className={`fa fa-star${isFav ? '' : '-o'}`}/>
    </button>
  </div>
</div>
