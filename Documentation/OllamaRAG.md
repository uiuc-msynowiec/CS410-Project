## Retrieval, Embedding, and Product Recomendation Development

The idea of this python pipeline was to ingest Amazon review data, clean and parse it, and then utilize a LLM Model on the indexed values to quickly return LLM-based product recommendations. The code implements a full RAG to support NLP based product search.

## Data Ingestion and Indexing

The script is designed to work on a pre-cleaned and combined dataset of product information and user review text. It will transform this cleaned and prepped dataset into a searchable FAISS index that the recommendation system can quickly query effectively.
If a FAISS index already exists, then it is automatically loaded in, to prevent the process of reindexing everything. If not, then the pipeline will index and create a new FAISS index and will begin to index all dataset files.

## Review Processing

The file "ingest_all_reviews.py" goes through the entire dataset and identifies all .jsonl files and then essentially as the name states, ingests all the data in those files. Each line in the file corresponds to a new product's review text and a score associated with that review.

For each line individually, it parses the JSON code and utilizes ast.literal_eval() to allow for faulty formatting across the various reviews. It then extracts the key values such as "parent_asin", "average_rating", "rating_number", "price", the full review of the product. The reviews are then split apart using regex. The regex command used to split the reviews apart into the Rating, User ID, and Review text is the following:
"r'\.\s*(\d+\.\d+)\s*\.\s*([A-Z0-9]+)\s*\.\s*'"

The script then summarizes each product into the sentence of the description of the product, the first 500 characters of the product info due to character limitations, and the first three short reviews.

This information is then passed onto ollama.embeddings(model="nomic-embed-text") where it is made into a 768-dimensional vector for quick access.

This vector is then added to the FAISS Index and the metadata is stored to another file, the metadata includes the following:
1. Product name
2. Description
3. Average rating
4. Price
5. Up to 5 reviews
6. Review

## Text Cleaning

However, before Ollama can be called on the dataset, the text must be cleaned where the clean_text() function gets called.
This function filters and normalizes text so the embedded model can receive consistent data without faulty formatting. In this function the following occurs:
1. Remove non-ASCII characters
2. Normalize whitespace
3. Remove faulty symbols with regex
4. Remove too long of reviews which are longer than 800 characters gets cut down to a max character count.

## Embedded Ollama Model

This program/script utilizes the nomic-embed-text model provided by Ollama to create a vector for each review. Easy comparison will occur with this semantic vector to quickly find the closest review to the user's request.
This function does the following:
1. Calls the clean function
2. If the review text is empty or too long, it will fill the vector with zeros and reject it
3. Calls the Ollama API
4. It will return a 768-dimensional float32 NumPy index.

This vector is then added to the FAISS index. 

## Vector Search (FAISS)

When the user enters a natural-language query the program does the following:
1. Embeds the query with the same nomic-embed-text model provided by Ollama to make a vector
2. Searches the entire FAISS index for the vectors closest to the vector generated for the user query
3. Returns the entries that are the closest

## LLM Based Recommendation

The get_product_recommendation() function first gets the information of the reviews from the previous steps and passes it onto the Ollama LLM Model of llama3.1 using a prompt to find the best product, summarize its strengths, highlight the weaknesses, suggest alternatives, and to report those things in plaintext.

## Main Loop
The main loop calls all the functions in a coherent fashion allowing the user to query the Local RAG to find products closest to their request.