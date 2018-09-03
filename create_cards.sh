prefix="abc"
rm -rf cards/*

composer card create -f cards/voa11_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u VOA11 -s VOA11

composer card create -f cards/voa12_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u VOA12 -s VOA12

composer card create -f cards/voa13_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u VOA13 -s VOA13

composer card create -f cards/voa14_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u VOA14 -s VOA14

composer card create -f cards/voa15_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u VOA15 -s VOA15

composer card create -f cards/pa1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u PA1 -s PA1

composer card create -f cards/img1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u IMMIGRATION1 -s IMMIGRATION1

composer card create -f cards/customs1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u CUSTOMS1 -s CUSTOMS1

composer card create -f cards/pho1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u PHO1 -s PHO1

composer card create -f cards/oa11_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u OA11 -s OA11

composer card create -f cards/oa21_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u OA21 -s OA21

composer card create -f cards/ldb1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u LDB1 -s LDB1

composer card create -f cards/cho1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u CHO1 -s CHO1

composer card create -f cards/coa1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u COA1 -s COA1

composer card create -f cards/ta1_$prefix.card -n smy -p ~/fabric-dev-servers/DevServer_connection.json -u TA1 -s TA1