#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
    
    if [[ "$TRAVIS_BRANCH" == "staging" ]]; then
        export DOCKER_ENV=stage
        elif [[ "$TRAVIS_BRANCH" == "production" ]]; then
        export DOCKER_ENV=prod
    fi
    
    if [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "production" ]
    then
        curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
        unzip awscli-bundle.zip
        ./awscli-bundle/install -b ~/bin/aws
        export PATH=~/bin:$PATH
        eval $(aws ecr get-login --region ap-southeast-1 --no-include-email)
        export TAG=$TRAVIS_BRANCH
        export REPO=$AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-1.amazonaws.com
    fi
    
    if [ "$TRAVIS_BRANCH" == "staging" ] || [ "$TRAVIS_BRANCH" == "production" ]
    then
        # users
        docker build $USERS_REPO -t $USERS:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $USERS:$COMMIT $REPO/$USERS:$TAG
        docker push $REPO/$USERS:$TAG
        # users db
        docker build $USERS_DB_REPO -t $USERS_DB:$COMMIT -f Dockerfile
        docker tag $USERS_DB:$COMMIT $REPO/$USERS_DB:$TAG
        docker push $REPO/$USERS_DB:$TAG
        # client
        docker build $CLIENT_REPO -t $CLIENT:$COMMIT -f Dockerfile-$DOCKER_ENV --build-arg REACT_APP_USERS_SERVICE_URL=TBD
        docker tag $CLIENT:$COMMIT $REPO/$CLIENT:$TAG
        docker push $REPO/$CLIENT:$TAG
        # swagger
        docker build $SWAGGER_REPO -t $SWAGGER:$COMMIT -f Dockerfile-$DOCKER_ENV
        docker tag $SWAGGER:$COMMIT $REPO/$SWAGGER:$TAG
        docker push $REPO/$SWAGGER:$TAG
    fi
fi
