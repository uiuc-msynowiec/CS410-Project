# Data Cleaning
The dataset used for this project consisted of user reviews and product data for Amazon curated in 2023 by McAuley Lab. We used the electronics subset of the data available from the dataset website:
https://amazon-reviews-2023.github.io/

The electronics dataset consisted of 43,886,944 reviews which was a 22 GB datafile for 1,610,012 products in a 5 GB product information datafile. This data was too large to develop with since it caused efficiency issues when trying to index the data and run tools, so we first needed to extract a subset of the data to perform work against. We extracted both a subset for 1000 products and a separate subset of 10000 products.

## Extracting a Subset of the Data
The scripts to extract the subset were:

### mini.py
python .\mini.py .\meta_Electronics.jsonl 10000 > meta_Electronics_10000.mini.jsonl

This script is passed 2 inputs:
   a jsonl file which contained one entry per line in json format
   the number of entries to write out

The output is printed to stdout so piping the output to a file would product a subset dataset in the same format as the original.

### print_entry.py
python .\print_entry.py parent_asin .\meta_Electronics_10000.mini.jsonl > parent_asin_list_10000.txt

This script is passed 2 inputs:
   the name of an entry within the json line to print out
   the name of a jsonl file to read the json entries from

The output is printed to stdout so piping the output to a text file produced a list of parent_asin values, one per line.

### read_based_on_entrylist.py
python .\read_based_on_entrylist.py parent_asin .\parent_asin_list_10000.txt .\Electronics.jsonl > Electronics_10000.mini.jsonl

This script is passed 3 inputs:
   the name of the json entry to compare
   a text file containing a list of entries to compare against, separated one per line
   a jsonl dataset file to compare with the text file entry list

The script would read each json line and compare the parent_asin entry against the full list of parent_asin values in the text file. If the parent_asin was found in the list, the json line was printed to stdout. The result was piped to a file to create a file in the same format as the original, but only containing entries which correlated to the subset of products in the metadata subset.

### process.bat and process_10000.bat
These batch scripts automate the process of running all of the scripts to generate a subset of the data. The process.bat file generates a dataset for 1000 products, while the process_10000.bat file generates a dataset for 10000 products. The resulting files are in the same format as the original.

## Cleaning and Reformatting the Subset Dataset
The resultant subset dataset was then cleaned and combined to create a single dataset that can be indexed and searched. The scripts to perform this task are as follows:

### clean_meta.py
python clean_meta.py meta_Electronics_10000.mini.jsonl > meta_Electronics_10000.mini.cleaned.jsonl

### clean_reviews.py
python clean_reviews.py Electronics_10000.mini.jsonl > Electronics_10000.mini.cleaned.jsonl

### combine_reviews_and_meta.py
python combine_reviews_and_meta.py Electronics_10000.mini.cleaned.jsonl meta_Electronics_10000.mini.cleaned.jsonl > Electronics_combined_10000.jsonl

### generate_corpus.py
python generate_corpus.py Electronics_combined_10000.jsonl -split
python generate_corpus.py Electronics_combined_10000.jsonl

# Running the Cleaning Scripts
The cleaning scripts have been batched into two sets. There are two versions of the scripts, one for a small dataset of 1000 items (process.bat and process_2.bat) and one for a larger set of 10000 items (process_10000.bat and process_2_10000.bat). The original dataset will need to be downloaded from the website below.

Intermediate versions of the files have been zipped and placed in the dataset_tools directory.

## Step 1
Download the electronics dataset and place it in the dataset_tools directory. The data can be found on the following site:
https://amazon-reviews-2023.github.io/

Direct links to the metadata and reviews datasets are here:
https://mcauleylab.ucsd.edu/public_datasets/data/amazon_2023/raw/review_categories/Electronics.jsonl.gz
https://mcauleylab.ucsd.edu/public_datasets/data/amazon_2023/raw/meta_categories/meta_Electronics.jsonl.gz

## Step 2
The first batch step consists of generating a smaller set from the 
dataset_tools\process.bat - run this script to generate a set of 1000 items
dataset_tools\process_10000.bat - run this script to generate a set of 10000 items

## Step 3
The second batch step consists of cleaning the data, combining it into a single dataset and generating a corpus compatible with pyserini.
dataset_tools\process_2.bat - run this script to generate the corpus for 1000 items
dataset_tools\process_2_10000.bat - run this script to generate the corpus for 10000 items
