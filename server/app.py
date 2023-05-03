from flask import Flask, make_response, jsonify, request, session, flash, redirect
from flask_restful import Resource, reqparse
import stripe
import json
from config import app, db, api, bcrypt
from models import User, Item, Order
import re

class HomePage(Resource):
    def get(self):
        return {'message': '200: Welcome to our Home Page'}, 200

# class CreateCheckoutSession(Resource):
#     def post(self):
#         parser = reqparse.RequestParser()
#         parser.add_argument('price_id', type=str, required=True)
#         args = parser.parse_args()
#         try:
#             checkout_session = stripe.checkout.Session.create(
#                 line_items=[
#                 {'price': args['price_id'],
#                     'quantity': 1,
#                 },
#                 ],
#                 mode="payment",
#                 success_url = YOUR_DOMAIN + '?success=true',
#                 cancel_url=YOUR_DOMAIN + '?canceled=true',
#             )
#         except stripe.error.StripeError as e:
#             return {'message': str(e)}, 400

#         return {'checkout_url': checkout_session.url}, 201


class SignUp(Resource):
    def post(self):
        email = request.json['email']
        password = request.json['password']
        password_confirmation = request.json['password_confirmation']
        firstname = request.json['first_name']
        lastname = request.json['last_name']
        dob = request.json['dob']

        # user_exists = User.query.filter(User.email == email).first() is not None

        if email in [u.email for u in User.query.all()]:
            flash('Username already taken!')
            return jsonify({"error": "There is already a user with this name"}), 409

        hashed_password = bcrypt.generate_password_hash(password)

        new_user = User(
            email = email,
            _password_hash = hashed_password,
            password_confirmation = password_confirmation,
            first_name = firstname,
            last_name = lastname,
            dob = dob
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict()

class Login(Resource):
    def post(self):
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        user = User.query.filter(User.email == email).first()
        # if user:
        if user.authenticate(password):
            session['user_id'] = user.id
            session.permanent = True
            return user.to_dict()
        elif user is None:
            return {'error': 'Invalid email or password'}, 404
        else:
            return {'error': 'Invalid email or password'}, 404

class Logout(Resource):
    def delete(self):
        session["user_id"] = None

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
            category = data['category'],
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
        user_id = session['user_id']
        return make_response([o.to_dict() for o in Order.query.filter(Order.user_id == user_id).all()], 200)

    def post(self):
        data = request.get_json()
        new_order = Order(
            user_id = data['user_id'],
            item_id = data['item_id'],
            item_count = data['item_count'],
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

class ClearCart(Resource):
    def get(self):
        user_id = session['user_id']
        db.session.query(Order).filter(Order.user_id == user_id).delete()
        db.session.commit()

        return {'message': 'cart is clear'}, 200

stripe.api_key = 'sk_test_51MzBCeHMeLOzkmO2brW3gQ3hOO9P9tOSTK9u5p6uZgQdngTeOT76iCtUbN3zQ8R3NneVuIbVQaoVmEs7JNPIaFl800L0j5ysWq'

def calculate_order_amount(items):
    user_id = session['user_id']
    items = []
    if user_id:
        item_count_list = [order.item_count for order in Order.query.filter(Order.user_id == user_id).all()]
        price_list = [order.item.price for order in Order.query.filter(Order.user_id == user_id).all()]
        items = list(map(lambda x,y: x * y, item_count_list, price_list))
        return items
    return sum(items) * 100

# class CreatePayment(Resource):
#     def post(self):
#         try:
#             data = json.loads(request.data)
#             # Create a PaymentIntent with the order amount and currency
#             intent = stripe.PaymentIntent.create(
#                 amount=calculate_order_amount(data['items']),
#                 currency='usd',
#                 automatic_payment_methods={
#                     'enabled': True,
#                 },
#             )
#             return jsonify({
#                 'clientSecret': intent['client_secret']
#             })
#         except Exception as e:
#             return jsonify(error=str(e)), 403

YOUR_DOMAIN = 'http://localhost:3000'

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    user_id = session['user_id']
    cart_items = Order.query.filter(Order.user_id == user_id).all()
    line_items = []
    user_email = User.query.filter(User.id == user_id).first().email
    for item in cart_items:
        line_items.append({
            'price': item.item.price_id,
            'quantity': item.item_count,
        })
    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=user_email,
            line_items=line_items,
            mode='payment',
            success_url=YOUR_DOMAIN + '/checkout/success',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

class CheckEmail(Resource):
    def get(self):
        email = request.args.get("email")
        if email:
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return {"error": "Invalid email address"}, 400
            # Check if email exists in the database
            user = User.query.filter_by(email=email).first()
            if user:
                return {"isUnique": False}
            return {"isUnique": True}
        return {"error": "Email not provided"}, 400

api.add_resource(CheckEmail, "/check-email")

# api.add_resource(CreatePayment, '/create-payment-intent')
api.add_resource(HomePage, '/', endpoint='home-page')
api.add_resource(SignUp, '/signup', endpoint='signup')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(ClearSession, '/clear_session', endpoint='clear_session')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(Items, '/items', endpoint='items')
api.add_resource(ItemByID, '/items/<int:id>')
api.add_resource(Orders, '/orders', endpoint='orders')
api.add_resource(OrderByID, '/orders/<int:id>')
api.add_resource(ClearCart, '/clearcart', endpoint='clearcart')
# api.add_resource(CreateCheckoutSession, '/create-checkout-session')

if __name__ == '__main__':
    app.run(port=5555, debug=True)