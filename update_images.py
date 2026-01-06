import json
import re

# Read the db.json file
with open('db.json', 'r') as f:
    data = json.load(f)

# SVG template with color variations
colors = [
    '%234A90E2', '%231F4B8C', '%23333333', '%23FF6B35', '%234ECDC4',
    '%23654321', '%236366F1', '%238B7355', '%23EC4899', '%238B5A3C',
    '%23F97316', '%236B7280', '%23A16207', '%23520000', '%23818CF8',
    '%2306B6D4', '%23F4A460', '%2314B8A6', '%23FBD34D', '%23A78BFA',
    '%23DC2626', '%23334155', '%231E1B4B', '%23F87171', '%23A0522D',
    '%230EA5E9', '%23E0E7FF', '%23D97706', '%2310B981', '%2364748B'
]

# Update images
for i, product in enumerate(data['products']):
    if product['image'].startswith('https://'):
        product_name = product['name'].replace(' ', '+')
        color = colors[i % len(colors)]
        svg = f"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='{color}' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dominant-baseline='middle'%3E{product_name}%3C/text%3E%3C/svg%3E"
        product['image'] = svg

# Write back to file
with open('db.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✓ Updated all product images with SVG placeholders")
