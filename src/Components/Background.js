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
      isFavorited: false,
      category: [],
      keywords: [],
      defaultCategories: [],
      isImageLoaded: false,
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDownHandler);
  }

  requestImages(e, category) {
    this.setState({ isLoaded: false });
    var defaultCategories = this.state.defaultCategories;

    //fetch("http://192.168.56.1:3001/", {
    fetch("https://node-server-baoq.onrender.com/", {
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
          //console.log(data);
          if (data == "ERRORE") {
            var err = { message: "Nessuna immagine trovata" };
            this.setState({
              isLoaded: true,
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
          console.log("Errore: " + err.message);
        }
      );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showing !== this.state.showing) {
      this.checkFavourite();
    }
  }
  preloadNextImage = () => {
    const item = this.state.item;
    const showing = this.state.showing;
    const nextImageIndex = showing + 1;

    if (item && item[nextImageIndex]) {
      // Add a null check for item[nextImageIndex]
      //const preloadedImages = [...this.state.preloadedImages];
      const img = new Image();
      img.src = item[nextImageIndex].urls.full;
      img.onload = () => {
        // Questo evento onLoad si verifica solo quando l'immagine è completamente caricata
        console.log("Immagine completamente caricata");
        this.setState({ isImageLoaded: true });
      };
      //preloadedImages[nextImageIndex] = img;
      //this.setState({ preloadedImages: preloadedImages });
    }
  };

  //add favourites
  checkFavourite = () => {
    if (this.state.isLoaded) {
      const link = this.state.item[this.state.showing].links.html;
      // Utilizza una Promise per gestire l'asincronia di chrome.storage.sync.get
      /*
      return new Promise((resolve) => {
        chrome.storage.sync.get({ links: [] }, (obj) => {
          const links = obj.links;

          const isFavorited = links.includes(link);
          console.log(link);
          console.log("LISTA: " + links);
          console.log("NELLA LISTA: " + isFavorited);

          this.setState({ isFavorited: isFavorited }, resolve);
        });
      });*/
    }
  };

  handleFavourites = async () => {
    // Chiamata asincrona di checkFavourite
    await this.checkFavourite();

    // Inverti lo stato di isFavorited e chiamata a favourites
    this.setState(
      (prevState) => ({ isFavorited: !prevState.isFavorited }),
      () => {
        this.favourites();
      }
    );
  };

  favourites = () => {
    const link = this.state.item[this.state.showing].links.html;

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
  };

  increaseShowing = () => {
    this.checkFavourite();
    this.setState({ isImageLoaded: false });
    if (!this.state.isLoaded) {
      return; // Blocca l'avanzamento se le immagini non sono state caricate
    }

    if (this.state.showing == this.state.item.length - 2) {
      //this.state.temp + 1 === 9) {
      this.setState({ temp: 0 }, () => {
        if (this.state.category.length >= 1) {
          for (var i = 0; i < this.state.category.length; i++) {
            this.requestImages(10, this.state.category[i]);
          }
        } else if (this.state.keywords.length >= 1) {
          for (var i = 0; i < this.state.keywords.length; i++) {
            this.requestImages(10, this.state.keywords[i]);
          }
        } else {
          this.requestImages(10, this.state.category);
        }
      });
    } else {
      this.setState({ temp: this.state.temp + 1 }, () => {
        this.preloadNextImage();
      });
    }

    if (this.state.isLoaded) {
      // Controlla nuovamente lo stato isLoaded prima di aumentare showing
      this.setState(
        (prevState) => ({
          showing: prevState.showing + 1,
          //temp: prevState.temp + 1,
        }) // Chiamata al precaricamento dell'immagine successiva
      );
    }
  };

  reduceShowing = () => {
    this.checkFavourite();
    if (!this.state.isLoaded) {
      return; // Blocca l'avanzamento se le immagini non sono state caricate
    }
    var showing = this.state.showing;
    if (showing > 0) {
      this.setState((prevstate) => ({
        showing: prevstate.showing - 1,
        temp: prevstate.temp - 1,
      }));
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

  componentDidUpdate() {
    if (
      this.state.defaultCategories !== this.props.defaultCategories &&
      this.props.defaultCategories.length != 0
    ) {
      this.setState({
        defaultCategories: this.props.defaultCategories,
        //category: [],
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
            console.log(this.props.keywords[i]);
            this.requestImages(10, this.props.keywords[i]);
          }
        } else {
          console.log(this.props.keywords);

          this.requestImages(10, this.props.keywords);
        }

        //TODO DA RIMETTERE
        //chrome.storage.sync.set({ keywords: this.props.keywords });
      }
    }
  }
  renderContent() {
    const {
      error,
      isLoaded,
      item,
      showing,
      arrayIndex,
      preloadedImages,
      isImageLoaded,
    } = this.state;
    const { category } = this.props;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (!isImageLoaded) {
      //return <div>Image loading</div>;
      const width = window.innerWidth;
      const height = window.innerHeight;
      return (
        <Blurhash
          hash={item[showing].blur_hash}
          width={width}
          height={height}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      );
    } else {
      console.log(item);

      const containerStyle = {
        backgroundImage: `url(${item[showing].urls.full})`,
        //backgroundImage: `url(${preloadedImages[arrayIndex]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        display: !isImageLoaded ? " none" : "",
      };
      return (
        <div
          className="BackgroundStyle"
          style={containerStyle}
          //onLoad={() => this.setState({ isImageLoaded: true })}
          //onLoad={alert("CARICATA")}
        >
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
          <button
            className="FavouritesButtonStyle"
            onClick={this.handleFavourites}
          >
            {this.state.isFavorited ? (
              <svg
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="-1 3.5 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                // Icon for Favorited
                <path
                  d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z"
                  fill-rule="nonzero"
                />
              </svg>
            ) : (
              <svg
                clip-rule="evenodd"
                fill-rule="evenodd"
                stroke-linejoin="round"
                stroke-miterlimit="2"
                viewBox="-1 3.5 25 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                // Icon for Not Favorited
                <path
                  d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44zm.678 2.033-2.361 4.792-5.246.719 3.848 3.643-.948 5.255 4.707-2.505 4.707 2.505-.951-5.236 3.851-3.662-5.314-.756z"
                  fill-rule="nonzero"
                />
              </svg>
            )}
          </button>
          ;
        </div>
      );
    }
  }
  render() {
    const { showing, error, isImageLoaded, isLoaded, item } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded && showing == 0) {
      setTimeout(() => {
        this.setState({ isImageLoaded: true });
      }, 3000);
      return <div>Loading...</div>;
    } else if (!isImageLoaded) {
      //return <div>Image loading</div>;
      const width = window.innerWidth;
      const height = window.innerHeight;
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
    } else {
      return this.renderContent();
    }
    if (showing === 0) {
      // Se showing è 0, esegui il timeout e poi rendi il contenuto

      return <div>Loading...</div>;
    } else {
      // Se showing non è 0, rendi il contenuto immediatamente
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
