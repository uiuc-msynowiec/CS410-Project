# Setting up API
## 1. go to amazonextension2.0 folder
## 2. Create a .env file in this folder.
## 3. Paste OPENAI_API_KEY=your_key in

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
## Step 1: Once the extension is loaded, type in a query that is related to electronics (i.e...)
## Step 2: Click on the button, "Run extension logic"
## Step 3: A similar item based on the query should appear in the status section of the chrome extension.


# Running the local RAG program

## 1. Clone the Github Repo, and open it up in VSCode

## 2. Pull up the repo in a File Explorer/Finder window and navigate to the /CS410-Project/rag_proj/reviewsset/ folder. THIS HAS TO BE THE UNZIPPED FOLDER.

# 3. Once here, double click on the Electronics_combined_10000.zip file. This will uncompress the file which is ok.

# 4. Once the file has been unzipped, copy the file and put it under this path instead: /CS410-Project/rag_proj/reviews_extracted/reviewsset/Electronics_combined_10000.zip_extracted

# 4. Once the unzipped file has been moved to the correct folder, remove the file from this path as it is no longer necessary: /CS410-Project/rag_proj/reviewsset/, and go back to the terminal in VSCode and navigate to the rag_proj folder within the overall repo.

# 5. Here now run the command "python ragpipeline.py"

# 6. Enjoy using the LLM/RAG!