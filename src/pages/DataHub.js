import React, { useState, useEffect } from 'react';
import ResultsTable from '../components/ResultsTable';
import jsonData from '../data/results.json'; // Import the converted JSON data
import PacmanLoader from "react-spinners/PacmanLoader";
import BackButton from '../components/BackButton';

function DataHub() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(''); // Initialize with an empty string
  const [filteredData, setFilteredData] = useState([]);
  const [yearSelected, setYearSelected] = useState(false); // Track if the user has selected a year


  // Define a function to filter data based on the selected year
  const filterDataByYear = (year) => {
    setLoading(true);

    // Use a filter function to select data for the chosen year
    const dataForYear = jsonData.filter((item) => item.Season === year);

    // Simulate loading delay (remove this in production)
    setTimeout(() => {
      setLoading(false);
      setFilteredData(dataForYear); // Update the filtered data
    }, 1000);
  };

  useEffect(() => {
    // Load data for the selected year only if the user has selected a year
    if (yearSelected && selectedYear) {
      filterDataByYear(selectedYear);
    }
  }, [selectedYear, yearSelected]);

  const handleYearChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedYear(selectedValue);
    setYearSelected(true); // Set yearSelected to true when the user selects a year
  };

  return (
          <div className="appdatahub">
            <BackButton />

      <div className='text-box'>
      <h2>DataHub</h2>
      <p style={{ textAlign: "center" }}>Select the season to view EPL statistics. <br></br>2019-20 and 2020-21 have added sentiment analysis insights</p>

      {/* Year Selection */}
      <div className="year-selector">
        <label style={{ color:"#333", textTransform:"uppercase"}}>
          Select Year:     
        </label><br></br>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            <option value="2011-12">2011-12</option>
            <option value="2012-13">2012-13</option>
            <option value="2013-14">2013-14</option>
            <option value="2014-15">2014-15</option>
            <option value="2015-16">2015-16</option>
            <option value="2016-17">2016-17</option>
            <option value="2017-18">2017-18</option>
            <option value="2018-19">2018-19</option>
            <option className="green" value="2019-20">2019-20 *Powered By Sentiment*</option>
            <option className="green" value="2020-21">2020-21 *Powered By Sentiment*</option>
          </select>
      </div>
      </div>
      {selectedYear != '' && (
  <div className="table-container" style={{ marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
    {loading ? (
      <div className="loading-spinner">
        <PacmanLoader color="#FFFFFF" />
      </div>
    ) : (
      <ResultsTable data={filteredData} />
    )}
  </div>
)}
    </div>

    
  );
}

export default DataHub;
