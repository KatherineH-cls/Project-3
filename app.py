from flask import Flask, render_template, redirect, jsonify, request
import os
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base


#################################################
# Database Setup - SQL
#################################################
#establish connection to SQL database in AWS - refer to https://stackoverflow.com/questions/54300263/connect-to-aws-rds-postgres-database-with-python/54313925

endpoint = os.getenv('db_endpoint')
username = os.getenv('db_username')
password = os.getenv('db_password')
db_name = os.getenv('db_name')
# db_name = 'd96d9lha0fnc67'

engine = create_engine(f'postgresql://{username}:{password}@{endpoint}:5432/{db_name}')
conn = engine.connect()

# Create an instance of Flask
app = Flask(__name__)

################################
# set up a declarative base to allow bond_voting javascript to connect to 
Base = declarative_base()

class Bond_vote_db(Base):
    __tablename__ = 'bond_votes'
    __table_args__ = {'extend_existing': True}
    option = Column(String, primary_key=True)
    votes = Column(Integer)
    color = Column(String)

#####################################

# Route to render index.html template using data 
@app.route("/")
def home():

        # # Return template and data
    return render_template("index.html")

@app.route("/voting_chart")
def vote_bond():

        # # Return template and data
    return render_template("index2.html")

@app.route("/api/get_bond_girls")
def girl_bond():

    #extract the sql table and turn it into a dataframe
    session=Session(engine)
    bond_girl=pd.read_sql_table("bond_girl_data_cleaned_v3", conn)
    bond_girl_json = bond_girl.to_json(orient = "records")
    session.close()

    # # Return template and data
    return (bond_girl_json)

#####################################
# set up api point to allow reading into AWS databse which can then be read by javascript
@app.route("/api/get_bond_votes")
def get_vote_data():

    #extract the sql table and turn it into a dataframe
    session=Session(engine)
    bond_votes=pd.read_sql_table("bond_votes", conn)
    bond_votes_dict=bond_votes.to_dict(orient="record")
    session.close()

    # # Return template and data
    return jsonify(bond_votes_dict)


# @app.route("/api/get_bond_votes")
# def bond_vote():

#     #extract the sql table and turn it into a dataframe
#     session=Session(engine)
#     bond_votes=pd.read_sql_table("bond_votes", conn)
#     bond_votes_dict=bond_votes.to_dict(orient="record")
#     session.close()

#     # # Return template and data
#     return jsonify(bond_votes_dict)

####################################
# set up 7 different endpoints to allow voting button to update bond_votes database

@app.route("/Idris Elba")
def tes():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Idris Elba").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/James Norton")
def James_Norton():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="James Norton").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/Regé-Jean Page")
def Jean_Page():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Regé-Jean Page").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/Henry Cavill")
def Henry_Cavill():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Henry Cavill").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/Lashana Lynch")
def Lashana():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Lashana Lynch").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/Tom Hardy")
def Tom():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Tom Hardy").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

@app.route("/Richard Madden")
def Richard():
    session=Session(engine)
    bond_votes=session.query(Bond_vote_db).filter_by(option="Richard Madden").first()
    bond_votes.votes+=1
    session.commit()
    session.close()

    return redirect('/voting_chart')

# if __name__ == "__main__":
#     app.run(debug=True)