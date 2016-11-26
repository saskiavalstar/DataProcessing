import csv
import json

with open('data.csv') as csvfile:
    fieldnames = ("jaar", "zuigelingensterfte")
    reader = csv.DictReader(csvfile, fieldnames)
    dict_list = []
    for row in reader:
        dict_list.append(row)

with open('data.json', 'w') as outfile:
    json.dump(dict_list, outfile)




