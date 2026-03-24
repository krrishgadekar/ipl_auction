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
(1, 'Chennai Super Kings', 'CSK', 50, '/teams/csk.png', '#FCBD02'),
(2, 'Mumbai Indians', 'MI', 50, '/teams/mi.png', '#004BA0'),
(3, 'Royal Challengers Bengaluru', 'RCB', 50, '/teams/rcb.png', '#EC1C24'),
(4, 'Kolkata Knight Riders', 'KKR', 50, '/teams/kkr.png', '#3A225D'),
(5, 'Sunrisers Hyderabad', 'SRH', 50, '/teams/srh.png', '#F7A721'),
(6, 'Rajasthan Royals', 'RR', 50, '/teams/rr.png', '#254AA5'),
(7, 'Gujarat Titans', 'GT', 50, '/teams/gt.png', '#1D5E84'),
(8, 'Delhi Capitals', 'DC', 50, '/teams/dc.png', '#0078BC'),
(9, 'Punjab Kings', 'PBKS', 50, '/teams/pbks.png', '#ED1B24'),
(10, 'Lucknow Super Giants', 'LSG', 50, '/teams/lsg.png', '#A72056');

INSERT INTO "Team" (id, name, username, password_hash, purse_remaining, squad_count) VALUES
('9c1ca0ae-1c88-4d53-ae32-04404f56c59e', 'Team Alpha', 'alpha', '$2b$10$UgNRuroAiYx2gRUBSCdzI.3rZtfHAk0HSwxmtxq6gZjFIqtFsf9YO', 120, 0),
('49c7cf72-b149-427b-b524-30968bf70aa2', 'Team Bravo', 'bravo', '$2b$10$gZg2pYo4a2WmZVpD0onEcuzqQC6OFYxP.8e.zQWtp9BLhsCEzrStK', 120, 0),
('50f4c202-825b-495e-8b21-92b7ecf5d4a8', 'Team Charlie', 'charlie', '$2b$10$ibnmeuYilNILwAMcGpcfjO81rcZFNF7Kk2zWjt8QekPHFlRaAipEm', 120, 0),
('1add2374-de2b-4c7a-8f1b-a5664faf52b9', 'Team Delta', 'delta', '$2b$10$IbxFAY44NPb3oWiXyuGRmejjje8w1ggS/3uhS3dV1Tb0wQyX57Ye.', 120, 0),
('2eac3fc3-4c4c-4533-b9f8-1b6884681616', 'Team Echo', 'echo', '$2b$10$uNXh3.QgDNnCAzINQLmEleCw8qgEODzjRKrDmwZ0fiN7Xm8Qpii9.', 120, 0),
('da7ca742-907a-441d-91a8-bb8d9a8e1cdf', 'Team Foxtrot', 'foxtrot', '$2b$10$2260RFAgZCGcse3kOc17Hu4iXY9RR51xMhJ0SS8G1D1Q7ixCnSRd.', 120, 0),
('60a0078b-496c-45f1-a125-b26f7be03b24', 'Team Golf', 'golf', '$2b$10$s.t1qYdc0Army52/WGSMB.pWtAK1SM6dHxSYzKj8kPkjvCyyGETd.', 120, 0),
('aeb91000-4f17-4042-9c3e-5150739ca3d3', 'Team Hotel', 'hotel', '$2b$10$NioMO5.3ojlI7RGQXt9HcOGe2wPiOIcz5PMhamsNeUPJQv0OQ/wcC', 120, 0),
('ef7f229d-80f5-415d-930b-d7396c1f9e0f', 'Team India', 'india', '$2b$10$198RgSMXTiLvAz1yGt/EPexVntwJwznxyK9duFlFOM5.cHZPxiMBa', 120, 0),
('a0e32e77-157d-47f3-9f73-054c71ab2533', 'Team Juliet', 'juliet', '$2b$10$PxuvHlfj2Sunc/9d6Byu7OWORpffNWq5rt67sK2.pQtiBCykz3W5G', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('0ae6d32b-3eb6-4145-b11a-20fe21b81f64', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('794863b0-0849-4150-b6fa-61ce5dc2ba26', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('6987fe70-812c-4695-aa21-4dba88b72dce', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('4252dfdc-a6af-41f1-8db0-2da9be341061', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('ba62e98e-dbf8-4926-87e8-f74719720325', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('533dcf2e-6965-40e6-82d1-e9322818e021', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('4d749cdc-57ee-45cf-bf3a-fc8a29e6a755', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('ac5bc690-16cc-473a-92f9-bcb32dd93b6e', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('dc1fcd0e-610c-4178-99ce-0b4aff4203eb', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('17775f35-3534-47cf-8149-e1ee58031736', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('e1fc3887-4149-4a86-963e-68834d003f74', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('c3e63277-40a1-4f4f-9282-caeb7a80ca7d', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('327976cc-9922-4028-a00e-4858a0fa6410', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('21b6b6dd-6637-4f6c-9ccb-1774daeb44d4', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('75ed7a72-1c47-43a6-8b1c-0c5cc52f72a1', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('3046905e-666d-46ff-af57-42ed76ce620e', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('0f406119-1e59-4fe2-9391-786b10227656', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('16aaec60-b06b-41b7-862e-fcf420e6bab2', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('070583ec-3eea-4064-ab89-fb527e636def', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('2dc7888f-25ed-4cbc-8eb2-eecf28dbe78e', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('1b823b17-869d-482c-84b7-28ba4385bc21', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('7e236a87-2ac5-4527-b14a-db51ededd036', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, true, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('0439f062-3eec-4313-bae9-5d5a15c35895', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('7173d9b1-6737-45cd-9a1e-5d88633a3c17', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('41c65508-a983-4175-a544-3c923efd126a', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('ebf58149-b082-4502-a010-da6f1b5dbc18', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('e020f28e-e22b-451b-81e4-fd2409270f35', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('ace1eec5-6adf-4780-9f5c-21450d8103db', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('6f3d6137-0b29-41f6-ab0b-d5add2ca4be1', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('b481d40a-3d4f-4ded-906e-a25ff87f1c84', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('4521975c-a5a5-433a-9e3c-80e9a21be863', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('05ffc2ab-27e6-466b-a31f-b0dfb7aa08bc', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('52b4b0bb-f865-4d35-8564-fd7ed0922938', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('7dcd6a77-7087-4ec9-9d93-43288c1e902c', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 2, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('24469bea-2286-4c89-b6c9-019f5965a0ee', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('247ea380-e733-4b45-b32d-d808ba41cf87', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('3952244d-969c-4977-80d3-f2d2bb3644c1', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('4dce422b-d708-43ec-bc74-cc1518823663', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('abcc402d-f6a1-4f03-aa8c-10c79120f7fc', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('d1044d97-088c-4236-af67-af7930a9bf98', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('8fcc2687-cf5e-4591-a750-c91dbd9a4070', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('c69972c3-1108-451f-a985-8f3a11310c96', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('bc7d07fc-ba1b-47ea-8dea-2163658db11f', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('048462aa-cf7a-4b89-af6c-cf924ec1ec65', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('fa7f5067-c328-4412-9a8f-c4ba59cf806e', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('d3ab99a2-a30c-4cf3-80aa-8e5f00a3d9f4', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('852d552e-3f55-4270-93d4-55078ba366fe', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('a9a98106-2061-4722-9ad5-5d0235385877', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('5e365d45-3ea4-4ba1-bb99-484a5fb73577', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('62323bf8-cd1d-411c-a28c-7c28c63dfa03', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('c4f76064-1ccf-465a-a3c5-154c8c5c336b', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('3ecff132-dc9d-4836-80eb-e1c94d8bb1df', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('d91afd0a-d3bd-4423-8835-9e208d6eb94f', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('3ba772cf-72b1-4734-98f6-4a48524e9fd6', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('bbd49a7e-0709-4e8f-894d-7bf2dff961e0', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('afa8a6b1-27f8-443e-b824-f7c740a2b378', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('7f1ff4a1-0bf2-4b70-9765-e6dd17af1958', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('34fa6dac-517d-4a01-8030-9f8fb51ad41a', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('6a874f14-a1d8-4e44-97dc-38919dbdf11b', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('2b5107fb-9cf6-46e4-b893-ad024dd3b79d', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('ef33a086-e84c-4ee7-ba33-ab135a95ff08', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('f5d13b7c-38e9-4c24-8e5f-eda26c70e45d', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('7e90090f-5335-4ba6-9ff7-e5ab49ca3633', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('05c37380-3c7e-42ec-80bc-a9dc0dade2de', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('ea268dcf-d3b9-48f6-a8fa-52abead795cf', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('ad605b14-4f4c-4f14-a7f5-7b4b233f52e2', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('416cf78d-80a2-49e2-8ae6-2049d5dc64ba', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('362bf594-86cf-431a-a28e-210f70ed57c5', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('4295e277-8a31-423a-b4b5-106b65cd493d', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('f4199cbb-7298-45e4-b559-576aee766f6c', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('24a10bdb-881f-4180-a1bb-4cf3e9e87f2b', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('0ab30499-0b26-4ad4-8580-68e197181d0c', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('fa920af4-864c-40cf-a4fe-252eaa002e0c', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('4e7f2b37-ab98-4a06-a8fe-054f8f90c113', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('46f6874e-d1ec-48ae-b6f7-53e039e219f4', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('04cb2754-1984-44b1-ba33-5a9e43b69f86', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('7d6539ff-7dee-497d-b9a5-77d8fbac9911', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('efd91de7-4c54-4301-b310-6b00a36d11d4', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('420b8982-6d82-4c80-8061-872b568baa75', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('3a2bc933-bdb0-4f44-a35d-11abf21dc405', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('cf2be724-bbdc-4521-b3ec-3525b665cfcf', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('b5e172fb-8b45-4f87-8657-0a2bd4f6a3fa', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('ba427386-0b05-4866-affb-d78a0f1d0295', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('3c060055-77a5-40c4-b4d3-c4407a7c6e8c', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('96d182e9-cfbb-4bd0-8465-0cc0f1b743a9', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('5f77a534-b7e7-42f6-a312-52538e0855ed', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('bd79ef07-7791-4a5b-8b2f-d0e58f978282', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('15ae1a80-d258-4d2a-a5a6-397fcd9b516d', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('a1f88b75-5a6e-47d5-9803-b722ea197683', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('9bdcd70e-d5c0-4087-a354-b2fab2ed34a0', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('1a95bb69-9706-4db2-af8b-ea09689e297b', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('9e53fdeb-c7ab-4879-a8b4-0ab71e54ad81', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('1588259a-5c6c-4b38-998a-065ac39e48d8', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('ccbfd5c4-6a92-4017-a905-0b6ac2de46f4', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('6e7c6738-5319-4e26-9502-8e627007d76d', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('96847619-1314-4d3e-b8a1-7926a2d1b5c9', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('1055efaf-bb81-432e-ad8e-a2da009b9a37', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('eb9781c6-d8b1-466b-b50c-8908f3b24753', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('3889fdfd-9fa9-4989-86d2-920dec9dbe33', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('b21496ec-fc04-4329-ba0e-cfdd467caa58', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('61b615e2-1b93-4f5f-aa3a-ce8ac531db8e', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('50345702-e5ef-4528-a87f-804ed2393e68', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('c58ff0c1-fe12-4a6a-8b5d-9e63958d1837', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('326469b3-4673-4aa7-8df3-03b2806bbb4f', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('77791789-24a4-4fe8-81a7-fecb5660f769', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('bbb6fb54-6b7c-43c7-a338-91e402d11166', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('8edd83d7-1b14-40e1-81b3-28a1325225bf', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('cbce7eb0-fff1-478d-b666-314cdedbd8cd', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('6feeb6e6-c658-4814-b447-894ec0bdfece', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('ea976f3e-a3c3-4639-a97e-561673312cb1', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('7b5f1647-093d-4931-8f47-4b165c5bb990', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('50878889-b96b-4192-bdc3-81d77605ebfb', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('c711ce6b-fa10-4988-a447-8601f1765a96', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('2c6a4a6b-26ab-4183-9af1-bdbfc7785073', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('0b511b02-61aa-40cc-a307-f7b917a15113', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('4ca16b27-a094-45da-aba5-45a9205ce718', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('c24afa5c-6141-4a07-b01e-c76a895d23c2', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, true, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('4510d010-7480-4a45-95e2-9d6cdefd7dbe', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('3b6a2306-3b63-45a9-bf49-89e258031da5', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('80c14c59-9cac-4581-a8ef-bab107dc409d', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('3de3c6e2-d75f-4175-a09f-63877177c232', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('848ca3e7-93ee-44c8-913a-805bb85fd77a', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('a9d363e3-0850-4f19-ab25-d0811f03908e', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('8e2552b1-c96d-4596-b336-04d5cede66eb', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('826b46be-4423-4f3f-9a80-72af46cf5e29', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('ac89bd33-8d72-4a45-92d7-0fdb408f1c9c', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('baf0baf1-74c8-4a28-98ab-494e28605910', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('db503406-ee37-465d-b116-05f3bd920563', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('cfdacb80-c25b-4a5c-b383-c90165653818', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('4ef746d7-9ee5-4701-a869-520b9b11baae', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('cf12f6e2-db2d-4d01-881e-5a847ac684ff', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('07ab07d5-3838-4dcd-a107-a8d16874185e', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('351b8bc4-92d0-4d49-8637-aebfbf52697a', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('13211139-07a1-49d0-be21-c1ef2c83ba18', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('f0c6d7bb-7452-48a8-9d7f-24a4c4c20ca8', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('1ebaaa2d-a48b-4ed2-98dd-a45b21389728', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('40b977db-4e4a-4906-8618-0717540186b0', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('0880e8a9-cb68-48aa-98ba-af1f90fa8e4c', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('bdcb4cd8-6585-43d5-9f67-028535cbc0f9', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('bcd780b3-5865-483f-a437-76d5618c5e0d', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('b0add717-5ba0-4976-826e-a192aff9aef4', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('e2cca40c-85cd-464c-b4ff-58262cdaf86e', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('7a52b450-25e4-43db-81be-8ab95cda6114', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('ab7e974a-0e9b-46ba-842f-99fcf043eada', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('8bbbb134-2617-40b8-a829-e715d03f94a9', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('08de934d-f828-47cc-878b-0687d952fc89', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('2a545bae-0fa8-4f0d-ae4b-d1eaa7e7d3e9', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('579bb9f5-850b-4d9d-81b2-125186f64416', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('0862af4e-cd5e-4449-9342-76b09a538f77', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('49360dfa-9ea5-4191-a454-d9adf21e551c', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('12f82c82-73c9-466a-b499-a8ad5ee8c1f0', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('a8462b4b-2961-4e01-ab75-ced2d5e9124f', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('773c3a22-b0d9-42b3-8005-42a37b90a605', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('d526c257-31a6-4ff1-b7e7-55dd0d1b3957', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('e1dc0af0-1ad5-4149-be69-f69d31fb823b', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('351737e3-0b98-48b6-9c05-d84f8449e910', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('34e504f0-7c07-428e-898c-50f2cef92368', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('58cb0057-2959-4ecc-9652-ddb7c7f3645f', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('0a1a38d4-763b-4ac4-b3cf-4b4417cdf7bd', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('80fd4791-3e38-4759-a53a-59c3ad7c1e81', '0ae6d32b-3eb6-4145-b11a-20fe21b81f64', 'UNSOLD'),
('14f1e274-d8e3-4ddb-9990-ec3e7f5805cd', '794863b0-0849-4150-b6fa-61ce5dc2ba26', 'UNSOLD'),
('752bbe52-a0b9-497e-a034-4c9456ccc77e', '6987fe70-812c-4695-aa21-4dba88b72dce', 'UNSOLD'),
('718f7071-3aa5-4ff1-b261-3697d4b7e88d', '4252dfdc-a6af-41f1-8db0-2da9be341061', 'UNSOLD'),
('02d7fbd4-76b4-4b46-bfd2-3f9560b0c2aa', 'ba62e98e-dbf8-4926-87e8-f74719720325', 'UNSOLD'),
('152d6edc-b157-4767-931f-7105f3e84f8a', '533dcf2e-6965-40e6-82d1-e9322818e021', 'UNSOLD'),
('756983c2-3084-4e42-8e0a-7a684434f7de', '4d749cdc-57ee-45cf-bf3a-fc8a29e6a755', 'UNSOLD'),
('7a6a1994-ce03-41fd-8ece-0181fe58519f', 'ac5bc690-16cc-473a-92f9-bcb32dd93b6e', 'UNSOLD'),
('0027e3e9-7df4-4df8-8262-6f3920a2027d', 'dc1fcd0e-610c-4178-99ce-0b4aff4203eb', 'UNSOLD'),
('04bdf252-c1c8-4dca-abf4-a7d3afe9acaf', '17775f35-3534-47cf-8149-e1ee58031736', 'UNSOLD'),
('c0d89b64-efeb-440a-b4f6-5b09cb1f8eaf', 'e1fc3887-4149-4a86-963e-68834d003f74', 'UNSOLD'),
('6fc22c94-23b9-4319-94de-ea9214e1b933', 'c3e63277-40a1-4f4f-9282-caeb7a80ca7d', 'UNSOLD'),
('52cda11a-d20e-4228-bab8-185dd0738b3f', '327976cc-9922-4028-a00e-4858a0fa6410', 'UNSOLD'),
('e6942964-f3fd-4b36-95db-78633677cc4e', '21b6b6dd-6637-4f6c-9ccb-1774daeb44d4', 'UNSOLD'),
('1d66e11c-d107-45a4-85e2-59d4dbba87c3', '75ed7a72-1c47-43a6-8b1c-0c5cc52f72a1', 'UNSOLD'),
('de8d6f8f-eafe-4ff9-97f8-997a81eaece7', '3046905e-666d-46ff-af57-42ed76ce620e', 'UNSOLD'),
('c8d6c66f-6062-41ba-9dfb-2e9537efe13e', '0f406119-1e59-4fe2-9391-786b10227656', 'UNSOLD'),
('e97f71ca-0e58-4cce-b47a-f06919b8907f', '16aaec60-b06b-41b7-862e-fcf420e6bab2', 'UNSOLD'),
('601b6552-5a00-4511-bab6-aa237fb95041', '070583ec-3eea-4064-ab89-fb527e636def', 'UNSOLD'),
('9ddfd95d-ead5-41cf-afb0-c3f4be097f65', '2dc7888f-25ed-4cbc-8eb2-eecf28dbe78e', 'UNSOLD'),
('88195754-b794-4be0-9524-537935ddd941', '1b823b17-869d-482c-84b7-28ba4385bc21', 'UNSOLD'),
('15f3ade0-79c3-44db-8a69-df7fc13fd8ff', '7e236a87-2ac5-4527-b14a-db51ededd036', 'UNSOLD'),
('1fe321e7-7f82-418e-8bff-ad8dda7fbd18', '0439f062-3eec-4313-bae9-5d5a15c35895', 'UNSOLD'),
('9bde9046-c49c-4ca7-974d-6fdae13b4666', '7173d9b1-6737-45cd-9a1e-5d88633a3c17', 'UNSOLD'),
('c6bf8598-7bc4-4992-a58e-40d249bbc544', '41c65508-a983-4175-a544-3c923efd126a', 'UNSOLD'),
('09f5360e-e41b-4657-a8cc-71b03097c677', 'ebf58149-b082-4502-a010-da6f1b5dbc18', 'UNSOLD'),
('b49a7736-7e84-4f48-9a7d-2df03864e75e', 'e020f28e-e22b-451b-81e4-fd2409270f35', 'UNSOLD'),
('771c634b-4175-4e19-96a1-37b95565f6d7', 'ace1eec5-6adf-4780-9f5c-21450d8103db', 'UNSOLD'),
('6e820108-4c0e-4bd5-b591-60a4eba512aa', '6f3d6137-0b29-41f6-ab0b-d5add2ca4be1', 'UNSOLD'),
('63d16cdc-5dbd-49bd-bcc2-4ee7c99688f9', 'b481d40a-3d4f-4ded-906e-a25ff87f1c84', 'UNSOLD'),
('98caa928-f06b-41a5-92b4-6620b77eb228', '4521975c-a5a5-433a-9e3c-80e9a21be863', 'UNSOLD'),
('c17b4d9a-5004-4090-a8e0-494701bd2f08', '05ffc2ab-27e6-466b-a31f-b0dfb7aa08bc', 'UNSOLD'),
('72784d23-ea75-4f07-9955-944c82148a30', '52b4b0bb-f865-4d35-8564-fd7ed0922938', 'UNSOLD'),
('d35fd115-4d57-4263-92ed-db972bb20bc0', '7dcd6a77-7087-4ec9-9d93-43288c1e902c', 'UNSOLD'),
('986d9453-21c0-4fbb-a1fd-52e6f09f4c93', '24469bea-2286-4c89-b6c9-019f5965a0ee', 'UNSOLD'),
('31761759-6193-4379-8f43-7251c77e1f69', '247ea380-e733-4b45-b32d-d808ba41cf87', 'UNSOLD'),
('263d55a1-0647-46d4-9c38-854c2eced9aa', '3952244d-969c-4977-80d3-f2d2bb3644c1', 'UNSOLD'),
('17260193-d3aa-4343-8027-cb8f8a1ed62c', '4dce422b-d708-43ec-bc74-cc1518823663', 'UNSOLD'),
('09f78240-5274-4e55-b746-f6d63325afce', 'abcc402d-f6a1-4f03-aa8c-10c79120f7fc', 'UNSOLD'),
('8a8741d0-e26d-4127-a730-76e4cdcceada', 'd1044d97-088c-4236-af67-af7930a9bf98', 'UNSOLD'),
('c3f6e411-5f4a-4c5f-b7e7-56a90d7d5b7e', '8fcc2687-cf5e-4591-a750-c91dbd9a4070', 'UNSOLD'),
('cbfbd985-40cd-4456-ab77-0130e52b1eb7', 'c69972c3-1108-451f-a985-8f3a11310c96', 'UNSOLD'),
('c7eb0640-7133-4ec3-932c-b81178eea914', 'bc7d07fc-ba1b-47ea-8dea-2163658db11f', 'UNSOLD'),
('ccfe06f4-5d03-4f36-82d4-a2a1390c5c1c', '048462aa-cf7a-4b89-af6c-cf924ec1ec65', 'UNSOLD'),
('32abf90a-f6af-41ae-b0c7-ede6a7e4b65c', 'fa7f5067-c328-4412-9a8f-c4ba59cf806e', 'UNSOLD'),
('d5683126-85c7-4165-8c92-a22be4ae9af4', 'd3ab99a2-a30c-4cf3-80aa-8e5f00a3d9f4', 'UNSOLD'),
('fca36227-750b-4d60-ac1d-fc7bf5df7814', '852d552e-3f55-4270-93d4-55078ba366fe', 'UNSOLD'),
('002bfae5-c47e-47ad-b8cb-58333922cc1c', 'a9a98106-2061-4722-9ad5-5d0235385877', 'UNSOLD'),
('0ca6ef30-9168-4710-9a19-bf71c1e963a4', '5e365d45-3ea4-4ba1-bb99-484a5fb73577', 'UNSOLD'),
('2e6b16a7-318c-4a14-9e3a-60b3a8201a4e', '62323bf8-cd1d-411c-a28c-7c28c63dfa03', 'UNSOLD'),
('54296fd2-86b4-4def-93f6-5ee70d22089f', 'c4f76064-1ccf-465a-a3c5-154c8c5c336b', 'UNSOLD'),
('83013521-8dde-432a-96ca-7d0bbbdf35c1', '3ecff132-dc9d-4836-80eb-e1c94d8bb1df', 'UNSOLD'),
('38931f2a-41fd-4688-aeae-79e4c1afbe47', 'd91afd0a-d3bd-4423-8835-9e208d6eb94f', 'UNSOLD'),
('6289ec45-b3f5-47a0-a558-d367e57b2b1e', '3ba772cf-72b1-4734-98f6-4a48524e9fd6', 'UNSOLD'),
('64a04238-19ff-4966-90db-c49b34d8e43e', 'bbd49a7e-0709-4e8f-894d-7bf2dff961e0', 'UNSOLD'),
('9a966616-9ea9-4cec-bcaa-717f5d8abfcb', 'afa8a6b1-27f8-443e-b824-f7c740a2b378', 'UNSOLD'),
('49f6a1aa-4530-4608-bbe8-a78ae74cb7a4', '7f1ff4a1-0bf2-4b70-9765-e6dd17af1958', 'UNSOLD'),
('d2f74677-52bb-4f83-a26a-90eb7a394966', '34fa6dac-517d-4a01-8030-9f8fb51ad41a', 'UNSOLD'),
('67432923-4505-4c80-be48-6b992522427a', '6a874f14-a1d8-4e44-97dc-38919dbdf11b', 'UNSOLD'),
('c373f043-ea89-4f6f-9716-d4795912a40b', '2b5107fb-9cf6-46e4-b893-ad024dd3b79d', 'UNSOLD'),
('e4b72bd6-5c29-4bfd-a34a-c65320763658', 'ef33a086-e84c-4ee7-ba33-ab135a95ff08', 'UNSOLD'),
('a361dad3-2574-494b-b7e6-c1379f4f0ddc', 'f5d13b7c-38e9-4c24-8e5f-eda26c70e45d', 'UNSOLD'),
('dde595f2-afcf-4fc1-b4a0-34c57a72bbf7', '7e90090f-5335-4ba6-9ff7-e5ab49ca3633', 'UNSOLD'),
('5fea4a8e-8d64-4a88-8a50-28440b4f3f3e', '05c37380-3c7e-42ec-80bc-a9dc0dade2de', 'UNSOLD'),
('102c84c4-7cbc-47d1-a5b7-222dfe017826', 'ea268dcf-d3b9-48f6-a8fa-52abead795cf', 'UNSOLD'),
('ecb7a9e6-d288-4ce0-a30d-ac8d3e2e0f01', 'ad605b14-4f4c-4f14-a7f5-7b4b233f52e2', 'UNSOLD'),
('0365904b-ee33-43e7-b05d-d11c2ff425e8', '416cf78d-80a2-49e2-8ae6-2049d5dc64ba', 'UNSOLD'),
('09733b62-af59-4da6-a3a3-05ac3617a371', '362bf594-86cf-431a-a28e-210f70ed57c5', 'UNSOLD'),
('b9b7a43a-b920-4705-b796-8e4ac30b1138', '4295e277-8a31-423a-b4b5-106b65cd493d', 'UNSOLD'),
('c96959d1-e6a4-4356-b9f4-3e9c6be756a4', 'f4199cbb-7298-45e4-b559-576aee766f6c', 'UNSOLD'),
('8993d581-a186-47be-bd64-0c8b1d67865b', '24a10bdb-881f-4180-a1bb-4cf3e9e87f2b', 'UNSOLD'),
('4eaad468-590c-4f6c-91c6-11095029d0dc', '0ab30499-0b26-4ad4-8580-68e197181d0c', 'UNSOLD'),
('4117d304-0478-4c47-941c-db79d452ad9c', 'fa920af4-864c-40cf-a4fe-252eaa002e0c', 'UNSOLD'),
('f2fbb3c2-f213-42b7-a30d-28314ba7e0a8', '4e7f2b37-ab98-4a06-a8fe-054f8f90c113', 'UNSOLD'),
('5ffb1baa-1b78-4147-b456-e03fbdd4e3a3', '46f6874e-d1ec-48ae-b6f7-53e039e219f4', 'UNSOLD'),
('a99c3950-89fa-498b-abdb-52672997bfe5', '04cb2754-1984-44b1-ba33-5a9e43b69f86', 'UNSOLD'),
('f5c3daa3-c17f-48cc-8b64-53b7d89c9f4e', '7d6539ff-7dee-497d-b9a5-77d8fbac9911', 'UNSOLD'),
('4d260714-34fc-4dd2-9636-e8d7ae5f26a7', 'efd91de7-4c54-4301-b310-6b00a36d11d4', 'UNSOLD'),
('58a4cfe1-25ba-44e5-96b4-fc13b600f07c', '420b8982-6d82-4c80-8061-872b568baa75', 'UNSOLD'),
('00572e0d-3aed-4078-bae0-270adf2287d2', '3a2bc933-bdb0-4f44-a35d-11abf21dc405', 'UNSOLD'),
('e9054c89-e481-417a-ace4-f940e068a930', 'cf2be724-bbdc-4521-b3ec-3525b665cfcf', 'UNSOLD'),
('edeee79b-80c2-43a1-8927-fcd01a5eaeef', 'b5e172fb-8b45-4f87-8657-0a2bd4f6a3fa', 'UNSOLD'),
('2291c044-2897-4bbe-9a77-183bea53ea3d', 'ba427386-0b05-4866-affb-d78a0f1d0295', 'UNSOLD'),
('1e890ce4-5132-4665-b158-648dbcc76b3e', '3c060055-77a5-40c4-b4d3-c4407a7c6e8c', 'UNSOLD'),
('3cbcbaf2-f506-4355-bc83-774107e64ab8', '96d182e9-cfbb-4bd0-8465-0cc0f1b743a9', 'UNSOLD'),
('a088eafe-b249-4634-a9aa-7c6eb22fa19d', '5f77a534-b7e7-42f6-a312-52538e0855ed', 'UNSOLD'),
('9c8723a4-b450-470b-8a65-5062092c5e98', 'bd79ef07-7791-4a5b-8b2f-d0e58f978282', 'UNSOLD'),
('819e4359-b458-4c9e-b83e-1ac8f0051aa1', '15ae1a80-d258-4d2a-a5a6-397fcd9b516d', 'UNSOLD'),
('bc18427d-a625-41c6-9d8b-73c44cd7855b', 'a1f88b75-5a6e-47d5-9803-b722ea197683', 'UNSOLD'),
('c358524d-c152-44e8-bab2-c4902b85191a', '9bdcd70e-d5c0-4087-a354-b2fab2ed34a0', 'UNSOLD'),
('09f9e3e3-0261-4bb6-b47b-3ad9c5a4f090', '1a95bb69-9706-4db2-af8b-ea09689e297b', 'UNSOLD'),
('9f80ba9f-9cb6-4519-9d18-7113909a5c99', '9e53fdeb-c7ab-4879-a8b4-0ab71e54ad81', 'UNSOLD'),
('981d09e2-9249-4821-be42-814ff56d54e2', '1588259a-5c6c-4b38-998a-065ac39e48d8', 'UNSOLD'),
('6a8d7b75-307a-4241-84cf-a63ac133aeb4', 'ccbfd5c4-6a92-4017-a905-0b6ac2de46f4', 'UNSOLD'),
('5dc6e5df-b787-454d-9880-3f1767d412ca', '6e7c6738-5319-4e26-9502-8e627007d76d', 'UNSOLD'),
('4efd8ef0-47a9-44e7-9f60-1c88cf28d456', '96847619-1314-4d3e-b8a1-7926a2d1b5c9', 'UNSOLD'),
('387dd2c0-6df9-4ce1-8867-e45d84867870', '1055efaf-bb81-432e-ad8e-a2da009b9a37', 'UNSOLD'),
('2ce2fbc0-f879-4ab9-89a8-1e7a048c90f3', 'eb9781c6-d8b1-466b-b50c-8908f3b24753', 'UNSOLD'),
('d0560ff0-aea6-4583-93d2-ce0f041d0a1f', '3889fdfd-9fa9-4989-86d2-920dec9dbe33', 'UNSOLD'),
('a7241906-09db-4e45-a037-72e0be4b6919', 'b21496ec-fc04-4329-ba0e-cfdd467caa58', 'UNSOLD'),
('cec9af92-5cd5-49ff-bd19-d63fd6695989', '61b615e2-1b93-4f5f-aa3a-ce8ac531db8e', 'UNSOLD'),
('926b4ca9-f536-4476-8353-6c1d03a6689b', '50345702-e5ef-4528-a87f-804ed2393e68', 'UNSOLD'),
('615f4867-be89-4c0e-82a5-5d231ba2f4f0', 'c58ff0c1-fe12-4a6a-8b5d-9e63958d1837', 'UNSOLD'),
('30298e7c-e95c-406c-9ea8-6a4c4978f701', '326469b3-4673-4aa7-8df3-03b2806bbb4f', 'UNSOLD'),
('db7fa124-f798-4024-b8ba-6f833a69f95d', '77791789-24a4-4fe8-81a7-fecb5660f769', 'UNSOLD'),
('3d609fb6-23e8-47c3-9036-508d96417711', 'bbb6fb54-6b7c-43c7-a338-91e402d11166', 'UNSOLD'),
('7684b1b0-ca95-4836-bbbb-791f8a51532c', '8edd83d7-1b14-40e1-81b3-28a1325225bf', 'UNSOLD'),
('b0e25d9c-fd2f-4ab4-ab2e-fd48e3490fa0', 'cbce7eb0-fff1-478d-b666-314cdedbd8cd', 'UNSOLD'),
('f51fc971-15f8-4e17-81d8-269cd67b169e', '6feeb6e6-c658-4814-b447-894ec0bdfece', 'UNSOLD'),
('53752af2-718e-41f1-aa2a-33d017155d45', 'ea976f3e-a3c3-4639-a97e-561673312cb1', 'UNSOLD'),
('5ff79802-7e94-416a-a3f6-32775dc6fd7d', '7b5f1647-093d-4931-8f47-4b165c5bb990', 'UNSOLD'),
('35886931-2ae8-4a3e-887b-6c16c51d6710', '50878889-b96b-4192-bdc3-81d77605ebfb', 'UNSOLD'),
('1cf052f1-b5a0-42f0-a45f-faa8eb89a8cc', 'c711ce6b-fa10-4988-a447-8601f1765a96', 'UNSOLD'),
('b8be95da-c7ef-4469-bbb0-f3d389db9713', '2c6a4a6b-26ab-4183-9af1-bdbfc7785073', 'UNSOLD'),
('863c23bb-b15a-4d1e-aea6-70aa572d2938', '0b511b02-61aa-40cc-a307-f7b917a15113', 'UNSOLD'),
('0dccd0ca-77d5-49cc-9d07-554d005246ff', '4ca16b27-a094-45da-aba5-45a9205ce718', 'UNSOLD'),
('6d230d8d-1f6e-42fb-b6c2-d1c241b0caef', 'c24afa5c-6141-4a07-b01e-c76a895d23c2', 'UNSOLD'),
('ea32b68c-4815-4375-a677-a1dd582bfb3c', '4510d010-7480-4a45-95e2-9d6cdefd7dbe', 'UNSOLD'),
('e471f227-f42e-41c6-8449-3f80d4353e5b', '3b6a2306-3b63-45a9-bf49-89e258031da5', 'UNSOLD'),
('339da3a8-a631-4a5c-8218-358ede49c0ef', '80c14c59-9cac-4581-a8ef-bab107dc409d', 'UNSOLD'),
('2ca83d78-33fe-49ce-b74e-d023fc39057a', '3de3c6e2-d75f-4175-a09f-63877177c232', 'UNSOLD'),
('cf371760-ca80-44a3-9fab-778bd1d52c73', '848ca3e7-93ee-44c8-913a-805bb85fd77a', 'UNSOLD'),
('21f49612-4681-4e7e-8080-28a05467bebe', 'a9d363e3-0850-4f19-ab25-d0811f03908e', 'UNSOLD'),
('a1e52184-eaca-4c37-acf5-e9183b835a1c', '8e2552b1-c96d-4596-b336-04d5cede66eb', 'UNSOLD'),
('8dcd875e-2630-467a-ae4e-af822ccc7bed', '826b46be-4423-4f3f-9a80-72af46cf5e29', 'UNSOLD'),
('6e249172-be90-4a59-9272-356e9e62e8cf', 'ac89bd33-8d72-4a45-92d7-0fdb408f1c9c', 'UNSOLD'),
('3194d190-e435-4095-83dc-d70956cd142f', 'baf0baf1-74c8-4a28-98ab-494e28605910', 'UNSOLD'),
('904f203f-71bd-492a-aedd-f5fd271e678e', 'db503406-ee37-465d-b116-05f3bd920563', 'UNSOLD'),
('8aebca35-4129-473d-8d5a-7885015ff314', 'cfdacb80-c25b-4a5c-b383-c90165653818', 'UNSOLD'),
('6fa3123d-1f56-4bd8-886f-24a94ab992da', '4ef746d7-9ee5-4701-a869-520b9b11baae', 'UNSOLD'),
('f5e71662-c7e0-4280-9b11-c9ee47131e48', 'cf12f6e2-db2d-4d01-881e-5a847ac684ff', 'UNSOLD'),
('fc721b0a-479b-4fc5-8175-36317fe109dc', '07ab07d5-3838-4dcd-a107-a8d16874185e', 'UNSOLD'),
('8cc9fd4c-9b53-4ab9-9d98-1b312969e54b', '351b8bc4-92d0-4d49-8637-aebfbf52697a', 'UNSOLD'),
('a1b82fba-6c4b-42ef-98af-63ba93bb7f6b', '13211139-07a1-49d0-be21-c1ef2c83ba18', 'UNSOLD'),
('543a30ce-1e60-4af9-99e3-f744e89fb2ff', 'f0c6d7bb-7452-48a8-9d7f-24a4c4c20ca8', 'UNSOLD'),
('060498b3-cb48-4a48-a3ad-c0c3ea44e9df', '1ebaaa2d-a48b-4ed2-98dd-a45b21389728', 'UNSOLD'),
('8475af7d-5d9c-4f48-aabf-08ac9aeb29a3', '40b977db-4e4a-4906-8618-0717540186b0', 'UNSOLD'),
('932cca80-d9f9-40be-a3d0-1dedb69003e6', '0880e8a9-cb68-48aa-98ba-af1f90fa8e4c', 'UNSOLD'),
('37dac5f3-5433-46a4-8a6e-1e8dc3db2d09', 'bdcb4cd8-6585-43d5-9f67-028535cbc0f9', 'UNSOLD'),
('edd5701a-33d5-498a-a21a-1ec3c989590f', 'bcd780b3-5865-483f-a437-76d5618c5e0d', 'UNSOLD'),
('86452244-ba1f-4342-bf00-1535444c4b33', 'b0add717-5ba0-4976-826e-a192aff9aef4', 'UNSOLD'),
('1ca71d59-c73f-4d23-8c21-ea85eb460305', 'e2cca40c-85cd-464c-b4ff-58262cdaf86e', 'UNSOLD'),
('0c9f87bc-98e6-4d30-8712-d6465ceb8335', '7a52b450-25e4-43db-81be-8ab95cda6114', 'UNSOLD'),
('be05a488-9048-44be-896f-f240cf24ab86', 'ab7e974a-0e9b-46ba-842f-99fcf043eada', 'UNSOLD'),
('d93ccbdc-3b61-49cd-8703-eee794804c4e', '8bbbb134-2617-40b8-a829-e715d03f94a9', 'UNSOLD'),
('c8d9beb4-b4db-4dc0-99cc-771cf81380a1', '08de934d-f828-47cc-878b-0687d952fc89', 'UNSOLD'),
('40424345-8020-4b32-90e5-e20e02acb54c', '2a545bae-0fa8-4f0d-ae4b-d1eaa7e7d3e9', 'UNSOLD'),
('38484b55-c217-4a44-a6af-2e83dc011cfc', '579bb9f5-850b-4d9d-81b2-125186f64416', 'UNSOLD'),
('fda10f1d-0bd9-4136-a4e9-643cccee2e8a', '0862af4e-cd5e-4449-9342-76b09a538f77', 'UNSOLD'),
('feb8b93a-d6c7-4d46-9b35-dd954a57bc22', '49360dfa-9ea5-4191-a454-d9adf21e551c', 'UNSOLD'),
('4566ba1b-6799-4432-8267-242986fa9771', '12f82c82-73c9-466a-b499-a8ad5ee8c1f0', 'UNSOLD'),
('eb0d3aa2-d4f8-49e4-b20f-d27d3cb22499', 'a8462b4b-2961-4e01-ab75-ced2d5e9124f', 'UNSOLD'),
('0411d673-4ada-424f-8a60-111ebc6815a6', '773c3a22-b0d9-42b3-8005-42a37b90a605', 'UNSOLD'),
('20e0f64e-d44d-44bf-a725-8b01b3663082', 'd526c257-31a6-4ff1-b7e7-55dd0d1b3957', 'UNSOLD'),
('fa4faa17-fefa-4029-b1f8-d0a508013cb5', 'e1dc0af0-1ad5-4149-be69-f69d31fb823b', 'UNSOLD'),
('a053021f-aa3a-4ebc-af47-4e878600784b', '351737e3-0b98-48b6-9c05-d84f8449e910', 'UNSOLD'),
('b447d0ab-6d0e-46e4-80b5-52a1308a3815', '34e504f0-7c07-428e-898c-50f2cef92368', 'UNSOLD'),
('2db414b4-630c-4d89-8a54-ba5a203b9689', '58cb0057-2959-4ecc-9652-ddb7c7f3645f', 'UNSOLD'),
('1480f5b4-cee4-453d-af8b-0c58cb116a1e', '0a1a38d4-763b-4ac4-b3cf-4b4417cdf7bd', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('1c109d50-553d-4b1e-9c6f-f85d1d706aac', 'admin', '$2b$10$4RNTYlhbFbHO1jH8KwGhzuDKEbq6luUnZtWbnA4hthpMJ.mudN9Q6', 'ADMIN'),
('1916947d-b1ee-4c18-9b57-472e7ce67e93', 'screen', '$2b$10$fHlHVCFcQbGfFpot1pApNOYVLpIiUAVlpZkGVz3XlGMhM1SJIDxom', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 4', 'PLAYER', '[{"rank":34,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":5,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

