#!/bin/bash

echo WATCH
date

if OUTPUT=$(rsync -a --info=NAME -ur /git/collabthings.ipfs.web/* .)
then
    if [ "$OUTPUT" != "" ]                   # got output?
    then
		echo OUTPUT $OUTPUT

		npm run build >> ../build.log
		
		sleep 10
		
		buildexit=$?
		
		echo exit code "${buildexit}"
		if [ "0" == "${buildexit}" ]; then
			echo OK?
			if [ -f error.log ]; then rm error.log; fi
			sleep 1
		else 
			echo FAIL?
			rm error.log
			cat *.log > error.log
			sleep 1
		fi
	else
		if [ -f error.log ]; then cat error.log; fi
    fi
fi
