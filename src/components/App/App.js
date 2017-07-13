import React, { Component } from 'react';
import Search from '../Search';
import Table from '../Table';
import CueList from '../CueList';
import {ButtonWithLoading} from '../Button';
import './App.css';
import 
{
  DEFAULT_QUERY,
  DEFAULT_PAGE,
  DEFAULT_HPP,
  PATH_BASE,
  PARAM_PAGE,
  PARAM_HPP,
  PATH_TAIL
} from '../Constants'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
      cueList: [],
      hideCues: false
    };

    this.needsToSearchRemote = this.needsToSearchRemote.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this);
    this.fetchSearchResults = this.fetchSearchResults.bind(this);
    this.onAddSong = this.onAddSong.bind(this);
    this.onRemoveSong = this.onRemoveSong.bind(this);
    this.onSwapVisibility = this.onSwapVisibility.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  // LIFECYCLE
  componentDidMount(){
    const {searchTerm} = this.state;
    this.setState({ searchKey: searchTerm});
    this.fetchSearchResults(searchTerm, DEFAULT_PAGE);
  }

  // CUSTOM TRIGGERS
  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse});
  }

  onSearchSubmit(event){
    const { searchTerm} = this.state;
    this.setState({ searchKey: searchTerm});
    if (this.needsToSearchRemote(searchTerm))
    {
      this.fetchSearchResults(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  onSwapVisibility(event){
    const {hideCues} = this.state;
    this.setState({hideCues: !hideCues})
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  needsToSearchRemote(searchTerm)
  {
    return !this.state.results[searchTerm];
  }

  setSearchResults(response){
    const { result, meta } = response;
    const { searchKey, results} = this.state

    if(result && meta)
    {
      const oldResult = results && results[searchKey]
        ? results[searchKey].result
        : [];

      const updatedResult = [
        ...oldResult,
        ...result
      ];

      this.setState({ 
        results: {
          ...results, 
          [searchKey]: { result: updatedResult, page: meta.page}
        },
        isLoading: false
      });
    }
  }

  fetchSearchResults(searchTerm, page) {

    this.setState({isLoading: true});

    fetch(`${PATH_BASE}${searchTerm}/?${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PATH_TAIL}`)
    .then(response => response.json())
    .then(result => this.setSearchResults(result));
  }

  onAddSong(item)
  {
    const {searchKey, results, cueList} = this.state;
    const {result, page} = results[searchKey];

    this.setState({
      cueList:
      [
        ...cueList, {song: item, searchKey}
      ]
    });
    const isNotId = x => x.workId !== item.workId
    const updatedHits = result.filter(isNotId);
    this.setState({
      results: 
      { ...results,
        [searchKey]: { result: updatedHits, page}
      },

    });
  }

  onRemoveSong(item)
  {
    const {results, cueList} = this.state;
    const {result, page} = results[item.searchKey];

    console.log(item);
    const isNotId = x => x.song.workId !== item.song.workId
    const updatedCueList = cueList.filter(isNotId)
    this.setState({
      cueList: updatedCueList
    });

    const updatedHits = result ?
      [...result,item.song]
      :
      [item.song]

    console.log(updatedHits);

    this.setState({
      results: 
      { ...results,
        [item.searchKey]: { result: updatedHits, page}
      },

    });
  }

  render() {
    const {
      searchTerm, 
      results, 
      searchKey, 
      isLoading, 
      sortKey,
      isSortReverse,
      cueList,
      hideCues
    } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 1;
    const list = (results && results[searchKey] && results[searchKey].result) || [];

    return (
      <div className="page">
        <CueList
          list={cueList}
          onRemoveSong={this.onRemoveSong}
          onSwapVisibility={this.onSwapVisibility}
          hideCues={hideCues}
        />
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Title Search
          </Search>
        </div>
        <Table
          list={list}
          sortKey={sortKey}
          isSortReverse={isSortReverse}
          onSort={this.onSort}
          onAddSong={this.onAddSong}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchResults(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
