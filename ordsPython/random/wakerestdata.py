
import requests
import json
from pprint import pprint

# STEP 1: Obtaining the base data

# MapServer/1 are where Food Inspection scores are located

# url1 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json'

# MapServer/2 are where Food Inspection Violations are located 

# url2 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=json'

url3 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/0/query?outFields=*&where=1%3D1&f=geojson'

# r1 = requests.get(url1)
# data1 = r1.json()

# with open("food_inspections.json", "w") as file:
#     json.dump(data1, file)

# r2 = requests.get(url2)
# data2 = r2.json()

# with open("food_inspection_violations.json", "w") as file:
#     json.dump(data2, file)

r3 = requests.get(url3)
data3 = r3.json()

with open("currentrestaurants.json", "w") as file:
    json.dump(data3, file)

# Step 2: AFTER, you have imported JSON files into a collection in Database Actions 

# url3 = 'http://localhost:8080/ords/ordstest/restauranthealthscores/'

# url4 = 'http://localhost:8080/ords/ordstest/restaurantviolations/'

# url4 = ''

# r3 = requests.get(url3)

# data3 = r3.json()

# pprint(data3.items())