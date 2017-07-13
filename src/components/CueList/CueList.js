import React from 'react';
// import PropTypes from 'prop-types';
import Button from '../Button';
import Sort from '../Sort';
import FontAwesome from 'react-fontawesome';
import {CSVLink} from 'react-csv';

const isNotAWriter = item => item.roleCde !== 'W'
const isNotAPublisher = item => item.roleCde !== 'P'

const CueList = ({
  list,
  onSort,
  sortKey,
  onRemoveSong,
  onSwapVisibility,
  hideCues
  }) =>
{

  const writers = item => {
    return item.song.interestedParties.filter(isNotAWriter)
  }

  const publishers = item => {
    return item.song.interestedParties.filter(isNotAPublisher)
  }

  const csvData = list_of_songs => 
  {
    let data = [], cueNo = 1, lastNo = 0;
    data.push(["CUE#","CUE/SONG TITLE","COMPOSER(S)","PRO","%","DIRECT PERF LICENSE COMPOSER", "IPI #", "PUBLISHER(S)", "PRO", "%", "DIRECT PERF LICENSE PUBLISHER", "TIME", "TC IN", "TC OUT", "USAGE", "ISWC"]);
    list_of_songs.forEach(obj => 
    {
      let max = writers(obj).length >= publishers(obj).length ? writers(obj).length : publishers(obj).length
      for(let i=0; i < max; i++)
      {
        data.push([
          cueNo, 
          lastNo === cueNo ? '' : obj.song.workTitle, 
          writers(obj)[i] ? writers(obj)[i].fullName : '',
          writers(obj)[i] ? writers(obj)[i].societyName : '',
          writers(obj)[i] ? obj.song.totalWriterAscapShare : '',
          writers(obj)[i] ? writers(obj)[i].payIndicator : '',
          writers(obj)[i] ? writers(obj)[i].ipiNaNum : '',
          publishers(obj)[i] ? publishers(obj)[i].fullName : '',
          publishers(obj)[i] ? publishers(obj)[i].societyName : '',
          publishers(obj)[i] ? obj.song.totalPublisherAscapShare : '',
          publishers(obj)[i] ? publishers(obj)[i].payIndicator : '',
          "",
          "",
          "",
          "",
          obj.song.ISWCCde
        ]);
        lastNo = cueNo;
      }
      cueNo += 1;
    });
    return data;
  }

  return (
      <div className="cuelist">
        {list.length ?
          <div className="cueheader">
            <h3> 
              Saved Cues ({list.length})
              &nbsp;&nbsp;&nbsp;
              <Button
                onClick={onSwapVisibility}
                className="button-inline">
                {hideCues ? 'Show' : 'Hide'}
              </Button>
              &nbsp;&nbsp;&nbsp;
              <CSVLink 
                filename={"cue-sheet.csv"}
                className="button-inline"
                data={csvData(list)}
              >
                Download
              </CSVLink>
            </h3>

          </div>
          : null
        }
        {list.length && !hideCues ?
          <div className="cuetable">
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
                Remove
              </span>
            </div>
            {list.map(item =>
              <div key={item.song.workId} className="table-row">
                <span style={{width: '20%'}}>
                  {item.song.workTitle}
                </span>
                <span style={{width: '40%'}}>
                  {writers(item).map(writer => 
                    writer.fullName
                  ).join(', ')}
                </span>
                <span style={{width: '20%'}}>
                  {item.song.performers ?
                    item.song.performers.map(performer => 
                    performer.fullName).join(', ')
                    :
                    null
                  }
                </span>
                <span style={{width: '10%'}}>
                  <Button
                    onClick={() => onRemoveSong(item)}
                    className="button-inline"
                  >
                    <FontAwesome name='minus'/>
                  </Button>
                </span>
              </div>
            )}
            </div>
          : null}
      </div>
  );
}

// CueList.propTypes = {
//     list: PropTypePropTypes.arrayOf(
//       PropTypes.shape({
//         workId: PropTypes.number.isRequired,
//       })
//     ).isRequired,
//     onDismiss: PropTypes.func.isRequired,
// }

export default CueList;