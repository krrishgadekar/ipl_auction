import csv

csv_path = r"c:\Users\Tanuj\Desktop\Ipl auction\IPL_AUCTION\backend\resources\ipl2026_rated_players_auction.csv"
output_path = r"c:\Users\Tanuj\Desktop\Ipl auction\IPL_AUCTION\backend\production_patch.sql"

updates = []
updates.append("-- IPL AUCTION PRODUCTION SYNC PATCH")
updates.append("-- Run this on your Neon database to sync schema and data changes.")
updates.append("")
updates.append("-- 1. SCHEMA CHANGES")
updates.append("ALTER TABLE \"Player\" ADD COLUMN IF NOT EXISTS \"riddle_title\" TEXT;")
updates.append("ALTER TABLE \"Player\" ADD COLUMN IF NOT EXISTS \"riddle_question\" TEXT;")
updates.append("")

updates.append("-- 2. RIDDLE DATA")
r1 = "I am the absolute 'Boss' of scooping terrifyingly fast bowlers right over the keeper's head. I spent years painting the town pink with my centuries, but now I am taking my English royalty to the biggest cricket stadium in the world. Who am I?"
r2 = "I have got a cabinet full of IPL trophies, but I am probably best known for my intense on-field death stares and my very famous younger brother. I recently traded my Nawabi vibes in Lucknow to join the chaos at the Chinnaswamy. Who am I?"

updates.append("UPDATE \"Player\" SET \"riddle_title\" = 'The Scoop King', \"riddle_question\" = '" + r1.replace("'", "''") + "' WHERE \"rank\" = 20;")
updates.append("UPDATE \"Player\" SET \"riddle_title\" = 'The Intense Allrounder', \"riddle_question\" = '" + r2.replace("'", "''") + "' WHERE \"rank\" = 21;")
updates.append("")

updates.append("-- 3. NATIONALITY DATA")
with open(csv_path, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        rank = row['Rank']
        nat = row['Nationality']
        if nat:
            updates.append("UPDATE \"Player\" SET \"nationality_raw\" = '" + nat.replace("'", "''") + "' WHERE \"rank\" = " + rank + ";")

with open(output_path, 'w') as f:
    f.write("\n".join(updates))

print("Generated " + output_path)
