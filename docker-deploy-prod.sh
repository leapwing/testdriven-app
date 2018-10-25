#!/bin/sh

if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
    
    if [ "$TRAVIS_BRANCH" == "production" ]
    then
        JQ="jq --raw-output --exit-status"

        configure_aws_cli() {
            aws --version
            aws configure set default.region ap-southeast-1
            aws configure set default.output json
            echo "AWS configured!"
        }

        register_definition() {
            if revision=$(aws ecs register-task-definition --cli-input-json "$task_def" | $JQ '.taskDefinition.taskDefinitionArn'); then
                echo "Revision: $revision"
            else
                echo "Failed to register task definition"
                return 1
            fi
        }

        update_service() {
            update_def=$(aws ecs update-service --cluster $cluster --service $service --task-definition $revision)
            echo "$update_def"
            update_result=$($update_def | $JQ '.service.taskDefinition')
            update_print=$(printf "$update_result")
            echo "$update_print"
            if [[ $update_result != $revision ]]; then
            # if [[ $(aws ecs update-service --cluster $cluster --service $service --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then    
                echo "Error updating service."
                return 1
            fi
        }

        deploy_cluster() {

            cluster="test-driven-production-cluster" 
            # users
            service="testdriven-users-prod-service"
            template="ecs_users_prod_taskdefinition.json"
            task_template=$(cat "ecs/$template")
            task_def=$(printf "$task_template" $AWS_RDS_URI $PRODUCTION_SECRET_KEY $AWS_ACCOUNT_ID)
            echo "$task_def"
            register_definition
            update_service

            # client
            service="testdriven-client-prod-service"
            template="ecs_client_prod_taskdefinition.json"
            task_template=$(cat "ecs/$template")
            task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
            echo "$task_def"
            register_definition
            update_service

            # swagger
            service="testdriven-swagger-prod-service"
            template="ecs_swagger_prod_taskdefinition.json"
            task_template=$(cat "ecs/$template")
            task_def=$(printf "$task_template" $AWS_ACCOUNT_ID)
            echo "$task_def"
            register_definition
            update_service

            # exercise
            service="testdriven-exercises-prod-service"
            template="ecs_exercises_prod_taskdefinition.json"
            task_template=$(cat "ecs/$template")
            task_def=$(printf "$task_template" $AWS_RDS_EXERCISES_URI $AWS_ACCOUNT_ID)
            echo "$task_def"
            register_definition
            # update_service
        }
        
        configure_aws_cli
        deploy_cluster

    fi
fi
