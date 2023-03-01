#!/bin/bash

echo "1) Start All"
echo "2) Start TP"
echo "3) Start Trade and Quote RDB"
echo "4) Start Aggregation RDB"
echo "5) Start CEP"
echo "6) Start FH"
echo "7) Start Log Replay for ibm.n"
echo "8) Read from csv"
echo "9) Start EOD"


read OPTION

# Sourcing Environment to get the ON_DISK_HDB directory
BASE_DIRECTORY=$(cd $(dirname $0) && pwd)
if [[ ! -v ON_DISK_HDB ]]; then
    ON_DISK_HDB=${BASE_DIRECTORY}/OnDiskDB
    echo "Setting on disk directory to: ${ON_DISK_HDB}"
fi
echo "Operating out of directory: ${BASE_DIRECTORY}"
echo "On Disk DB set to: ${ON_DISK_HDB}"
# Checking if directories exist

if [ ! -d $ON_DISK_HDB ]
then
    echo "Creating On Disk DB $ON_DISK_HDB"
    mkdir -p $ON_DISK_HDB
fi

if [ ! -d ${ON_DISK_HDB}/sym ]
then
    echo "Creating On Disk DB ${ON_DISK_HDB}/sym"
    mkdir -p ${ON_DISK_HDB}/sym
fi

if [ ! -d ${ON_DISK_HDB}/sym ]
then
    echo "Creating On Disk DB ${ON_DISK_HDB}/hdb"
    mkdir -p ${ON_DISK_HDB}/hdb
fi

if [ ! -d ${BASE_DIRECTORY}/logs ]
then
    echo "Creating logs directory ${BASE_DIRECTORY}/logs"
    mkdir -p ${BASE_DIRECTORY}/logs
fi
TICK_DIRECTORY=${BASE_DIRECTORY}/tick
LOG_DIRECTORY=${BASE_DIRECTORY}/logs

if [ $OPTION -eq 2 ]
then
    cd $BASE_DIRECTORY
    q tick.q sym $ON_DISK_HDB -p 5000 > ${LOG_DIRECTORY}/tp.log 2>&1 &
    exit
elif [ $OPTION -eq 3 ]
then
    cd $TICK_DIRECTORY
    q rdb1.q localhost:5000 -p 5008 > ${LOG_DIRECTORY}/rdb1.log 2>&1 &
    exit
elif [ $OPTION -eq 4 ]
then
    cd $TICK_DIRECTORY
    q rdb2.q localhost:5000 -p 5009 > ${LOG_DIRECTORY}/rdb2.log 2>&1 &
    exit
elif [ $OPTION -eq 5 ]
then
    cd $TICK_DIRECTORY
    q cep.q localhost:5000 -p 5112 > ${LOG_DIRECTORY}/cep.log 2>&1 &
    exit
elif [ $OPTION -eq 6 ]
then
    cd $BASE_DIRECTORY
    q feedhandler.q localhost:5000 -p 5111 > ${LOG_DIRECTORY}/feedhandler.log 2>&1 &
    exit
elif [ $OPTION -eq 7 ]
then
    cd $BASE_DIRECTORY
    echo "Enter the name of the log replay file to be read, sitting in ${ON_DISK_HDB}"
    read LOGFILE
    echo $LOGFILE
    echo "Enter the name of the output file you want displayed"
    read LOGOUT
    echo $LOGOUT
    q lr_filter.q -logout ${LOGOUT} -logfile ${LOGFILE} > ${LOG_DIRECTORY}/lr_filter.log 2>&1 &
    exit
elif [ $OPTION -eq 8 ]
then
    cd $BASE_DIRECTORY
    echo "Enter the name of the csv file to be read, sitting in ${BASE_DIRECTORY}"
    read CSVFILE
    echo $CSVFILE
    echo "Enter the name of the schema to be upserted into"
    read SCHEMA
    echo $SCHEMA
    q csv_reader.q -csvFile ${CSVFILE} -schema ${SCHEMA} -tp localhost:5000 > ${LOG_DIRECTORY}/csv_reader.log 2>&1 &
    exit
elif [ $OPTION -eq 9 ]
then
    cd $BASE_DIRECTORY
    echo "Enter the name of the log replay file to be read, sitting in ${ON_DISK_HDB}"
    read LOGFILE
    echo $LOGFILE
    q eod.q -logfile ${LOGFILE} > ${LOG_DIRECTORY}/eod.log 2>&1 &
    exit
fi

cd $BASE_DIRECTORY
q tick.q sym $ON_DISK_HDB -p 5000 > ${LOG_DIRECTORY}/tp.log 2>&1 &

cd $TICK_DIRECTORY

q rdb1.q localhost:5000 -p 5008 > ${LOG_DIRECTORY}/rdb1.log 2>&1 &
q rdb2.q localhost:5000 -p 5009 > ${LOG_DIRECTORY}/rdb2.log 2>&1 &

q cep.q localhost:5000 -p 5112 > ${LOG_DIRECTORY}/cep.log 2>&1 &

q websockets.q localhost:5000 -p 5222 > ${LOG_DIRECTORY}/websockets.log 2>&1 &

cd $BASE_DIRECTORY
q feedhandler.q localhost:5000 -p 5111 > ${LOG_DIRECTORY}/feedhandler.log 2>&1 &
