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
  <div className={`col-xs-6 frame ${isWorkbook ? 'workbook-frame' : 'view-frame'}`}>
    <Link to={`/app/workbooks/${tab}/${workbookId}/views/${defaultViewUrl}`}  className="workbook-thumbnail-container">
      <img className="workbook-thumbnail" src={thumbnailUrl} />
    </Link>
  </div>
  <div className={`col-xs-6`} style={{paddingTop: '10px'}}>
    <p className='name'>{name}</p>
    <p className='owner-name'>{ownerName}</p>
    <p className='date'>{moment(updatedAt).format('M/D/YY, H:MM A')}</p>
    <p className='project-name'>{projectName}</p>
    <FavoriteStar onClick={onFavorite} isFavorite={isFav}/>
  </div>
</div>
