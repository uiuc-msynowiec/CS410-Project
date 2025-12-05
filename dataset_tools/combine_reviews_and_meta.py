import os
import sys
import json
import re

if len(sys.argv) != 3:
    print("usage: python combine_reviews_and_meta.py reviewfile metafile")
    print("   combines reviews and meta to produce a list of items with all review text")
    exit(0)

items = {}

with open(sys.argv[2], 'r') as file:
    for line in file:
        jline = json.loads(line.strip())
        items[jline['parent_asin']] = jline

with open(sys.argv[1], 'r') as file:
    for line in file:
        jline = json.loads(line.strip())
        asin = jline['parent_asin']
        items[asin]['text'] = items[asin]['text'] + " . " + jline['text']

for item in items.values():
    print(json.dumps(item))