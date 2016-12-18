import csv
import json

with open('d3linkedview_data.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    dict_list = []
    for row in reader:
        dict_list.append(row)

with open('d3linkedview_data.json', 'w') as outfile:
    json.dump(dict_list, outfile)

