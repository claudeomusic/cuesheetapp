import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Sort from '../Sort';
import FontAwesome from 'react-fontawesome';
// import { sortBy } from 'lodash';


// const SORTS = {
//   NONE: list => list,
//   TITLE: list => sortBy(list, 'title'),
//   AUTHOR: list => sortBy(list, 'author'),
//   COMMENTS: list => sortBy(list, 'num_comments').reverse(),
//   POINTS: list => sortBy(list, 'points').reverse(),
// };

const isNotAWriter = item => item.RoleCode !== 'W'

const Table = ({
  list,
  sortKey,
  isSortReverse, 
  onSort,
  onAddSong}) =>
{
  // const sortedList = SORTS[sortKey](list);
  // const reverseSortedList = isSortReverse
  //   ? sortedList.reverse()
  //   : sortedList;

  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '20%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey}
          > 
            Title
          </Sort>
        </span>
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
          >
            Composers
          </Sort>
        </span>
        <span style={{ width: '20%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
          > 
            Performers
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Add
        </span>
      </div>
      { list.map(item =>
        <div key={item.workId} className="table-row">
          <span style={{width: '20%'}}>
            {item.workTitle}
          </span>
          <span style={{width: '40%'}}>
            {item.interestedParties.filter(isNotAWriter).map(writer => 
              writer.fullName
            ).join(', ')}
          </span>
          <span style={{width: '20%'}}>
            {item.performers ?
              item.performers.map(performer => 
              performer.fullName).join(', ')
              :
              null
            }
          </span>
          <span style={{width: '10%'}}>
            <Button
              onClick={() => onAddSong(item)}
              className="button-inline"
            >
              <FontAwesome name='plus'/>
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        workId: PropTypes.number.isRequired,
      })
    ).isRequired,
    onAddSong: PropTypes.func.isRequired,
}

export default Table;