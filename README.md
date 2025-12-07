# Running the local RAG program

## Requirements
Make sure you have Ollama installed. If not, go to this link and install it: https://ollama.com/download. Furthermore, once installed go to Terminal or CommandPrompt and enter this command to double check the version: "ollama --version". If the version is something like 0.13.x, then you should be good to go. Follow this by pulling the following models from ollama: "ollama pull nomic-embed-text" and "ollama pull llama3.1"

## Step 1
Clone the Github Repo, and open it up in VSCode

## Step 2
Pull up the repo in a File Explorer/Finder window and navigate to the /CS410-Project/rag_proj/reviewsset/ folder. THIS HAS TO BE THE UNZIPPED FOLDER.

## Step 3
Once here, double click on the Electronics_combined_10000.zip file. This will uncompress the file which is ok.

## Step 4
Once the file has been unzipped, copy the file and put it under this path instead: /CS410-Project/rag_proj/reviews_extracted/reviewsset/Electronics_combined_10000.zip_extracted

## Step 5
Once the unzipped file has been moved to the correct folder, remove the file from this path as it is no longer necessary: /CS410-Project/rag_proj/reviewsset/, and go back to the terminal in VSCode and navigate to the rag_proj folder within the overall repo.

## Step 6
Here now run the command "python ragpipeline.py"

## Step 7
If you'd like the program to reindex everything type "y" when prompted, else if you've run the program before, there should be an index saved and you can just press "n".

## Step 8
Type "exit" to quit the program whenever and enjoy using the program!

# 🚀 Loading the Chrome Extension

## 1. Open the Extensions Page
Go to: chrome://extensions

## 2. Enable Developer Mode
Toggle **Developer mode** in the top-right corner.

## 3. Load the Extension
Click **“Load unpacked”** and select your extension’s folder.

## 4. Test It
Go to [https://www.amazon.com](https://www.amazon.com) and verify that your extension works (e.g., banner appears or logo changes).

#  Running Chrome Extension
## Step 1: Once the extension is loaded and you are in the page "amazon.com" type in a query that is related to electronics (i.e...)
## Step 2: Click on the button, "Run extension logic"
## Step 3: A similar item based on the query should appear in the status section of the chrome extension.
## Step 4: The user can click on Settings and has the option to change to either light or dark mode based on their preference.