import os
import sys
import json

if len(sys.argv) < 3:
    print("usage: python readindex.py x file1 [file2] [file3 ...]")
    print("   prints line x file one or more files")
    print("   the first line of a file is line 0")
    exit(0)

x = int(sys.argv[1])

for f in range(2, len(sys.argv)):
    with open(sys.argv[f], 'r') as file:
        if x > 0:
            for y in range(x-1):
                file.readline()
        print(json.dumps(
           json.loads(file.readline().strip()),
           indent=4))
        print()



