import React, { useState, useEffect } from 'react';
import ResultsTable from '../components/ResultsTable';
import PacmanLoader from "react-spinners/PacmanLoader";
import BackButton from '../components/BackButton';
import jsonData from '../data/mlmodels/collated_games_data.json'; // Import the JSON data

function TotalScores() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [yearSelected, setYearSelected] = useState(false);
  const [showSentimentFeatures, setShowSentimentFeatures] = useState(true); // Set to true initially
  const [showMLModels, setShowMLModels] = useState(true); // Set to true initially
  const [isBoxWidened, setIsBoxWidened] = useState(false); // Track if the box is widened

  const filterDataByYear = (year) => {
    setLoading(true);
    const dataForYear = jsonData.filter((item) => item.Season === year);
    setTimeout(() => {
      setLoading(false);
      setFilteredData(dataForYear);
    }, 2000);
  };

  useEffect(() => {
    if (yearSelected && selectedYear) {
      filterDataByYear(selectedYear);
    }
  }, [selectedYear, yearSelected]);

  const handleYearChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedYear(selectedValue);
    setYearSelected(!!selectedValue); 
    setIsBoxWidened(!!selectedValue); 
  };
  

  const handleSentimentCheckboxChange = () => {
    setShowSentimentFeatures(!showSentimentFeatures);
    if (!showSentimentFeatures && !showMLModels) {
      setShowMLModels(true);
    }
  };

  const handleMLCheckboxChange = () => {
    setShowMLModels(!showMLModels);
    if (!showMLModels) {
      setShowSentimentFeatures(false);
    }
  };

  return (
    <div className="appdatahub">
    <BackButton />
    <div className={`text-box ${isBoxWidened ? 'text-box-widen' : ''}`}>
      {/* Heading always centered */}
      <h2>TotalScores</h2>
      
      {/* This paragraph will only show when the box is not widened */}
      {!isBoxWidened && (
        <p style={{ textAlign: "center" }}>
          Select the season to view EPL statistics.<br />2019-20 is powered by sentiment analysis insights
        </p>
      )}

        <div className="year-selector">
          <label style={{ color:"#333", textTransform:"uppercase"}}>
            Select Year:     
          </label><br></br>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            <option value="2019-20">2019-20 *Powered By Sentiment*</option>
          </select>
        </div>

        {/* Checkboxes for sentiment features and ML models */}
        <div className="checkboxes">
  {/* Group checkboxes together in a single container */}
  <div className="checkbox-container">
    <input
      type="checkbox"
      id="mlModels"
      checked={showMLModels}
      onChange={handleMLCheckboxChange}
    />
    <label htmlFor="mlModels">show all ML models</label>
  </div>
  <div className="checkbox-container">
    <input
      type="checkbox"
      id="sentimentFeatures"
      checked={showSentimentFeatures}
      onChange={handleSentimentCheckboxChange}
    />
    <label htmlFor="sentimentFeatures"><i>only with SA features</i></label>
  </div>
</div>
      </div>
      {selectedYear && (
        <div class="table-container">
                    {loading ? (
            <div className="loading-spinner">
              <PacmanLoader color="#FFFFFF" />
            </div>
          ) : (
            <ResultsTable data={filteredData} showSentimentFeatures={showSentimentFeatures} showMLModels={showMLModels} />
          )}
        </div>
      )}
    </div>
  );
}

export default TotalScores;
