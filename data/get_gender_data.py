import os, re, numpy as np, pandas as pd, json
import pyphen
from collections import Counter
from collections import defaultdict

dic = pyphen.Pyphen(lang='de_DE')

df = pd.read_csv('german_viz/data/nouns.csv', encoding='utf-8-sig')[['lemma','genus','suffix']]

print(df)
nouns = df['lemma'].values
genders =df['genus'].values
suffixgenders = genders[:34]
all_suffixs = df['suffix'].values.tolist()
suffixs = df['suffix'].values.tolist()[:34]

suffix_dict_freq = defaultdict(int)
for i in range(len(all_suffixs)):
    suffix_dict_freq[all_suffixs[i]] += 1
suffix_dict_freq
links, nodes = [], []

gender_freq = defaultdict(int)
for i in range(len(genders)):
    gender_freq[genders[i]] += 1
gender_freq

mas = {'name': 'masculine',
       'freq': gender_freq['m'],
           'i': -1
       }
neu = {'name': 'neutral',
       'freq': gender_freq['n'],
           'i': -2
       }
fem = {'name': 'feminime',
       'freq': gender_freq['f'],
           'i': -3
       }
nodes.append(mas)
nodes.append(neu)
nodes.append(fem)
for i in range(len(suffixs)):
	obj = {
		'name': suffixs[i],
		'gender': suffixgenders[i],
        'freq': suffix_dict_freq[suffixs[i]],
		'i': i
	}
	nodes.append(obj)

for i in range(34):
    if nodes[i+3]['gender'] == 'm':
        links.append({
            'source':-1,
            'target':nodes[i+3]['i']
        })
    elif nodes[i+3]['gender'] == 'n':
        links.append({
            'source':-2,
            'target':nodes[i+3]['i']
        })
    elif nodes[i+3]['gender'] == 'f':
        links.append({
            'source':-3,
            'target':nodes[i+3]['i']
        })

dict = {}
dict['nodes'] = nodes
dict['links'] = links

with open('genders.json', 'w') as aus:
	json.dump(dict, aus)
