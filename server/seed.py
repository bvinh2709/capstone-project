from random import randint, choice as rc
from datetime import date

from app import app
from models import db, User, Order, Item

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        User.query.delete()
        Order.query.delete()
        Item.query.delete()

        i1 = Item(name="Cheese Burger", image="https://images.unsplash.com/photo-1603064752734-4c48eff53d05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="A simple burger with one patty and American cheese", in_stock=True, price=6.25)
        i2 = Item(name="Double Cheese Burger", image="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="A simple burger with two patties and American cheese", in_stock=True, price=8.75)
        i3 = Item(name="Bacon Cheese Burger", image="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="A simple burger with one patty, bacon and American cheese", in_stock=True, price=7.25)
        i4 = Item(name="Hawaiian Cheese Burger", image="https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="A simple burger with one patty, ham, turkey, and white cheese", in_stock=True, price=7.75)
        i5 = Item(name="The Flat Burger", image="https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJ1cmdlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Chef's special burger with a Wagyu patty, American cheese, and egg", in_stock=True, price=10.95)
        i6 = Item(name="The Saucy Burger", image="https://images.unsplash.com/photo-1610440042657-612c34d95e9f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJ1cmdlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Grilled turkey burger with white cheese, topped with garlicy BBQ sauce", in_stock=True, price=7.25)
        i7 = Item(name="The Carm", image="https://images.unsplash.com/photo-1542574271-7f3b92e6c821?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1cmdlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Double American cheese burger with bunch of grilled onions", in_stock=True, price=9.00)
        i8 = Item(name="Fries", image="https://images.unsplash.com/photo-1598679253544-2c97992403ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGZyaWVzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="Regular French fries", in_stock=True, price=3.25)
        i9 = Item(name="New York styled Fries", image="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZnJpZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60", description="French fries with Parmesan cheese", in_stock=True, price=4.25)
        i10 = Item(name="Sweet Potato Fries", image="https://images.unsplash.com/photo-1529589510304-b7e994a92f60?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3dlZXQlMjBwb3RhdG8lMjBmcmllc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Fried sweet potato features in a variety of dishes and cuisines including the popular sweet potato fries, a variation of French fries using sweet potato instead of potato", in_stock=True, price=3.75)
        i11 = Item(name="Onion Rings", image="https://images.unsplash.com/photo-1625938146369-adc83368bda7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8b25pb24lMjByaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="An onion ring, also called a French fried onion ring, is a form of appetizer or side dish in British and American cuisine", in_stock=True, price=5.00)
        i12 = Item(name="Takoyaki", image="https://images.unsplash.com/photo-1652752731860-ef0cf518f13a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8dGFrb3lha2l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60", description="Takoyaki is a ball-shaped Japanese snack made of a wheat flour-based batter and cooked in a special molded pan", in_stock=True, price=6.00)
        i13 = Item(name="Wings", image="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZnJpZWQlMjBjaGlja2VufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="Fried chicken wings with Ranch", in_stock=True, price=8.00)
        i14 = Item(name="Berry Yogurt", image="https://images.unsplash.com/photo-1472555794301-77353b152fb7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHNoYWtlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Blueberry yogurt - yogurt with sweetened blueberries or blueberry jam. yoghourt, yoghurt, yogurt", in_stock=True, price=4.75)
        i15 = Item(name="Oreo Cookie Milkshake", image="https://images.unsplash.com/photo-1586917049334-0f99406d8a6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2hha2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="Vanilla ice cream blended with Oreo cookies", in_stock=True, price=4.75)
        i16 = Item(name="Mango Smoothie", image="https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hha2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="A shake is a sweet frozen treat that is soft and flavored like a mango, a tropical fruit", in_stock=True, price=4.75)
        i17 = Item(name="Coca-cola", image="https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Q29rZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Coke", in_stock=True, price=1.99)
        i18 = Item(name="Sprite", image="https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8U3ByaXRlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60", description="Sprite", in_stock=True, price=1.99)
        i19 = Item(name="Tea", image="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8U3dlZXQlMjB0ZWF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60", description="Tea, either Sweet, unsweet, or half and half", in_stock=True, price=1.99)
        i20 = Item(name="Boba", image="https://images.unsplash.com/photo-1592318730259-6f18a6ba1c29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Qm9iYSUyMFRlYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60", description="Boba tea", in_stock=True, price=4.99)

        items = [i1,i2,i3,i4,i5,i6,i7,i8,i9,i10,i11,i12,i13,i14,i15,i16,i17,i18,i19,i20]

        db.session.add_all(items)
        db.session.commit()