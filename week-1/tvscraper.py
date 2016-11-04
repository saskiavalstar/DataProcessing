#!/usr/bin/env python
# Name: Saskia Valstar
# Student number: 11423404
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re
import numpy as np
from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    # initialize list with information
    tv_series = []
    # for loop for retrieving tv series information
    for y in dom.by_class("lister-item-content"):
        # title
        for e in y.by_class("lister-item-header"):
            for a in e.by_tag("a"):
                # append to list (tv_series) and convert unicode to ascii
                tv_series.append(a.content.encode("ascii","ignore"))

        # rating
        for e in y.by_class("ratings-bar"):
            for strong in e.by_tag("strong"):
                tv_series.append(strong.content.encode("ascii","ignore"))

        # genres
        for e in y.by_class("text-muted"):
            for genre in e.by_class("genre"):
                genres = genre.content.encode("ascii","ignore")
                #  removes \n from string
                genres = genres.strip()
                # removes \t from string
                genres = genres.rstrip()
                tv_series.append(genres)

        # actors and actresses
        for e in y.by_tag("p")[2:3]:
            actors = []
            for a in e.by_tag("a"):
                actors.append(str(a.content.encode("ascii","ignore")))
            tv_series.append(', ' .join(actors))

        # runtime
        for e in y.by_class("text-muted"):
            for runtime in e.by_class("runtime"):
                run_num = re.findall('\d+', runtime.content.encode("ascii", "ignore"))
                tv_series.append('' .join(run_num))

    #  return list with information
    return tv_series


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # creates variable to take steps of five
    indices = np.arange(0, len(tvseries), 5)

    # for loop to print every tv series (five elements) on a new line
    for i in indices:
        line = tvseries[i:i+5]
        writer.writerow(line)


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download(cached=True)

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
