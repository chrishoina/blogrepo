datalist = []
with open("data.json") as f:
    for line in f:
        datalist.append(line)

print(datalist[1:])
count = 0

for count, i in enumerate(datalist, 1):
    with open(f'{count}.json', "w") as f:
        f.write("%s\n" % i)




