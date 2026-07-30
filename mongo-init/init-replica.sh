#!/bin/bash
set -e

echo "Inicializando replica set rs0..."

mongosh --host mongo1:27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 }
  ]
});
EOF

echo "Esperando a que se elija primario..."
sleep 5

mongosh --host mongo1:27017 --eval "rs.status()"

echo "Replica set inicializado correctamente."