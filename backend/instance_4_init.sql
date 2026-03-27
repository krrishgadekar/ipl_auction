-- INSTANCE 4 INITIALIZATION
-- RESETS THE DATABASE FOR A FRESH START
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
SET search_path TO public;

﻿-- CreateEnum
CREATE TYPE "Category" AS ENUM ('BAT', 'BOWL', 'AR', 'WK');

-- CreateEnum
CREATE TYPE "Pool" AS ENUM ('BAT_WK', 'BOWL', 'AR');

-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('INDIAN', 'OVERSEAS');

-- CreateEnum
CREATE TYPE "AuctionPhase" AS ENUM ('NOT_STARTED', 'FRANCHISE_PHASE', 'POWER_CARD_PHASE', 'LIVE', 'POST_AUCTION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SequenceType" AS ENUM ('PLAYER', 'FRANCHISE', 'POWER_CARD');

-- CreateEnum
CREATE TYPE "PlayerAuctionStatus" AS ENUM ('UNSOLD', 'SOLD');

-- CreateEnum
CREATE TYPE "PowerCardType" AS ENUM ('GOD_EYE', 'MULLIGAN', 'FINAL_STRIKE', 'BID_FREEZER', 'RIGHT_TO_MATCH');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "active_session_id" TEXT,
    "brand_key" TEXT,
    "franchise_name" TEXT,
    "brand_score" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "purse_remaining" DECIMAL(65,30) NOT NULL DEFAULT 120,
    "squad_count" INTEGER NOT NULL DEFAULT 0,
    "overseas_count" INTEGER NOT NULL DEFAULT 0,
    "batsmen_count" INTEGER NOT NULL DEFAULT 0,
    "bowlers_count" INTEGER NOT NULL DEFAULT 0,
    "ar_count" INTEGER NOT NULL DEFAULT 0,
    "wk_count" INTEGER NOT NULL DEFAULT 0,
    "purchased_players" JSONB NOT NULL DEFAULT '[]',
    "logo" TEXT,
    "primary_color" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "pool" "Pool" NOT NULL,
    "grade" "Grade" NOT NULL,
    "rating" INTEGER NOT NULL,
    "nationality" "Nationality" NOT NULL,
    "nationality_raw" TEXT,
    "base_price" DECIMAL(65,30) NOT NULL,
    "legacy" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT,
    "image_url" TEXT,
    "is_riddle" BOOLEAN NOT NULL DEFAULT false,
    "riddle_title" TEXT,
    "riddle_question" TEXT,
    "matches" INTEGER,
    "bat_runs" INTEGER,
    "bat_sr" DECIMAL(65,30),
    "bat_average" DECIMAL(65,30),
    "bowl_wickets" INTEGER,
    "bowl_eco" DECIMAL(65,30),
    "bowl_avg" DECIMAL(65,30),
    "sub_experience" INTEGER,
    "sub_scoring" INTEGER,
    "sub_impact" INTEGER,
    "sub_consistency" INTEGER,
    "sub_wicket_taking" INTEGER,
    "sub_economy" INTEGER,
    "sub_efficiency" INTEGER,
    "sub_batting" INTEGER,
    "sub_bowling" INTEGER,
    "sub_versatility" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionPlayer" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "status" "PlayerAuctionStatus" NOT NULL DEFAULT 'UNSOLD',
    "sold_price" DECIMAL(65,30),
    "sold_to_team_id" TEXT,

    CONSTRAINT "AuctionPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPlayer" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "price_paid" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TeamPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phase" "AuctionPhase" NOT NULL DEFAULT 'NOT_STARTED',
    "current_player_id" TEXT,
    "current_item_id" TEXT,
    "current_bid" DECIMAL(65,30),
    "highest_bidder_id" TEXT,
    "current_sequence_id" INTEGER,
    "current_sequence_index" INTEGER NOT NULL DEFAULT 0,
    "bid_frozen_team_id" TEXT,
    "auction_day" TEXT NOT NULL DEFAULT 'Day 1',
    "active_power_card" TEXT,
    "active_power_card_team" TEXT,
    "gods_eye_revealed" BOOLEAN NOT NULL DEFAULT false,
    "bid_history" JSONB NOT NULL DEFAULT '[]',
    "last_sold_player_id" TEXT,
    "last_sold_price" DECIMAL(65,30),
    "last_sold_team_id" TEXT,
    "last_sold_team_name" TEXT,

    CONSTRAINT "AuctionState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionSequence" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SequenceType" NOT NULL DEFAULT 'PLAYER',
    "sequence_items" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "AuctionSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active_session_id" TEXT,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowerCard" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "type" "PowerCardType" NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PowerCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Top11Selection" (
    "team_id" TEXT NOT NULL,
    "player_ids" TEXT[],
    "captain_id" TEXT NOT NULL,
    "vice_captain_id" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Top11Selection_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Franchise" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "brand_score" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "logo" TEXT,
    "primary_color" TEXT,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_username_key" ON "Team"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_brand_key_key" ON "Team"("brand_key");

-- CreateIndex
CREATE UNIQUE INDEX "Player_rank_key" ON "Player"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionPlayer_player_id_key" ON "AuctionPlayer"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPlayer_team_id_player_id_key" ON "TeamPlayer"("team_id", "player_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PowerCard_team_id_type_key" ON "PowerCard"("team_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_name_key" ON "Franchise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_short_name_key" ON "Franchise"("short_name");

-- AddForeignKey
ALTER TABLE "AuctionPlayer" ADD CONSTRAINT "AuctionPlayer_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionPlayer" ADD CONSTRAINT "AuctionPlayer_sold_to_team_id_fkey" FOREIGN KEY ("sold_to_team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayer" ADD CONSTRAINT "TeamPlayer_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayer" ADD CONSTRAINT "TeamPlayer_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerCard" ADD CONSTRAINT "PowerCard_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Top11Selection" ADD CONSTRAINT "Top11Selection_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



-- ── DATA FOR INSTANCE 4 ──

INSERT INTO "Franchise" (id, name, short_name, brand_score, logo, primary_color) VALUES
(1, 'Chennai Super Kings', 'CSK', 67.84, '/teams/csk.png', '#FCBD02'),
(2, 'Mumbai Indians', 'MI', 66.46, '/teams/mi.png', '#004BA0'),
(3, 'Royal Challengers Bengaluru', 'RCB', 56.50, '/teams/rcb.png', '#EC1C24'),
(4, 'Kolkata Knight Riders', 'KKR', 52.87, '/teams/kkr.png', '#3A225D'),
(5, 'Sunrisers Hyderabad', 'SRH', 47.12, '/teams/srh.png', '#F7A721'),
(6, 'Rajasthan Royals', 'RR', 45.62, '/teams/rr.png', '#254AA5'),
(7, 'Gujarat Titans', 'GT', 45.29, '/teams/gt.png', '#1D5E84'),
(8, 'Delhi Capitals', 'DC', 42.23, '/teams/dc.png', '#0078BC'),
(9, 'Punjab Kings', 'PBKS', 42.16, '/teams/pbks.png', '#ED1B24'),
(10, 'Lucknow Super Giants', 'LSG', 40.00, '/teams/lsg.png', '#A72056');

INSERT INTO "Team" (id, name, username, password_hash, purse_remaining, squad_count) VALUES
('242ffabb-78b1-4cf1-a285-757a20f08063', 'Team Alpha', 'alpha', '$2b$10$7y7XxUjJnOHgHfW7s.0FfuXeVSiefidG8c9g.ZDt4VVU7RTe0qMhe', 120, 0),
('a76f99f4-3074-47b0-a43c-d0dedb137f13', 'Team Bravo', 'bravo', '$2b$10$EEiukm2FYCHv6dfmWrpQLeEQkrZUuRq1hFDd0yKH99Wkivjmv6zei', 120, 0),
('2590eaf9-ae9a-419c-a63f-ecba958a4500', 'Team Charlie', 'charlie', '$2b$10$vUv7qpLoEAPSXXMe.N553eLl28Uw0V8eBFjqkc9E.TwkJera8EMXK', 120, 0),
('447d74f5-94cc-4fc6-9368-e76f82014ea7', 'Team Delta', 'delta', '$2b$10$De7JcvHFn.OBwFoeSh2nDuDx02EkzW/pPpn3OWjB.fMwXAzvcIxsC', 120, 0),
('5def36aa-e7fc-48d5-9438-bc1699c7dc46', 'Team Echo', 'echo', '$2b$10$Zw0lXgXXM7wHD79pqELLCOzxiwQA.ECR9ygagxfzy1Bb6Mvyjqa8S', 120, 0),
('b6c423ed-c98d-422d-9b69-ea04aa637fb4', 'Team Foxtrot', 'foxtrot', '$2b$10$vSci6F3axCBQyr1jpRNjKekx83k9hNmYyzqJE27D31.vsfr4L/rZW', 120, 0),
('9e6efa32-8b83-44fd-9981-badaffa01184', 'Team Golf', 'golf', '$2b$10$.T5zL4aLEcdjVDP.JzlGP.ARu6144hZUU9Pwau.lcj0B33VNqLxVS', 120, 0),
('8c9cc59f-f052-40c1-aa74-827244847393', 'Team Hotel', 'hotel', '$2b$10$3ynTCqT3ThTxKOIOSCxkaOUKWN1a/ROGZZw4AzBx7L8bt5J.J3QrW', 120, 0),
('cf27e5d7-925a-4203-84db-fb74f17433e9', 'Team India', 'india', '$2b$10$uRfIgrDm.bPPFgRf8LFwduIsb2a5GWrbbHPGljNBTM5lReVrck6A2', 120, 0),
('31065463-cf91-4062-940f-374859c1a6a3', 'Team Juliet', 'juliet', '$2b$10$iAQV1Qh/p2OFAhYSeScQLeQ1Ewtg7czMbkZy1uFoQMDo4D6JM04yu', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('523498ad-74e7-4144-a59f-301502fb2cc8', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('c91bce8f-1c29-4d24-9cd1-0751acf60d0f', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('383aabb2-98ae-440b-924a-992b39e95d86', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('a257fa06-0cf8-4609-9cd3-c99a48c09059', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('48f5d577-fa56-48f8-a839-d81522c275aa', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('e002cd72-47c9-453d-a0f0-1ca45addfb29', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('8aa4b554-85e4-4bbb-a8aa-a4777e0dd88b', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('a2973929-a807-473a-bb19-4ae7aeb6e10f', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('15765aed-cfbb-411d-8de6-84074e9b9363', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('13f5c566-f6ae-4042-afdb-24712de20e07', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('16a6d86b-f96a-4155-bcc3-c548644d6000', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('05a57cdd-ffd6-4505-aed9-45b36cb3486c', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('bcf17d36-0c54-484f-ba33-9246892637fa', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('42fc094f-4ab2-49b1-bd58-ea6fd7de2fb0', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('2ed573a5-95df-49d7-bac6-cf67e4fc9330', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('7d9fa6bf-cf84-495e-a44e-9ea180346f02', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('f5a4a855-94e1-41b1-9916-278902f218d3', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('2ecdf2b0-8809-42f7-b8f1-79065fd7ac48', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('ab077fb1-fb00-4964-a480-f3df087078b5', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('17f14228-fcc5-4ec1-9623-1e0bf4ec6022', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('bb33c04f-5968-4da9-998d-31dd607e18b2', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('729316b2-2264-4392-9f39-ce19498f8bda', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, true, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('40f50127-39ae-449d-bbe6-45eba2451c14', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('9b17fbe4-2d2c-4d77-8570-53ac25b0d8d1', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('4e5bbf21-c822-4ab5-89ea-75c1b5dcc289', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('dfd985a3-1672-4e06-acc2-ddc988604e59', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('f45f576e-1987-4d04-b485-fc2cb8e5616c', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('d8fdc06a-7a34-4679-b219-f14276b0dbbf', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('c0f75612-0335-4dd2-af96-096e25c60425', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('98fcf230-fdd0-495b-b0ee-601600a5347f', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('72e0122d-2040-4db3-9ec2-609de611b456', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('c249e2ea-d7ee-4491-abe8-71c46673bfb1', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('31199c0f-f5bb-4281-855c-77186c179fdd', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('cf6a6283-ee0f-449e-8138-4fff009a1c04', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 1, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('55d16a72-e809-44b1-98e0-772079e17f19', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('86093ded-a572-40dd-9214-63b30b48c88a', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('c0546b3f-af56-4b13-9360-f31d06656ad9', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('f120b634-f561-46e1-99a2-0a09563321c4', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('8d5345a9-bda1-498e-96ed-1ea1f227ac84', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('d5d52bc8-4f25-41d3-89e9-72fd0dc93621', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('c786ef8a-bd49-4624-ae14-87f6235a5390', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('a0a884b7-d2b2-43f7-b709-27152547a651', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('07742aa2-21aa-4b20-9719-08705186397c', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('8c2ad524-be42-4a66-bc44-cb04c9b7e43f', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('656cd983-95bb-4eec-8611-c0ff4f544640', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('e4238383-342e-46f4-a0ee-60d96436bb52', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('c578203b-3527-4e98-9b43-a53a79ff394c', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('b0f8eb04-5ba6-41d6-8b8c-9c0dd8eed0c8', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('e366e8f0-9b2e-4781-9a63-8f3e238139e0', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('cdaec365-dfc2-4a96-ba8a-6b07d12f51b8', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 1, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('11cb5ae5-5ada-42c2-a14f-5712b9488132', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('f0714639-3656-40ea-b6b8-47a3bb971269', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('ea97245e-5068-407e-894f-a4de8b75ec17', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('819e37dc-aecd-43b1-930f-eca8db2d5810', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('2c99a97c-3298-4b6e-8257-cd31cdeb12f1', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('5c001531-a992-4d04-b06f-b9f5c051db24', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('8340f79c-0bb4-4a1b-a4f3-8f46114e6876', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('7753018a-7496-4756-a080-9ba2fd7262a4', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('da3789df-4e18-4876-b8cc-82fcaa7a8e23', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('8c77f32a-ed25-4765-ac9c-2d50b48e0212', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('b7ab0740-c9b3-4e3f-939d-852876aff85c', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('1dc27f61-fdc5-4df3-a6fa-7155e3c88397', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('88bcdb71-213e-4791-b378-2f1d83bd344d', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('eb0eac66-e827-412c-8bd1-862d1ba997f7', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('68ccfa14-7a23-43b2-9d1b-c8a9b0231f3e', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('4df91d33-2b3b-40f2-a41d-29614c8e9ad3', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('a8ab075e-191b-4b85-b9a0-cf1364a5cc65', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('7b387309-7e92-4712-b94f-fd6f2be90350', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('99b05146-38a4-42af-b8aa-3ca529854c8f', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('e09d90da-2c69-4db8-a68f-5d17a7a61d2b', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('00ee0917-39a4-4f43-9640-81cd6a28353e', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('b68885fc-4b39-4055-9cdb-a018c8e1912b', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 1, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('0a6e7ce2-d8ae-4709-9a95-00bfc154b1b4', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('d34cf402-a274-42e9-8386-493210246edd', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('a45399dd-a866-448d-a687-4ebc99423614', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('7a71a192-b49b-4c5b-953d-94550935a868', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('22784d04-c63a-47cf-bdcb-148c5285a8e3', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('855a24ce-0156-40d0-a262-a14273ec17b3', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('7401c4e2-bbfe-4dad-af5c-16ff1e1eb2f5', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 0.5, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('aafccdca-10d7-4547-89ef-269e79a253bd', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('1694af68-88d6-48af-9a3d-1b75af8ca522', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('d25ed81b-7a52-44a5-98fb-56c576356a45', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('f7a0f4be-63b6-48d4-82ad-0d911599ca0c', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('d31cd774-b608-468a-89a3-e1accd1211af', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('75ae93c8-687f-4498-ac03-d58cb242982c', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('1b92e7ec-4b4f-440c-97f8-879b0c3783f9', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 1, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('e45564c4-ab27-42c2-bdfe-45ed6265617f', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('e213d840-e609-46b2-93a4-c7e248c48000', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('6966424d-7d16-4c2c-ac04-2225034f3c55', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('b1db490c-c91e-4633-898b-619748480b55', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('52995a1a-5a43-4ea2-bca6-381b6fd48ae8', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('97150dd1-5131-48f5-a9cc-a0dd339669be', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('5a804a46-d4de-435f-a733-44aa75984ce6', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('63c1b1bb-31f0-4867-85d2-1afabada81a0', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('b9109e31-38e8-4907-b6ee-e7e8dd212ba6', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('dd45b5ce-9fb4-4232-89d8-60eac8870ee1', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('5d9902ec-05b9-4926-a881-7e224327c825', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 1, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('cbd6470b-9a45-417c-86c6-2c4f298d0b60', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('a2be8a68-8081-42e9-938c-bc330a5a9457', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('1f5038d7-2416-402e-ba68-23d5d84a8387', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('8d4d8528-6cf2-45eb-945f-23ebadca20ef', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('5f6413c2-86e0-4ebc-bbd3-c0a52f54882c', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('26c0438c-34bc-4f63-88fb-503b08fbec19', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('7b6f17c8-4723-4f61-8537-d3b3aef2c674', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('bd45c358-93c0-4dcc-95c6-846b357c1b06', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('21acad53-40fa-44bf-a137-5c20e4de0ef0', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('7d7f0f18-3491-4a50-aed5-1e12d2579053', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('d6d7b1d8-2ae7-4457-860a-0a823c4e3f3e', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('c8dd33eb-9811-4444-ab3f-df25a69666cc', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('58220176-891e-41e0-90fc-45f5f453e2f8', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('0fe499df-06cf-44a3-a5f9-c7d1531013b1', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('323f37a7-05e7-42dd-8a77-a8db42a19cfe', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('a1e80571-0350-4f99-bb16-971430df2e75', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('e18d7183-a759-42ae-8791-94977b585e5b', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('f61b4207-d4fd-4862-a93a-6e4f215edc0a', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('20aec5c8-4359-4a58-ba67-79599fc0c49b', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('ab21cbdd-c385-4d8c-b215-ffa6bfdbf0ae', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, true, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('78b6e935-efab-4f2a-8bb8-29b0a02ee71c', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('213d38f5-1cce-47b4-958f-deda86611d3d', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('182c470a-c07a-42b0-ac03-32b926254a2b', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('af3d8efd-93c9-488d-bca8-847551e659f4', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('3cc45f8b-f6c7-4e7e-a424-59226bc76361', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 1, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('057ff7af-0c83-462f-ae44-8369f7cde15c', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('4f87651e-3be5-4da2-b2b7-3ae810c83771', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('57c7e042-ccdd-4df4-9217-c315b8e3c7a8', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('db479358-d17a-46dc-8e65-9877c808e7e4', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('480b6b70-2a12-46b1-b31e-6db333603913', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('c47ebccd-70e1-4e36-baf8-4a95a89ec0d3', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('39195b76-fddf-425c-b934-c9fc5aeadd0e', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('2ebda397-44fe-48db-8fb7-d0f206865e35', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('d7d31283-5509-4088-b1e8-baa5becb85f8', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('2af01b53-bed9-4738-8392-3d372c8d2182', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('04b4dff6-c27c-458d-bbe8-e1d68c1e312c', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('2ddee932-209e-4e13-bce0-191837556807', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('6de778d5-e2ea-4345-965d-18409ba46e9d', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('31d598ea-b3a1-4432-8654-ba1daf9bd17b', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('58d4105f-b154-4c97-a647-78fe9fc7bf16', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('b5954556-0e6d-4a6b-989d-170abf319e81', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('c45ee110-1e0b-4f63-8503-3d991bcbb2e6', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('b39c326b-1bf5-4709-b1af-e1fd28955312', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('ac96ed0e-7472-42d7-8897-1d0eec7cd9de', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('4a568d02-7d83-4860-bb32-35bfbb1e1b12', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('f096b2da-cfdc-4346-9799-c053cbfd671e', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('f627f4c1-8ea6-417c-a37f-bae3d62c22ca', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('99608d48-e21c-47db-85a5-c85b767a7208', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('06321a63-afc4-482a-86df-351aa8168251', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('540e90bc-249a-452b-a82b-ce853ea71116', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('aba3838d-66a2-4854-a9da-9a538094f72d', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('3bb0017c-1988-4e7c-b284-c19e08050291', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('67696f6b-9e19-438a-8842-4a3c9f11abb9', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('6d27da6b-9aed-4c54-89ac-fb357dc217ef', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('90ae4793-79dd-425f-b9dc-c578929d17ce', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('12f59159-f527-4f4b-bdb8-aba361b87225', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('4f44144b-67f5-430d-9035-2defbf85094b', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('e12a14af-7c39-4890-9190-12fe1eef1c86', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('f19b3aa6-695c-4d71-93ef-08f3807e72fc', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('179e90ef-5db8-4445-9a0a-726fd0c80287', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('9439d4d3-03a7-4c66-b7f8-ae36b565bfc9', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('6f6ea6fa-cd30-49f7-a04e-91e918bb92cf', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('8e5c34c0-f7d8-441a-a99c-b6336d58b0b0', '523498ad-74e7-4144-a59f-301502fb2cc8', 'UNSOLD'),
('d4a6e7eb-7334-49bb-b710-2e1c31cd2329', 'c91bce8f-1c29-4d24-9cd1-0751acf60d0f', 'UNSOLD'),
('ebcdf495-1f74-4ee7-a46a-a22f293b2c4c', '383aabb2-98ae-440b-924a-992b39e95d86', 'UNSOLD'),
('311dcc50-49e9-4b22-bdcc-d8de0875e29c', 'a257fa06-0cf8-4609-9cd3-c99a48c09059', 'UNSOLD'),
('1e2cdd16-0f9d-4bf8-9237-d45d71505922', '48f5d577-fa56-48f8-a839-d81522c275aa', 'UNSOLD'),
('5438db9c-1b60-44fb-90de-3272539d8c46', 'e002cd72-47c9-453d-a0f0-1ca45addfb29', 'UNSOLD'),
('f93deebd-1656-4342-9de2-5dda762ba2c1', '8aa4b554-85e4-4bbb-a8aa-a4777e0dd88b', 'UNSOLD'),
('a9ebc1e1-ed85-4d7d-80c8-623686ed4808', 'a2973929-a807-473a-bb19-4ae7aeb6e10f', 'UNSOLD'),
('d006a968-4986-458b-9ff6-04e294ecfd68', '15765aed-cfbb-411d-8de6-84074e9b9363', 'UNSOLD'),
('a79979ac-8c83-4115-a2c1-49549cf7f8e3', '13f5c566-f6ae-4042-afdb-24712de20e07', 'UNSOLD'),
('72ea6c80-ec49-4a1c-8702-793a52b36a1a', '16a6d86b-f96a-4155-bcc3-c548644d6000', 'UNSOLD'),
('4ecac4bd-9d55-41f6-9cd6-81fe9b1f3dc7', '05a57cdd-ffd6-4505-aed9-45b36cb3486c', 'UNSOLD'),
('55a6a026-6574-4f08-8e99-836919344ed8', 'bcf17d36-0c54-484f-ba33-9246892637fa', 'UNSOLD'),
('2e09708b-d9c3-43c0-825a-697d4f7b5fb2', '42fc094f-4ab2-49b1-bd58-ea6fd7de2fb0', 'UNSOLD'),
('fa833ccb-0a2b-4766-9b61-580540e9d056', '2ed573a5-95df-49d7-bac6-cf67e4fc9330', 'UNSOLD'),
('719ecc7a-597e-4c1c-8cc0-46fa39609fb5', '7d9fa6bf-cf84-495e-a44e-9ea180346f02', 'UNSOLD'),
('5cb30759-2faf-477a-b680-b3206941b405', 'f5a4a855-94e1-41b1-9916-278902f218d3', 'UNSOLD'),
('281e9012-082b-4cda-9e57-e83239f025f8', '2ecdf2b0-8809-42f7-b8f1-79065fd7ac48', 'UNSOLD'),
('506d88a4-3f88-498f-a2d6-754a1aa763d3', 'ab077fb1-fb00-4964-a480-f3df087078b5', 'UNSOLD'),
('97280de8-0ec5-4b0a-8a46-c45938ea4239', '17f14228-fcc5-4ec1-9623-1e0bf4ec6022', 'UNSOLD'),
('13978f15-7c84-44b2-8493-167d03b2c24d', 'bb33c04f-5968-4da9-998d-31dd607e18b2', 'UNSOLD'),
('c944d5bc-3a2a-486c-beb9-ca275abba95b', '729316b2-2264-4392-9f39-ce19498f8bda', 'UNSOLD'),
('454e6e52-a000-4733-b902-8f33ce6f39df', '40f50127-39ae-449d-bbe6-45eba2451c14', 'UNSOLD'),
('890ef9e6-4052-43df-b299-97ae73e2b1cd', '9b17fbe4-2d2c-4d77-8570-53ac25b0d8d1', 'UNSOLD'),
('dc6496df-7294-47a6-8d16-0257217049f0', '4e5bbf21-c822-4ab5-89ea-75c1b5dcc289', 'UNSOLD'),
('87738233-ae23-4e5d-9349-e8f38cee5822', 'dfd985a3-1672-4e06-acc2-ddc988604e59', 'UNSOLD'),
('13c272b5-ef54-4b1f-b836-2ec090bd4025', 'f45f576e-1987-4d04-b485-fc2cb8e5616c', 'UNSOLD'),
('31101f14-6af7-44da-8724-c3cdcedb6d92', 'd8fdc06a-7a34-4679-b219-f14276b0dbbf', 'UNSOLD'),
('a3bea762-6cc4-4676-a26a-b68355c3883c', 'c0f75612-0335-4dd2-af96-096e25c60425', 'UNSOLD'),
('489abd5a-53f1-487a-8522-633021273a81', '98fcf230-fdd0-495b-b0ee-601600a5347f', 'UNSOLD'),
('003249c4-269a-414a-ade0-8adb36331755', '72e0122d-2040-4db3-9ec2-609de611b456', 'UNSOLD'),
('ab9e3672-e30a-4dd8-8646-f8f27c064443', 'c249e2ea-d7ee-4491-abe8-71c46673bfb1', 'UNSOLD'),
('cd7d4de6-b763-4f13-a842-929dd9c41c44', '31199c0f-f5bb-4281-855c-77186c179fdd', 'UNSOLD'),
('bd105f06-5ab4-4bc8-a630-f6472bf7e0ac', 'cf6a6283-ee0f-449e-8138-4fff009a1c04', 'UNSOLD'),
('08b6f82c-526b-4e7d-adc5-a694f0d5cf8d', '55d16a72-e809-44b1-98e0-772079e17f19', 'UNSOLD'),
('dadb3cfc-2b5a-46f9-abf6-ee787814678c', '86093ded-a572-40dd-9214-63b30b48c88a', 'UNSOLD'),
('dca86fe1-9b37-49b3-976f-15b2ec9c68e0', 'c0546b3f-af56-4b13-9360-f31d06656ad9', 'UNSOLD'),
('859c42f2-9f43-4522-931d-136eecc37e63', 'f120b634-f561-46e1-99a2-0a09563321c4', 'UNSOLD'),
('13b00075-cdfd-4fda-a72c-df6ae57901fd', '8d5345a9-bda1-498e-96ed-1ea1f227ac84', 'UNSOLD'),
('33619474-cf04-4995-9af8-24d97922c507', 'd5d52bc8-4f25-41d3-89e9-72fd0dc93621', 'UNSOLD'),
('9152c6b9-4d22-4c72-a810-0cde450eb166', 'c786ef8a-bd49-4624-ae14-87f6235a5390', 'UNSOLD'),
('ac610d4d-6c0a-4886-b2f0-8362c40fb5e0', 'a0a884b7-d2b2-43f7-b709-27152547a651', 'UNSOLD'),
('e95452d9-1e65-4d37-bbcb-a7ab8b94e5cb', '07742aa2-21aa-4b20-9719-08705186397c', 'UNSOLD'),
('b0541cfa-007b-4989-913c-b892955259e3', '8c2ad524-be42-4a66-bc44-cb04c9b7e43f', 'UNSOLD'),
('d6ba8f28-785c-4ada-bd6f-b1624d4679fe', '656cd983-95bb-4eec-8611-c0ff4f544640', 'UNSOLD'),
('9477129a-eb15-4a23-9519-baa05563e4ef', 'e4238383-342e-46f4-a0ee-60d96436bb52', 'UNSOLD'),
('393eb27b-e968-41ee-8b60-194f4dc8e4fb', 'c578203b-3527-4e98-9b43-a53a79ff394c', 'UNSOLD'),
('aa6b3961-712c-4793-a101-b5430d5ce9b4', 'b0f8eb04-5ba6-41d6-8b8c-9c0dd8eed0c8', 'UNSOLD'),
('962b3e75-0023-4b40-a982-ccf4ba7d0838', 'e366e8f0-9b2e-4781-9a63-8f3e238139e0', 'UNSOLD'),
('0263b403-7b0a-4c83-81f3-6703035fc559', 'cdaec365-dfc2-4a96-ba8a-6b07d12f51b8', 'UNSOLD'),
('5956f7c4-f0a9-4108-8f7c-88d99fdd3028', '11cb5ae5-5ada-42c2-a14f-5712b9488132', 'UNSOLD'),
('796209bd-0adb-4d37-a176-71e9687a9252', 'f0714639-3656-40ea-b6b8-47a3bb971269', 'UNSOLD'),
('beb1b879-6cae-453b-b913-dd90609f0604', 'ea97245e-5068-407e-894f-a4de8b75ec17', 'UNSOLD'),
('918a6022-3c28-4672-b47d-ea271958c93b', '819e37dc-aecd-43b1-930f-eca8db2d5810', 'UNSOLD'),
('e0275ac9-b718-4e11-a18c-9b72acdcb53d', '2c99a97c-3298-4b6e-8257-cd31cdeb12f1', 'UNSOLD'),
('24524a1f-7ba6-4725-8307-162f40448681', '5c001531-a992-4d04-b06f-b9f5c051db24', 'UNSOLD'),
('da684870-ed26-4bf5-ba53-20129f87913f', '8340f79c-0bb4-4a1b-a4f3-8f46114e6876', 'UNSOLD'),
('eca7e78d-47f7-4f05-bb66-6eb77b4eb240', '7753018a-7496-4756-a080-9ba2fd7262a4', 'UNSOLD'),
('a87ca607-0f92-48d3-8fc9-d139221ad6a6', 'da3789df-4e18-4876-b8cc-82fcaa7a8e23', 'UNSOLD'),
('7aa1f110-9d4f-4aef-9038-85a4b63a1f46', '8c77f32a-ed25-4765-ac9c-2d50b48e0212', 'UNSOLD'),
('d40a3290-fda7-48d1-8799-f7aa333cfad2', 'b7ab0740-c9b3-4e3f-939d-852876aff85c', 'UNSOLD'),
('0409ce06-8ea1-438a-a548-14011a99bc9b', '1dc27f61-fdc5-4df3-a6fa-7155e3c88397', 'UNSOLD'),
('e60d7c55-9ebc-45e5-a226-df7375e4b5d2', '88bcdb71-213e-4791-b378-2f1d83bd344d', 'UNSOLD'),
('c150a9bf-6868-4c0b-b483-190f23e3fc75', 'eb0eac66-e827-412c-8bd1-862d1ba997f7', 'UNSOLD'),
('e4e6a36e-25c4-431e-8317-12c164131c2f', '68ccfa14-7a23-43b2-9d1b-c8a9b0231f3e', 'UNSOLD'),
('c30a7bc9-c349-4baa-87cc-8ebeed535e1c', '4df91d33-2b3b-40f2-a41d-29614c8e9ad3', 'UNSOLD'),
('3c00add0-6669-40b5-b227-52ecb8f435d2', 'a8ab075e-191b-4b85-b9a0-cf1364a5cc65', 'UNSOLD'),
('ca6d593b-c853-4e41-8bfb-b526c618d714', '7b387309-7e92-4712-b94f-fd6f2be90350', 'UNSOLD'),
('df0553b3-fa07-4c5b-b975-11d45e3df9e3', '99b05146-38a4-42af-b8aa-3ca529854c8f', 'UNSOLD'),
('b8d6e6fb-9bca-425c-be97-88a8d194bac6', 'e09d90da-2c69-4db8-a68f-5d17a7a61d2b', 'UNSOLD'),
('cf42f4c0-5a31-46a3-8bf8-d77db2373b8f', '00ee0917-39a4-4f43-9640-81cd6a28353e', 'UNSOLD'),
('e10e209c-bf2a-43b0-ad01-22bd2f47662a', 'b68885fc-4b39-4055-9cdb-a018c8e1912b', 'UNSOLD'),
('d7190bd9-f25d-4a8d-93c3-5d53521fb1be', '0a6e7ce2-d8ae-4709-9a95-00bfc154b1b4', 'UNSOLD'),
('38e2e6e4-ba6e-485d-bb38-4d169a9f27f8', 'd34cf402-a274-42e9-8386-493210246edd', 'UNSOLD'),
('b607bc6a-3f4a-488f-9a84-af0142538229', 'a45399dd-a866-448d-a687-4ebc99423614', 'UNSOLD'),
('c89e0b8a-8e56-47d2-8eda-d4f8c527dc5e', '7a71a192-b49b-4c5b-953d-94550935a868', 'UNSOLD'),
('6f98a0c4-f57a-4b12-8a0e-a556e4fcf0ab', '22784d04-c63a-47cf-bdcb-148c5285a8e3', 'UNSOLD'),
('63a15362-76f3-4e76-a82d-d8fef0b9fc9c', '855a24ce-0156-40d0-a262-a14273ec17b3', 'UNSOLD'),
('7abc2c61-8afe-4b2a-8226-18a487137822', '7401c4e2-bbfe-4dad-af5c-16ff1e1eb2f5', 'UNSOLD'),
('39a91a22-586f-45b8-9c00-2b1e7880ed0f', 'aafccdca-10d7-4547-89ef-269e79a253bd', 'UNSOLD'),
('79f3ff98-20c0-4750-890c-5dbcfab7f61f', '1694af68-88d6-48af-9a3d-1b75af8ca522', 'UNSOLD'),
('798d19d6-c05c-4e03-9089-2e284465c828', 'd25ed81b-7a52-44a5-98fb-56c576356a45', 'UNSOLD'),
('47e51a12-4781-4381-adce-e2226938e232', 'f7a0f4be-63b6-48d4-82ad-0d911599ca0c', 'UNSOLD'),
('37161023-b97f-4e83-b3d8-748784c0888c', 'd31cd774-b608-468a-89a3-e1accd1211af', 'UNSOLD'),
('d95b5238-9321-44a6-bf06-185e5c4f963d', '75ae93c8-687f-4498-ac03-d58cb242982c', 'UNSOLD'),
('17e2248a-6b45-42f4-a4bb-0e4372ad9a74', '1b92e7ec-4b4f-440c-97f8-879b0c3783f9', 'UNSOLD'),
('306a0798-b2eb-4c8c-90df-faaece83ecb0', 'e45564c4-ab27-42c2-bdfe-45ed6265617f', 'UNSOLD'),
('205228fc-2b77-493b-9f10-c455ffb2daad', 'e213d840-e609-46b2-93a4-c7e248c48000', 'UNSOLD'),
('ed30a81b-767c-4026-bff6-2fd32ae5f296', '6966424d-7d16-4c2c-ac04-2225034f3c55', 'UNSOLD'),
('06e9c92c-e0e2-4f12-b16d-2fed9391fefe', 'b1db490c-c91e-4633-898b-619748480b55', 'UNSOLD'),
('f2b1cad2-4756-4cfd-a7fe-d60e16c0eb3c', '52995a1a-5a43-4ea2-bca6-381b6fd48ae8', 'UNSOLD'),
('fc39192f-3ab0-4c97-84b5-27693df1b75d', '97150dd1-5131-48f5-a9cc-a0dd339669be', 'UNSOLD'),
('672d258e-43d2-4c19-89e9-335a2c69b63b', '5a804a46-d4de-435f-a733-44aa75984ce6', 'UNSOLD'),
('ecae9d8f-ec34-4a57-8057-04e6ad9f2604', '63c1b1bb-31f0-4867-85d2-1afabada81a0', 'UNSOLD'),
('d4878cda-3413-4875-9c85-220442aa2308', 'b9109e31-38e8-4907-b6ee-e7e8dd212ba6', 'UNSOLD'),
('54c6a5c6-48fc-40a6-814e-d8c5d8eae23f', 'dd45b5ce-9fb4-4232-89d8-60eac8870ee1', 'UNSOLD'),
('502cd602-ba46-49b3-ba7a-96535e3147cd', '5d9902ec-05b9-4926-a881-7e224327c825', 'UNSOLD'),
('48da1266-91d4-46fc-89b1-9ffcfe3152ec', 'cbd6470b-9a45-417c-86c6-2c4f298d0b60', 'UNSOLD'),
('6c844469-1ab8-44f1-a9ec-de562646d657', 'a2be8a68-8081-42e9-938c-bc330a5a9457', 'UNSOLD'),
('ff10392f-5bde-422c-a813-2011cdf9395f', '1f5038d7-2416-402e-ba68-23d5d84a8387', 'UNSOLD'),
('3efa47d0-b7b7-43fe-bfb4-e8b8d69b17a6', '8d4d8528-6cf2-45eb-945f-23ebadca20ef', 'UNSOLD'),
('ef3b428f-9ba8-4732-b101-2a06b5599500', '5f6413c2-86e0-4ebc-bbd3-c0a52f54882c', 'UNSOLD'),
('7c3afba4-99a1-4ddc-a902-4407c03f5f23', '26c0438c-34bc-4f63-88fb-503b08fbec19', 'UNSOLD'),
('a91b4b39-648d-4b7a-981e-c1817418911e', '7b6f17c8-4723-4f61-8537-d3b3aef2c674', 'UNSOLD'),
('e69a88dc-af18-4bbb-b064-cb23b810bae6', 'bd45c358-93c0-4dcc-95c6-846b357c1b06', 'UNSOLD'),
('0c99733f-b3b1-456b-9e4c-6d7bf0736190', '21acad53-40fa-44bf-a137-5c20e4de0ef0', 'UNSOLD'),
('9f0439fb-a034-4117-9db2-ede7c8192062', '7d7f0f18-3491-4a50-aed5-1e12d2579053', 'UNSOLD'),
('1450b862-57cc-447b-87ab-f24a2d76ddbc', 'd6d7b1d8-2ae7-4457-860a-0a823c4e3f3e', 'UNSOLD'),
('02c7d7ab-4b9a-44d4-a5b0-9e8eaef78019', 'c8dd33eb-9811-4444-ab3f-df25a69666cc', 'UNSOLD'),
('4d5c0915-e08b-415f-8ae1-bc7000074b04', '58220176-891e-41e0-90fc-45f5f453e2f8', 'UNSOLD'),
('a927d068-9b60-46a4-b640-410ea16c76fb', '0fe499df-06cf-44a3-a5f9-c7d1531013b1', 'UNSOLD'),
('8372d156-6b0b-443c-a733-5f41491ef6da', '323f37a7-05e7-42dd-8a77-a8db42a19cfe', 'UNSOLD'),
('e3ab497b-ac9c-43b0-8c5c-34e145a13330', 'a1e80571-0350-4f99-bb16-971430df2e75', 'UNSOLD'),
('20ebb759-b5e3-4d56-aceb-9a7e89f83947', 'e18d7183-a759-42ae-8791-94977b585e5b', 'UNSOLD'),
('e1e1e567-7121-45f9-a234-1e6e246a6539', 'f61b4207-d4fd-4862-a93a-6e4f215edc0a', 'UNSOLD'),
('d7ab24c4-1547-4b52-9c61-6028af15c540', '20aec5c8-4359-4a58-ba67-79599fc0c49b', 'UNSOLD'),
('6f8f3da6-e1c7-4f7d-bcaf-5a1c18be8d88', 'ab21cbdd-c385-4d8c-b215-ffa6bfdbf0ae', 'UNSOLD'),
('a93fa944-cf4c-4171-b0ac-dc4137ac0e85', '78b6e935-efab-4f2a-8bb8-29b0a02ee71c', 'UNSOLD'),
('7b947b44-565b-4b51-8b82-894586fbe74a', '213d38f5-1cce-47b4-958f-deda86611d3d', 'UNSOLD'),
('55556c5c-3b20-4c14-8bfb-5ff61acca2b9', '182c470a-c07a-42b0-ac03-32b926254a2b', 'UNSOLD'),
('6c973a37-0445-40e4-aea3-e600f6e70fd0', 'af3d8efd-93c9-488d-bca8-847551e659f4', 'UNSOLD'),
('86ab748c-c499-4185-85e4-2781fc87ebab', '3cc45f8b-f6c7-4e7e-a424-59226bc76361', 'UNSOLD'),
('767f4cc7-20dc-4f29-85d2-7833e7a4d50f', '057ff7af-0c83-462f-ae44-8369f7cde15c', 'UNSOLD'),
('7f191b6a-628c-40e0-9471-007054d9436d', '4f87651e-3be5-4da2-b2b7-3ae810c83771', 'UNSOLD'),
('9e62e316-05c7-4427-940c-f595f001fa52', '57c7e042-ccdd-4df4-9217-c315b8e3c7a8', 'UNSOLD'),
('12179331-cfd0-49f0-b57b-fbe40f69ac6d', 'db479358-d17a-46dc-8e65-9877c808e7e4', 'UNSOLD'),
('81ed0e3d-d270-4d09-a32f-15ce55bcb14c', '480b6b70-2a12-46b1-b31e-6db333603913', 'UNSOLD'),
('491255cf-2833-4cd5-897d-7e80f5b9a7cf', 'c47ebccd-70e1-4e36-baf8-4a95a89ec0d3', 'UNSOLD'),
('0fd1ff70-fb1a-48a9-9881-13768a60651f', '39195b76-fddf-425c-b934-c9fc5aeadd0e', 'UNSOLD'),
('f9cda7e4-9a04-4d11-bcb6-b3a786df74b3', '2ebda397-44fe-48db-8fb7-d0f206865e35', 'UNSOLD'),
('19e84436-aeed-4b11-a07c-1316a619405f', 'd7d31283-5509-4088-b1e8-baa5becb85f8', 'UNSOLD'),
('17214515-9df3-4c45-a822-8dfb5d30d14b', '2af01b53-bed9-4738-8392-3d372c8d2182', 'UNSOLD'),
('8d186510-0669-43af-8586-e5c3c633bbc6', '04b4dff6-c27c-458d-bbe8-e1d68c1e312c', 'UNSOLD'),
('c833d759-e00c-43c0-a67e-d9d18dccf0b0', '2ddee932-209e-4e13-bce0-191837556807', 'UNSOLD'),
('e41aa7bc-92e1-4c3b-89c4-11159f456405', '6de778d5-e2ea-4345-965d-18409ba46e9d', 'UNSOLD'),
('42f9c626-aa48-4019-a580-2116c586c7b2', '31d598ea-b3a1-4432-8654-ba1daf9bd17b', 'UNSOLD'),
('6c85ac28-9ede-42cc-9d61-9f634ff1ee80', '58d4105f-b154-4c97-a647-78fe9fc7bf16', 'UNSOLD'),
('e4538c7b-0901-419d-aa2a-ce23e42dc33d', 'b5954556-0e6d-4a6b-989d-170abf319e81', 'UNSOLD'),
('40af578d-b50f-4752-b170-6fcb1105e951', 'c45ee110-1e0b-4f63-8503-3d991bcbb2e6', 'UNSOLD'),
('a6a37fea-0118-4795-b7ac-b2b741893672', 'b39c326b-1bf5-4709-b1af-e1fd28955312', 'UNSOLD'),
('f9420617-b054-4eec-9f6e-6da663c783fb', 'ac96ed0e-7472-42d7-8897-1d0eec7cd9de', 'UNSOLD'),
('55e0915b-0ce8-4e4e-9af9-8798929606f0', '4a568d02-7d83-4860-bb32-35bfbb1e1b12', 'UNSOLD'),
('3f2b4bfe-7fe6-43fa-94b3-2e46ab1ec7ca', 'f096b2da-cfdc-4346-9799-c053cbfd671e', 'UNSOLD'),
('c5c94e5c-97b3-459e-ba21-75e431554ade', 'f627f4c1-8ea6-417c-a37f-bae3d62c22ca', 'UNSOLD'),
('1becbb3f-52a8-4266-9f39-d78a1844e077', '99608d48-e21c-47db-85a5-c85b767a7208', 'UNSOLD'),
('1a19063f-1b84-40f3-a0d1-ee11d31daba9', '06321a63-afc4-482a-86df-351aa8168251', 'UNSOLD'),
('d1fdfd3c-0039-42de-9838-47c63ed1cc4c', '540e90bc-249a-452b-a82b-ce853ea71116', 'UNSOLD'),
('12a0e07a-d655-4fd9-a86d-1ca283836612', 'aba3838d-66a2-4854-a9da-9a538094f72d', 'UNSOLD'),
('46124d67-fd38-424e-9127-3d4101bb8cdf', '3bb0017c-1988-4e7c-b284-c19e08050291', 'UNSOLD'),
('cd1688a6-e463-45ca-b077-2d058dcd6d77', '67696f6b-9e19-438a-8842-4a3c9f11abb9', 'UNSOLD'),
('067582eb-c76b-4e63-b60d-9ed5dd4590df', '6d27da6b-9aed-4c54-89ac-fb357dc217ef', 'UNSOLD'),
('c73c6d7f-9e1b-4f23-9dfe-5cd8ab7e00a9', '90ae4793-79dd-425f-b9dc-c578929d17ce', 'UNSOLD'),
('0ee7ad8f-234a-472a-bd9c-92c44357c97f', '12f59159-f527-4f4b-bdb8-aba361b87225', 'UNSOLD'),
('2c633741-9af2-4695-8a24-4f1239d4b3e4', '4f44144b-67f5-430d-9035-2defbf85094b', 'UNSOLD'),
('21470ee0-e9a0-494a-8563-4ab0cb357f32', 'e12a14af-7c39-4890-9190-12fe1eef1c86', 'UNSOLD'),
('d5faece4-e90b-4ba7-8ad1-5c35b7ee9b73', 'f19b3aa6-695c-4d71-93ef-08f3807e72fc', 'UNSOLD'),
('d6e43b48-ec9c-4544-8d8a-0584fb10e92b', '179e90ef-5db8-4445-9a0a-726fd0c80287', 'UNSOLD'),
('3cfc074d-362b-48a9-b5b2-a09f1fef2170', '9439d4d3-03a7-4c66-b7f8-ae36b565bfc9', 'UNSOLD'),
('6056ab48-219a-4efb-bed4-63e551efa890', '6f6ea6fa-cd30-49f7-a04e-91e918bb92cf', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('4509962e-616c-4fa6-9c36-703560494143', 'admin', '$2b$10$snmtiCl.AX/1Obn8Op74Qe/KwkWa/lDBhHxd4.mubEZY80zDfri4.', 'ADMIN'),
('10d54a5f-8167-4024-8991-62365ec9d42e', 'screen', '$2b$10$8hL8eVshYTIaXq7SRRDYrOVEEEan7SOo5JbXZIATo7yCFqoNMRKCC', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 4', 'PLAYER', '[{"rank":34,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":5,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

