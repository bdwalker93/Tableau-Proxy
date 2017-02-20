import React from 'react';
import { Link } from 'react-router';
import FavoriteStar from './FavoriteStar';

import moment from 'moment';

export const WorkbookListItem = ({
  tab,
  workbook: {
    id,
    thumbnailUrl,
    name,
    ownerName,
    projectName,
    defaultViewUrl,
    updatedAt,
    isWorkbook,
    workbookId, 
    size
  },
  isFav,
  onFavorite
}) =>
<div className={`row workbook-item ${parseInt(size) > 1 ? 'multi' : ''}`}>
  <div className="col-xs-6">
    <Link to={`/app/workbooks/${tab}/${workbookId}/views/${defaultViewUrl}`}  className="workbook-thumbnail-container">
      <img className="workbook-thumbnail" src={thumbnailUrl} />
    </Link>
  </div>
  <div className={`col-xs-6 ${isWorkbook ? 'workbook-frame' : 'view-frame'}`}>
    <p>{name}</p>
    <p>{ownerName}</p>
    <p>{moment(updatedAt).format('L, LT')}</p>
    <p>{projectName}</p>
    <FavoriteStar onClick={onFavorite} isFavorite={isFav}/>
  </div>
</div>
