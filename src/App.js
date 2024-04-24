import React, { useState, useEffect } from "react";
import { TextBoxComponent, ButtonComponent } from "./Components/Components";
import ChangeBackground from "./Components/Background";

// Includi la libreria gapi

function App() {
  //const [displayText, setDisplayText] = useState("");
  const [category, setCategory] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [toggleFavorites, setFavorites] = useState();

  /*
  const handleInputChange = (value) => {
    setDisplayText(value);
  };*/

  const handleCategory = (category) => {
    //console.log("category3", category);
    setCategory([...category]);
  };

  const handleKeywords = (keywords) => {
    //console.log("keywords3", keywords);
    setKeywords([...keywords]);
  };

  const handleDefaultCategories = (defaultCategories) => {
    //console.log("defaultCategories3", defaultCategories);
    setDefaultCategories([...defaultCategories]);
  };

  const handleToggleFavorites = (favorites) => {
    // Aggiorna lo stato principale con il valore di favorites
    setFavorites(favorites);
  };

  return (
    <div>
      <TextBoxComponent
        //handleInputChange={handleInputChange}
        handleCategory={handleCategory}
        handleKeywords={handleKeywords}
        handleDefaultCategories={handleDefaultCategories}
        handleToggleFavorites={handleToggleFavorites}
      />
      <ChangeBackground
        category={category}
        keywords={keywords}
        defaultCategories={defaultCategories}
        toggleFavorites={toggleFavorites}
      />
    </div>
  );
}

export default App;
