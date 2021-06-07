#!/bin/bash

# script para inicializar o servidor do site
# gerando log em server_log
# rodar com ./start_server.sh &

npm start &> server_log
