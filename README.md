<!-- ```
docker-compose --env-file .env -f ./docker-compose.yml up -d
``` -->

## Run kafka & dbs in containers
```
docker-compose --env-file ./apps/backend/.env -f ./apps/backend/.docker/local/docker-compose.yml up -d
```

## Install dependencies
```
pnpm install
```

## Backend

```
cd apps/backend
```

```
pnpm db:migrate
```

```
pnpm db:seed
```

```
pnpm start:dev
```

## Frontend
```
cd apps/ui && pnpm dev
```
