import os
import sys
import json

if len(sys.argv) != 4:
    print("usage: python read_based_on_entrylist.py entryname entrylist file")
    print("   prints all lines that contain an entry named entryname")
    print("   contained within a list from the file entrylist")
    exit(0)

entryname = sys.argv[1]
table = {}
#x = 0

with open(sys.argv[2], 'r') as file:
    for line in file:
        entry = line.strip()
        
        #if not(entry in table):
        #    x = x + 1
        #    print(entry)
        table[entry] = True
#print(f'{x} unique entries')

x = 0
with open(sys.argv[3], 'r') as file:
    for line in file:
        jline = json.loads(line.strip())
        #if x < 100:
        #    print(jline[entryname])
        x = x + 1
        if jline[entryname] in table:
            print(line.strip())

