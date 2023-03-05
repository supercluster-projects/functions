#dotenv -e .env -e ./super-visuals/.env ${1}
export $(cat .env | xargs) &&
export $(cat ./super-visuals/.env | xargs) && ${1}