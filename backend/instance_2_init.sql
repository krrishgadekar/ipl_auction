-- INSTANCE 2 INITIALIZATION
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



-- ── DATA FOR INSTANCE 2 ──

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
('76f6270a-01e4-4756-ae51-456be55afec1', 'Team Alpha', 'alpha', '$2b$10$4kD2KSfkYrPEch27S/zjiuXoeuYUu8ru9gnX/EUq18oFNK8F2TPmW', 120, 0),
('9899e61b-0333-41c9-a3a9-bd9788ca1d33', 'Team Bravo', 'bravo', '$2b$10$.vppCt/QM9xAZ0Cwwp7tMuJPOH7Mq0kYGkoAZ4XsLl9it7iyQ6SGu', 120, 0),
('d2f785a1-cb13-42d8-b960-51f5a418dae5', 'Team Charlie', 'charlie', '$2b$10$8gzH.TtOKYMjROoJ9XBZI.PMiCVNXB6oi89sDlokT/bjV.ibzC6RG', 120, 0),
('971f2f1e-c6f1-447a-b732-2380f2ed6da9', 'Team Delta', 'delta', '$2b$10$s18DQuhv0UlP.YT07t3H6uxRf9YfggAlnuBa7DLCOyz5Dkqf6PE2i', 120, 0),
('a1c52b6c-533a-4754-9681-131379840fcf', 'Team Echo', 'echo', '$2b$10$Lp7f9EIHJTCNrHJHVQT25uOuKrE2U2wJ59VRaPjNOFBvvo7TZpOJ6', 120, 0),
('5944ba8d-fef5-4254-a8ac-9740029616ee', 'Team Foxtrot', 'foxtrot', '$2b$10$ikSofdb73TQPu1W73cv46u0QKBnHGJ.JUpyV6jpDdR4q7QggF0zDO', 120, 0),
('935293a8-1c94-4b7d-ace8-980fedcd6969', 'Team Golf', 'golf', '$2b$10$pw6l4fdoIAvb7calfE32J.QX9LdGHCtMp31hJ5.vnWMssB3CiUD6e', 120, 0),
('189c60e6-e09a-41f2-a45f-553eb673089f', 'Team Hotel', 'hotel', '$2b$10$MUMlfdIWQ9jNva3p0vbfEO9KvP2BNftq0vedAgAzPqtGr0tU0.XUm', 120, 0),
('b0e74fc2-e334-48b0-8e4a-abb84146d1fe', 'Team India', 'india', '$2b$10$l9CegBeM9b/oLm52OxzxzOcRxcamjsQifISklNpqSTcy/ONHL2H5S', 120, 0),
('2d103295-11c8-46d2-a4a4-e2429311d1d6', 'Team Juliet', 'juliet', '$2b$10$pXnHG.f6VfX31PW1rU4XKOXxaKFFmYuL75zKA5NKZsknvVBHiAoAK', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, riddle_title, riddle_question, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('17adbde5-7cf0-4fb9-83da-8e0dfcff2fca', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('9e702fbf-6139-4ce2-9ebd-76d4e5a3be55', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('55d1ac91-ebe6-4988-b140-686c5a8fe6e1', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('0836b959-ca51-4307-85a0-82e6516a43ee', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('804e4111-c897-44c7-861c-8d904e4f78a5', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('306d91fc-253c-480f-906d-34d980a2202f', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('21a1ed05-777e-4281-abd2-ccd33c921f81', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('315e7c73-c637-4d02-a52d-7f29d01d2827', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('30e4a95d-063d-49a7-ac00-787029fbcd7e', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('81ee7813-3abc-4746-b540-b88952cce1a8', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('ceccd6ba-751b-4205-88d2-e14717e176f4', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('149accdf-b43a-4b12-8399-426119ebed1a', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('93dfbae4-a8e2-48d2-98fd-546df0358b20', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('aeb73827-0557-472a-935c-78f3245f6d80', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('04565193-c123-4ece-ae88-a1283ff03e5c', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('11617094-b199-4f57-9b80-a557b359e14e', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('0030e119-0618-4fe9-aa62-c9a63ab44edb', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('add1c921-9304-44a6-abfb-b0d30afcc4eb', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('b1923e85-c29b-4d40-b45a-53f0b6210380', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('3703b284-5df7-407c-830a-b2e16ad21459', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('88d14caa-d51f-4bba-9faa-a47e9fe518e7', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('72e3f314-58c6-4a1b-a74a-d8c5ec853953', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('67eac1f0-cfae-4701-bc6b-100b88e84c63', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('75963310-f9b8-432e-a50e-1414e4151ecb', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('b015e54e-b3be-493f-9d17-9ff5c5b7e60b', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('0ae261b7-b916-44ef-b2a2-118f82571c92', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('2e5d4319-f6b6-4ec9-bcdc-4b0b89c42162', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('703baa3d-abdf-411c-96d8-9abc12ef0b70', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('a0dc511c-2b01-41d9-a9ed-cc8b57cd09a0', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('a6c69ba1-b4ee-4118-8ddd-1d4b80062672', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('0c32f167-3e0a-4181-bd8c-6ed32cc9a2f4', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('86c69e67-5ff0-4d72-bcf7-bf14300501fd', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('6fac19a1-8eb0-49e7-97e4-65edc7afe9e6', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('4b3f50ef-cf85-41f5-a46c-503878f02f77', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('a56510ce-7fcb-4fdf-bd48-d6be35d002e1', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('40566d48-1440-4994-ba91-80376303302e', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('adbad11b-c79f-4239-8b8e-65614e4407f5', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('668a91a8-da32-4484-8d5e-dd9636b93965', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('96aa5152-0098-4090-8ccf-b02243d37332', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('3e12dbcf-23cf-45b7-84e9-0b45e8614715', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('91eb818e-e0ad-421e-8502-519054caf54b', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('df07886f-2855-433e-984a-cc39c0073873', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('13bf1bef-75e7-4008-9c1f-b9d48a547c6b', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('539eb668-1552-400e-a48d-121d3f55c270', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('81ca165e-e145-406a-9d7f-50c96581d987', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('5b032149-4db3-4975-b8ea-b411317d8d22', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('a266989e-3711-46b6-ac0d-d44b8bf12588', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('fbbea6ac-2a6a-4866-945a-c216b2ac6fe9', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('9bccf042-e2c8-4e61-8f14-2074c54236e6', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('3a734c1f-a834-4c5f-a702-ecf613986b51', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('5b54701a-065a-4929-bce7-0ac61127a87a', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('0ea1cf31-5e14-4e7b-8606-a4b9365053be', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('cc32f95a-d0c8-4569-bb54-a1ca0ec4c314', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('6107ac2f-ec87-4b6e-a6c8-c77cf941165d', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('89637260-bf24-412d-aa3e-ee91179a65c1', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('27937943-0594-4066-b63f-db4b7efd0f14', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('b00ca6e9-99d9-4adc-8c20-d31ea509f12e', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('ef1123a2-e4c0-441b-b19e-8f88024bec5f', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('ae927bf8-91dc-4fc8-9ecb-8356d11e17d8', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('a26b9bd4-4818-4756-8bbf-b8f37665b7eb', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('d8eb9c3e-70cc-47ac-b115-e34263084881', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('1ccd157e-5f85-46ba-b5da-f8ad4ab54d45', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('9ac49490-7ef0-4960-b4d0-045e2f44159c', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('99bacf2a-f6e6-4e3c-b93f-754f469904bf', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('747c0b1f-90bf-40fd-b1dd-6f579da4f112', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('3e0582b4-43ad-45d9-a777-9261993daa47', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('14a4814f-b29f-4062-ae24-6f00dd3fec78', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('e7dfc509-013b-4d59-8966-45aea8c9bff7', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('29abec44-4f68-4330-a1d9-75578fe55a33', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('a870fdfb-ba4c-4e0a-b8c7-c8db730ede6e', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('686978e6-2ec1-4986-b36a-d6c5440b1808', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('eeeb69eb-0d34-4e19-99ac-2bc4c361c3ea', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('94a9722f-ca2b-4f49-8d8c-82944694adad', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('2db2ea6c-31a6-40af-9ff3-cef0ae85de8c', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('0de4f3ad-ed82-4719-9334-8a588589a3fa', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('f071e2da-0b83-47df-b324-22d55e88dfd1', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('b5320a06-804f-4804-a692-79c3f4718da4', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('8e44833a-f803-4104-8d39-02d739cd1886', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('da46d085-3edc-4ff2-bcb2-ff73d2fa1d57', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('5518db08-af8f-48d5-a83b-ac15b530c54d', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('694df860-9ec0-43ed-9c94-0c6f2e263542', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('cd4c894c-ccc9-40a8-8ee6-888175e7a1d6', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('c1eb91a0-9b34-4764-a01c-c47f8fe0b12c', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('c5955d72-a0f3-4d52-bba7-293a2f526b82', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('316b61d1-e695-42ac-9d5a-f5be02a59be8', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('8eea2da0-81f1-4e29-bc00-bd338acf70f2', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('ae339170-6be1-4e4a-87a1-56ddb7d272bb', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('7deeae33-86ea-45fa-a701-72bc2cb56784', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('b28a2346-5e88-4c0b-a2d7-d5a7a76d3c7a', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('1a2579b8-7373-40e4-ad34-a5c9fc122a2c', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('5f72241d-a7d3-40ec-a5d7-f3e46cac251f', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('79b69ff8-66e3-44e7-855d-faf18fb4ea14', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('9bc04ebc-c4d8-4a9d-9338-8291768be116', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('acc622b0-2832-4df4-9d06-922a99c79f24', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('3633ac2e-df9a-46aa-9449-e782cf5f8900', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('f5acc84f-a6cc-40f2-8e1c-c73412752f4c', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('94a40944-b110-4134-8268-57e757c73db6', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, true, 'The First-Over Menace', 'I’m a smiling Kiwi whose absolute favorite hobby is completely destroying top orders in the very first over of a match. When I’m forced to hold a bat, you might catch me busting out my legendary "flamingo" defensive shot. After spending a few seasons causing chaos in pink, I am finally back home to lead the pace attack in blue and gold. Who am I?', 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('d8872499-f857-4563-aa0d-5f6b911c3a52', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('d048e270-7723-4559-a724-5f4d6700e7c9', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('f8b5098e-7cf2-4f2b-92c8-af9c68dec5e5', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('ba583a09-164f-4e8f-94a2-69f188f3586a', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('40b7b404-9279-4196-abe9-2c9189fdc776', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('256687f5-e5f7-4c19-aba4-1ecb8e0dec12', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('7cfce812-818b-49cb-ac38-9d7c6117a5b9', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('4e80e6c3-7ae3-4e02-89ac-5fe425f4bd87', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('11c48737-6bec-4f5b-bf7c-9277ecaa20e1', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('46cc42f5-c901-41fd-8024-87cf5a1d05b9', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('c9f66af5-8b09-4166-a4f5-e8b40779d54a', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('e29ae618-d739-455a-9524-5f66d824e57d', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('912452a1-3486-49b8-9377-67faf4be7e43', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('acf11b5c-49ec-45f1-a827-465494194cf5', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('3731a4bf-261c-488c-a148-4742f53dbf39', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('ee939bab-db75-46ae-a0e9-d99f8b5c467a', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('e7eb511f-e0e1-49af-8a7a-279c1817067e', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('a4e10462-f0d6-4531-9ab1-a8f906f2fa73', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('00b89b74-2af9-486d-ad5b-79ab4c1fe3ce', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('4d70a086-c157-4bdf-833f-ad80a807b2c1', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('a1f29d1a-8cb3-44ea-9cb1-142a6a1cefe0', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('361f02d1-7292-428a-b2ac-c3fbc1e65320', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('f0bca373-e5ca-4872-8ca4-b6ba43333a4e', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('e43f0629-ea58-4e93-929e-c059176c9dc1', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('ffbbb9e8-2868-4b1f-8d8c-fd930760ffed', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('35ea9be4-131a-4d28-8bb3-007f9745583a', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('9971ed53-d932-4b5e-b9aa-5fbbad2deb1b', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('7d98f317-4e4c-447f-bcfb-b4dcf5cae254', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('a42d3395-8bca-4829-88d6-40f7ee364a8f', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('0f3a5c69-2451-40f4-82b1-166e2a60182e', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('922bc4a4-8a7d-460a-ba28-45f4a8a930e8', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('d458310f-5d4d-472f-9b11-76b5076a6c8e', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('9012617e-2caf-42ea-897f-03ebe8b61879', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('b4a88bda-fc69-4c9a-b3b1-ae432f2555b0', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('f8f8f1c3-e795-4245-8d8a-2133d63b96a9', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('85fed5cd-a5a9-4fb9-b401-1b842a993bed', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('274cd8d9-4873-47ea-8aa1-76993a9092b2', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('fd8cf7ac-620e-4c76-b89b-177dbd2eb1f4', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('01a3cff7-6b12-4139-8adc-a925930fe4eb', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('4bab5c0a-1e0f-4e45-8657-735811482713', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('726fc391-be1b-4095-ac62-33a625795131', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('491b54f5-0548-4912-9d8c-59ac433b53ff', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('69074275-2086-47b6-aefa-b0c9557e3b46', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('1e07497c-6050-45dd-bb96-b9bcd9d04f3f', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('02bdfd5c-7be3-4c3b-86e0-e9915a9e934f', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('11e59559-657c-477c-801d-843692174907', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('065fe261-9c7e-44dc-94ad-11be859e7a42', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('0b3da46b-986f-4d44-b019-03b6c93496a2', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('f1387338-bf86-4e21-8a9a-12446b40cf9d', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('b3d893f1-87ce-401f-b265-b4864802a07f', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('928751f1-0630-4205-b373-467b066b9b71', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('3ce2cbd2-c5e4-473e-bdb4-056a2f39a90a', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('711a8272-a75a-432e-ba62-1ded7f43f3e1', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, true, 'The ''Strike Rate'' Debater', 'I have one of the most elegant cover drives in world cricket, but I’m equally famous for sparking internet debates about whether "strike rate is overrated." After dealing with a rather public, animated scolding from my former team boss on the field, I’ve left Lucknow behind to open the batting in the Capital. Who am I?', 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('dcfa0f36-84a5-4955-a847-8e00e9465b3c', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('e9f7efa9-ffe6-427e-add2-06ac1fb6a4e1', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('c0ce6740-d21d-40fe-a040-c2a839b14af9', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('6717cf7d-cb90-4a98-bcba-b9029cc4ddf7', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('896ce1c9-3f20-424a-8a3e-9fbcb8d7b183', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('5e828f09-bbff-451a-a985-608d57ee7d4c', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('f052ce66-a8b4-4ddd-9627-c22fd997a935', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('ad6efe70-53a0-41ff-83d0-aa557598fd64', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('6b32f52e-7d7d-4197-bcf4-cafa5193c085', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('ecdf9763-a9e2-4a4b-94c7-d2b6976d3a83', '17adbde5-7cf0-4fb9-83da-8e0dfcff2fca', 'UNSOLD'),
('5f0d83ce-d4cf-4b96-a356-d98568e725d9', '9e702fbf-6139-4ce2-9ebd-76d4e5a3be55', 'UNSOLD'),
('8655f7e0-b9e4-450a-9e94-2caf4b796064', '55d1ac91-ebe6-4988-b140-686c5a8fe6e1', 'UNSOLD'),
('ba9e0fa1-1938-417f-bbe8-0b2dfcfff770', '0836b959-ca51-4307-85a0-82e6516a43ee', 'UNSOLD'),
('c1d3d508-46ed-4cc8-89bf-253a96715de9', '804e4111-c897-44c7-861c-8d904e4f78a5', 'UNSOLD'),
('de116927-897c-4a14-bb8d-e9dbfaccb025', '306d91fc-253c-480f-906d-34d980a2202f', 'UNSOLD'),
('63993cd1-4c00-4f65-8e27-2a986d0be52c', '21a1ed05-777e-4281-abd2-ccd33c921f81', 'UNSOLD'),
('d98561d3-63c4-4c03-a23b-6a30cc8b914b', '315e7c73-c637-4d02-a52d-7f29d01d2827', 'UNSOLD'),
('4b1f8db4-113e-40f6-a4f2-6e1ed7917c22', '30e4a95d-063d-49a7-ac00-787029fbcd7e', 'UNSOLD'),
('2c445e25-dcb4-4608-b9c2-c4e787f21a3e', '81ee7813-3abc-4746-b540-b88952cce1a8', 'UNSOLD'),
('a61d8c3c-ee63-4a0e-b422-f0900c925db5', 'ceccd6ba-751b-4205-88d2-e14717e176f4', 'UNSOLD'),
('41ef8b4c-c0ba-4520-b106-7afc2498cd59', '149accdf-b43a-4b12-8399-426119ebed1a', 'UNSOLD'),
('85828e2c-a04c-4460-a11e-25e4e7186174', '93dfbae4-a8e2-48d2-98fd-546df0358b20', 'UNSOLD'),
('6f451287-b2eb-46fa-b4a3-2997771eb5e8', 'aeb73827-0557-472a-935c-78f3245f6d80', 'UNSOLD'),
('88dc27a4-d68c-4a01-9664-22948784bcda', '04565193-c123-4ece-ae88-a1283ff03e5c', 'UNSOLD'),
('1569f4bc-6638-40e8-a7f9-dce56f76c96f', '11617094-b199-4f57-9b80-a557b359e14e', 'UNSOLD'),
('90bc053f-987f-47a3-b513-6117198cf332', '0030e119-0618-4fe9-aa62-c9a63ab44edb', 'UNSOLD'),
('18c66a96-d1e9-445c-8a21-bd7924ae2fc8', 'add1c921-9304-44a6-abfb-b0d30afcc4eb', 'UNSOLD'),
('0e3c6fb9-ae68-4f9a-b9f5-c43c777d73fc', 'b1923e85-c29b-4d40-b45a-53f0b6210380', 'UNSOLD'),
('d937870e-d449-43c7-8d78-2bf8c92a2dc4', '3703b284-5df7-407c-830a-b2e16ad21459', 'UNSOLD'),
('6692beb7-7f47-40ef-9a50-a1efb959a8ec', '88d14caa-d51f-4bba-9faa-a47e9fe518e7', 'UNSOLD'),
('d79b1c2b-2de3-4370-a419-457ff18269d3', '72e3f314-58c6-4a1b-a74a-d8c5ec853953', 'UNSOLD'),
('3d1e7bc5-3f49-45de-aeed-05d51bb37f01', '67eac1f0-cfae-4701-bc6b-100b88e84c63', 'UNSOLD'),
('4381838f-3a03-4ad4-ae5e-c6546fa0a290', '75963310-f9b8-432e-a50e-1414e4151ecb', 'UNSOLD'),
('cb91858d-0d81-4dcd-a071-6502c25fc143', 'b015e54e-b3be-493f-9d17-9ff5c5b7e60b', 'UNSOLD'),
('9a277698-469b-4a1d-adfe-fd1ea961d660', '0ae261b7-b916-44ef-b2a2-118f82571c92', 'UNSOLD'),
('09571aaa-2229-4d23-959d-6b1c7f41fc54', '2e5d4319-f6b6-4ec9-bcdc-4b0b89c42162', 'UNSOLD'),
('8d966e78-cfc6-499a-89b7-038dbdcd83a9', '703baa3d-abdf-411c-96d8-9abc12ef0b70', 'UNSOLD'),
('0300ef3c-34de-45c2-bdf7-45e29defe363', 'a0dc511c-2b01-41d9-a9ed-cc8b57cd09a0', 'UNSOLD'),
('f5c4e627-0931-4ff1-9bb2-783443a7c3f9', 'a6c69ba1-b4ee-4118-8ddd-1d4b80062672', 'UNSOLD'),
('0ce59b39-a73a-450f-a652-8bb6317f3dbe', '0c32f167-3e0a-4181-bd8c-6ed32cc9a2f4', 'UNSOLD'),
('9161f96c-82f2-466c-987e-de61c7c727bd', '86c69e67-5ff0-4d72-bcf7-bf14300501fd', 'UNSOLD'),
('ae5ea584-771b-4c3d-a862-2aae80503201', '6fac19a1-8eb0-49e7-97e4-65edc7afe9e6', 'UNSOLD'),
('d4e2ebb6-8db9-4ca7-9b71-ce39fea6f399', '4b3f50ef-cf85-41f5-a46c-503878f02f77', 'UNSOLD'),
('6c5dbd9b-fe52-4ef8-8cd1-390c6f414d3e', 'a56510ce-7fcb-4fdf-bd48-d6be35d002e1', 'UNSOLD'),
('9a72ac21-f16d-40a6-aae6-55ed5c0a700c', '40566d48-1440-4994-ba91-80376303302e', 'UNSOLD'),
('d9e1b32d-4e61-42e8-975f-8ed4ebb75a0e', 'adbad11b-c79f-4239-8b8e-65614e4407f5', 'UNSOLD'),
('85dd586e-ae4e-485b-ba9c-d54e2f6c5a73', '668a91a8-da32-4484-8d5e-dd9636b93965', 'UNSOLD'),
('2713d080-8f92-4eff-a04b-385d89740f05', '96aa5152-0098-4090-8ccf-b02243d37332', 'UNSOLD'),
('0ebbdc06-21eb-4606-918f-c15737c0d2d7', '3e12dbcf-23cf-45b7-84e9-0b45e8614715', 'UNSOLD'),
('a59fa5a1-bfe8-485c-be6f-24d75908fb59', '91eb818e-e0ad-421e-8502-519054caf54b', 'UNSOLD'),
('26514d3c-61d1-45a4-a64e-434976d21944', 'df07886f-2855-433e-984a-cc39c0073873', 'UNSOLD'),
('499da79a-091f-4b59-bea8-91d145655d14', '13bf1bef-75e7-4008-9c1f-b9d48a547c6b', 'UNSOLD'),
('7f92bd51-841c-4e84-901d-f1dc98a53118', '539eb668-1552-400e-a48d-121d3f55c270', 'UNSOLD'),
('17c1e20f-2d4a-4065-a804-9b72cfc50bd0', '81ca165e-e145-406a-9d7f-50c96581d987', 'UNSOLD'),
('c54e68fa-6dff-42e0-85ed-822df45ad53c', '5b032149-4db3-4975-b8ea-b411317d8d22', 'UNSOLD'),
('43d7dae1-663e-4f1c-ba07-ef718411c75c', 'a266989e-3711-46b6-ac0d-d44b8bf12588', 'UNSOLD'),
('d5a1e5f3-ba5b-4f2e-9ad6-e3dabbf7d749', 'fbbea6ac-2a6a-4866-945a-c216b2ac6fe9', 'UNSOLD'),
('0d5a697f-d177-4b73-8495-5c878a0ccec4', '9bccf042-e2c8-4e61-8f14-2074c54236e6', 'UNSOLD'),
('8dc047bf-c1c7-42a5-b22f-f8040c0ad9e8', '3a734c1f-a834-4c5f-a702-ecf613986b51', 'UNSOLD'),
('aaa5581b-c477-4596-b2a3-2833084dd505', '5b54701a-065a-4929-bce7-0ac61127a87a', 'UNSOLD'),
('7ef73a78-6e45-4d4b-93e1-dbd28296efcc', '0ea1cf31-5e14-4e7b-8606-a4b9365053be', 'UNSOLD'),
('8d164369-78fa-41ce-ae60-7da9e312521a', 'cc32f95a-d0c8-4569-bb54-a1ca0ec4c314', 'UNSOLD'),
('7c83a7f0-7432-46de-b9c8-412d6a704db9', '6107ac2f-ec87-4b6e-a6c8-c77cf941165d', 'UNSOLD'),
('598675e5-e7ba-4422-9d67-47adf44132b1', '89637260-bf24-412d-aa3e-ee91179a65c1', 'UNSOLD'),
('bb2237a2-b143-4942-add2-80035e7074fc', '27937943-0594-4066-b63f-db4b7efd0f14', 'UNSOLD'),
('2c899e46-94ee-4179-8745-1eaad29acb08', 'b00ca6e9-99d9-4adc-8c20-d31ea509f12e', 'UNSOLD'),
('b7522526-6f1b-400c-9662-ba8f45708cfa', 'ef1123a2-e4c0-441b-b19e-8f88024bec5f', 'UNSOLD'),
('5ea13318-b120-4dfc-82b5-19a6673da310', 'ae927bf8-91dc-4fc8-9ecb-8356d11e17d8', 'UNSOLD'),
('6876471b-d15c-44d5-b982-096f2ac65034', 'a26b9bd4-4818-4756-8bbf-b8f37665b7eb', 'UNSOLD'),
('62e62a2c-5abd-46b4-b827-e979ed9ab9b9', 'd8eb9c3e-70cc-47ac-b115-e34263084881', 'UNSOLD'),
('89499e48-e129-4586-a2fa-c2bc8f53e3c4', '1ccd157e-5f85-46ba-b5da-f8ad4ab54d45', 'UNSOLD'),
('f886ce81-dda5-459e-b25d-4f0600f9061d', '9ac49490-7ef0-4960-b4d0-045e2f44159c', 'UNSOLD'),
('9344316e-3635-47e1-836c-8a9c98e36281', '99bacf2a-f6e6-4e3c-b93f-754f469904bf', 'UNSOLD'),
('541c90aa-a8c0-4cc1-a721-92b9029d3949', '747c0b1f-90bf-40fd-b1dd-6f579da4f112', 'UNSOLD'),
('7e8e5c58-89ff-49ed-810c-9ae99ec2a6d8', '3e0582b4-43ad-45d9-a777-9261993daa47', 'UNSOLD'),
('1c9988e5-270b-4451-a8d9-2a0d860671d3', '14a4814f-b29f-4062-ae24-6f00dd3fec78', 'UNSOLD'),
('add1ae9f-f0a1-4700-ab29-5e599a15f6c8', 'e7dfc509-013b-4d59-8966-45aea8c9bff7', 'UNSOLD'),
('11a3e98c-a7a4-40ff-9a64-e9e38fb6c363', '29abec44-4f68-4330-a1d9-75578fe55a33', 'UNSOLD'),
('6cecf93b-7023-4b9b-b387-4fb98ef5dbd1', 'a870fdfb-ba4c-4e0a-b8c7-c8db730ede6e', 'UNSOLD'),
('c412b27c-17e7-4a74-bdbc-d8dfa2f5b7e2', '686978e6-2ec1-4986-b36a-d6c5440b1808', 'UNSOLD'),
('c615f174-3363-42ca-9557-77483d724aca', 'eeeb69eb-0d34-4e19-99ac-2bc4c361c3ea', 'UNSOLD'),
('f1db60a5-027c-40af-9dfd-e127382b4e75', '94a9722f-ca2b-4f49-8d8c-82944694adad', 'UNSOLD'),
('17a912ce-184c-45a3-8f62-28dac3838862', '2db2ea6c-31a6-40af-9ff3-cef0ae85de8c', 'UNSOLD'),
('e604c58a-a079-49a5-9c4c-3ff2b4cce9fc', '0de4f3ad-ed82-4719-9334-8a588589a3fa', 'UNSOLD'),
('4918ba04-73a9-4827-85e7-0c2d67c7ad69', 'f071e2da-0b83-47df-b324-22d55e88dfd1', 'UNSOLD'),
('54a5719b-228d-4c93-a3e6-3c7122f2b2fd', 'b5320a06-804f-4804-a692-79c3f4718da4', 'UNSOLD'),
('1b5b0383-f4f6-4c84-b8cc-a3495c3fd396', '8e44833a-f803-4104-8d39-02d739cd1886', 'UNSOLD'),
('11e0a930-2989-43f6-a784-fd8ad00e3810', 'da46d085-3edc-4ff2-bcb2-ff73d2fa1d57', 'UNSOLD'),
('34e77adc-d834-4e6d-83bc-cc9875d09db1', '5518db08-af8f-48d5-a83b-ac15b530c54d', 'UNSOLD'),
('c8a25b4f-4e2f-4aa8-8452-6d95d657d772', '694df860-9ec0-43ed-9c94-0c6f2e263542', 'UNSOLD'),
('f4562ea7-f241-4823-8291-731435fc485d', 'cd4c894c-ccc9-40a8-8ee6-888175e7a1d6', 'UNSOLD'),
('8431d0a7-c690-4e0d-bb2e-05a3c5d7ef02', 'c1eb91a0-9b34-4764-a01c-c47f8fe0b12c', 'UNSOLD'),
('cff2c096-dd4f-4dd1-a600-01efbcc33bec', 'c5955d72-a0f3-4d52-bba7-293a2f526b82', 'UNSOLD'),
('155cddaf-4ccc-4548-ab46-eb7ae50db941', '316b61d1-e695-42ac-9d5a-f5be02a59be8', 'UNSOLD'),
('cacebfb5-d3af-42c2-b6d2-8753ec5c6593', '8eea2da0-81f1-4e29-bc00-bd338acf70f2', 'UNSOLD'),
('031de16b-bb63-46d6-af55-048a3f66b178', 'ae339170-6be1-4e4a-87a1-56ddb7d272bb', 'UNSOLD'),
('1b18af42-d47f-443c-8d24-bc8f961cd293', '7deeae33-86ea-45fa-a701-72bc2cb56784', 'UNSOLD'),
('47eca2bb-9e9c-49e7-ade8-64868e318504', 'b28a2346-5e88-4c0b-a2d7-d5a7a76d3c7a', 'UNSOLD'),
('22b346ed-96c2-4818-ad7c-61dbf6f6e57f', '1a2579b8-7373-40e4-ad34-a5c9fc122a2c', 'UNSOLD'),
('ae6673dd-634a-483d-b921-0390a1501bb4', '5f72241d-a7d3-40ec-a5d7-f3e46cac251f', 'UNSOLD'),
('804451f1-05b9-435b-bfec-d7b8c2fa05ae', '79b69ff8-66e3-44e7-855d-faf18fb4ea14', 'UNSOLD'),
('8fc2656a-01e4-4263-bf09-50b74f225e5f', '9bc04ebc-c4d8-4a9d-9338-8291768be116', 'UNSOLD'),
('48b85dba-0f85-4d11-87d9-7164c71077a5', 'acc622b0-2832-4df4-9d06-922a99c79f24', 'UNSOLD'),
('9b01c31e-0ca3-4c5c-873a-549295a72fc1', '3633ac2e-df9a-46aa-9449-e782cf5f8900', 'UNSOLD'),
('b62ea733-5d3d-45db-a104-005545382e5c', 'f5acc84f-a6cc-40f2-8e1c-c73412752f4c', 'UNSOLD'),
('e920f13f-97f7-455b-8283-67a0a81da774', '94a40944-b110-4134-8268-57e757c73db6', 'UNSOLD'),
('3befe836-ce11-4dcc-b9a4-d462b18cbbef', 'd8872499-f857-4563-aa0d-5f6b911c3a52', 'UNSOLD'),
('fc9b565f-d2da-4e13-910a-8f03d1c9659e', 'd048e270-7723-4559-a724-5f4d6700e7c9', 'UNSOLD'),
('6c092ba9-ac2f-4367-b6e5-8482a02623af', 'f8b5098e-7cf2-4f2b-92c8-af9c68dec5e5', 'UNSOLD'),
('84e68c51-07b2-4d93-89f1-a35c1099804e', 'ba583a09-164f-4e8f-94a2-69f188f3586a', 'UNSOLD'),
('a571fc27-0c9b-4e3d-9342-6c49b2b43e3d', '40b7b404-9279-4196-abe9-2c9189fdc776', 'UNSOLD'),
('480fbbda-3e55-4a90-a4b1-a42af5e29403', '256687f5-e5f7-4c19-aba4-1ecb8e0dec12', 'UNSOLD'),
('9f03482e-3c21-4169-a8ca-e6622974d0a7', '7cfce812-818b-49cb-ac38-9d7c6117a5b9', 'UNSOLD'),
('9cba3d81-70bc-4638-acba-075735994408', '4e80e6c3-7ae3-4e02-89ac-5fe425f4bd87', 'UNSOLD'),
('f7475a3e-fcc4-454b-a9e2-b8b18b1956ef', '11c48737-6bec-4f5b-bf7c-9277ecaa20e1', 'UNSOLD'),
('1b0a3ff7-2a54-4d2b-a21f-48090d90a6c1', '46cc42f5-c901-41fd-8024-87cf5a1d05b9', 'UNSOLD'),
('81f62bfb-422b-46ba-97c3-f97e325ef434', 'c9f66af5-8b09-4166-a4f5-e8b40779d54a', 'UNSOLD'),
('3080b62b-9e8b-4e7f-bcc5-07acfed22eff', 'e29ae618-d739-455a-9524-5f66d824e57d', 'UNSOLD'),
('eafa2a92-d746-4bc6-9bfc-56bf7aebd979', '912452a1-3486-49b8-9377-67faf4be7e43', 'UNSOLD'),
('ffeafe68-f9bb-498f-bc48-57c1a2add333', 'acf11b5c-49ec-45f1-a827-465494194cf5', 'UNSOLD'),
('6769b0e5-c6e9-4da8-abb5-635a131bccb0', '3731a4bf-261c-488c-a148-4742f53dbf39', 'UNSOLD'),
('fb481240-1637-4a8d-8b4d-13b80bfd43e3', 'ee939bab-db75-46ae-a0e9-d99f8b5c467a', 'UNSOLD'),
('042c4995-e5c2-43ec-b628-5a58f06c7369', 'e7eb511f-e0e1-49af-8a7a-279c1817067e', 'UNSOLD'),
('6a1bd235-0ce7-47b0-a374-070ab03e0719', 'a4e10462-f0d6-4531-9ab1-a8f906f2fa73', 'UNSOLD'),
('fc904fb7-cb83-47b0-b93c-8e8657ee5b1d', '00b89b74-2af9-486d-ad5b-79ab4c1fe3ce', 'UNSOLD'),
('6b87d924-b40b-4ac2-9576-e5dd9a37617b', '4d70a086-c157-4bdf-833f-ad80a807b2c1', 'UNSOLD'),
('af4d309a-57d8-4955-aff4-e14253d8bbdb', 'a1f29d1a-8cb3-44ea-9cb1-142a6a1cefe0', 'UNSOLD'),
('41a8f71c-61e3-43e1-8814-c4c3771c3770', '361f02d1-7292-428a-b2ac-c3fbc1e65320', 'UNSOLD'),
('85bdff36-e494-4560-a188-8669371d133d', 'f0bca373-e5ca-4872-8ca4-b6ba43333a4e', 'UNSOLD'),
('e7387316-e3be-4c23-9314-9400655c8df5', 'e43f0629-ea58-4e93-929e-c059176c9dc1', 'UNSOLD'),
('b63bbaa2-d83d-4e46-9e23-e3952f866197', 'ffbbb9e8-2868-4b1f-8d8c-fd930760ffed', 'UNSOLD'),
('0aa1c55c-a39f-426f-b81b-5d6feef79a2b', '35ea9be4-131a-4d28-8bb3-007f9745583a', 'UNSOLD'),
('cb6c0171-7e40-4791-a2ff-25a7de194386', '9971ed53-d932-4b5e-b9aa-5fbbad2deb1b', 'UNSOLD'),
('6f4d5ee7-60a6-4954-8781-8ce5d1c6e86c', '7d98f317-4e4c-447f-bcfb-b4dcf5cae254', 'UNSOLD'),
('1873bc59-030d-4228-a776-22c606c4cdfb', 'a42d3395-8bca-4829-88d6-40f7ee364a8f', 'UNSOLD'),
('f038c964-04fb-4b91-9aea-91ef290ce7f5', '0f3a5c69-2451-40f4-82b1-166e2a60182e', 'UNSOLD'),
('3892cedd-f8b6-45e7-9583-4848eadb3a54', '922bc4a4-8a7d-460a-ba28-45f4a8a930e8', 'UNSOLD'),
('f5db6ba8-b636-4009-b061-797b8e1646b9', 'd458310f-5d4d-472f-9b11-76b5076a6c8e', 'UNSOLD'),
('6e0876c5-3f4c-45d2-b848-139c2401b3e4', '9012617e-2caf-42ea-897f-03ebe8b61879', 'UNSOLD'),
('d8885bd3-dc7d-4eb2-bfca-93c9222f0e1c', 'b4a88bda-fc69-4c9a-b3b1-ae432f2555b0', 'UNSOLD'),
('e69ab080-cc6a-477c-bf42-26a87db29cd2', 'f8f8f1c3-e795-4245-8d8a-2133d63b96a9', 'UNSOLD'),
('ad1ca8ce-a9cf-40a5-b9e8-cdee01930b80', '85fed5cd-a5a9-4fb9-b401-1b842a993bed', 'UNSOLD'),
('53c9e727-1d84-428a-bd3b-28b540e7437f', '274cd8d9-4873-47ea-8aa1-76993a9092b2', 'UNSOLD'),
('6d7485e5-07e2-47cd-9835-d9a9091b6eac', 'fd8cf7ac-620e-4c76-b89b-177dbd2eb1f4', 'UNSOLD'),
('4bbf8e62-fd13-456f-8115-395e41fe361d', '01a3cff7-6b12-4139-8adc-a925930fe4eb', 'UNSOLD'),
('d3aae832-8e9d-42e9-8612-2b0483b0d97f', '4bab5c0a-1e0f-4e45-8657-735811482713', 'UNSOLD'),
('622653d8-2061-4c75-badb-a2cc20c5135e', '726fc391-be1b-4095-ac62-33a625795131', 'UNSOLD'),
('11a5b5c0-367b-4b7d-b246-f2dde101f4d3', '491b54f5-0548-4912-9d8c-59ac433b53ff', 'UNSOLD'),
('8e3594cc-de07-46c1-9c37-c25027e5c2a8', '69074275-2086-47b6-aefa-b0c9557e3b46', 'UNSOLD'),
('dd16d97b-76eb-4a21-b155-af5439482bca', '1e07497c-6050-45dd-bb96-b9bcd9d04f3f', 'UNSOLD'),
('63db3415-3ef1-4699-bc55-e3d5dea06baf', '02bdfd5c-7be3-4c3b-86e0-e9915a9e934f', 'UNSOLD'),
('f1e69aee-f383-4a67-8e11-8b9a9fcea197', '11e59559-657c-477c-801d-843692174907', 'UNSOLD'),
('e1c9800a-0436-490a-8ccb-efdc71edec8d', '065fe261-9c7e-44dc-94ad-11be859e7a42', 'UNSOLD'),
('7a0917d9-7e06-499b-aaa3-36bd8a7a97fe', '0b3da46b-986f-4d44-b019-03b6c93496a2', 'UNSOLD'),
('94c0004c-618e-4f0c-86d2-b116a44d07bb', 'f1387338-bf86-4e21-8a9a-12446b40cf9d', 'UNSOLD'),
('76a00fed-a139-4a2f-96c5-59552ec8dc81', 'b3d893f1-87ce-401f-b265-b4864802a07f', 'UNSOLD'),
('39513232-393d-4c01-8372-e9ef1b3f3259', '928751f1-0630-4205-b373-467b066b9b71', 'UNSOLD'),
('82bbcbf7-1f79-4af1-9d5d-62a573f7fdf7', '3ce2cbd2-c5e4-473e-bdb4-056a2f39a90a', 'UNSOLD'),
('47decec9-f6fb-40d6-8559-5911912d1127', '711a8272-a75a-432e-ba62-1ded7f43f3e1', 'UNSOLD'),
('f9c440fa-435b-4c2b-a5c8-8ac8dd4b7814', 'dcfa0f36-84a5-4955-a847-8e00e9465b3c', 'UNSOLD'),
('b0846f9c-f327-4fa3-badb-42cc51aeb071', 'e9f7efa9-ffe6-427e-add2-06ac1fb6a4e1', 'UNSOLD'),
('0767b16b-54b1-40a7-8c42-c5598ac91b70', 'c0ce6740-d21d-40fe-a040-c2a839b14af9', 'UNSOLD'),
('87a19f08-13af-4cb5-8e5c-0e8f13bf424b', '6717cf7d-cb90-4a98-bcba-b9029cc4ddf7', 'UNSOLD'),
('9b78014c-8de7-4978-9ff9-94a3d064e71b', '896ce1c9-3f20-424a-8a3e-9fbcb8d7b183', 'UNSOLD'),
('0c46246d-e932-4752-affe-df762c2de475', '5e828f09-bbff-451a-a985-608d57ee7d4c', 'UNSOLD'),
('18c218a8-65d1-4fe1-8fa6-ae390d93ac4f', 'f052ce66-a8b4-4ddd-9627-c22fd997a935', 'UNSOLD'),
('9a0945f8-5814-4dfc-8f0e-0e8bbdfdd590', 'ad6efe70-53a0-41ff-83d0-aa557598fd64', 'UNSOLD'),
('c741e65b-f41f-4590-b46a-1818766b84e0', '6b32f52e-7d7d-4197-bcf4-cafa5193c085', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('302332e0-ff2d-4cf8-87f6-1158fcf37c4c', 'admin', '$2b$10$yNe.wx.dwg3snqTB4SJVp.EycCGJOEEBQANJBRwihcJp88jSi24RC', 'ADMIN'),
('822efe35-66af-4f5c-958d-45e6b4651ab2', 'screen', '$2b$10$eOwdgYjGgEXhDebUPIf2IO4PW903YIZskM4Wn1o8GkQPIcbBAqLse', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Franchise Sequence', 'FRANCHISE', '[10,4,3,6,7,8,9,1,5,2]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(2, 'Power Card Sequence', 'POWER_CARD', '["FINAL_STRIKE","MULLIGAN","BID_FREEZER","GOD_EYE"]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(3, 'Player Sequence', 'PLAYER', '[131,134,149,69,81,66,26,34,84,23,116,155,123,124,142,148,101,94,119,76,135,115,147,19,43,1,80,30,68,85,109,118,100,58,7,120,122,128,130,64,121,144,24,42,137,133,141,88,74,60,29,106,159,59,97,49,92,78,151,47,82,77,140,98,72,62,102,63,5,136,93,71,146,153,40,113,48,4,139,55,107,36,143,99,41,152,20,54,95,32,103,111,38,90,79,96,12,86,158,46,104,75,18,129,57,105,89,154,44,16,117,39,108,35,8,33,67,13,125,150,52,138,31,126,157,87,10,114,73,83,2,25,15,45,56,53,127,11,156,21,51,65,28,112,70,22,61,17,91,9,50,6,132,145,3,27,110,37,14]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

