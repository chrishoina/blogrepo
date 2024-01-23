
import csv
import json
from pprint import pprint
import requests


        #                                                               #
        #  STEP 1 OPTION 1: Obtaining the base data; JSON collections   #
        #                                                               #    


# MapServer/0 - Restaurant data 

# url0 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/0/query?outFields=*&where=1%3D1&f=geojson'

# MapServer/1 - Food Inspection scores

# url1 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json'

# MapServer/2 - Food Inspection Violations 

# url2 = 'https://maps.wake.gov/arcgis/rest/services/Inspections/RestaurantInspectionsOpenData/MapServer/2/query?where=1%3D1&outFields=*&outSR=4326&f=json'

# r0 = requests.get(url0)
# data0 = r0.json()

# with open("restaurants.csv", "w") as file:
#     json.dump(data0, file)

# r1 = requests.get(url1)
# data1 = r1.json()

# with open("restaurantscores.json", "w") as file:
#     json.dump(data1, file)

# r2 = requests.get(url2)
# data2 = r2.json()

# with open("restaurantviolations", "w") as file:
#     json.dump(data2, file)


        #                                                               #
        #  STEP 1 OPTION 2: Obtaining the base data; as CSV data        #
        #                                                               #   


# restaurants
url1 = 'https://opendata.arcgis.com/api/v3/datasets/5c68797ce230422d92a9edf72193a04e_0/downloads/data?format=csv&spatialRefId=2264&where=1=1'

r1 = requests.get(url1)

with open('restaurants.csv', 'w') as f:
    writer = csv.writer(f)
    for line in r1.iter_lines():
        writer.writerow(line.decode('utf-8').split(','))

# restaurant inspection violations
url2 = 'https://opendata.arcgis.com/api/v3/datasets/c8ea67e7bd03466d9cc35ebb07f8eb8c_1/downloads/data?format=csv&spatialRefId=2264&where=1=1'

r2 = requests.get(url2)

with open('restaurantviolations.csv', 'w') as f:
    writer = csv.writer(f)
    for line in r2.iter_lines():
        writer.writerow(line.decode('utf-8').split(','))

# restaurant inspection scores
url3 = 'https://opendata.arcgis.com/api/v3/datasets/1b08c4eb32f44a198277c418b71b3a48_2/downloads/data?format=csv&spatialRefId=2264&where=1=1'

r3 = requests.get(url3)

with open('restaurantscores.csv', 'w') as f:
    writer = csv.writer(f)
    for line in r3.iter_lines():
        writer.writerow(line.decode('utf-8').split(','))


        #                                                                                                                                       #
        #  STEP 2: AFTER, you have imported JSON or CSV files into a collection or tables (depending on your approach) in Database Actions      #
        #                                                                                                                                       #     

# url4 = 'http://localhost:8080/ords/ordstest/restauranthealthscores/'

# url5 = 'http://localhost:8080/ords/ordstest/restaurantviolations/'

# url6 = 'http://localhost:8080/ords/ordstest/restaurants/'

# r3 = requests.get(url3)

# data3 = r3.json()

# pprint(data3.items())