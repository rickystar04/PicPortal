import React, { useState } from "react";
import { Blurhash } from "react-blurhash";
import "./Style.css";
import nextImage from "../imgs/next-arrow.png";
import prevImage from "../imgs/prev-arrow.png";
import { resolve } from "path";

class ChangeBackground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      item: [],
      showing: 0,
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
    // Add event listener for keyboard input
    document.addEventListener("keydown", this.keyDownHandler);
    //Check if the first image is among favorite images
    this.handleFavorites();
  }

  // Function to fetch images from the server
  requestImages(e, category) {
    this.setState({ isLoaded: false });

    //fetch("http://localhost:3001/", {
    fetch("https://node-server-baoq.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numOfImages: e,
        category: category,
        defaultCategories: this.state.defaultCategories,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in the request to the server");
        }
        return response.json();
      })
      .then(
        (data) => {
          if (data == "ERRORE") {
            // Handle error if no images found
            var err = { message: "No images found" };
            this.setState({
              isLoaded: false,
              error: err,
            });
          } else {
            // Update component state with fetched images
            this.setState(
              (prevState) => ({
                item: [...prevState.item, ...data],
                isLoaded: true,
              }),
              () => {
                this.preloadNextImage(); // Preload next image
              }
            );
          }
        },
        (err) => {
          // Handle fetch error
          this.setState({
            isLoaded: true,
            error: err,
          });
        }
      );
  }

  // Function to preload next image for smoother transitions
  preloadNextImage = () => {
    const item = this.state.item;
    const showing = this.state.showing;
    const nextImageIndex = showing + 1;

    //console.log("Preloading next image");
    if (item && this.state.toggleFavorites) {
      this.setState({ isImageLoaded: false });
    }

    if (item) {
      if (item[nextImageIndex] != undefined) {
        const img = new Image();
        img.src = item[nextImageIndex].urls.raw;
        img.onload = () => {
          console.log("Image fully loaded");
        };
      }
      setTimeout(() => {
        this.setState({ isImageLoaded: true });
      }, 1000);
    }
  };

  // Function to handle keyboard input
  keyDownHandler = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.increaseShowing(); // Move to next image
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.reduceShowing(); // Move to previous image
    }
  };

  // Function to handle favorite images
  handleFavorites = () => {
    // Check if current image is favorited
    var fav = this.checkFavorite();

    // Update component state with favorite status
    this.setState(() => ({ isfavorited: fav }));
  };

  // Function to check if current image is favorited

  checkFavorite = () => {
    if (this.state.isLoaded) {
      const item = this.state.item[this.state.showing];

      const link = {
        id: item.id,
        urls: { raw: item.urls.raw },

        user: {
          links: { html: item.user.links.html },
          name: item.user.name,
        },
        links: {
          html: item.links.html,
        },
        blur_hash: item.blur_hash,
      };

      // Get favorite links from Chrome storage
      chrome.storage.sync.get({ links: [] }, (obj) => {
        const links = obj.links;

        const isfavorited =
          links.findIndex((links) => links.id === link.id) != -1;

        this.setState({ isfavorited: isfavorited });
        return isfavorited;
      });
    }
  };

  // Function to add/remove current image to/from favorites
  favorites = () => {
    const item = this.state.item[this.state.showing];

    const link = {
      id: item.id,
      urls: { raw: item.urls.raw },

      user: {
        links: { html: item.user.links.html },
        name: item.user.name,
      },
      links: {
        html: item.links.html,
      },
      blur_hash: item.blur_hash,
    };

    // Get favorite links from Chrome storage
    chrome.storage.sync.get({ links: [] }, (obj) => {
      const links = obj.links;

      const linkIndex = links.findIndex((links) => links.id === link.id);

      if (linkIndex != -1) {
        // Link is already favorited, remove it
        links.splice(linkIndex, 1);
        console.log("Link removed", link);
      } else {
        // Link is not favorited, add it
        links.push(link);
        console.log("Link added", link);
      }

      // Save updated favorite links to Chrome storage
      chrome.storage.sync.set({ links: links }, () => {
        // Qui puoi eseguire azioni successive dopo che la Promise è stata risolta

        // Update component state with updated favorite links
        this.setState({ favorites: links }, () => {
          this.handleFavorites();
        });
      });
    });
  };

  // Function to increase showing index and load next image
  increaseShowing = () => {
    const {
      isLoaded,
      toggleFavorites,
      showing,
      item,
      category,
      keywords,
      isImageLoaded,
    } = this.state;
    const { length } = item;

    this.setState({ isImageLoaded: false });

    if (!isLoaded) {
      return; // Prevent advancing if images are not loaded
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
        }); // Return to the first image when reaching the end
        return;
      }
    } else if (showing === length - 2) {
      // Load more images when reaching the second last image
      const items =
        category.length >= 1
          ? category
          : keywords.length >= 1
          ? keywords
          : [category];
      items.forEach((item) => this.requestImages(10, item));
    } else {
      this.preloadNextImage();

      if (isLoaded) {
        // Check isLoaded again before increasing showing
        this.setState({ showing: showing + 1 }, () => this.handleFavorites());
      }
    }
  };

  // Function to decrease showing index
  reduceShowing = () => {
    this.checkFavorite();
    const { isLoaded, showing, item, toggleFavorites } = this.state;
    //TODO forse da rimuovere
    if (!this.state.isLoaded) {
      return; // Prevent advancing if images are not loaded
    }

    if (toggleFavorites) {
      if (showing > 0) {
        this.setState((prevState) => ({
          showing: prevState.showing - 1,
          isImageLoaded: true,
        }));
      } else {
        this.setState({
          showing: item.length - 1,
          isImageLoaded: true,
        });
        return;
      }
    } else if (showing > 0) {
      this.setState(
        (prevstate) => ({
          showing: prevstate.showing - 1,
        }),
        () => {
          // Call handleFavorites() after state update
          this.handleFavorites();
        }
      );
    } else {
      console.log("You are at the beginning of the list");
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    // Update images if toggleFavorites prop changes
    if (
      this.props.toggleFavorites !== undefined &&
      this.props.toggleFavorites !== prevProps.toggleFavorites
    ) {
      if (this.state.toggleFavorites === true) {
        await new Promise((resolve) => {
          this.setState(
            {
              toggleFavorites: this.props.toggleFavorites,
              showing: 0,
              isImageLoaded: false,
              item: [],
            },
            resolve
          );
        });
        await this.requestImages(10, this.state.category);
        this.handleFavorites();
      } else {
        // Update state only if necessary
        if (this.state.toggleFavorites !== this.props.toggleFavorites) {
          await new Promise((resolve) => {
            this.setState(
              {
                toggleFavorites: this.props.toggleFavorites,
                item: this.state.favorites, // Reset item to favorites
                showing: 0,
                isImageLoaded: false,
              },
              resolve
            );
          });
          this.handleFavorites();
          this.preloadNextImage();
        }
      }
    }

    // Update defaultCategories state
    if (
      this.state.defaultCategories !== this.props.defaultCategories &&
      this.props.defaultCategories.length != 0
    ) {
      this.setState({
        defaultCategories: this.props.defaultCategories,
      });
    }

    // Load images based on category or keywords
    if (this.state.defaultCategories.length != 0) {
      if (this.state.category !== this.props.category) {
        this.setState({
          category: this.props.category,
          item: [],
          isLoaded: false,
          showing: 0,
        });
        if (this.props.category.length > 1) {
          for (var i = 0; i < this.props.category.length; i++) {
            await this.requestImages(10, this.props.category[i]);
          }
        } else {
          await this.requestImages(10, this.props.category);
        }
        chrome.storage.sync.set({ category: this.props.category });
      } else if (this.state.keywords !== this.props.keywords) {
        this.setState({
          keywords: this.props.keywords,
          item: [],
          showing: 0,
          isLoaded: false,
        });

        if (this.props.keywords.length > 1) {
          for (var i = 0; i < this.props.keywords.length; i++) {
            await this.requestImages(10, this.props.keywords[i]);
          }
        } else {
          await this.requestImages(10, this.props.keywords);
        }

        chrome.storage.sync.set({ keywords: this.props.keywords });
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
      // Render loading indicator if images are not loaded yet
      setTimeout(() => {
        this.setState({ isImageLoaded: true });
      }, 3000);
      return <div>Loading...</div>;
    } else if (!isImageLoaded) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Render blurhash while image is loading

      if (item[showing]) {
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
      return <div>Error: no favorite image</div>;
    } else {
      // Render background image and UI controls

      let containerStyle = {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
        display: !isImageLoaded ? "none" : "",
      };
      // If toggleFavorites is true and there are favorites available, show only favorites
      const currentImage = toggleFavorites ? favorites[showing] : item[showing];
      containerStyle.backgroundImage = `url(${currentImage.urls.raw})`;

      const placeLocation = item[showing].location;

      return (
        <div className="BackgroundStyle" style={containerStyle}>
          <Photographer
            name={item[showing].user.name}
            photographer={item[showing].user.links.html}
            photo_link={item[showing].links.html}
          ></Photographer>

          <div className="PlaceLocationStyle">
            <a
              href={
                "https://maps.google.com/?q=" +
                placeLocation.position.latitude +
                "," +
                placeLocation.position.longitude
              }
              target="blank"
            >
              {placeLocation.name}
            </a>
          </div>
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
