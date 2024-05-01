import App from "./App";

const mockChrome = {
  storage: {
    sync: {
      get: jest.fn((data, callback) =>
        callback({ category: [], keywords: [] })
      ),
      // Add other methods as needed
    },
    // Add other methods as needed
  },
  // Add other properties or methods as needed
};

// Set the global chrome object to the mockChrome
global.chrome = mockChrome;

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // For additional matchers

import ChangeBackground from "./Components/Background"; // Update the import path accordingly

describe("ChangeBackground component", () => {
  // Test case for rendering the component without errors
  it("renders without crashing", () => {
    render(<App />);
  });

  // Add more test cases for other functionalities as needed
});

/*global chrome*/
