import json 

# Everything for extracting privileges

f1 = open('privileges.json')

data1 = json.load(f1)

with open('pdbadmin_privs.sql', 'w') as f1:
    f1.write("SET SERVEROUTPUT ON;\n")
    # f.write("Declare\n")
    # f.write("   invalid_privs Exception;\n")
    f1.write("Begin")

pdbprivslist = []

for i in data1:
    pdbprivslist.append(i["privilege"])
    
with open('pdbadmin_privs.sql', 'a') as f1:
    f1.write("\n")
    for i in pdbprivslist:
        f1.write(f"   Execute Immediate 'Grant {i} to PDBADMIN';" + "\n")
    
with open('pdbadmin_privs.sql', 'a') as f1:
    f1.write("\n")
    f1.write("Exception\n")
    f1.write("   when Others Then\n")
    f1.write("   dbms_output.put_line('Failed grant statement: ' || sqlerrm || sqlcode ||'.');\n")
    f1.write("\nEnd;\n/")

# Everything for extracting roles

f2 = open('roles.json')

data2 = json.load(f2)

with open('pdbadmin_roles.sql', 'w') as f2:
    f2.write("SET SERVEROUTPUT ON;\n")
    # f.write("Declare\n")
    # f.write("   invalid_roles Exception;\n")
    f2.write("Begin")

pdbroleslist = []

for i in data2:
    pdbroleslist.append(i["role"])
    
with open('pdbadmin_roles.sql', 'a') as f2:
    f2.write("\n")
    for i in pdbroleslist:
        f2.write(f"   Execute Immediate 'Grant {i} to PDBADMIN';" + "\n")
    
with open('pdbadmin_roles.sql', 'a') as f2:
    f2.write("\n")
    f2.write("Exception\n")
    f2.write("   when Others Then\n")
    f2.write("   dbms_output.put_line('Failed grant statement: ' || sqlerrm || sqlcode ||'.');\n")
    f2.write("\nEnd;\n/")

