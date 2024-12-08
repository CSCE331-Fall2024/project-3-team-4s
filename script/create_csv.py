import csv
import random
import datetime as dt

#constants
MENU_ITEMS = {
    "bowl": 8.30,
    "plate": 9.80,
    "bigger_plate": 11.30,
    "alc_entree": 5.20,
    "alc_side": 4.40,
    "appetizer": 2.00,
    "fountain_drink": 2.30,
    "bottled_drink": 2.3,
    "refresher": 3.2
}

MENU_ITEM_IDS = {
    "bowl": 17,
    "plate": 18,
    "bigger_plate": 19,
    "appetizer": 20,
    "alc_side": 21,
    "alc_entree": 22,
    "entree": [5, 6, 7, 8, 9, 10, 46, 47, 48, 49, 50, 51, 52, 53],
    "side": [1, 2, 3, 4],
    "appetizers": [11, 12, 13, 14],
    "drinks": [55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
    "fountain_drink": 83,
    "bottled_drink": 70,
    "bottles": [72, 73, 74, 75, 76],
    "refresher": 69,
    "refreshers": [65, 66, 67, 68]
}

TRANSACTION_HEADER = ["transaction_id", "total_cost", "transaction_time",
                      "transaction_date", "transaction_type", "customer_id", "employee_id", "week_number"]

MENU_TRANSACTION_JOIN_HEADER = ["menu_item_id", "transaction_id", "item_quantity"]

CUSTOMER_HEADER = ["customer_id", "first_name", "last_name", "rewards_points", "email", "phone"]

TRANSACTION_TYPES = ["Credit/Debit", "Gift Card"]

TRANSACTION_COUNT = 65000
TOTAL_REVENUE = 755432
START_DATE = dt.datetime(2024, 1, 1)
END_DATE = dt.datetime(2024, 12, 8)
START_TIME = dt.timedelta(hours=10)
END_TIME = dt.timedelta(hours=22)

#generates the customer csv for 1000 customers
def generate_customers():
    customers = []

    customers.append([1, "Landon", "Uelsmann", 0, "ldu77@tamu.edu", "6365152783"])
    customers.append([2, "Ryan", "Tran", 0, "rryantran@tamu.edu", "5128176315"])
    customers.append([3, "Lawrence", "Wong", 0, "lawrencewong@tamu.edu", "8323666226"])
    customers.append([4, "Eshwar", "Gadi", 0, "egadi2004@tamu.edu", "7378956170"])

   
    for customer_id in range(5, 1001):
        first_name = f"Customer{customer_id}"
        last_name = "Customer"
        email = f"customer{customer_id}@example.com"
        phone = f"000000{str(customer_id).zfill(4)}"
        rewards_points = 0
        customers.append([customer_id, first_name, last_name, rewards_points, email, phone])

    return customers

#generates transaction csv
def generate_transaction_history(customers):
    """Generates transaction and menu_item_transaction data."""
    current_revenue = 0
    transactions = []
    menu_item_transactions = []

    customer_rewards = {customer[0]: 0 for customer in customers}

    for i in range(1, TRANSACTION_COUNT):
        if current_revenue >= TOTAL_REVENUE:
            break

        date = generate_random_date(START_DATE, END_DATE)
        time = generate_random_time(START_TIME, END_TIME)
        customer_choice = random.choice([True, False])

        customer_id = None
        employee_id = None
        total_cost = round(random.uniform(5, 50), 2)

        if customer_choice:
            customer_id = random.choice(list(customer_rewards.keys())) 
            customer_rewards[customer_id] += int(total_cost * 100)
        else:
            employee_id = random.choice(range(1, 14))

        week_number = calculate_week_number(dt.datetime.strptime(date, '%Y-%m-%d').date(), START_DATE.date())

        transactions.append([
            i, total_cost, time, date, random.choice(TRANSACTION_TYPES),
            customer_id if customer_id else "", employee_id if employee_id else "", week_number
        ])

        item_quantities = {} 
        for _ in range(random.randint(1, 3)): 
            item_type = random.choice(list(MENU_ITEMS.keys()))
            item_id = random.choice(
                MENU_ITEM_IDS[item_type] if isinstance(MENU_ITEM_IDS[item_type], list) else [MENU_ITEM_IDS[item_type]]
            )
            if item_id in item_quantities:
                item_quantities[item_id] += random.randint(1, 3)  
            else:
                item_quantities[item_id] = random.randint(1, 3) 

        for item_id, quantity in item_quantities.items():
            menu_item_transactions.append([item_id, i, quantity])

    
    for customer in customers:
        customer[3] = customer_rewards.get(customer[0], 0) 

    return transactions, menu_item_transactions

#determines the time for transaction
def generate_random_time(start_time, end_time):
    """Generates a random time between start_time and end_time."""
    delta = end_time - start_time
    random_seconds = random.randint(0, delta.seconds)
    return str(start_time + dt.timedelta(seconds=random_seconds))[:8]

#determines the date for transaction
def generate_random_date(start_date, end_date):
    """Generates a random date between start_date and end_date."""
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return str(start_date + dt.timedelta(days=random_days))[:10]

#determines the week number for transaction
def calculate_week_number(transaction_date, start_date):
    """Calculates the week number given a date."""
    delta = (transaction_date - start_date).days
    return (delta // 7) + 1



customers = generate_customers()

transactions, menu_item_transactions = generate_transaction_history(customers)

with open("customer.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerow(CUSTOMER_HEADER)
    writer.writerows(customers)

with open("transaction.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerow(TRANSACTION_HEADER)
    writer.writerows(transactions)

with open("menu_item_transaction.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerow(MENU_TRANSACTION_JOIN_HEADER)
    writer.writerows(menu_item_transactions)