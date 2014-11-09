#!/bin/sh
# Use this script to run meteor in a development environment

# Configure email package.
export MAIL_URL=smtp://gimmeridemail:gimmeride1@smtp.gmail.com:587/

# Run meteor
meteor
