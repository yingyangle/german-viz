#!/Users/christine/anaconda3/bin/python
# -*- coding: utf-8 -*-

import os, re, pandas as pd, json
import os, re, random, requests, datetime, pandas as pd
from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
from lxml import html
from lxml.etree import tostring
from time import sleep

def formatText(text):
	text = re.sub('[\n\t\%\,]', '', text)
	text = re.sub('\[.*\]', '', text)
	text = re.sub('\(\W*', '(', text)
	return text.strip()

df = pd.DataFrame(columns = ['Country', 'Speakers', 'Percentage', 'Year'])

# load Wikipedia page
url = 'https://en.wikipedia.org/wiki/Geographical_distribution_of_German_speakers'
anon_session = requests.Session()
request = anon_session.get(url) 
soup = BeautifulSoup((request.text))

# find elements
table = soup.find(class_='wikitable') # first table
trs = table.find_all('tr') # find rows

for tr in trs:
	tds = tr.find_all("td")
	if len(tds) < 4: continue
	data = [formatText(td.get_text()) for td in tds]
	# print(formatText(tds[0].get_text()), formatText(tds[1].get_text()), formatText(tds[2].get_text()), formatText(tds[3].get_text()))
	row = {
		'Country': data[0],
		'Speakers': data[1],
		'Percentage': data[2],
		'Year': data[3]
	}
	df = df.append(row, ignore_index=True)
	
print(df)

### SAVE CSV ###
df.to_csv('speakers.csv', index=False, encoding='utf-8-sig')

#### CONVERT TO JSON ###

json_data = {}

for i,row in df.iterrows():
	json_data[row['Country']] = {col:row[col] for col in df.columns}

with open('speakers.json', 'w') as aus:
	json.dump(json_data, aus)

print('saved json !')









