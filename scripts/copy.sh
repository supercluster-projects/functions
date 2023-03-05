sh ./scripts/env.sh \
  "scp ./.env $DEPLOY_USER:$DEPLOY_HOST/$DEPLOY_PATH/current \
  && \
  scp ./super-visuals/.env $DEPLOY_USER:$DEPLOY_HOST/$DEPLOY_PATH/current/super-visuals"
