import React, { useState } from 'react';
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

const ItemCard = ({ data, onClose }) => {
  // Overlay click handler to close the modal if clicked on the backdrop
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('item-card-backdrop')) {
      onClose();
    }
  };
  const getFullTimeResult = (result) => {
    switch (result) {
      case 'H':
        return 'Home Win';
      case 'D':
        return 'Draw';
      case 'A':
        return 'Away Win';
      default:
        return result; // Or some default text such as 'Unknown'
    }
  };
  
  return(
    <div className="item-card-backdrop" onClick={handleBackdropClick}>
    <div className="item-card">
      <div className="item-card-header">
        <h2>{data['HomeTeam']} vs {data['AwayTeam']}</h2>
        <h3>{data['Date Time']}</h3>
        <button className="item-card-close" onClick={onClose}>&times;</button>
      </div>
      <div className="item-card-body">
        <div className="item-card-column">
          <h3>{data['HomeTeam']}</h3>
          <p><strong>Full Time Goals</strong> <br></br>{data.FTHG}</p>
          <p><strong>Half Time Goals</strong> {data.HTHG}</p>
          <p><strong>Shots</strong><br></br> {data.HS}</p>
          <p><strong>Shots on Target</strong><br></br> {data.HST}</p>
          <p><strong>Corners</strong><br></br> {data.HC}</p>
          <p><strong>Fouls Committed</strong><br></br> {data.HF}</p>
          <p><strong>Yellow Cards</strong><br></br> {data.HY}</p>
          <p><strong>Red Cards</strong><br></br> {data.HR}</p>
        </div>
        <div className="item-card-column">
          <h3>{data['AwayTeam']}</h3>
          <p><strong>Full Time Goals</strong><br></br> {data.FTAG}</p>
          <p><strong>Half Time Goals</strong><br></br> {data.HTAG}</p>
          <p><strong>Shots</strong><br></br> {data.AS}</p>
          <p><strong>Shots on Target</strong><br></br> {data.AST}</p>
          <p><strong>Corners</strong><br></br> {data.AC}</p>
          <p><strong>Fouls Committed</strong><br></br> {data.AF}</p>
          <p><strong>Yellow Cards</strong><br></br> {data.AY}</p>
          <p><strong>Red Cards</strong><br></br> {data.AR}</p>
        </div>
      </div>
      <div className="item-card-footer">
        <p><strong>Season:</strong> {data.Season}</p>
        <p><strong>Full Time Result:</strong> {getFullTimeResult(data.FTR)}</p>
        <p><strong>Half Time Result:</strong> {getFullTimeResult(data.HTR)}</p>
        <p><strong>Referee:</strong> {data.Referee}</p>
      </div>
    </div>
  </div>
  );
};
const ResultsTable = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  // Close the item card
  const closeItemCard = () => setSelectedItem(null);

  // Function to open the item card with the selected row's data
  const handleRowClick = (row) => {
    setSelectedItem(row.original);
  };
  const columns = React.useMemo(
    () => [
      

      {
        Header: 'Date Time',
        accessor: 'DateTime',
        Cell: ({ value }) => {
          // Parse the datetime value (assuming it's in a valid date format)
          const date = new Date(value);
          // Format the date and time as "DD/MM h:mma"
          const formattedDateTime = `${date.getDate()}/${date.getMonth() + 1} ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;

          return formattedDateTime;
        },
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
      {selectedItem && <ItemCard data={selectedItem} onClose={closeItemCard} />}

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
                    title={columnDescriptions[column.Header] || ''}
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
                <tr {...row.getRowProps()} onClick={() => handleRowClick(row)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
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