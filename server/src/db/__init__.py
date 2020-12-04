import pymongo
import sys

import env_production


def init_db():
    client = pymongo.MongoClient(env_production.db_connection_string)
    print("Connected")
    db = client[env_production.db_name]
    url_mappings = db[env_production.collection_name]
    return client, db, url_mappings


client, db, url_mappings = init_db()
