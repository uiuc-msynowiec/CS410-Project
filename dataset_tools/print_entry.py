import os
import sys
import json

if len(sys.argv) != 3:
    print("usage: python readentry.py entryname file")
    print("   prints an entry from every line in a file")
    exit(0)

entry = sys.argv[1]

with open(sys.argv[2], 'r') as file:
    for line in file:
        jline = json.loads(line.strip())
        print(jline[entry])

