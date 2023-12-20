# Remove old database
sudo rm -rf data

# Remove old docker container if it exists
docker stop some-postgres
docker rm some-postgres

# Remove network if it exists
docker network rm some-network

# Create new docker network
docker network create some-network

# Start postgres and delete it after it's done
docker run --name some-postgres --network some-network -e POSTGRES_PASSWORD=secret -p 5432:5432 -v $(pwd)/init.sql:/docker-entrypoint-initdb.d/init.sql -v $(pwd)/data:/var/lib/postgresql/data postgis/postgis:16-3.4 -rm && docker stop some-postgres && docker rm some-postgres
