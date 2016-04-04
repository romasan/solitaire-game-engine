#!/bin/sh 
HOST='192.168.250.54'
USER='uwap'
PASSWD='Mars8_quire'
DIR='/test/solitaireenginecommon/js/'
FILE='SolitaireEngine.js'

cd js
ftp -p -n $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
cd $DIR
put $FILE
quit
END_SCRIPT
exit 0
