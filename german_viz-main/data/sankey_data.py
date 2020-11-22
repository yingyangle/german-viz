#!/Users/christine/anaconda3/bin/python
# -*- coding: utf-8 -*-

import os, re, json
from collections import defaultdict

ein = open('nouns.json', 'r', encoding='utf-8-sig')
data = json.load(ein)
print(len(data))
print('loaded json !')

links, nodes = [], []
links_dict = defaultdict(lambda: defaultdict(int))
singulars = defaultdict(int)
plurals = defaultdict(int)

# get names of links and nodes
for x in data:
	singular = x['suffix'] if x['suffix'] else 'other'
	plural = x['plural_type'] if x['plural_type'] else 'other'

	# add link to links_dict
	links_dict[singular][plural] += 1
	
	# add node to nodes
	singulars[singular] += 1
	plurals[plural] += 1

# print(singulars, len(singulars))
# print(plurals, len(plurals))
# print(links_dict, len(links_dict))
print(plurals)
print(len(singulars), len(plurals), len(links_dict), len(singulars) + len(plurals))

singulars_list = list(singulars.keys())
plurals_list = list(plurals.keys())

# add singular objects to nodes list
for i,s in enumerate(singulars_list):
	obj = {
		'name': s,
		'type': 'singular',
		'count': singulars[s],
		'i': i
	}
	nodes.append(obj)
# add plural objects to nodes list
for i,p in enumerate(plurals_list):
	obj = {
		'name': p,
		'type': 'plural',
		'count': plurals[p],
		'i': i + len(singulars)
	}
	nodes.append(obj)

# convert links_dict to list of link objects
for singular in links_dict:
	for plural in links_dict[singular]:
		links.append({
			'source': singulars_list.index(singular),
			'target': plurals_list.index(plural) + len(singulars),
			'value': links_dict[singular][plural]
		})

# save as .json
with open('links.json', 'w') as aus:
	json.dump(links, aus)

with open('nodes.json', 'w') as aus:
	json.dump(nodes, aus)

print('saved json !')





