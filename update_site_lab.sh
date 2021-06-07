#!/bin/bash

# script para atualizar o código do site
# deve ser chamado pelo crontab (/etc/crontab)
# a cada minuto, gerando log em /var/log/update-site
# 

cd /home/okibrasil/site-oki

echo 'Atualizando site do laboratório ' $(date)

git pull

