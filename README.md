# PicPortal

PicPortal is a Chrome extension that customizes your browsing experience by transforming your landing page into a showcase of visual inspiration.

## Features

- Personalize your new tab with inspiring images and photos.
- Easy to use and lightweight.
- The images are sourced from <a href="unsplash.com">Unsplash</a>, a platform for free-to-use, high-quality images. These images are delivered through a custom API hosted on <a href="render.com">Render</a>, ensuring that you receive a fresh and diverse selection of visuals each time you open a new tab.
- PicPortal allows you to personalize your experience further by selecting categories of images that resonate with you. Choose from a variety of categories such as Nature, Architecture, Beaches, and more to tailor the visual inspiration on your new tab page to your preferences.

## Installation

1. Clone the repository locally:

```console
git clone https://github.com/rickystar04/PicPortal.git
```

2. Navigate to the cloned directory via command prompt or terminal:

```console
> cd PicPortal
```

3. Install the necessary packages:

```console
> npm install
```

4. Build the project:

```console
> npm run build
```

5. Open Chrome and navigate to `chrome://extensions/`.
6. Enable Developer Mode in the top right corner.
7. Click on "Load unpacked extension" and select the `build` folder inside the cloned project directory.

## Usage

After installation, whenever you open a new tab in Chrome, PicPortal's customized new tab page will be displayed.

## Upcoming Features

- **Favorites Synchronization**: In addition to adding images to your favorites for quick access, we are planning to implement synchronization of your favorites across multiple devices. This will allow you to access your curated collection of inspiring images no matter where you are or which device you're using.

- **Bookmarks**: We are also working on a feature that will allow you to bookmark your favorite web pages directly from the new tab page. This will enable you to quickly navigate to your most visited sites and keep your favorite online content easily accessible.

## Contributing

If you would like to contribute to the project, please submit a pull request or open an issue to discuss what you would like to change.

**Note for Developers:**
The codebase uses the `chrome.storage.sync` API for saving data locally in Chrome. When running the project node with `npm start`, you will encounter an error due to the use of this API. Here's the recommended approach:

- If you want to modify parts of the code that do not involve the `chrome.storage.sync` API, consider commenting out all parts of the program where it is used. This will allow you to run the project without encountering the error related to the Chrome-specific API.
- If your changes are related to the `chrome.storage.sync` API, you should rebuild the project's build file each time you want to see the changes applied by running `npm run build`. Then, reload the build in the Chrome extensions page to verify the functionality.

Please ensure that you test your changes thoroughly before submitting a pull request.

## License

This project is released under the MIT License. For more details, see the LICENSE file in the repository.

## Support

For support, you can open an issue in the GitHub repository or contact the maintainer at the email address provided in the GitHub profile.
