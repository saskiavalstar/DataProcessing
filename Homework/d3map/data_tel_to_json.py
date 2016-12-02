import csv
import json

with open('telephone_data.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    dict_list = []
    for row in reader:
        dict_list.append(row)

with open('tel_data.json', 'w') as outfile:
    json.dump(dict_list, outfile)