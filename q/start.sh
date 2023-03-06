#!/bin/bash

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

cd $BASE_DIRECTORY
q tick.q sym $ON_DISK_HDB -p 5000 > ${LOG_DIRECTORY}/tp.log 2>&1 &

cd $TICK_DIRECTORY

q rdb1.q localhost:5000 -p 5008 > ${LOG_DIRECTORY}/rdb1.log 2>&1 &

q websockets.q localhost:5000 -p 5222 > ${LOG_DIRECTORY}/websockets.log 2>&1 &

cd $BASE_DIRECTORY
q feedhandler.q localhost:5000 -p 5111 > ${LOG_DIRECTORY}/feedhandler.log 2>&1 &
