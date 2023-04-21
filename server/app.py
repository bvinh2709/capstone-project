from flask import Flask, make_response, jsonify, request, session
from flask_restful import Resource, Api
from flask_migrate import Migrate

from config import app, db, api, bcrypt
from models import User, Item, Order

class HomePage(Resource):
    def get(self):
        return {'message': '200: Welcome to our Home Page'}, 200

class SignUp(Resource):
    def post(self):
        email = request.json['email']
        password = request.json['password']
        password_confirmation = request.json['password_confirmation']
        firstname = request.json['first_name']
        lastname = request.json['last_name']
        dob = request.json['dob']

        user_exists = User.query.filter(User.email == email).first() is not None

        if user_exists:
            return jsonify({"error": "There is already a user with this name"}), 409

        hashed_password = bcrypt.generate_password_hash(password)
        hashed_password_confirmation = bcrypt.generate_password_hash(password_confirmation)

        new_user = User(
            email = email,
            _password_hash = hashed_password,
            password_confirmation = hashed_password_confirmation,
            first_name = firstname,
            last_name = lastname,
            dob = dob
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "id": new_user.id,
            "email": new_user.email,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
        })

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get['email']
        password = data.get['password']
        user = User.query.filter(User.email == email).first()

        if user is None:
            return {'error': 'Invalid email'}, 404
        if not bcrypt.check_password_hash(user._password_hash, password):
            return {'error': 'Invalid password'}, 404

        session.permanent = True
        session['user_id'] = user.id

        return jsonify({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })

class Logout(Resource):
    def delete(self):
        session.pop("user_id", None)

        return {}, 204

class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200

        return {}, 401

class ClearSession(Resource):
    def delete(self):
        session['page_views'] = None
        session['user_id'] = None
        return {}, 204

class Users(Resource):
    def get(self):
        return make_response([u.to_dict() for u in User.query.all()], 200)

class UserByID(Resource):
    def get(self, id):
        if id not in [i.id for i in User.query.all()]:
            return make_response({'message': 'User not Found, please try again'}, 404)
        return make_response((User.query.filter(User.id==id).first()).to_dict(), 200)

    def patch(self, id):
        if id not in [i.id for i in User.query.all()]:
            return make_response({'message': 'User not Found, please try again'}, 404)
        else:
            data = request.get_json()
            user = User.query.filter(User.id==id).first()
            for key in data.keys():
                setattr(user, key, data[key])

            db.session.add(user)
            db.session.commit()

            return make_response(user.to_dict(), 200)

    def delete(self, id):
        if id not in [i.id for i in User.query.all()]:
            return make_response({'message': 'User not Found, please try again'}, 404)
        else:
            db.session.query(Order).filter(Order.user_id == id).delete()
            user = User.query.filter(User.id==id).first()
            db.session.delete(user)
            db.session.commit()

            return make_response({'message': 'This User has been terminated!'}, 204)

class Items(Resource):
    def get(self):
        return make_response([i.to_dict() for i in Item.query.all()], 200)

    def post(self):
        data = request.get_json()
        new_item = Item(
            name = data['name'],
            image = data['image'],
            description = data['description'],
            in_stock = data['in_stock'],
            price = data['price'],
        )

        db.session.add(new_item)
        db.session.commit()

        return make_response(new_item.to_dict(), 201)

class ItemByID(Resource):
    def get(self, id):
        if id not in [i.id for i in Item.query.all()]:
            return make_response({'message': 'Item not Found, please try again'}, 404)
        return make_response((Item.query.filter(Item.id==id).first()).to_dict(), 200)

    def patch(self, id):
        if id not in [i.id for i in Item.query.all()]:
            return make_response({'message': 'Item not Found, please try again'}, 404)
        else:
            data = request.get_json()
            item = Item.query.filter(Item.id==id).first()
            for key in data.keys():
                setattr(item, key, data[key])
            db.session.add(item)
            db.session.commit()

            return make_response(item.to_dict(), 200)

    def delete(self, id):
        if id not in [i.id for i in Item.query.all()]:
            return make_response({'message': 'Item not Found, please try again'}, 404)
        else:
            db.session.query(Order).filter(Order.item_id == id).delete()
            item = Item.query.filter(Item.id==id).first()
            db.session.delete(item)
            db.session.commit()

            return make_response({'message': 'This item is either out of stock or removed from menu!'}, 204)

class Orders(Resource):
    def get(self):
        return make_response([o.to_dict() for o in Order.query.all()], 200)

    def post(self):
        data = request.get_json()
        new_order = Order(
            user_id = data['user_id'],
            item_id = data['item_id'],
        )

        db.session.add(new_order)
        db.session.commit()

        return make_response(new_order.to_dict(), 201)

class OrderByID(Resource):
    def get(self, id):
        if id not in [i.id for i in Order.query.all()]:
            return make_response({'message': 'Order not Found, please try again'}, 404)
        return make_response((Order.query.filter(Order.id==id).first()).to_dict(), 200)

    def patch(self, id):
        if id not in [i.id for i in Order.query.all()]:
            return make_response({'message': 'Order not Found, please try again'}, 404)
        else:
            data = request.get_json()
            order = Order.query.filter(Order.id==id).first()
            for key in data.keys():
                setattr(order, key, data[key])
            db.session.add(order)
            db.session.commit()

            return make_response(order.to_dict(), 200)

    def delete(self, id):
        if id not in [i.id for i in Order.query.all()]:
            return make_response({'message': 'Order not Found, please try again'}, 404)
        else:
            order = Order.query.filter(Order.id==id).first()
            db.session.delete(order)
            db.session.commit()

            return make_response({'message': 'This order has been settled!'}, 204)


api.add_resource(HomePage, '/', endpoint='home-page')
api.add_resource(SignUp, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(ClearSession, '/clear_session', endpoint='clear_session')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/user/<int:id>')
api.add_resource(Items, '/items', endpoint='items')
api.add_resource(ItemByID, '/items/<int:id>')
api.add_resource(Orders, '/orders', endpoint='orders')
api.add_resource(OrderByID, '/orders/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)