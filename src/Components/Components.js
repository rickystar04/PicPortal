import React, { useState, useEffect } from "react";
import "./Style.css";

class TextBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      isHide: true,
    };
  }

  handleChange = (event) => {
    const newValue = event.target.value;
    this.setState({ inputValue: newValue }); // Pass the value to the parent component
  };

  handleSubmit = (text) => {
    if (text == undefined) {
      return;
    }
    window.location.href = `https://www.google.com/search?q=${text}`;
  };

  //FORSE DA RIMUOVERE
  /*
  componentDidMount() {
    const keyDownHandler = (event) => {
      //console.log("User pressed: ", event.key);

      if (event.key === "Enter" && event.target.value !== "") {
        event.preventDefault();

        // 👇️ call submit function here
        this.handleSubmit(event.target.value);
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    this.cleanupFunction = () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }
*/
  SearchQuery = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      // Esegui le azioni per il primo input
      this.handleSubmit(event.target.value);
    }
  };

  componentWillUnmount() {
    //this.cleanupFunction();
  }

  funzioneDaChiamare = () => {
    this.setState((prevState) => ({
      isHide: !prevState.isHide,
    }));
  };

  handleCategory = (category) => {
    this.props.handleCategory(category);
  };

  handleKeywords = (keywords) => {
    this.props.handleKeywords(keywords);
  };

  handleDefaultCategories = (categories) => {
    this.props.handleDefaultCategories(categories);
  };

  handleToggleFavorites = (favorites) => {
    this.props.handleToggleFavorites(favorites);
  };
  render() {
    return (
      <div>
        {this.state.isHide && (
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
            onKeyDown={this.SearchQuery}
            className="InputStyle"
          />
        )}
        {this.state.isHide && (
          <ButtonComponent
            text={this.state.inputValue}
            isHide={this.state.isHide}
          />
        )}
        {this.state.isHide && <DisplayDate isHide={this.state.isHide} />}
        <HideButtonComponent chiamataFunzione={this.funzioneDaChiamare} />
        <Sidebar
          passCategory={this.handleCategory}
          passKeywords={this.handleKeywords}
          passDefaultCategories={this.handleDefaultCategories}
          onToggleFavorites={this.handleToggleFavorites}
        />
      </div>
    );
  }
}
////////////////////////////////

class ButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
    };
  }

  handleClickButton = () => {
    if (this.props.text !== "")
      window.location.href = `https://www.google.com/search?q=${this.props.text}`;
  };

  render() {
    return (
      <div>
        <button className="ButtonStyle" onClick={this.handleClickButton}>
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
          >
            <path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z" />
          </svg>
        </button>
      </div>
    );
  }
}

