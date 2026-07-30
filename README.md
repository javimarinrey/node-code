# Ejecución
npm install
npm run dev          # desarrollo con recarga automática (ts-node-dev)

# o para simular producción real:
npm run build
npm start

# Inserta dato de prueba
docker exec -it mongo1 mongosh --eval '
db.getSiblingDB("midb").items.insertOne({ _id: "test1", nombre: "prueba" })
'

# leer desde un secundario explícitamente
docker exec -it mongo2 mongosh --eval '
rs.secondaryOk();
db.getSiblingDB("midb").items.find({ _id: "test1" })
'
# Verificar que funciona
curl http://localhost:3000/health

# Verificar si insertaste el item de prueba antes:
curl http://localhost:3000/items/test1

# Prueba de carga
npx autocannon -c 100 -d 20 http://localhost:3000/items/test1

# PM2
sudo npm install -g pm2
npm run build
pm2 start ecosystem.config.js