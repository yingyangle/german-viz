#!/Users/christine/anaconda3/bin/python
# -*- coding: utf-8 -*-

import os, re, json

ein = open('nouns.json', 'r', encoding='utf-8-sig')
data = json.load(ein)
print(len(data))
print('loaded json !')

links, nodes = [], []
links_dict = {}

for x in data:
	singular = x['suffix'] if x['suffix'] else 'other'
	plural = x['plural_type'] if x['plural_type'] else 'other'

	# add link to links_dict
	if singular in links_dict:
		if plural in links_dict[singular]:
			links_dict[singular][plural] += 1
		else:
			links_dict[singular][plural] = 1
	else:
		links_dict[singular] = { plural: 1 }

	# add node to nodes
	s = {'name': singular, 'category': 'singular'}
	if not s in nodes:
		nodes.append({
			'name': singular,
			'category':'singular'})
	p = {'name': plural, 'category': 'plural'}
	if not p in nodes:
		nodes.append({
			'name': plural,
			'category':'plural'})

# print(nodes, len(nodes))
# print(links_dict, len(links_dict))

for singular in links_dict:
	for plural in links_dict[singular]:
		links.append({
			'source': nodes.index({'name': singular, 'category': 'singular'}),
			'target': nodes.index({'name': plural, 'category': 'plural'}),
			'value': links_dict[singular][plural]
		})

with open("links.json", "w") as aus:
	json.dump(links, aus)

with open("nodes.json", "w") as aus:
	json.dump(nodes, aus)

print(len(links), len(nodes))
print('saved json !')





