#!/bin/bash
cd /home/kavia/workspace/code-generation/hey-react-frontend-147708-147717/hey_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

