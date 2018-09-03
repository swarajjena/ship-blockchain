prefix="abc"
rm -rf cards/*

composer identity issue -c admin@smy -f cards/voa11_$prefix.card -u VOA11 -a "resource:org.hack.sagarmala.VOA#VOA11"

composer identity issue -c admin@smy -f cards/voa12_$prefix.card -u VOA12 -a "resource:org.hack.sagarmala.VOA#VOA12"

composer identity issue -c admin@smy -f cards/voa13_$prefix.card -u VOA13 -a "resource:org.hack.sagarmala.VOA#VOA13"

composer identity issue -c admin@smy -f cards/voa14_$prefix.card -u VOA14 -a "resource:org.hack.sagarmala.VOA#VOA14"

composer identity issue -c admin@smy -f cards/voa15_$prefix.card -u VOA15 -a "resource:org.hack.sagarmala.VOA#VOA15"

composer identity issue -c admin@smy -f cards/pa1_$prefix.card -u PA1 -a "resource:org.hack.sagarmala.PA#PA1"

composer identity issue -c admin@smy -f cards/ta1_$prefix.card -u TA1 -a "resource:org.hack.sagarmala.TA#TA1"

composer identity issue -c admin@smy -f cards/img1_$prefix.card -u IMMIGRATION1 -a "resource:org.hack.sagarmala.IMMIGRATION#IMMIGRATION1"

composer identity issue -c admin@smy -f cards/customs1_$prefix.card -u CUSTOMS1 -a "resource:org.hack.sagarmala.CUSTOMS#CUSTOMS1"

composer identity issue -c admin@smy -f cards/pho1_$prefix.card -u PHO1 -a "resource:org.hack.sagarmala.PHO#PHO1"

composer identity issue -c admin@smy -f cards/oa11_$prefix.card -u OA11 -a "resource:org.hack.sagarmala.OA1#OA11"

composer identity issue -c admin@smy -f cards/oa21_$prefix.card -u OA21 -a "resource:org.hack.sagarmala.OA2#OA21"

composer identity issue -c admin@smy -f cards/ldb1_$prefix.card -u LDB1 -a "resource:org.hack.sagarmala.LDB#LDB1"

composer identity issue -c admin@smy -f cards/coa1_$prefix.card -u COA1 -a "resource:org.hack.sagarmala.COA#COA1"

composer identity issue -c admin@smy -f cards/cha1_$prefix.card -u CHA1 -a "resource:org.hack.sagarmala.CHA1#CHA1"

