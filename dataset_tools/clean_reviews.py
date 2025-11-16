import os
import sys
import json
import re

if len(sys.argv) < 2:
    print("usage: python clean_reviews.py file")
    print("   prints all lines of file with extra entries removed and text cleaned")
    exit(0)

remove_entries = ['images', 'asin', 'timestamp', 'helpful_vote', 'verified_purchase']

combine_entries = ['title', 'rating', 'user_id', 'text']

with open(sys.argv[1], 'r') as file:
    for line in file:
        firsttime = True
        text = ""
        cline = line.strip()
        cline = cline.replace(r'\u2019', '')
        cline = cline.replace(r'<br />', ' ')
        cline = re.sub(r'\\u[0-9a-f]{4}', ' ', cline)
        jline = json.loads(cline)
        for entry in remove_entries:
            jline.pop(entry)
        for entry in combine_entries:
            ent = jline.pop(entry)
            if ent is not None:
                if firsttime:
                    text = str(ent)
                    firsttime = False
                else:
                    text = text + " . " + str(ent)
        text = re.sub(r'[\[\]\(\)&,\-:"!]', ' ', text)
        text = re.sub('  +', ' ', text)
        jline['text'] = text
        print(json.dumps(jline))

