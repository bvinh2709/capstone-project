from flask import Flask, make_response, jsonify, request, session
from flask_restful import Resource, Api
from flask_migrate import Migrate

from config import app, db, api, bcrypt
from models import User, Item, Order

class HomePage(Resource):
    def get(self):
        return {'message': '200: Welcome to our Home Page'}, 200

api.add_resource(HomePage, '/', endpoint='home-page')

if __name__ == '__main__':
    app.run(port=5555, debug=True)