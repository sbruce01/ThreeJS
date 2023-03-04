#!/bin/bash

ps aux | grep ' tick.q' | grep '5000'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' rdb1.q' | grep '5008'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' feedhandler.q' | grep '5111'| grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' csv_reader.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
ps aux | grep ' websockets.q' | grep -v grep | awk '{print $2}' | xargs -I {} kill -9 {}
