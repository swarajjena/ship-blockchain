rm *.bna
rm *.card 
cd ~/fabric-dev-servers/
./stopFabric.sh
./teardownFabric.sh
./teardownAllDocker.sh
rm -rf ~/.composer/
./startFabric.sh
./createPeerAdminCard.sh
git pull
cd ~/sagarmala/ship-blockchain
composer archive create -t dir -n .
composer network install --card PeerAdmin@hlfv1 --archiveFile sma@0.0.1.bna
composer network start --networkName sma --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
 composer network ping --card admin@sma

composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.VOA", "pID": "VOA11" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.VOA", "pID": "VOA12" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.VOA", "pID": "VOA13" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.VOA", "pID": "VOA14" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.VOA", "pID": "VOA15" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.CHA", "pID": "CHA1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.COA", "pID": "COA1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.CUSTOMS", "pID": "CUSTOMS1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.IMMIGRATION", "pID": "IMMIGRATION1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.LDB", "pID": "LDB1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.OA1", "pID": "OA11" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.OA2", "pID": "OA21" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.PA", "pID": "PA1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.PHO", "pID": "PHO1" }'
composer participant add -c admin@sma -d '{ "$class": "org.hack.sagarmala.TA", "pID": "TA1" }'

