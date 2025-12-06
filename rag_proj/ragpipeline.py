import os
import json
import ast
import faiss
import numpy as np
import ollama
from pathlib import Path
from typing import List, Dict, Any
import re

# set up the zip files so it can pull the unzip files as well
ZIP_PATH = "reviewsset.zip"                 # where the datasets are located
EXTRACT_DIR = "reviews_extracted"           # where to output the extracted reviews
FAISS_DIM = 768                             # hardcoded value to default nomic-embed-text dimension as was trying to just call it earlier and it didn't work
FAISS_INDEX_PATH = "faiss.index"            # where to save created vectors
FAISS_META_PATH = "faiss_meta.json"         # where the product metadata should be extracted to

# checks to see if everything has been indexed already once or no, so you don't need to spend time reindexing/reingesting everything
def load_faiss():
    # set up paths to the index and metadata output
    indexpath = Path(FAISS_INDEX_PATH)
    metapath = Path(FAISS_META_PATH)

    # if they already exist then pull them in
    if indexpath.exists() and metapath.exists():
        index = faiss.read_index(FAISS_INDEX_PATH)
        # read the files
        with open(FAISS_META_PATH, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        return index, metadata
    # if they don't exist then set up files for the first time
    else:
        index = faiss.IndexFlatL2(FAISS_DIM)
        metadata = []
        print("Created new FAISS index.")
        return index, metadata

# in case it is ingesting for the first time or reindexing, save it to the local computer
def save_faiss(index, metadata):
    faiss.write_index(index, FAISS_INDEX_PATH)
    with open(FAISS_META_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

def ingest_all_reviews(review_dir: str, index, metadata: List[Dict]):    
    # init file count is zero
    file_count = 0

    # set up a path to the set .zip file
    dirpath = Path(review_dir)

    # recursively look for .jsonl files
    jsonlpath = dirpath.rglob('*.jsonl')

    # make a list of all .jsonl files
    allpath = list(jsonlpath)

    # iterate through all files
    for path in allpath:
        
        # if file exist then consume and index it
        if path.is_file():
            ingest_jsonl_file(str(path), index, metadata)
            file_count += 1
    
    print(f"\nProcessed {file_count} files, indexed {len(metadata)} products")

def ingest_jsonl_file(path: str, index, metadata: List[Dict]):
    # take in the .jsonl file
    count = 0    
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        # get the lines of the file
        lines = f.readlines()

        # calculate total lines
        total_lines = len(lines)

        # for each line process it
        for line_num, line in enumerate(lines):
            # get rid of whitespace
            line = line.strip()

            # if line is empty skip it
            if not line:
                continue

            # set up an object to map all of the reviews fields together into one
            obj = None

            # use ast to make the dictionary of reviews since it can handle both single and double quotes, json can't, with ast you get 9994 products
            try:
                obj = ast.literal_eval(line)
            except Exception:
                # need an exception to account for JSON for the other 4 reviews that are being skipped
                try:
                    obj = json.loads(line)
                except Exception:
                    continue

            # if the obj can't be made/ does't exist skip it
            if not isinstance(obj, dict):
                continue

            # Extract key fields
            parent_asin = obj.get("parent_asin", f"unknown_{line_num}")
            avg_rating = obj.get("average_rating", 0)
            rating_number = obj.get("rating_number", 0)
            price = obj.get("price")
            text = obj.get("text", "")
            
            # get reviews from text
            product_desc, reviews = parse_reviews_from_text(text)

            # even if there is a blank/broken one, move past it
            if not reviews:
                continue
            
            # get rid of the section name for product
            if product_desc.split('.'):
                product_name = product_desc.split('.')[0].strip()
            else:
                product_name = parent_asin
            
            # Create a searchable summary for embedding
            review_samples = ""
            for i in range(min(3, len(reviews))):
                # give a 100 char context
                review_samples += reviews[i]["review_text"][:100] + " "
            # give a 500 char context
            searchable_text = f"{product_name}. {product_desc[:500]} Rating: {avg_rating}/5. {review_samples}"
            
            vector = embed(searchable_text)
            index.add(vector)
            
            # Store metadata
            meta = {
                "product_id": parent_asin,
                "product_name": product_name,
                # give 300 char for description
                "description": product_desc[:300],
                "average_rating": avg_rating,
                "total_reviews": rating_number,
                "price": price,
                # max reference is 5 reviews
                "reviews": reviews[:5],
                # give a 1000 char for all the text
                "full_text": text[:1000]
            }
            
            # add to the set
            metadata.append(meta)

            # increment by 1 and go to the next line
            count += 1

            if count % 10 == 0:
                print(f"Indexed {count} out of {total_lines}")

# Removes non-ASCII characters (emojis, special symbols), removes multiple spaces, problematic special characters, 
def clean_text(text: str) -> str:
    # remove non ascii chars
    text = text.encode('ascii', 'ignore') 

    # convert back to ascii                  
    text = text.decode('ascii') 

    # replaces multiple spaces and swap with single space                            
    text = ' '.join(text.split())           

    # remove special char and swap with empty space                
    text = re.sub(r'[^\w\s.,!?-]', ' ', text) 

    # return and gets rid of starting and ending spaces              
    return text.strip()  

# get individual reviews from the text
def parse_reviews_from_text(text: str) -> List[Dict[str, Any]]:
    reviews = []
    
    # split up the ratings
    regexpattern = r'\.\s*(\d+\.\d+)\s*\.\s*([A-Z0-9]+)\s*\.\s*'
    
    parts = re.split(regexpattern, text)
    
    # get the product description
    if parts:
        product_desc = parts[0].strip()
    else:
        product_desc = ""

    # split up the rating, user_id, and the actual text of the review, there's a three due to the three sections per review, so count needs to go to the next 3'd starting block
    i = 1

    # - 2 to index correctly
    while i < len(parts) - 2: 
        rating = float(parts[i])
        user_id = parts[i+1]
        review_text = parts[i+2].strip()

        # add it to the output
        if review_text:
            reviews.append({
                "rating": rating,
                "user_id": user_id,
                "review_text": review_text
            })
            
        # Manually jump 3 steps to the next review block
        i += 3

    return product_desc, reviews

# convert text to vectors
def embed(text: str) -> np.ndarray:
    # Clean and truncate text
    text = clean_text(text)
    max_length = 800

    # if text doesn't exist or too big, then fill with zeros, else pass it on
    if text == "":
        return np.zeros((1, FAISS_DIM), dtype="float32")
    elif len(text) > max_length:
        return np.zeros((1, FAISS_DIM), dtype="float32")
    current_text = text

    # call ollama api
    response = ollama.embeddings(model="nomic-embed-text", prompt=current_text)

    # if response is not empty and there is a value for the inputted values then get output
    embedded = response.get("embedding")
    if embedded:    
        # get the vector
        emblist = response["embedding"]
        # return output which is a 2d array
        return np.array(emblist, dtype="float32").reshape(1, -1)
    else:
        return np.zeros((1, FAISS_DIM), dtype="float32")

# look through database to find products
def search_products(query: str, index, metadata: List[Dict], k: int = 10) -> List[Dict]:
    # convert search query to a vector
    qvec = embed(query)

    # search the FAISS index for closest
    distances, indices = index.search(qvec, k)
    
    results = []
    # loop through index
    for idx in indices[0]:

        # check if index is valid
        if idx < len(metadata):
            results.append(metadata[idx])
    
    # return the most similar products
    return results


def get_product_recommendation(query: str, index, metadata: List[Dict]) -> str:    
    # Search for relevant products]
    # get 8 closest items to the search requests
    returns = search_products(query, index, metadata, k=8)
    
    # Build context from top products
    context_details = []
    for product in (returns):
        reviews_summary = ""
        if product.get("reviews"):
            reviews_summary = "\n".join([
                # give 150 characters of context
                f"[{r['rating']}/5] {r['review_text'][:150]}..."
                for r in product["reviews"][:3]
            ])

        # give 300 chars of context
        context_details.append(f"""
            Product {product['product_name']}
            ASIN: {product['product_id']}
            Average Rating: {product['average_rating']:.1f}/5 ({product['total_reviews']} reviews)
            Description: {product['description'][:300]}
            """)
                
        context = "".join(context_details)
                
        # Create prompt for LLM
        prompt = f"""You are a helpful shopping assistant analyzing product reviews. A customer is looking for:

            "{query}"

            Here are the top matching products from our database:
            {context}

            Based on the reviews and product information, please do the following:

            1. Recommend the BEST product (mention the product name)
            2. Spotlight the strengths from the reviews
            3. List any concerns or weaknesses mentioned in reviews
            4. Suggest alternatives

            ---
            IMPORTANT INSTRUCTION: DO NOT use Markdown formatting (like **bold**, *italics*, or lists like * or -). Use plain text only.
            ---

            Be specific and focus on helping the customer make an informed decision."""

    # ollama settings for response
    response = ollama.chat(
        model="llama3.1",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0.7}
    )
    return response["message"]["content"]

# main program
def main():
    # load the faiss index from a previous run if possible
    index, metadata = load_faiss()

    # if the existing index doesn't exist, index it
    if len(metadata) == 0:
        # use the directory given
        ingest_all_reviews(EXTRACT_DIR, index, metadata)
        # index for the firs time
        save_faiss(index, metadata)
    else:
    # if there is an index, then ask if you want to reindex it
        choice = input(f"\nFound existing FAISS index. Do you want to reindex (y/n): ")
        if choice.lower() == 'y':
            index = faiss.IndexFlatL2(FAISS_DIM)
            # clear out metadata
            metadata = []
            # reindex everything
            ingest_all_reviews(EXTRACT_DIR, index, metadata)
            save_faiss(index, metadata)
    
    print("\nType 'exit' to quit at anytime\n")
    
    # keep a cycle going until the user exists
    while True:
        
        #ask user what they want
        query = input("What are you looking for? ").strip()
        
        # if user wants to bail this is what to do
        if query.lower() == "exit":
            print("\nThanks for using!")
            break
    
        # run the query to find the most similar proj
        answer = get_product_recommendation(query, index, metadata)
        print(answer)

if __name__ == "__main__":
    main()