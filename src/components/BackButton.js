import React from "react";
import { useNavigate } from "react-router-dom";
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();
    
    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
          <button className="back-button" onClick={goBack}>Back</button>
        </>
    );
};

export default BackButton;