//////////////////////////////////////////////////
class DisplayDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
      time: new Date(),
    };
  }

  componentDidMount() {
    const interval = setInterval(() => {
      this.setState({
        time: new Date(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }

  render() {
    var hours = this.state.time.getHours();
    var minutes = this.state.time.toLocaleTimeString().split(":")[1];

    return (
      <div>
        {this.state.isHide && (
          <p className="ClockStyle">
            {hours}:{minutes}
          </p>
        )}
      </div>
    );
  }
}
/////////////////////////////////////////////////
class HideButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: true,
    };
  }
  toggleHide = () => {
    this.setState((prevState) => ({
      isHide: !prevState.isHide,
    }));
  };

  handleClick = () => {
    // Chiamata alla funzione passata come prop quando viene cliccato l'elemento in ComponenteB
    this.props.chiamataFunzione();
    this.toggleHide();
  };
  render() {
    if (this.state.isHide) {
      return (
        <button className="HideButton" onClick={this.handleClick}>
          <svg
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 3 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m17.069 6.546 2.684-2.359c.143-.125.32-.187.497-.187.418 0 .75.34.75.75 0 .207-.086.414-.254.562l-16.5 14.501c-.142.126-.319.187-.496.187-.415 0-.75-.334-.75-.75 0-.207.086-.414.253-.562l2.438-2.143c-1.414-1.132-2.627-2.552-3.547-4.028-.096-.159-.144-.338-.144-.517s.049-.358.145-.517c2.111-3.39 5.775-6.483 9.853-6.483 1.815 0 3.536.593 5.071 1.546zm2.319 1.83c.966.943 1.803 2.014 2.474 3.117.092.156.138.332.138.507s-.046.351-.138.507c-2.068 3.403-5.721 6.493-9.864 6.493-1.297 0-2.553-.313-3.729-.849l1.247-1.096c.795.285 1.626.445 2.482.445 3.516 0 6.576-2.622 8.413-5.5-.595-.932-1.318-1.838-2.145-2.637zm-3.434 3.019c.03.197.046.399.046.605 0 2.208-1.792 4-4 4-.384 0-.756-.054-1.107-.156l1.58-1.389c.895-.171 1.621-.821 1.901-1.671zm-.058-3.818c-1.197-.67-2.512-1.077-3.898-1.077-3.465 0-6.533 2.632-8.404 5.5.853 1.308 1.955 2.567 3.231 3.549l1.728-1.519c-.351-.595-.553-1.289-.553-2.03 0-2.208 1.792-4 4-4 .925 0 1.777.315 2.455.843zm-2.6 2.285c-.378-.23-.822-.362-1.296-.362-1.38 0-2.5 1.12-2.5 2.5 0 .36.076.701.213 1.011z"
              fillRule="nonzero"
            />
          </svg>
        </button>
      );
    } else {
      return (
        <button className="HideButton" onClick={this.handleClick}>
          <svg
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 3 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm8.413 7c-1.837 2.878-4.897 5.5-8.413 5.5-3.465 0-6.532-2.632-8.404-5.5 1.871-2.868 4.939-5.5 8.404-5.5 3.518 0 6.579 2.624 8.413 5.5zm-8.411-4c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
              fillRule="nonzero"
            />
          </svg>
        </button>
      );
    }
  }
}
/////////////////////////////////////////////////
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: true,
      categories: [],
      selectedCategory: [],
      keywords: [],
      favorites: false,
    };
  }

  getCategories = () => {
    //fetch("http://192.168.56.1:3001/categories")
    fetch("https://node-server-baoq.onrender.com/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella richiesta al server");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          categories: data,
        });
        var categories = [];
        for (let i = 0; i < data.length; i++) {
          categories.push(data[i].slug);
        }
        this.props.passDefaultCategories(categories);
      })
      .catch((error) => {
        console.error("Errore:", error.message);
      });
  };

  componentDidMount() {
    this.getCategories();

    //TODO DA RIMETTERE

    chrome.storage.sync.get({ category: [], keywords: [] }, (result) => {
      this.setState({
        selectedCategory: result.category,
        selectedKeywords: result.keywords,
      });
      console.log("RECUPERATA:" + result.keywords);
      if (result.category.length > 0) {
        this.retrieveCategory(result.category);
      }

      if (result.keywords.length > 0) {
        console.log("QUI");
        this.retrieveKeywords(result.keywords);
      }
    });
  }

  toggleHide = () => {
    this.setState((prevState) => ({
      isHidden: !prevState.isHidden,
    }));
  };

  retrieveCategory = (selectedCategory) => {
    console.log("selectedCategory", selectedCategory);
    this.setState({
      selectedCategory: selectedCategory,
    });
    this.props.passCategory(selectedCategory);
  };

  retrieveKeywords = (selectedKeywords) => {
    console.log("selectedKeywords", selectedKeywords);
    this.setState({
      keywords: selectedKeywords,
    });
    this.props.passKeywords(selectedKeywords);
  };

  selectCategory = (category) => {
    const { keywords } = this.state;

    if (keywords.length === 0) {
      var selectedCategory = this.state.selectedCategory;
      var categoryIndex = selectedCategory.indexOf(category);

      if (categoryIndex !== -1) {
        selectedCategory.splice(categoryIndex, 1);
        console.log("Rimosso", category);
      } else {
        selectedCategory.push(category);
      }

      this.setState({
        selectedCategory: selectedCategory,
      });

      console.log("selectedCategory", selectedCategory);
      this.props.passCategory(selectedCategory);
    } else {
      // If there are keywords, prevent selecting any category
      console.log("Cannot select category when keywords are present.");
    }
  };

  inputKeyWords = (event) => {
    const { selectedCategory } = this.state;

    if (
      selectedCategory.length === 0 &&
      event.key === "Enter" &&
      event.target.value !== ""
    ) {
      // Esegui le azioni per il primo input
      var query = event.target.value;
      var selectedKeywords = this.state.keywords;

      if (selectedKeywords.indexOf(query) === -1) {
        selectedKeywords.push(query);

        this.setState({
          keywords: selectedKeywords,
        });
      }
      console.log(selectedKeywords);
      this.props.passKeywords(selectedKeywords);
    } else {
      // If categories are selected, prevent adding new keywords
      console.log("Cannot add keywords when categories are selected.");
    }
  };

  deleteKeyWord = (index) => {
    var selectedKeywords = this.state.keywords;
    selectedKeywords.splice(index, 1);
    this.setState({
      keywords: selectedKeywords,
    });
    this.props.passKeywords(selectedKeywords);
  };

  toggleFavorites = () => {
    this.setState(
      (prevState) => ({
        favorites: !prevState.favorites,
      }),
      () => {
        this.props.onToggleFavorites(this.state.favorites);
      }
    );
  };
  render() {
    const { isHidden, categories, selectedCategory, keywords, favorites } =
      this.state;
    return (
      <div>
        <div
          className={`RestOfScreen ${this.state.isHidden ? "" : "shown"}`}
          onClick={this.toggleHide}
        ></div>

        <button className="SidebarButtonStyle" onClick={this.toggleHide}>
          <svg
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m21 15.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75zm0-4c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z"
              fillRule="nonzero"
            />
          </svg>
        </button>
        <div className={`SidebarStyle ${this.state.isHidden ? "hidden" : ""}`}>
          <button className="CloseSidebarButtonStyle" onClick={this.toggleHide}>
            <svg
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
            </svg>
          </button>
          <input
            type="text"
            className={`InputKeyword ${
              selectedCategory.length > 0 ? "disabled" : ""
            }`}
            placeholder="Search by keywords"
            onKeyDown={(e) => this.inputKeyWords(e)}
            disabled={selectedCategory.length > 0}
          />
          <div className="KeywordsContainerStyle">
            {keywords &&
              keywords.map((keyword, index) => (
                <div className="Keywords-grid" key={index}>
                  <div
                    className="KeywordBox"
                    onClick={(e) => this.deleteKeyWord(index)}
                  >
                    {keyword}
                  </div>
                </div>
              ))}
          </div>

          <div className="FavoritesContainer">
            <p className="FavoritesTitle">View only favorites</p>
            <div className="SwitchContainer">
              {/* Aggiunta del pulsante di switch */}
              <label className="Switch">
                <input
                  type="checkbox"
                  checked={favorites}
                  onChange={this.toggleFavorites}
                />
                <span className="Slider"></span>
              </label>
            </div>
          </div>

          <p className="CategoriesTitle">Categories</p>
          <div className="CategoriesContainerStyle">
            {categories &&
              categories.map((category, index) => (
                <div className="category-name" key={index}>
                  {category.title}
                  <div
                    className={`grid-item ${
                      selectedCategory.includes(category.slug) ? "selected" : ""
                    } ${keywords.length > 0 ? "disabled" : ""}`}
                    key={index}
                    style={{
                      position: "relative",
                      backgroundImage: `url(${category.cover_photo.urls.regular})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                    onClick={
                      () => this.selectCategory(category.slug)
                      //() =>
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export { TextBoxComponent, ButtonComponent };
/*global chrome*/
