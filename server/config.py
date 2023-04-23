from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from datetime import timedelta
# from flask_session import Session

app = Flask(__name__)
app.secret_key = b'vinhcapstoneproject'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SESSION_TYPE'] = 'sqlalchemy'
# app.json.compact = False
app.permanent_session_lifetime = timedelta(days=30)

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
# app.config['SESSION_SQLALCHEMY'] = db
migrate = Migrate(app, db)
db.init_app(app)
# session = Session(app)
api = Api(app)
bcrypt = Bcrypt(app)

CORS(app)