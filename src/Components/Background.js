import React, { useState } from "react";
import { Blurhash } from "react-blurhash";
import "./Style.css";
import nextImage from "../imgs/next-arrow.png";
import prevImage from "../imgs/prev-arrow.png";

//TODO fare richiesta con le keyword senza passare le categorie
class ChangeBackground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      item: [],
      showing: 0,
      temp: 0,
      isfavorited: false,
      category: [],
      keywords: [],
      defaultCategories: [],
      isImageLoaded: false,
      favorites: [],
      toggleFavorites: false,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDownHandler);
    this.handleFavorites();
  }

  requestImages(e, category) {
    this.setState({ isLoaded: false });
    var defaultCategories = this.state.defaultCategories;

    if (this.state.toggleFavorites) {
      //fetch("https://node-server-baoq.onrender.com/");
    } else {
      //alert("PROVA");
      fetch("http://localhost:3001/", {
        //fetch("https://node-server-baoq.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numOfImages: e,
          category: category,
          defaultCategories: defaultCategories,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Errore nella richiesta al server");
          }
          return response.json();
        })
        .then(
          (data) => {
            if (data == "ERRORE") {
              var err = { message: "Nessuna immagine trovata" };
              this.setState({
                isLoaded: false,
                error: err,
              });
            } else {
              this.setState(
                (prevState) => ({
                  item: [...prevState.item, ...data],
                  isLoaded: true,
                }),
                () => {
                  this.preloadNextImage();
                }
              );
            }
          },
          (err) => {
            this.setState({
              isLoaded: true,
              error: err,
            });
          }
        );
    }
  }

  preloadNextImage = () => {
    const item = this.state.item;
    const showing = this.state.showing;
    const nextImageIndex = showing + 1;

    console.log("Preloading next image");
    if (item && this.state.toggleFavorites) {
      this.setState({ isImageLoaded: false });
    }

    if (item) {
      if (item[nextImageIndex] != undefined) {
        // Add a null check for item[nextImageIndex]
        //const preloadedImages = [...this.state.preloadedImages];
        const img = new Image();
        img.src = item[nextImageIndex].urls.full;
        img.onload = () => {
          // Questo evento onLoad si verifica solo quando l'immagine è completamente caricata
          console.log("Immagine completamente caricata");
        };
        //preloadedImages[nextImageIndex] = img;
        //this.setState({ preloadedImages: preloadedImages });
      }
      setTimeout(() => {
        this.setState({ isImageLoaded: true });
      }, 1000);
    }
  };

  //add favorites

  checkFavorite = () => {
    if (this.state.isLoaded) {
      const link = this.state.item[this.state.showing];
      var included = this.state.favorites.includes(link);
      return included;

      // Utilizza una Promise per gestire l'asincronia di chrome.storage.sync.get
      /*
      return new Promise((resolve) => {
        chrome.storage.sync.get({ links: [] }, (obj) => {
          const links = obj.links;

          const isfavorited = links.includes(link);
          console.log(link);
          console.log("LISTA: " + links);
          console.log("NELLA LISTA: " + isfavorited);

          this.setState({ isfavorited: isfavorited }, resolve);
        });
      });*/
    }
  };

  clickedFavorite = () => {
    this.favorites();
  };
  handleFavorites = () => {
    // Chiamata asincrona di checkFavorite
    var fav = this.checkFavorite();

    // Inverti lo stato di isfavorited e chiamata a favorites
    this.setState(() => ({ isfavorited: fav }));
  };

  favorites = () => {
    const link = this.state.item[this.state.showing];

    //TODO SYNC
    /*
    chrome.storage.sync.get({ links: [] }, (obj) => {
      const links = obj.links;

      const linkIndex = links.indexOf(link);

      if (linkIndex !== -1) {
        // Link è già presente, rimuovilo
        links.splice(linkIndex, 1);
        console.log("Link removed", link);
      } else {
        // Link non è presente, aggiungilo
        links.push(link);
        console.log("Link added", link);
      }

      // Utilizza Promise per gestire l'asincronia di chrome.storage.sync.set
      new Promise((resolve) => {
        chrome.storage.sync.set({ links: links }, resolve);
      }).then(() => {
        console.log("LINKS SALVATI: ");
        console.log(links);
      });
    });
    */

    var links = this.state.favorites;
    const linkIndex = links.indexOf(link);
    if (linkIndex !== -1) {
      // Link è già presente, rimuovilo
      links.splice(linkIndex, 1);
      console.log("Link removed", link);
    } else {
      // Link non è presente, aggiungilo
      links.push(link);
      console.log("Link added", link);
    }

    console.log(links);

    // Utilizza Promise per gestire l'asincronia di chrome.storage.sync.set
    new Promise((resolve) => {
      //chrome.storage.sync.set({ links: links }, resolve);
      this.setState({ favorites: links }, resolve);
    }).then(() => {
      this.handleFavorites();
    });
  };

  increaseShowing = () => {
    const {
      isLoaded,
      toggleFavorites,
      showing,
      item,
      temp,
      category,
      keywords,
      isImageLoaded,
    } = this.state;
    const { length } = item;

    this.setState({ isImageLoaded: false });

    if (!isLoaded) {
      return; // Blocca l'avanzamento se le immagini non sono state caricate
    }

    if (toggleFavorites) {
      if (showing < length - 1) {
        this.setState((prevState) => ({
          showing: prevState.showing + 1,
          isImageLoaded: true,
        }));
      } else {
        this.setState({
          showing: 0,
          isImageLoaded: true,
        }); // Torna alla prima immagine quando si è alla fine delle immagini
        return;
      }
    } else if (showing === length - 2) {
      //this.state.temp + 1 === 9) {
      this.setState({ temp: 0 }, () => {
        const items =
          category.length >= 1
            ? category
            : keywords.length >= 1
            ? keywords
            : [category];
        items.forEach((item) => this.requestImages(10, item));
      });
    } else {
      this.setState({ temp: temp + 1 }, () => this.preloadNextImage());

      if (isLoaded) {
        // Controlla nuovamente lo stato isLoaded prima di aumentare showing
        this.setState({ showing: showing + 1 }, () => this.handleFavorites());
      }
    }
  };

  reduceShowing = () => {
    this.checkFavorite();
    if (!this.state.isLoaded) {
      return; // Blocca l'avanzamento se le immagini non sono state caricate
    }
    var showing = this.state.showing;

    if (showing > 0) {
      this.setState(
        (prevstate) => ({
          showing: prevstate.showing - 1,
          temp: prevstate.temp - 1,
        }),
        () => {
          // Qui passa la funzione handleFavorites() come callback
          this.handleFavorites();
        }
      );
    } else {
      console.log("You are at the beginning of the list");
    }
  };

  //move right-left
  keyDownHandler = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();

      // 👇️ call submit function here
      this.increaseShowing();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.reduceShowing();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.toggleFavorites !== undefined &&
      this.props.toggleFavorites !== prevProps.toggleFavorites
    ) {
      if (this.state.toggleFavorites === true) {
        this.setState(
          {
            toggleFavorites: this.props.toggleFavorites,
            item: this.state.favorites, // Reset item to favorites
            showing: 0,
            temp: 0,
            isImageLoaded: false,
          },
          () => {
            this.requestImages(10, this.state.category);
          }
        );
      } else {
        // Update state only if necessary
        if (this.state.toggleFavorites !== this.props.toggleFavorites) {
          this.setState(
            {
              toggleFavorites: this.props.toggleFavorites,
              item: this.state.favorites, // Reset item to favorites
              showing: 0,
              temp: 0,
              isImageLoaded: false,
            },
            () => {
              this.handleFavorites();

              this.preloadNextImage();
            }
          );
        }
      }
    }

    if (
      this.state.defaultCategories !== this.props.defaultCategories &&
      this.props.defaultCategories.length != 0
    ) {
      this.setState({
        defaultCategories: this.props.defaultCategories,
      });
    }
    if (this.state.defaultCategories.length != 0) {
      if (this.state.category !== this.props.category) {
        this.setState({
          category: this.props.category,
          item: [],
          isLoaded: false,
          showing: 0,
          temp: 0,
        });
        if (this.props.category.length > 1) {
          for (var i = 0; i < this.props.category.length; i++) {
            this.requestImages(10, this.props.category[i]);
          }
        } else {
          this.requestImages(10, this.props.category);
        }
        //TODO DA RIMETTERE
        //chrome.storage.sync.set({ category: this.props.category });
      } else if (this.state.keywords !== this.props.keywords) {
        this.setState({
          keywords: this.props.keywords,
          item: [],
          temp: 0,
          showing: 0,
          isLoaded: false,
        });

        if (this.props.keywords.length > 1) {
          for (var i = 0; i < this.props.keywords.length; i++) {
            this.requestImages(10, this.props.keywords[i]);
          }
        } else {
          this.requestImages(10, this.props.keywords);
        }

        //TODO DA RIMETTERE
        //chrome.storage.sync.set({ keywords: this.props.keywords });
      }
    }
  }
  // All'interno del metodo render() della classe ChangeBackground
  render() {
    const {
      error,
      isLoaded,
      item,
      showing,
      isImageLoaded,
      toggleFavorites,
      favorites,
    } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded && showing === 0) {
      setTimeout(() => {
        this.setState({ isImageLoaded: true });
      }, 3000);
      return <div>Loading...</div>;
    } else if (!isImageLoaded) {
      console.log("1");
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Verifica se item[showing] è definito prima di accedere a blur_hash
      if (item[showing]) {
        console.log("2");
        return (
          <div style={{ transition: "1s ease" }}>
            <Blurhash
              hash={item[showing].blur_hash}
              width={width}
              height={height}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </div>
        );
      }
    } else if (item.length == 0 && toggleFavorites == true) {
      return <div>Error: nessuna immagine preferita2</div>;
    } else {
      let containerStyle = {
        backgroundImage: `url(${
          toggleFavorites && favorites.length > 0
            ? favorites[showing].urls.full
            : item[showing].urls.full
        })`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        display: !isImageLoaded ? "none" : "",
      };
      if (toggleFavorites && favorites.length > 0) {
        // Se toggleFavorites è true e ci sono preferiti disponibili, mostra solo i preferiti
        const currentFavorite = favorites[showing];
        const containerStyle = {
          backgroundImage: `url(${currentFavorite.urls.full})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh",
          width: "100vw",
          textAlign: "center",
          display: !isImageLoaded ? "none" : "",
        };
      }
      return (
        <div className="BackgroundStyle" style={containerStyle}>
          <Photographer
            name={item[showing].user.name}
            photographer={item[showing].user.links.html}
            photo_link={item[showing].links.html}
          ></Photographer>
          <img
            src={nextImage}
            className="NextImageStyle"
            onClick={this.increaseShowing}
          />
          <img
            src={prevImage}
            className="PrevImageStyle"
            onClick={this.reduceShowing}
          />
          <button className="FavoritesButtonStyle" onClick={this.favorites}>
            {this.state.isfavorited ? (
              <svg
                clipRule="evenodd"
                fillRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit="2"
                viewBox="-1 3.5 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z"
                  fillRule="nonzero"
                />
              </svg>
            ) : (
              <svg
                clipRule="evenodd"
                fillRule="evenodd"
                strokeLinejoin="round"
                strokeMiterlimit="2"
                viewBox="-1 3.5 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44zm.678 2.033-2.361 4.792-5.246.719 3.848 3.643-.948 5.255 4.707-2.505 4.707 2.505-.951-5.236 3.851-3.662-5.314-.756z"
                  fillRule="nonzero"
                />
              </svg>
            )}
          </button>
        </div>
      );
    }
  }
}

class Photographer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //name: name,
    };
  }
  render() {
    //alert(this.props.name);
    var utm_link = "?utm_source=PicPortal&utm_medium=referral";
    var unsplash_link = "https://unsplash.com";
    return (
      <div>
        <p className="PhotographerName">
          <a href={this.props.photo_link + utm_link}>Photo</a> by{" "}
          <a href={this.props.photographer + utm_link}>{this.props.name}</a> on{" "}
          <a href={unsplash_link + utm_link}>Unsplash</a>
        </p>
      </div>
    );
  }
}

export default ChangeBackground;
/*global chrome*/
