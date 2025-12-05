import os
import sys
import json
import re
import shutil

def process_and_write_line(line, outfile):
    jline = json.loads(line.strip())
    corp = {}
    corp['id'] = jline["parent_asin"]
    corp['contents'] = jline["text"]
    print(json.dumps(corp), file=outfile)

if len(sys.argv) < 2:
    print("usage: python generate_corpus.py file [-split]")
    print("   creates a file or set of files containing corpus json entries { id, contents }")
    exit(0)

split = False

dir = "corpusdir_" + sys.argv[1]

if len(sys.argv) > 2 and sys.argv[2] == "-split":
    split = True
    
    if os.path.exists(dir):
       shutil.rmtree(dir)
    os.mkdir(dir)

x = 1

with open(sys.argv[1], 'r') as file:
    outputfile = None
    if not(split):
        outputfile = open("corpus_" + sys.argv[1], 'w')
    for line in file:
        if split:
            outputfile = open(dir + "\\doc" + str(x) + ".json", 'w')
            x = x + 1
        
        process_and_write_line(line, outputfile)
        
        if split:
           outputfile.close()

if not(split):
    outputfile.close()