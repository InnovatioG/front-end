
# COPIAR ENV LOCAL TO EC2

# scp -i ~/sources/reposUbuntu/INNOVATIO/INFO/MANUOK.pem /home/manuelpadilla/sources/reposUbuntu/INNOVATIO/front-end-main-v2/.env.PREVIEW-AWS.local ubuntu@ec2-34-224-93-158.compute-1.amazonaws.com:~/front-end/.env.local

scp -i ~/sources/reposUbuntu/INNOVATIO/INFO/MANUOK.pem /home/manuelpadilla/sources/reposUbuntu/INNOVATIO/front-end-main-v2/.env.PREVIEW-AWS.local ubuntu@18.213.68.76:~/front-end/.env.local


# NO SE USA MAS, ERA PARA AWS AMPLIFY, AHORA TENEMOS EC2


#!/bin/bash

# # 👇 MODIFICÁ ESTAS DOS VARIABLES
# APP_ID="d2z6s7x3swf1dj"
# BRANCH_NAME="main"

# ENV_FILE=".env.PREVIEW-AWS.local"

# if [ ! -f "$ENV_FILE" ]; then
#   echo "❌ No se encontró el archivo $ENV_FILE"
#   exit 1
# fi

# # Recolecta todas las variables en un JSON
# echo "🔄 Procesando $ENV_FILE..."

# ENV_VARS_JSON=$(awk -F= '
#   /^[^#].*=.*$/ {
#     key=$1
#     val=$0
#     sub("^[^=]*=", "", val)
#     gsub(/"/, "\\\"", val)
#     gsub(/^[ \t]+|[ \t]+$/, "", val)  # trim
#     printf "\"%s\":\"%s\",\n", key, val
#   }
# ' "$ENV_FILE" | sed '$s/,$//' | awk 'BEGIN{print "{"} {print} END{print "}"}')


# # Escribe a archivo temporal para pasar como argumento
# echo "$ENV_VARS_JSON" > /tmp/env_vars.json

# # Ejecuta el update
# echo "🚀 Subiendo variables a Amplify..."
# aws amplify update-app \
#   --app-id "$APP_ID" \
#   --environment-variables file:///tmp/env_vars.json

# echo "✅ Variables actualizadas exitosamente."
