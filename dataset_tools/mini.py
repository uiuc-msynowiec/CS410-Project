import os
import sys


if len(sys.argv) != 3:
    print("usage: python mini.py file.ext x")
    print("   creates a new file named file.mini.ext containing")
    print("   the first x lines of the original file")
    exit(0)

filename = sys.argv[1]
len = int(sys.argv[2])

#parts = os.path.splitext(filename)
#outfile = f'{parts[0]}.mini{parts[1]}'

file = open(filename, 'r')
#output = open(outfile, 'w')

for x in range(len):
    #print(file.readline().strip(), file=output)
    print(file.readline().strip())

print(f'wrote the first {len} lines of {filename} to {outfile}')

file.close()
output.close()


