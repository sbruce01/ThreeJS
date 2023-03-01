#!/bin/bash

echo "Running Services:"

ps aux | grep ' tick.q' | grep '5000'| grep -v grep
ps aux | grep ' rdb1.q' | grep '5008'| grep -v grep
ps aux | grep ' rdb2.q' | grep '5009'| grep -v grep
ps aux | grep ' cep.q' | grep '5112'| grep -v grep
ps aux | grep ' feedhandler.q' | grep '5111'| grep -v grep
