# Chrome Extension

As part of our project, we developed a Google Chrome extension that integrates a modular frontend interface with a robust backend service layer, serving as the user interface for our enhanced search system. The extension is specifically designed to prompt the LLM-powered search tool, which utilizes the Ollama RAG model, to recommend electronic Amazon products. This tool eliminates the "pain point" of traditional browsing by allowing users to enter a highly verbose and specific query to fit their exact needs. The extension simplifies the process into a streamlined user interaction flow: a user enters their query, clicks the "RUN Extension Logic" button, and the generated output—a recommended electronic product—is immediately displayed within the UI's Status section. The tool is designed to pull text from reviews and display highlights relevant to the query, a critical feature that removes the need for the user to manually scan through pages of reviews. Furthermore, the extension includes a minor utility feature, offering the user the option to switch between a light mode and a dark mode interface.

## manifest.json
This file defines the extension's metadata, including its name ("Shopping Helper") and version. It specifies the background.js file as the service_worker for background processing and the content.js file (along with modal.css) to run on all web pages (<all_urls>), where it will inject the helper's user interface.

## content.js
This script is responsible for creating and managing the extension's interactive floating modal/widget, which appears on the user's browser page. It handles all user interface logic, including rendering the "Shopping Helper" modal with an input field and an "Ask AI" button, managing the modal's dragging, minimizing, and closing, and allowing users to change the theme (Dark/Light Mode) via a settings panel. Crucially, when the user clicks "Ask AI," this script sends a message containing the query to the background.js service worker.

## background.js
This script acts as the extension's central nervous system, listening for the runOpenAIQuery message sent by content.js. Upon receiving a query, it opens a WebSocket connection to an external bridge at ws://localhost:32001, sends the user query over this connection, and then relays the AI's response back to the content.js script to be displayed in the modal.

## server.js
This is an external Node.js proxy server that handles the actual communication with the OpenAI API, necessary because service workers in Chrome Extensions have restrictions on direct API calls. It exposes an /api/openai endpoint that accepts a user query and forwards it to the OpenAI API (using the gpt-4o-mini model) with a system prompt to act as a "helpful product recommendation assistant," and then returns the AI's response.

## modal.css
This file contains all the styling definitions for the "Shopping Helper" modal created by content.js. It ensures the modal is visually distinct and functional, defining styles for the header, buttons, input/output fields, and implements the visual changes for the Dark and Light Mode themes.

## settings.html
This HTML file serves as the extension's default popup, though its primary function here is to offer a dedicated, simplified theme-toggling interface separate from the main modal's settings panel. It displays the current theme status and includes JavaScript to switch the theme and save the preference in localStorage.
