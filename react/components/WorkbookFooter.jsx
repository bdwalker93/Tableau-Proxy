import React from 'react';
import { Link } from 'react-router'

import moment from 'moment';

import './WorkbookFooter.less';

export const WorkbookFooter = ({
  viewAllWbs,
  viewRecentWbs,
  viewFavoriteWbs
}) =>
  //Why is it if we set <a onClick={console.log("asdasd")}> it prints a ton of times?? but calling the function doesnt?
  <div className="workbook-footer">
    <div className="col-xs-4">
      <a onClick={viewAllWbs}>
        All
      </a>
    </div>
    <div className="col-xs-4">
      <a onClick={viewRecentWbs}>
        Recent
      </a>
    </div>
    <div className="col-xs-4">
      <a onClick={viewFavoriteWbs}>
        Favorites
      </a>
    </div>
  </div>
