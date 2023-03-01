#!/bin/bash

echo "1) Stop All"
echo "2) Stop TP"
echo "3) Stop Trade and Quote RDB"
echo "4) Stop Aggregation RDB"
echo "5) Stop CEP"
echo "6) Stop FH"
echo "7) Stop Log Replay"
echo "8) Stop CSV Read"
echo "9) Stop EOD Process"

read OPTION

if [ $OPTION -eq 2 ]
then
    ps aux | grep ' tick.q' | grep '5000'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 3 ]
then
    ps aux | grep ' rdb1.q' | grep '5008'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 4 ]
then
    ps aux | grep ' rdb2.q' | grep '5009'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 5 ]
then
    ps aux | grep ' cep.q' | grep '5112'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 6 ]
then
    ps aux | grep ' feedhandler.q' | grep '5111'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 7 ]
then
    ps aux | grep ' lr_filter.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 8 ]
then
    ps aux | grep ' csv_reader.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
elif [ $OPTION -eq 9 ]
then
    ps aux | grep ' eod.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
    exit
fi

ps aux | grep ' tick.q' | grep '5000'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' rdb1.q' | grep '5008'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' rdb2.q' | grep '5009'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' cep.q' | grep '5112'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' feedhandler.q' | grep '5111'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' lr_filter.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' csv_reader.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' eod.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' websockets.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
