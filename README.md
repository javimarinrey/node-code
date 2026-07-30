# Ejecución (desarrollo con recarga automática (ts-node-dev))
```shell
npm install
npm run dev
```

# Ejecución para simular producción real
```shell
npm run build
npm start
```

# Inserta dato de prueba
```shell
docker exec -it mongo1 mongosh --eval '
db.getSiblingDB("midb").items.insertOne({ _id: "test1", nombre: "prueba" })
'
```

# Leer desde un secundario explícitamente
```shell
docker exec -it mongo2 mongosh --eval '
rs.secondaryOk();
db.getSiblingDB("midb").items.find({ _id: "test1" })
'
```

# Verificar que funciona
```shell
curl http://localhost:3000/health
```

# Verificar si insertaste el item de prueba antes:
```shell
curl http://localhost:3000/items/test1
```

# Prueba de carga
```shell
npx autocannon -c 100 -d 20 http://localhost:3000/items/test1
```

# Levantar proceso con PM2
```shell
sudo npm install -g pm2
npm run build
pm2 start ecosystem.config.js
```