#!/Users/christine/anaconda3/bin/python
# -*- coding: utf-8 -*-

import os, re, numpy as np, pandas as pd, json
import pyphen
from collections import Counter

dic = pyphen.Pyphen(lang='de_DE')

df = pd.read_csv('nouns_orig.csv', encoding='utf-8-sig')
print(df)
print(df.columns, '\n')

# unique POS
print(list(set(','.join(list(set(df.pos))).split(','))), '\n') 
# alphabet
chars = set(''.join(df.lemma))
print(chars, '\n')

# rename columns - remove spaces, remove "nominativ"
df = df.rename(columns={x:re.sub(' |(nominativ)', '', x) for x in df.columns})

# list of suffixes to look for
suffixes = [x[1:] for x in df.lemma if x.startswith('-')]
suffixes = suffixes + [
	'ion',
	'y',
	'tät',
	'ik',
	'isch',
	'zeit',
	'ie',
	'ent',
	'or',
	'ieb',
	'atz',
	'el',
	'er',
	'irsch',
	'ift',
	'uch',
	'itt',
	'ied',
	'aus',
	'sel',
	'eit',
	'ein',
	'ain',
	'aum',
	'aut',
	'ach',
	'erg',
	'erk',
	'eln',
	'us',
	'sche',
	'ee',
	'ekt',
	'um',
	'ahn',
	'erl',
	'ahl',
	'iff',
	'ank',
	'acht',
	'etz',
	'urz',
	'urm',
	'che',
	'ang',
	'icht',
	'ahrt',
	'ing',
	'ild',
	'eur',
	'ehre',
	'eich',
	'ur',
	'iv',
	'nis',
	'euz',
	'all',
	'aust',
	'auf',
	'and',
	'eis',
	'echt',
	'ei',
	'uss',
	'and',
	'eim',
	'ind',
	'ausch',
	'lz',
	'at',
	'ag',
	'ien',
	'eil',
	'ehr',
	'eid',
	'ig',
	'ug',
	'alt',
	'opf',
	'ald',
	'au',
	'ann',
	'os',
	'in',
	'ar',
	'aft',
	'eck',
	'eu',
	'oss',
	'em',
	'ahr',
	'ieg',
	'mpf',
	'gnst',
	'on',
	'ort',
	'nst',
	'itz',
	'ack',
	'it',
	'ut',
	'ub',
	'ad',
	'id',
	'eld',
	'und',
	'end',
	'eund',
	'off',
	'ief',
	'eif',
	'darf',
	'uf', 
	'og',
	'ich',
	'nsch',
	'sch',
	'ph',
	'th',
	'uh',
	'i',
	'ock',
	'al',
	'uhl',
	'amm',
	'om',
	'nyn',
	'an',
	'en',
	'ern',
	'o',
	'ohr',
	'är',
	'as',
	'chs',
	'is',
	'ns',
	'nft',
	'schaft',
	'kt',
	'lt',
	'mt',
	'ot',
	'oot',
	'rt',
	'ist',
	'ät',
	'eiz',
	'utz',
	'ma',
	'ü',
	'e', 
	'a'
]
# remove duplicates
suffixes = list(set(suffixes))
# order suffixes in descending order of length
suffixes = sorted(suffixes, key=len, reverse=True)
print(suffixes, '\n')

no_suffix = 0 # number of words with no matching suffix
no_suffix_col = [] # list of words with no matching suffix
suffixes_col = [] # list of suffixes for each lemma
plural_types_col = [] # list of suffixes for each plural
syllables_col = [] # list of syllable counts for each lemma 

# get suffix of lemma, return 0 if no suffix
def get_suffix(lemma):
	for s in suffixes:
		if lemma.endswith(s):
			# print(s, lemma)
			return s
	return np.nan

# check each lemma for syllables and singular/plural suffixes
for i,row in df.iterrows():
	lemma = row.lemma
	singular = row.singular
	plural = row.plural
	
	# GET SUFFIX (SINGULAR)
	suffix = get_suffix(lemma)
	suffixes_col.append(suffix)
	# if there's no matching suffix
	if suffix is np.nan:
		no_suffix += 1
		no_suffix_col.append(lemma)
		# print(lemma)
		
	# GET PLURAL TYPE
	if type(plural) is not str or type(singular) is not str: # if plural == 0, np.nan
		plural_types_col.append(np.nan) 
	else:
		plural_type = ''
		for i in range(len(singular)):
			if singular[i] != plural[i]:
				if plural[i] in ['ä', 'ü', 'ö']:
					plural_type = 'umlaut + '
					continue
				break
		plural_type += plural[i+1:]
		if plural_type == '': plural_type = 'no change'
		if plural_type == 'umlaut + ': plural_type = 'umlaut'
		plural_types_col.append(plural_type)
		
	# GET SYLLABLES
	lemma = re.sub('[\-\+\,\'\`\’\ʻ\(\)\@\. ]+', '', lemma)
	sylls = len(dic.inserted(lemma).split('-'))
	syllables_col.append(sylls)
	

# print number of words found for each suffix
print(Counter(suffixes_col).most_common())

# print list of words with no matching suffix, sorted by end of the word
print('\nno_suffix count', no_suffix, '\n')
no_suffix_col = sorted(no_suffix_col, key=lambda x: x[::-1])
# [print(x) for x in no_suffix_col]

# print unique plural types
plural_types_counter = Counter(plural_types_col)
print(plural_types_counter, '\n')
# clean up plural types (get rid of bad ones)
plural_types_col_NEW = []
for p in plural_types_col:
	if plural_types_counter[p] < 10:
		plural_types_col_NEW.append(0)
	else:
		plural_types_col_NEW.append(p)
plural_types_col = plural_types_col_NEW
# print unique plural types again
plural_types_counter = Counter(plural_types_col)
print(plural_types_counter, '\n')

# save columns in df
df['suffix'] = suffixes_col
df['plural_type'] = plural_types_col
df['syllables'] = syllables_col
df['letters'] = [len(x) for x in df.lemma]


### SAVE CSV ###

# only keep these columns
df = df[['lemma', 'pos', 'suffix', 'plural_type', 'syllables', 'letters', 'singular', 'plural']+[x for x in df.columns if x.startswith('genus')]]
df = df.fillna(0)
df.to_csv('nouns.csv', index=False, encoding='utf-8-sig')
print(df)
print('saved csv !')


#### CONVERT TO JSON ###

json_data = []

for i,row in df.iterrows():
	row_obj = {col:row[col] for col in df.columns}
	row_obj['pos'] = row_obj['pos'].split(',')
	# print(row_obj)
	json_data.append(row_obj)

with open('nouns.json', 'w') as aus:
	json.dump(json_data, aus)

print('saved json !')




