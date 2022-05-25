#!/bin/sh
# Set a special mode in sh: fail the script if any command fails
set -e
# Launch the server on a separate process
FLASK_APP=it/unibo/escooter/http.py poetry run flask run &
# Record its process identifier for later termination
PID="$( echo $! )"
# Wait some time for the server to be up and running
sleep 5
# Ask for the main page
curl -sL http://127.0.0.1:5000
# There has been no error, shut down the server
# (it is a graceful shutdown, "kill" sends a TERM signal by default)
kill $PID
