export $(cat .env | xargs) && \
  scp $PWD/.env $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/current && \
  scp $PWD/super-visuals/.env $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/current/super-visuals