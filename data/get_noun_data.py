#!/Users/christine/anaconda3/bin/python
# -*- coding: utf-8 -*-

import os, re, numpy as np, pandas as pd, json
import pyphen
from collections import Counter, defaultdict

ein = open('dictcc.txt', 'r')
raw = ein.read().strip()
ein.close()

raw = re.sub('\[.*?\]', '', raw)
raw = re.sub('\<.*?\>', '', raw)
raw = re.sub('[ \n][ \n]+', ' ', raw)
lines = raw.split('\n')
lines = [x.split('\t') for x in lines if '{' in x]

# print('raw', raw)

# print('lines', lines)

definitions = defaultdict(list)

for l in lines:
	word = re.sub(' *\{[a-z]+\}', '', l[0])
	definition = l[1]
	definitions[word].append(definition)


# print(definitions)

# SAVE AS JSON
with open('definitions.json', 'w') as aus:
	json.dump(definitions, aus)

print('saved definitions.json !')



dic = pyphen.Pyphen(lang='de_DE')

df = pd.read_csv('nouns_orig.csv', encoding='utf-8-sig')
print(df)
print(df.columns, '\n')

# unique POS
print(list(set(','.join(list(set(df.pos))).split(','))), '\n')
# alphabet
chars = set(''.join(df.lemma))
print(chars, '\n')

pos_dict = {
	'Substantiv': 'noun',
	'Adjektiv': 'adj.',
	'adjektivische Deklination': 'substantive adj.',
	'Deklinierte Form': 'declined form',
	'Wortverbindung': 'collocation',
	'Redewendung': 'idiom',
	'Geflügeltes Wort': 'aphorism',
	'Grußformel': 'greeting',
	'Suffix': 'suffix',
	'Affix': 'affix',
	'Gebundenes Lexem': 'bound morpheme',
	'Abkürzung': 'abbrev.',
	'Buchstabe': 'letter',
	'Symbol': 'symbol',
	'Partikel': 'particle',
	'Zahlklassifikator': 'classifier',
	'Toponym': 'toponym',
	'Eigenname': 'proper name',
	'Vorname': 'given name',
	'Nachname': 'surname',
	'Straßenname': 'street name',
}

pos_to_remove = {'Affix', 'Suffix', 'Gebundenes Lexem', 'Abkürzung', 'Buchstabe', 'Symbol'}

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
freq_col = [] # list of frequencies for each lemma
def_col = [] # list of definitions for each lemma
remove_col = [] # list of whether or not to remove this row

# frequency dict
with open('nouns_freq.json', 'r') as ein:
	freq_dict = json.load(ein)

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

	# check whether to remove this row
	remove_flag = 0
	row['pos'] = [x for x in row['pos'].split(',') if x != 'Substantiv']
	# if contains pos_to_remove
	if not set(row['pos']).isdisjoint(pos_to_remove): remove_flag = 1
	if row.genus not in {'f', 'm', 'n'}: remove_flag = 1
	if singular == 0 and plural == 0: remove_flag = 1
	if remove_flag:
		suffixes_col.append(0)
		plural_types_col.append(0)
		syllables_col.append(0)
		freq_col.append(0)
		def_col.append(0)
		remove_col.append(1)
		continue

	# convert POS to english
	row['pos'] = [pos_dict[x] for x in row['pos']]

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

	# GET FREQUENCY
	if row['lemma'] in freq_dict:
		f = freq_dict[row['lemma']]
	else:
		f = 0
	freq_col.append(f)
	
	# GET DEFINITION
	if lemma in definitions:
		definition = definitions[lemma][0]
	else:
		definition = 0
	def_col.append(definition)

	remove_col.append(0)


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
df['frequency'] = freq_col
df['definition'] = def_col
df['remove'] = remove_col

# remove columns
df = df.loc[df.remove == 0]

from itertools import chain
pos_set = set(chain.from_iterable(df['pos'])) ### unnest list

print('remaining pos', pos_set)


### SAVE CSV ###

# only keep these columns
# df = df[['lemma', 'pos', 'suffix', 'plural_type', 'syllables', 'letters', 'singular', 'plural']+[x for x in df.columns if x.startswith('genus')]]
df = df[['lemma', 'pos', 'suffix', 'plural_type', 'syllables', 'letters', 'singular', 'plural', 'genus', 'frequency', 'definition']]
df = df.fillna(0)
df.to_csv('nouns.csv', index=False, encoding='utf-8-sig')
print(df)
print('saved nouns.csv !')


### CONVERT TO JSON ###

json_data = []

for i,row in df.iterrows():
	row_obj = {col:row[col] for col in df.columns}
	# print(row_obj)
	json_data.append(row_obj)

with open('nouns.json', 'w') as aus:
	json.dump(json_data, aus)

print('saved nouns.json !')



#### GET GENDER PCTS (for ternary plot) ###

print(df)

suffix_count = defaultdict(lambda: defaultdict(int))

# count genders per suffix
for i,row in df.iterrows():
	suf = row['suffix']
	gen = row['genus']
	if suf and gen:
		suffix_count[suf][gen] += 1

# convert defaultdict to dict
def default_to_regular(d):
	if isinstance(d, defaultdict):
		d = {k: default_to_regular(v) for k, v in d.items()}
	return d

# convert defaultdict to dict
suffix_count = default_to_regular(suffix_count)

# convert counts to percentages for each suffix
for suf in suffix_count:
	total = sum([suffix_count[suf][g] for g in suffix_count[suf]])
	suffix_count[suf]['total'] = total
	for gen in ['f', 'm', 'n']:
		if gen not in suffix_count[suf]:
			suffix_count[suf][gen] = 0
		else:
			suffix_count[suf][gen] = suffix_count[suf][gen] / total


# SAVE AS JSON
with open('gender_pct.json', 'w') as aus:
	json.dump(suffix_count, aus)

print('saved gender_pct.json !')










