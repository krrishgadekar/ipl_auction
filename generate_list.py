import csv

# Riddle players to exclude (Unique names from instances and user provided)
riddle_players = {
    "Krunal Pandya",
    "Jos Buttler",
    "KL Rahul",
    "Trent Boult",
    "Shardul Thakur",
    "Mohsin Khan",
    "Kagiso Rabada",
    "Jaydev Unadkat",
    "Rohit Sharma",
    "Ravindra Jadeja",
    "Hardik Pandya",
    "Shivam Dube",
    "Sandeep Sharma"
}

input_csv = r"c:\Users\Tanuj\Desktop\Ipl auction\IPL_AUCTION\backend\resources\ipl2026_rated_players_auction.csv"
output_txt = r"c:\Users\Tanuj\Desktop\Ipl auction\IPL_AUCTION\Player_Ratings_List.txt"
output_md = r"c:\Users\Tanuj\Desktop\Ipl auction\IPL_AUCTION\Player_Ratings_List.md"

players_list = []

with open(input_csv, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    count = 0
    for row in reader:
        if count >= 159:
            break
        name = row['Player'].strip()
        rating = row['Rating'].strip()
        
        if name not in riddle_players:
            players_list.append((name, rating))
        
        count += 1

# Sort by name for easier lookup by participants
players_list.sort(key=lambda x: x[0])

# Write to TXT
with open(output_txt, mode='w', encoding='utf-8') as f:
    f.write(f"{'PLAYER NAME'.ljust(30)} | {'RATING'}\n")
    f.write("-" * 40 + "\n")
    for name, rating in players_list:
        f.write(f"{name.ljust(30)} | {rating}\n")

# Write to MD
with open(output_md, mode='w', encoding='utf-8') as f:
    f.write("# IPL Auction 2026 - Player Ratings List\n\n")
    f.write("| Player Name | Overall Rating |\n")
    f.write("| :--- | :--- |\n")
    for name, rating in players_list:
        f.write(f"| {name} | {rating} |\n")

print(f"Generated {len(players_list)} players.")
