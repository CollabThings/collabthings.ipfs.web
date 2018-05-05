#!/bin/bash

echo WATCH
date

log=../ipfs.web.build.log

if OUTPUT=$(rsync -a --info=NAME --exclude=target -ur /git/collabthings.ipfs.web/* .)
then
    if [ "$OUTPUT" != "" ]                   # got output?
    then
		echo OUTPUT $OUTPUT >> $log
		
		# npm run build >> ../ipfs.web.build.log
		npx webpack >> $log 2>&1
		echo webpack done >> $log 2>&1

		buildexit=$?

		mkdir -p /git/collabthings.ipfs.web/target/ >> $log 2>&1
		cp -ruv client/* /git/collabthings.ipfs.web/target/ >> $log 2>&1

		echo exit code "${buildexit}"
		if [ "0" == "${buildexit}" ]; then
			echo OK?
			if [ -f error.log ]; then rm error.log; fi
			sleep 1
		else 
			echo FAIL?
			rm error.log
			cat *.log > error.log
			sleep 5
		fi
	else
		if [ -f error.log ]; then cat error.log; fi
    fi
fi
