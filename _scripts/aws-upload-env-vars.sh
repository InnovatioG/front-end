#!/bin/bash

# 👇 MODIFICÁ ESTAS DOS VARIABLES
APP_ID="d2z6s7x3swf1dj"
BRANCH_NAME="main"

ENV_FILE=".env.PREVIEW-AWS.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ No se encontró el archivo $ENV_FILE"
  exit 1
fi

# Recolecta todas las variables en un JSON
echo "🔄 Procesando $ENV_FILE..."

ENV_VARS_JSON=$(awk -F= '
  /^[^#].*=.*$/ {
    key=$1
    $1=""
    sub(/^=/, "", $0)
    gsub(/"/, "\\\"", $0)
    printf "\"%s\":\"%s\",\n", key, $0
  }
' "$ENV_FILE" | sed '$s/,$//' | awk 'BEGIN{print "{"} {print} END{print "}"}')

# Escribe a archivo temporal para pasar como argumento
echo "$ENV_VARS_JSON" > /tmp/env_vars.json

# Ejecuta el update
echo "🚀 Subiendo variables a Amplify..."
aws amplify update-app \
  --app-id "$APP_ID" \
  --environment-variables file:///tmp/env_vars.json

echo "✅ Variables actualizadas exitosamente."
