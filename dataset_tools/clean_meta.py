import os
import sys
import json
import re

if len(sys.argv) < 2:
    print("usage: python clean_meta.py file")
    print("   prints all lines of file with entries removed and text cleaned")
    exit(0)

remove_entries = ['images', 'videos', 'store', 'bought_together', 'details']

combine_entries = ['main_category', 'title']
combine_arrays = ['description', 'categories', 'features']

# chars to remove (),"-&
# fields to combine: main_category, title, description array, categories array
with open(sys.argv[1], 'r') as file:
    for line in file:
        firsttime = True
        text = ""
        cline = re.sub(r'\\u[0-9a-f]{4}', ' ', line.strip())
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
        for entry in combine_arrays:
            ent = jline.pop(entry)
            if ent is not None:
                for val in ent:
                   text = text + " . " + str(val)
        text = re.sub(r'[\[\]\(\)&,\-:"!]', ' ', text)
        text = re.sub('  +', ' ', text)
        jline['text'] = text
        print(json.dumps(jline))
