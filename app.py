from flask import Flask, render_template, redirect, jsonify, request
from flask_pymongo import PyMongo
import pandas
from pymongo import MongoClient

import numpy as np
import pandas as pd
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from config import postgresql_pword
# from config import username

#################################################
# Database Setup - SQL
#################################################
#establish connection to SQL database in AWS - refer to https://stackoverflow.com/questions/54300263/connect-to-aws-rds-postgres-database-with-python/54313925
endpoint='james-bond-uwa-db.cbbzivxykkl5.ap-southeast-2.rds.amazonaws.com'
username='postgres'
password='postgres'

engine = create_engine(f'postgresql://{username}:{password}@{endpoint}:5432/James_Bond')
conn = engine.connect()

# Create an instance of Flask
app = Flask(__name__)
#set up mongo URI
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/AU_bushfire'

# Use PyMongo to establish Mongo connection
# mongo = PyMongo(app)

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

        # # Return template and data
    return render_template("index.html")

@app.route("/api/get_bond_girls")
def home():

    #extract the sql table and turn it into a dataframe
    session=Session(engine)
    bond_girl=pd.read_sql_table("bond_girl_data_cleaned", conn)
    bond_girl_json = bond_girl.to_json(orient = "records")
    session.close()

    # # Return template and data
    return (bond_girl_json)


    

# --------------------------Environmental Impact codes--------------------------------
# @app.route("/bushfire-env")
# def env_impact():
#     return render_template("env_impact.html")    

# @app.route("/api/env_impact/get_animals")
# def get_env():
#     # Create our session (link) from Python to the DB
#     session=Session(env_engine)
#     protected_animals = pd.read_sql_table("protected_animals", env_conn)
#     animals_json = protected_animals.to_json(orient = "index")
#     session.close()
    
#     """Return the JSON representation of your dictionary."""
#     return (animals_json)

# -----------------------------------------------------------------------------------

# ----------------------------Health Impact Codes------------------------------------
# @app.route("/health_impact")
# def health_impact():
#     return render_template("health_impact.html")

# @app.route("/api/health")
# def health():
#     health_session = Session(health_engine)
#     sales = pd.read_sql_table("inhaler_sales", health_conn)
#     sales_dict = sales.to_dict(orient="record")
#     health_session.close()
#     return jsonify(sales_dict)



if __name__ == "__main__":
    app.run(debug=True)


