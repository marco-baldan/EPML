import React from 'react';
import { useTable, useSortBy } from 'react-table';
import './ResultsTable.css';

const columnDescriptions = {
  Season: 'Match Season',
  'Date Time': 'Match Date and Time (yyyy-mm-dd hh:mm:ss)',
  'Home Team': 'Home Team',
  'Away Team': 'Away Team',
  FTHG: 'Full Time Home Team Goals',
  FTAG: 'Full Time Away Team Goals',
  FTR: 'Full Time Result (H=Home Win, D=Draw, A=Away Win)',
  HTHG: 'Half Time Home Team Goals',
  HTAG: 'Half Time Away Team Goals',
  HTR: 'Half Time Result (H=Home Win, D=Draw, A=Away Win)',
  Referee: 'Match Referee',
  HS: 'Home Team Shots',
  AS: 'Away Team Shots',
  HST: 'Home Team Shots on Target',
  AST: 'Away Team Shots on Target',
  HC: 'Home Team Corners',
  AC: 'Away Team Corners',
  HF: 'Home Team Fouls Committed',
  AF: 'Away Team Fouls Committed',
  HY: 'Home Team Yellow Cards',
  AY: 'Away Team Yellow Cards',
  HR: 'Home Team Red Cards',
  AR: 'Away Team Red Cards',
};

const ResultsTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      

      {
        Header: 'Date Time',
        accessor: 'DateTime',
      },
      {
        Header: 'Home Team',
        accessor: 'HomeTeam',
      },
      {
        Header: 'Away Team',
        accessor: 'AwayTeam',
      },
      {
        Header: 'FTHG',
        accessor: 'FTHG',
      },
      {
        Header: 'FTAG',
        accessor: 'FTAG',
      },
      {
        Header: 'FTR',
        accessor: 'FTR',
      },
      {
        Header: 'HTHG',
        accessor: 'HTHG',
      },
      {
        Header: 'HTAG',
        accessor: 'HTAG',
      },
      {
        Header: 'HTR',
        accessor: 'HTR',
      },
      {
        Header: 'Referee',
        accessor: 'Referee',
      },
      {
        Header: 'HS',
        accessor: 'HS',
      },
      {
        Header: 'AS',
        accessor: 'AS',
      },
      {
        Header: 'HST',
        accessor: 'HST',
      },
      {
        Header: 'AST',
        accessor: 'AST',
      },
      {
        Header: 'HC',
        accessor: 'HC',
      },
      {
        Header: 'AC',
        accessor: 'AC',
      },
      {
        Header: 'HF',
        accessor: 'HF',
      },
      {
        Header: 'AF',
        accessor: 'AF',
      },
      {
        Header: 'HY',
        accessor: 'HY',
      },
      {
        Header: 'AY',
        accessor: 'AY',
      },
      {
        Header: 'HR',
        accessor: 'HR',
      },
      {
        Header: 'AR',
        accessor: 'AR',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <div>
      <div className="table-container">
      <table {...getTableProps()} className="styled-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'sort-desc'
                        : 'sort-asc'
                      : ''
                  }
                  title={columnDescriptions[column.Header]}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ResultsTable;
