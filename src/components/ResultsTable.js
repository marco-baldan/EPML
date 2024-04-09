import React from 'react';
import './ResultsTable.css';
import yesIcon from '../media/yes.png';
import noIcon from '../media/no.png';
import trainingIcon from '../media/training.png';
import testingIcon from '../media/testing.png';
import manchesterUnitedLogo from '../media/manchester-united-logo.png';
import liverpoolLogo from '../media/liverpool-logo.png';
import sheffieldLogo from '../media/sheffield-logo.png';
import newcastleLogo from '../media/newcastle-logo.png';
import evertonLogo from '../media/everton-logo.png';
import manCityLogo from '../media/man-city-logo.png';
import burnleyLogo from '../media/burnley-logo.png';
import tottenhamLogo from '../media/tottenham-logo.png';
import westHamLogo from '../media/west-ham-logo.png';
import astonVillaLogo from '../media/aston-villa-logo.png';
import norwichLogo from '../media/norwich-logo.png';
import crystalPalaceLogo from '../media/crystal-palace-logo.png';
import southamptonLogo from '../media/southampton-logo.png';
import arsenalLogo from '../media/arsenal-logo.png';
import chelseaLogo from '../media/chelsea-logo.png';
import leicesterLogo from '../media/leicester-logo.png';
import wolvesLogo from '../media/wolves-logo.png';
import bournemouthLogo from '../media/bournemouth-logo.png';
import brightonLogo from '../media/brighton-logo.png';
import watfordLogo from '../media/watford-logo.png';

const PredictionResult = ({ model, prediction, actual }) => {
  const isCorrect = prediction === actual;
  const iconSrc = isCorrect ? yesIcon : noIcon;
  const modelName = model
    .replace('roberta', 'roBERTA') 
    .replace('vadar', 'VADAR') 
    .replace(/_/g, ' ') 
    .replace('Naive Bayes', 'Naive Bayes')
    .replace('L Regress', 'Logistic Regression')
    .replace('KNN', 'K-Nearest Neighbors')
    .replace('SVM', 'Support Vector Machine')
    .replace('w/o ', '');

  return (
    <div className="prediction-result">
      <img src={iconSrc} alt={isCorrect ? 'Correct' : 'Incorrect'} className="prediction-icon" />
      <span className="prediction-model">{modelName}</span>
    </div>
  );
};


const teamLogos = {
  'Man United': manchesterUnitedLogo,
  'Liverpool': liverpoolLogo,
  'Sheffield United': sheffieldLogo,
  'Newcastle': newcastleLogo,
  'Everton': evertonLogo,
  'Man City': manCityLogo,
  'Burnley': burnleyLogo,
  'Tottenham': tottenhamLogo,
  'West Ham': westHamLogo,
  'Aston Villa': astonVillaLogo,
  'Norwich': norwichLogo,
  'Crystal Palace': crystalPalaceLogo,
  'Southampton': southamptonLogo,
  'Arsenal': arsenalLogo,
  'Chelsea': chelseaLogo,
  'Leicester': leicesterLogo,
  'Wolves': wolvesLogo,
  'Bournemouth': bournemouthLogo,
  'Brighton': brightonLogo,
  'Watford': watfordLogo
};


const getTeamLogo = (teamName) => {
  return teamLogos[teamName] || ''; 
};

const MatchCard = ({ match, showSentimentFeatures, showMLModels }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const resultActual = match.FTR; 
  
  const modelGroups = {
    'roBERTA additional feature': Object.keys(match).filter(key => key.startsWith('roberta ')),
    'VADAR additional feature': Object.keys(match).filter(key => key.startsWith('vadar ')),
    'without sentiment analysis': Object.keys(match).filter(key => key.startsWith('w/o '))
  };

  const hasSentimentFeatures = Object.values(modelGroups).flat().some(key => 
    key.includes('roberta') ||
    key.includes('vadar')
  );

  const hasMLModels = Object.values(modelGroups).flat().some(key => 
    key.includes('Naive Bayes') ||
    key.includes('Logistic Regression') ||
    key.includes('K-Nearest Neighbors') ||
    key.includes('Support Vector Machine')
  );

  const isTrainingData = !hasMLModels;

  if ((showSentimentFeatures && !hasSentimentFeatures) || (showMLModels && !hasMLModels)) {
    return null;
  }
  
  return (
    <div className="match-card">
      {isTrainingData ? (
        <img src={trainingIcon} alt="Training Data" className="data-type-icon" />
      ) : (
        <img src={testingIcon} alt="Testing Data" className="data-type-icon" />
      )}
      

      <div className="match-details">
        <div className="match-date">{formatDate(match.DateTime)}</div>
        <div className="team-container">
          <div className="team home-team">
            <span className="team-name">{match.HomeTeam}</span>
            <img src={getTeamLogo(match.HomeTeam)} alt={`${match.HomeTeam} Logo`} className="team-logo" />
            <span className="team-score">{match.FTHG}</span>
          </div>
          <div className="team away-team">
            <span className="team-score">{match.FTAG}</span>
            <img src={getTeamLogo(match.AwayTeam)} alt={`${match.AwayTeam} Logo`} className="team-logo" />
            <span className="team-name">{match.AwayTeam}</span>
          </div>
        </div>
        <hr className="horizontal-line" />
      </div>
      <div className="prediction-results-container">
        {Object.entries(modelGroups).map(([groupName, modelKeys]) => (
          <div className="prediction-group" key={groupName}>
            <h4>{groupName}</h4>
            {modelKeys.length > 0 ? (
              modelKeys.map(modelKey => (
                <PredictionResult
                  key={modelKey}
                  model={modelKey.replace(/(roberta |vadar |w\/o )/, '').replace('_', ' ')}
                  prediction={match[modelKey]}
                  actual={resultActual}
                />
              ))
            ) : (
              <p className="no-models">No models available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


const ResultsTable = ({ data, showSentimentFeatures, showMLModels }) => {
  return (
    <div className="results-container">
      <div className="testing-section">
        <div className="card-container">
          {data.map((match, index) => (
            <MatchCard
              key={index}
              match={match}
              showSentimentFeatures={showSentimentFeatures}
              showMLModels={showMLModels}
              isTrainingData={false} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;