#!/bin/bash

type=$1
fails=""

inspect() {
    if [ $1 -ne 0 ]; then
        fails="${fails} $2"
    fi
}

# run server-side tests
server() {
    docker-compose -f docker-compose-dev.yml up -d --build
    docker-compose -f docker-compose-dev.yml run users python manage.py test
    inspect $? users
    docker-compose -f docker-compose-dev.yml run users flake8 --ignore=E501 project
    inspect $? users-lint
    docker-compose -f docker-compose-dev.yml run exercises python manage.py test
    inspect $? exercises
    docker-compose -f docker-compose-dev.yml run exercises flake8 --ignore=E501 project
    inspect $? exercises-lint
    docker-compose -f docker-compose-dev.yml run scores python manage.py test
    inspect $? scores
    docker-compose -f docker-compose-dev.yml run scores flake8 --ignore=E501 project
    inspect $? scores-lint
    docker-compose -f docker-compose-dev.yml down
}

client() {
    docker-compose -f docker-compose-dev.yml up -d --build
    docker-compose -f docker-compose-dev.yml run client npm test -- --coverage
    inspect $? client
    docker-compose -f docker-compose-dev.yml down
}

e2e() {
    docker-compose -f docker-compose-stage.yml up -d --build
    # docker-compose -f docker-compose-stage.yml run users python manage.py recreate_db
    ./node_modules/.bin/cypress run --config baseUrl=http://localhost --env REACT_APP_API_GATEWAY_URL=$REACT_APP_API_GATEWAY_URL,LOAD_BALANCER_DNS_NAME=http://localhost
    inspect $? e2e
    docker-compose -f docker-compose-stage.yml down
    
}

all() {
    docker-compose -f docker-compose-dev.yml up -d --build
    docker-compose -f docker-compose-dev.yml run users python manage.py test
    inspect $? users
    docker-compose -f docker-compose-dev.yml run users flake8 --ignore=E501 project
    inspect $? users-lint
    docker-compose -f docker-compose-dev.yml run exercises python manage.py test
    inspect $? exercises
    docker-compose -f docker-compose-dev.yml run exercises flake8 --ignore=E501 project
    inspect $? exercises-lint
    docker-compose -f docker-compose-dev.yml run scores python manage.py test
    inspect $? scores
    docker-compose -f docker-compose-dev.yml run scores flake8 --ignore=E501 project
    inspect $? scores-lint
    docker-compose -f docker-compose-dev.yml run client npm test -- --coverage
    inspect $? client
    docker-compose -f docker-compose-dev.yml down
    e2e
}

# run appropriate tests
if [[ "${type}" == "server" ]]; then
    echo "\n"
    echo "Running server-side tests!\n"
    server
    elif [[ "${type}" == "client" ]]; then
    echo "\n"
    echo "Running client-side tests!\n"
    client
    elif [[ "${type}" == "e2e" ]]; then
    echo "\n"
    echo "Running e2e tests!\n"
    e2e
else
    echo "\n"
    echo "Running all tests!\n"
    all
fi

# return proper code
if [ -n "${fails}" ]; then
    echo "Tests failed: ${fails}"
    exit 1
else
    echo "Tests passed!"
    exit 0
fi

