-- INSTANCE 3 INITIALIZATION
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



-- ── DATA FOR INSTANCE 3 ──

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
('30dc87ec-742c-45da-9ebc-e686b5f3fae2', 'Team Alpha', 'alpha', '$2b$10$ieX//oWtUSkReJnXFFAAPegugHFH5c29fVDa8jUpwf80/M47yPm8C', 120, 0),
('9aa248bb-99a2-4b5e-be8f-ac5154692f1d', 'Team Bravo', 'bravo', '$2b$10$FvDH8DO2kOy4aW6/UecoJuTOxS6R55cO6Lpij9NpEfSupyl6t3U8y', 120, 0),
('3a23d0db-cf9a-4546-9c9d-403d802e0d96', 'Team Charlie', 'charlie', '$2b$10$MNruAooh/G.B3yFA/7oazO70ReMAGGTWPPWMyBY1p4QaOJO2jX7Oy', 120, 0),
('20327148-42d8-4f9e-a63c-d7eb364a2dd9', 'Team Delta', 'delta', '$2b$10$huLGr61l2pJpTrabQrKmqubZweBPkzZ8oB5zF/xowPzqwM/vjEKYe', 120, 0),
('0ed660ac-495f-4346-acf6-94c76ca7cbc2', 'Team Echo', 'echo', '$2b$10$mUzc7gj7PfMF2.m5cFssPevKrNoQGkok7aXA4fM2aDTHgnXqLbPWq', 120, 0),
('66e603eb-5460-4e22-a05a-7f3998a9cc36', 'Team Foxtrot', 'foxtrot', '$2b$10$Z5lVR2pufSnjQQN1Ms8qmeSx5PWZvWor14ocyB3V3GljbSB1Uo9ze', 120, 0),
('2551bb8a-cdcb-4564-85d7-5bebbedc87bc', 'Team Golf', 'golf', '$2b$10$z00inXTzp15sQhDYuhQj4ueW4VKelOT8jfEOd87ZwqafhlVGLKufG', 120, 0),
('45ec0948-4817-4b18-a6c2-743726a428ab', 'Team Hotel', 'hotel', '$2b$10$Dx9neaQGuA1kfrJlSfQwveWjm3MMBsmigMjm2WnvPfLpdCxpJhjDW', 120, 0),
('77f5674f-07c3-456b-8def-953df4051758', 'Team India', 'india', '$2b$10$.ttgYo6tY2Yurf6e2AU3DOIzzkkLlrLrTjWr/Pxav0NitxnXDXgYy', 120, 0),
('c0ce4d45-8a76-4c01-91da-3af87c25c3d9', 'Team Juliet', 'juliet', '$2b$10$EcI0qfMDj7KHZ3qMyS1aeuZwhRJD3lNJvWMGXiAKUBRHaDk1eUb82', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, riddle_title, riddle_question, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('92b38cab-94a4-4f85-93d6-f50827248966', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('c3788dcb-e2d8-4fcb-9f79-e7e3aed079a5', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('8c9d6066-6700-4404-afa4-61e071179ad5', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('8f3a69d3-7c1f-4b01-be12-b892a59c6aa3', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('d58a0073-f31e-46ba-9eab-2ed963578d36', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('af868da7-9153-4a02-a1cf-4dd05b870fe3', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('f769eb13-0102-44a8-893d-8463b1a52848', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('53e02ae9-7e5d-4bc9-ac9a-8d3db7e1350d', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('bbbef3d3-0a56-431a-9d6b-f0ef570ca865', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('d3ab7d51-b01f-4001-90d2-57f1ab854c84', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('56357268-08d4-47f2-ace6-7c6823346ce7', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('10dc300f-8229-4612-a97a-d66b23df49f0', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('e50a14ce-9ddc-40b9-b3ca-2e92fde07e50', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('c50ab6b5-e6e8-4481-acf0-f7afbbe2112a', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('dcb897a1-1724-464d-8763-4cdc0f957fdb', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('36fb0d8a-1767-45e8-abbc-bdaf92b6dfe2', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('52901235-ad76-487d-8446-7810013ed237', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('22ef5050-3aa0-4350-b792-e063e086bb95', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('3bc44978-b61e-433b-9c94-76bc7f669209', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('8e7b663b-5340-4c34-8a11-49273a721e08', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('90b2b2a3-cb8e-4840-a4bb-3b85639e1570', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('f31f8d76-93e6-424d-b9c4-f98fc7bf746a', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('21be50b8-4321-498c-ae3c-a8a7ea392e0f', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('616afd8f-4903-4734-9236-8e50b5f5cf18', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('4b3a7c28-7358-4939-bdf6-c73f9ac210be', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('c9eefdac-28e8-4edc-b011-743bd02806eb', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('6c782ff3-4851-4532-9cdf-55e397a87793', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('55ee4457-ae69-4e90-a7b5-12a5e9c0f076', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('85b238e5-3d62-450e-8f79-f24fe6be9f8a', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('17508cef-5668-45a3-b9d4-db32940d7dcc', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('bd45898b-c441-4edb-a340-fb648e537a33', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('7dc15847-1ef6-4bb4-b5ef-070eb8fd1770', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('d0e559fb-f56d-4b26-ba0b-3a4059eb934d', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('4e01ac1b-235c-4c04-abfe-233ce1666f2a', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('f55aea53-1b50-425c-90eb-52cc6350e145', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('9f22b4ff-ae09-4460-8ded-eeeb9a490909', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('bfb8c299-3c89-4f97-b169-412f130dc349', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('ddc836f5-0f7d-4f5f-81ed-f3f30bce2edf', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('78f932ea-d8c0-48f2-92a0-d046117c2a57', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('36fa9a0b-e854-4747-b9df-b607e1a13d6a', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('ed8f8b91-e5bf-4b4d-b726-a182e41675d1', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('5e86951a-5274-4e2c-867d-e11ab9f6147c', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('da85177e-2abd-4477-8ac2-e0a82c31e24f', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('4aefda35-4fc8-443b-bfd7-df9fa8fe253b', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('c1dcafa2-4960-4741-965a-46726d03a3f1', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('d4116ad9-069c-42d1-b97d-84bba0370541', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('848399c2-54d0-416b-b720-492eb904b836', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('90960a55-fdd3-4727-8157-8c87276ca55b', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('f717ecba-1e4e-4cb7-be83-bf1893bdadda', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('171afe62-fcd7-4f26-99bf-ec07a37dc8d5', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('7cbbb90f-9b76-4da6-9e80-eb12f2612bb6', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('681ed3c4-a08b-4534-9f61-c6cc24bd3a61', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('d8c83097-24d3-40a4-9da2-829f7446531f', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('c38e7b66-9cdf-4fdc-9fc5-7331a3473130', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('78b4a761-4727-4f6c-a783-9cd99385fd3a', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('17a73fc6-3873-4c4e-a6b5-4e6449653687', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('31ea326a-389c-4a5a-8643-ffb18aa28cc9', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('27c40c93-b2e4-4b97-b266-3dea365e16a6', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('ebd7c6df-12b9-411b-be57-2ab395abdee2', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('4361b152-4fff-4184-a145-ef99235df625', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('8b1a12be-c685-4c9b-a446-1d7d458a2f5f', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('7c1b9359-bcd2-49a0-a551-1d4cb53f671c', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('9ed0139a-f140-4684-86c7-2c91b4184c44', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('4d292a61-b542-4808-be0c-a28056c7600a', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('a0f47bc0-bcd8-4d8d-914d-74acc5511cb9', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('e9d090ab-3097-466a-b17c-085c7cb9c272', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('abe2143e-17cf-49ad-96ce-1d735f4c246f', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('ef9e34d8-e876-4de3-af3d-912578e84abb', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('bf9b6677-ae33-4d63-b980-ba5cdf649367', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('8e4b31ff-5114-459d-8b90-0c3de27bd732', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('f41e0f95-70ee-46ea-bebe-efc1b705473f', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('d93b988d-c042-412f-bcf8-5624c7c5d33b', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('26353e00-282d-4ec7-9329-3d87d4c3d55e', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 1, true, 'The ''Golden Arm'' Deity (Grade B)', 'Mere mortals play cricket, but I am universally recognized by the internet as a ''Lord''. After winning trophies in yellow and touring through Delhi and Kolkata, the ''Palghar Express'' is finally pulling into the Wankhede to play for his home city. Who am I?', 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('7cd15692-8f15-4c05-b8cf-b479eebc331d', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('cbc5788c-9dd5-4f61-9faa-22a6940db7c1', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('7639bdd8-0f29-427b-af49-5fbc08848393', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('fac8d475-08c2-4b75-bd06-f353cfb195aa', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('116b1057-e7bf-4182-859a-ad3aa16412bf', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('4333cb2f-ed69-473e-b1db-2a85a99ddf91', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('199e8bb4-65a8-4dab-898a-f43ebbfa63d5', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('ab903628-e138-4e5b-928e-d396cd80f2be', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('770370bf-c4a4-41b4-a098-20e6ff9aae67', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('bf013095-7e34-42dc-8a7e-fe5dc8607f96', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('3f94fd6d-a2a9-4db1-95ec-582c739b959f', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('ad68b021-9e2e-4fba-b84e-05e2e3f2a485', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('1f80dd06-9976-427d-8fb1-416d4b8bbe56', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('9eb3829c-2129-486a-a0be-1c7847fba660', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('a5717294-79cb-4e3b-9fbf-8840468e86dc', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('24e01142-f901-44f2-8d9c-0d0722c4c367', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('8d2a3ac9-bd28-4f63-8dff-d98d36223cee', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('705037a0-24ec-42fd-a952-392e076431b1', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('1044d1ca-9f86-47e1-af37-8c202e823fc5', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('6c99c286-96d9-4162-9714-3470fca1a2d5', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('db3e001f-7b2b-4992-9982-3f8981491d11', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('0036597e-7827-497f-961f-24da8992da1e', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('b8c6a9ea-a68c-43e3-b3b2-66053e84b3d9', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('f3414cf6-bb29-4013-bce2-c4ae6e100eb6', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('47885eba-65d2-4258-a6da-a6c09a5207ca', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('fa111e74-5cdc-407d-9335-9ec8ddfa68c7', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('8042ea90-df03-4781-8b11-009d1e176d1b', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('a6cb9b9b-691a-4c9f-bbe0-895498b97869', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('6ee4e382-0106-4dcb-84c1-22e3470166b2', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('9c971000-9061-4aae-98b7-3a5af76998e4', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('b4ea462e-506d-40be-9601-92951d4356d5', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('b47a73d5-e8a7-4dea-90c2-22fedd791090', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('03b2096c-1b48-4930-b4ee-8392c81caf02', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('b230ce2e-591c-4844-a406-3bbf18dd0c42', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('ba8073a0-8024-4bfa-a724-ba9621169269', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('b3cc8d74-b397-4e20-97f3-a2cb89051c6b', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('1fea030c-d702-4925-861b-bb36f475d362', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('124de28f-20e4-4dc2-bc78-7380a5b5b328', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('298e47b0-8c0a-4a4b-bd4f-df9df27fbdcd', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('207361a1-5129-4dc0-865e-9a0b174965f8', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('0674ee7c-dea0-4b0d-a89d-4489cea17904', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('fe43530a-034a-4090-9fa4-361b5bf7aed0', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('0bcd7ac9-99a4-406c-b2f2-7900f051458f', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('c95d6378-7f97-4bf3-af0f-0f9405e01fbf', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('01f429d4-daf9-4776-9384-f9f9d86f6f34', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('2ec1093d-1dd6-43c2-8987-6d571bfd4497', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('54f5b011-4a4c-4428-b376-492393a31a5b', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('b811435d-dace-4aef-b713-2cc4aafd6fb0', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('6f935322-3adb-403c-a39e-3d3ff75e508c', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('a8d90cd4-8530-433f-b6f3-5dac66bb39be', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('fc6f07c5-bc56-4b69-a6b2-ed2508e63a87', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('bf662945-3f01-45b3-b637-de67b34ad692', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('3533e7d5-d837-4fdd-97d8-03d351ada428', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('8ec057f8-dab2-4f70-839d-1fb687f52fbc', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('e408e7bc-6357-41f1-844b-74cd8f36d86f', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('bdf4ab11-cb3d-48e0-be58-003f084080c4', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('273ee050-e7e3-43af-9032-0242ddebcb2d', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('6076c823-34d8-4d9a-b21c-9746336f9e5e', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('8e6d9e96-d7a7-4a34-94db-4d9b08b76f6a', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('f65a67b4-5fd5-4e55-a42b-8d81ec005195', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('1263fea4-b188-410b-87ff-46b7d3ede3e1', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('f1a34231-dd8a-450c-9af6-001dc7d032bd', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('83c8f7a6-18c2-440b-b94d-68067a4acf00', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('024bf114-88fc-482e-a1ce-d11c55589df5', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('938ea7e6-fe9d-43f6-9854-7a4c26d0865b', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('a8cc1105-47fe-4c9f-b256-b73ee79de8ac', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('02810f81-6cee-4dcd-9980-6008e97c6d57', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('30b29783-b511-461d-8c6a-03ca31887904', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('4b64f174-6b5e-4057-b7ef-97161a8d07d7', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('1581673e-bc5e-4780-a8ab-17973c47630f', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('182efdd2-596b-416f-8063-a858c1cc4c73', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('4ca5dea1-1c7e-4f41-8e89-7262f89b549e', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('60123b9f-d5cf-488f-a745-12494b7425ec', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('1820773b-8f40-48ee-a6ea-69d995f5f7e2', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('c039785c-ed83-495b-af6e-0934cf05d9bd', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('d4c9170f-9379-45d4-9c91-f92013449fa8', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('1e22ee42-bbf0-4ae4-bb8b-256f3f119dda', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('8df50e64-b17c-4d7d-af67-5839c7759022', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, true, 'The Injury-Defying Giant (Grade C)', 'I might spend a little too much time hanging out in the physio room, but when I’m fit, my tall left-arm pace is an absolute nightmare. My absolute peak IPL moment was coming back from a massive shoulder injury to defend just 11 runs in the final over against Tim David and Cameron Green. While others shuffle around in auctions, I’ve stayed put to lead the pace attack for the Nawabs in the North. Who am I?', 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('b4cadc71-b776-4898-99c1-2546c3817f8c', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('5b73cd07-a791-4927-a368-3edb3e86e920', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('696caa53-98b8-4576-8cbf-272367ce0510', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('f8d61fa1-5f80-426d-8786-f5fc8faba07d', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('0618b740-232b-4bce-991a-2d749cfa2fd5', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('3ca6ba7e-599d-4b0c-a551-1f2baf2b59e6', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('0ba1b72f-1a41-4f73-b18f-0b285c41a465', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('70fdc10c-9297-4ac7-a571-37dd9969278a', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('e49a72ae-16a3-4ac9-991c-0511c5ffe3e3', '92b38cab-94a4-4f85-93d6-f50827248966', 'UNSOLD'),
('0c11e017-4dec-4357-ad95-aa7360a892fc', 'c3788dcb-e2d8-4fcb-9f79-e7e3aed079a5', 'UNSOLD'),
('5045540d-4544-484e-8515-7808f1aaad71', '8c9d6066-6700-4404-afa4-61e071179ad5', 'UNSOLD'),
('8cbbd438-0033-4629-a535-1fa8d23cda5a', '8f3a69d3-7c1f-4b01-be12-b892a59c6aa3', 'UNSOLD'),
('8d8e821d-3020-4f77-903d-54a8bd3f75b1', 'd58a0073-f31e-46ba-9eab-2ed963578d36', 'UNSOLD'),
('adffaf4b-7af0-4880-b7e4-a0b98393e1c8', 'af868da7-9153-4a02-a1cf-4dd05b870fe3', 'UNSOLD'),
('0a93508c-f5b0-48ac-951f-b66e0d30daf1', 'f769eb13-0102-44a8-893d-8463b1a52848', 'UNSOLD'),
('9d5040ce-3200-4d9e-b20f-8f8037585301', '53e02ae9-7e5d-4bc9-ac9a-8d3db7e1350d', 'UNSOLD'),
('7e437eb7-1b40-4aec-b675-cc294aa7b37f', 'bbbef3d3-0a56-431a-9d6b-f0ef570ca865', 'UNSOLD'),
('94d46c11-2308-44d4-9071-5a42978c8ba5', 'd3ab7d51-b01f-4001-90d2-57f1ab854c84', 'UNSOLD'),
('2ceb8c18-c85d-414b-94e7-d81b6dcd3c61', '56357268-08d4-47f2-ace6-7c6823346ce7', 'UNSOLD'),
('bd862655-dc67-4d9b-991e-919469ab39bd', '10dc300f-8229-4612-a97a-d66b23df49f0', 'UNSOLD'),
('7e982ad6-59f7-4b8c-9a0f-c89c498264f0', 'e50a14ce-9ddc-40b9-b3ca-2e92fde07e50', 'UNSOLD'),
('9df82077-1d6e-4b23-bce1-4b621b22a176', 'c50ab6b5-e6e8-4481-acf0-f7afbbe2112a', 'UNSOLD'),
('20428063-1b5c-454f-b88d-93f086852e65', 'dcb897a1-1724-464d-8763-4cdc0f957fdb', 'UNSOLD'),
('7a2f31fe-22c6-47ec-9f96-0365b4885057', '36fb0d8a-1767-45e8-abbc-bdaf92b6dfe2', 'UNSOLD'),
('509bb5e9-d3f8-42eb-9985-dd9d8d747439', '52901235-ad76-487d-8446-7810013ed237', 'UNSOLD'),
('5d3034bf-e21a-41d9-aeea-d6f28e0767cf', '22ef5050-3aa0-4350-b792-e063e086bb95', 'UNSOLD'),
('4b71bec4-9f7d-42d8-84ef-97a5ff431f98', '3bc44978-b61e-433b-9c94-76bc7f669209', 'UNSOLD'),
('f836af07-d9f7-46e0-b9e0-35954555f475', '8e7b663b-5340-4c34-8a11-49273a721e08', 'UNSOLD'),
('663adbff-30ed-48bd-b28c-025cff523d25', '90b2b2a3-cb8e-4840-a4bb-3b85639e1570', 'UNSOLD'),
('0281461c-62c9-4afc-9981-ce99e774a1b5', 'f31f8d76-93e6-424d-b9c4-f98fc7bf746a', 'UNSOLD'),
('b8402e30-cd07-465e-b62e-56c9eeda047a', '21be50b8-4321-498c-ae3c-a8a7ea392e0f', 'UNSOLD'),
('55e37cc7-34e1-4ced-a44b-37f42e0732cb', '616afd8f-4903-4734-9236-8e50b5f5cf18', 'UNSOLD'),
('bd4403fe-13ba-4aff-a1fa-1ae3ba03cdd3', '4b3a7c28-7358-4939-bdf6-c73f9ac210be', 'UNSOLD'),
('3f2a7bcb-978e-4c96-a386-b2f1025c3cc5', 'c9eefdac-28e8-4edc-b011-743bd02806eb', 'UNSOLD'),
('a6f0e33c-aec1-4700-972e-7ca09056b032', '6c782ff3-4851-4532-9cdf-55e397a87793', 'UNSOLD'),
('8c482724-04ad-4337-9d35-336396d29a81', '55ee4457-ae69-4e90-a7b5-12a5e9c0f076', 'UNSOLD'),
('52984c49-d55f-4b02-9c94-1c71a6bbfc92', '85b238e5-3d62-450e-8f79-f24fe6be9f8a', 'UNSOLD'),
('37795160-5635-4da8-909b-7f597762c871', '17508cef-5668-45a3-b9d4-db32940d7dcc', 'UNSOLD'),
('258238a2-e1b4-4993-a818-1137b06c1ce7', 'bd45898b-c441-4edb-a340-fb648e537a33', 'UNSOLD'),
('29f06ce5-bbc3-41e7-8148-4334c6619774', '7dc15847-1ef6-4bb4-b5ef-070eb8fd1770', 'UNSOLD'),
('d5ff97e2-538e-4531-99b6-9e526005fe28', 'd0e559fb-f56d-4b26-ba0b-3a4059eb934d', 'UNSOLD'),
('83914e8c-505f-410f-b329-f41daa383249', '4e01ac1b-235c-4c04-abfe-233ce1666f2a', 'UNSOLD'),
('1911d251-8dee-4d07-a692-5ee73486bb92', 'f55aea53-1b50-425c-90eb-52cc6350e145', 'UNSOLD'),
('5f0246d0-c15e-48a7-88f7-c556ae9c1e86', '9f22b4ff-ae09-4460-8ded-eeeb9a490909', 'UNSOLD'),
('abaf2136-23ff-4964-b4dd-547f04959e62', 'bfb8c299-3c89-4f97-b169-412f130dc349', 'UNSOLD'),
('6296daaa-9793-4a54-9aa5-356e0e5e51b3', 'ddc836f5-0f7d-4f5f-81ed-f3f30bce2edf', 'UNSOLD'),
('cb22f11c-e19a-498c-a5d7-a7d1d7089c13', '78f932ea-d8c0-48f2-92a0-d046117c2a57', 'UNSOLD'),
('4d39908a-b883-48e8-8312-8a2fbe6cdddb', '36fa9a0b-e854-4747-b9df-b607e1a13d6a', 'UNSOLD'),
('aea199b4-8fc7-471c-8d6e-6cb2e7e5a911', 'ed8f8b91-e5bf-4b4d-b726-a182e41675d1', 'UNSOLD'),
('f5704125-a8c8-424a-82fb-c4c5d9b6865a', '5e86951a-5274-4e2c-867d-e11ab9f6147c', 'UNSOLD'),
('f0aac162-28d9-4101-9f76-55fdb6d911ea', 'da85177e-2abd-4477-8ac2-e0a82c31e24f', 'UNSOLD'),
('754f5fbc-70c1-44d4-99aa-0a785461ef7a', '4aefda35-4fc8-443b-bfd7-df9fa8fe253b', 'UNSOLD'),
('c33869cb-0f4d-4ff6-853d-59ce5c47354b', 'c1dcafa2-4960-4741-965a-46726d03a3f1', 'UNSOLD'),
('6496a68d-a601-44d7-aaa9-d4913d1c61db', 'd4116ad9-069c-42d1-b97d-84bba0370541', 'UNSOLD'),
('243def46-8d5e-431b-986c-ea067b0015a4', '848399c2-54d0-416b-b720-492eb904b836', 'UNSOLD'),
('26a126d9-ff33-40a1-a369-cd2ed83d26a0', '90960a55-fdd3-4727-8157-8c87276ca55b', 'UNSOLD'),
('6e6987c1-d61c-4cf8-84be-6869d90d8c19', 'f717ecba-1e4e-4cb7-be83-bf1893bdadda', 'UNSOLD'),
('603bf523-e3fe-4cfa-bee4-ea7f5dc420a2', '171afe62-fcd7-4f26-99bf-ec07a37dc8d5', 'UNSOLD'),
('4c18f493-ea39-43f3-bba9-094de2904838', '7cbbb90f-9b76-4da6-9e80-eb12f2612bb6', 'UNSOLD'),
('d4a0ac58-9e4d-4476-8599-ad68d9ff1fc5', '681ed3c4-a08b-4534-9f61-c6cc24bd3a61', 'UNSOLD'),
('90688a1c-a1a3-44f9-b377-5d60dfe32ae1', 'd8c83097-24d3-40a4-9da2-829f7446531f', 'UNSOLD'),
('2fe4557d-5424-4399-b01f-b6a95729d3c7', 'c38e7b66-9cdf-4fdc-9fc5-7331a3473130', 'UNSOLD'),
('b4ce0de4-d066-405c-82a6-3728b60bba57', '78b4a761-4727-4f6c-a783-9cd99385fd3a', 'UNSOLD'),
('0e3694be-c7fb-4d41-8289-5cefc544da5f', '17a73fc6-3873-4c4e-a6b5-4e6449653687', 'UNSOLD'),
('84828dc7-1ee7-4fbc-9e2e-6ac5ee22761d', '31ea326a-389c-4a5a-8643-ffb18aa28cc9', 'UNSOLD'),
('7c4265af-e631-4758-83d2-288f8e9a0d8e', '27c40c93-b2e4-4b97-b266-3dea365e16a6', 'UNSOLD'),
('a6cd1801-c4d3-4966-9d98-fda228c095f0', 'ebd7c6df-12b9-411b-be57-2ab395abdee2', 'UNSOLD'),
('5a662943-8223-40e1-a24b-8291da781078', '4361b152-4fff-4184-a145-ef99235df625', 'UNSOLD'),
('c931c743-a2d8-49cf-977d-76c3eff73af1', '8b1a12be-c685-4c9b-a446-1d7d458a2f5f', 'UNSOLD'),
('a5cbae3c-9163-4f1e-bf00-46d5e6223138', '7c1b9359-bcd2-49a0-a551-1d4cb53f671c', 'UNSOLD'),
('758fc3c1-265f-4530-ab2c-9589795a19f5', '9ed0139a-f140-4684-86c7-2c91b4184c44', 'UNSOLD'),
('ea69029d-36b1-435d-a3fd-44b0fab5c676', '4d292a61-b542-4808-be0c-a28056c7600a', 'UNSOLD'),
('23e0ad2b-8c92-46dc-8a13-b8a4905b5d0c', 'a0f47bc0-bcd8-4d8d-914d-74acc5511cb9', 'UNSOLD'),
('d7aa1b67-3bcc-4deb-b49c-abbb95b4849f', 'e9d090ab-3097-466a-b17c-085c7cb9c272', 'UNSOLD'),
('ed137e4c-402a-4366-931d-caf47bc6d6bd', 'abe2143e-17cf-49ad-96ce-1d735f4c246f', 'UNSOLD'),
('682e7a7e-7784-4acf-8ff3-9497980d3f9e', 'ef9e34d8-e876-4de3-af3d-912578e84abb', 'UNSOLD'),
('41294790-22cb-4f19-8cc9-3813fb8bb34e', 'bf9b6677-ae33-4d63-b980-ba5cdf649367', 'UNSOLD'),
('6d8445ea-9e7a-419b-8bd2-1c685e4d897f', '8e4b31ff-5114-459d-8b90-0c3de27bd732', 'UNSOLD'),
('0eefb932-dabd-4f8e-8d67-89d8abf2d0c5', 'f41e0f95-70ee-46ea-bebe-efc1b705473f', 'UNSOLD'),
('031a140f-895e-4f04-839d-c0c9083418d6', 'd93b988d-c042-412f-bcf8-5624c7c5d33b', 'UNSOLD'),
('7ed0821e-7251-4862-b32d-4bf9fb12a53c', '26353e00-282d-4ec7-9329-3d87d4c3d55e', 'UNSOLD'),
('6b2fe549-07ab-4c55-9d6e-26a5799a7ac1', '7cd15692-8f15-4c05-b8cf-b479eebc331d', 'UNSOLD'),
('f2f4f054-9e09-49b7-adab-574b84da0da1', 'cbc5788c-9dd5-4f61-9faa-22a6940db7c1', 'UNSOLD'),
('5ccca706-656f-458f-b8e8-38a1c65d0652', '7639bdd8-0f29-427b-af49-5fbc08848393', 'UNSOLD'),
('72bfc9cc-c826-4f4e-a55b-37ec26e3d1a1', 'fac8d475-08c2-4b75-bd06-f353cfb195aa', 'UNSOLD'),
('7df898de-6cdb-41c6-81e8-4ae2e30c007b', '116b1057-e7bf-4182-859a-ad3aa16412bf', 'UNSOLD'),
('171d349f-3b6e-49a3-8911-002e32a5dfab', '4333cb2f-ed69-473e-b1db-2a85a99ddf91', 'UNSOLD'),
('fb243023-2365-45dd-87fb-bc89dc199b72', '199e8bb4-65a8-4dab-898a-f43ebbfa63d5', 'UNSOLD'),
('520e57fd-e450-4611-b272-608c1a2e4184', 'ab903628-e138-4e5b-928e-d396cd80f2be', 'UNSOLD'),
('7ddf1dc0-1b42-4502-b48f-321dfa250ecd', '770370bf-c4a4-41b4-a098-20e6ff9aae67', 'UNSOLD'),
('b32b41ee-b9c0-43f5-b5ce-2ee2c4fb96f3', 'bf013095-7e34-42dc-8a7e-fe5dc8607f96', 'UNSOLD'),
('9388fc75-804a-44ed-bbde-5d1c9fe17dd4', '3f94fd6d-a2a9-4db1-95ec-582c739b959f', 'UNSOLD'),
('77c7c8ab-d2fa-4232-8173-c615d7a881a4', 'ad68b021-9e2e-4fba-b84e-05e2e3f2a485', 'UNSOLD'),
('032316b6-ccb9-4afd-aa32-b0d7cf5bb647', '1f80dd06-9976-427d-8fb1-416d4b8bbe56', 'UNSOLD'),
('12e0434e-27b7-4769-851d-24c4ef64e053', '9eb3829c-2129-486a-a0be-1c7847fba660', 'UNSOLD'),
('29d6c53c-6f2a-4aaa-ae0d-0230bca87bec', 'a5717294-79cb-4e3b-9fbf-8840468e86dc', 'UNSOLD'),
('9e4de1f9-e83b-457a-8335-8731ccc726cb', '24e01142-f901-44f2-8d9c-0d0722c4c367', 'UNSOLD'),
('1226537c-73b8-46f5-9b9e-b8287ebf7604', '8d2a3ac9-bd28-4f63-8dff-d98d36223cee', 'UNSOLD'),
('5a6b44e1-e2e4-4848-a6ef-5517d288e81f', '705037a0-24ec-42fd-a952-392e076431b1', 'UNSOLD'),
('a4c96d46-9659-4509-92da-26ac82575975', '1044d1ca-9f86-47e1-af37-8c202e823fc5', 'UNSOLD'),
('1a9d315b-8cfc-4aec-8675-6e102d88a9da', '6c99c286-96d9-4162-9714-3470fca1a2d5', 'UNSOLD'),
('31e7c921-c2da-4c38-b324-ca2d21b69292', 'db3e001f-7b2b-4992-9982-3f8981491d11', 'UNSOLD'),
('0dd9651a-e144-46f1-9c18-e54c99f03623', '0036597e-7827-497f-961f-24da8992da1e', 'UNSOLD'),
('7f2cff88-336f-4d00-9166-4256be539636', 'b8c6a9ea-a68c-43e3-b3b2-66053e84b3d9', 'UNSOLD'),
('3cf7cc4e-dfe1-4f1c-a08d-2ad0231b927f', 'f3414cf6-bb29-4013-bce2-c4ae6e100eb6', 'UNSOLD'),
('19ad70d7-9075-45d4-952c-d039476f9a09', '47885eba-65d2-4258-a6da-a6c09a5207ca', 'UNSOLD'),
('f0166b5a-be0b-415b-947c-d417b9c9ffe4', 'fa111e74-5cdc-407d-9335-9ec8ddfa68c7', 'UNSOLD'),
('11ca6b51-1449-428d-a1de-7f899334e6e5', '8042ea90-df03-4781-8b11-009d1e176d1b', 'UNSOLD'),
('c55ae2b0-0790-4fbe-9a5e-2ab7e1f6062f', 'a6cb9b9b-691a-4c9f-bbe0-895498b97869', 'UNSOLD'),
('6ee451f5-e662-49ed-a501-dc8163bf883d', '6ee4e382-0106-4dcb-84c1-22e3470166b2', 'UNSOLD'),
('1e903a9f-19ca-4e1f-841e-74107ea2980d', '9c971000-9061-4aae-98b7-3a5af76998e4', 'UNSOLD'),
('cacbf1ee-d5d4-4db5-beba-f121002e624f', 'b4ea462e-506d-40be-9601-92951d4356d5', 'UNSOLD'),
('e7e7afb0-a4c7-45cc-889b-d343179391ba', 'b47a73d5-e8a7-4dea-90c2-22fedd791090', 'UNSOLD'),
('5908cf8f-541d-466e-96c3-980daf1517b0', '03b2096c-1b48-4930-b4ee-8392c81caf02', 'UNSOLD'),
('5f69f808-c9c7-405f-a846-361d131f21e7', 'b230ce2e-591c-4844-a406-3bbf18dd0c42', 'UNSOLD'),
('a5397536-f328-4e07-ae2d-067184fdc73c', 'ba8073a0-8024-4bfa-a724-ba9621169269', 'UNSOLD'),
('ca5b0a0a-7b07-4c25-bd6c-ce26f0b55ca2', 'b3cc8d74-b397-4e20-97f3-a2cb89051c6b', 'UNSOLD'),
('df04023a-84ce-4a31-8c86-12f5c79beda0', '1fea030c-d702-4925-861b-bb36f475d362', 'UNSOLD'),
('ced061c0-6914-41cd-8a0a-95ea86b341c3', '124de28f-20e4-4dc2-bc78-7380a5b5b328', 'UNSOLD'),
('00feaa11-e588-445e-acc5-51670583c02f', '298e47b0-8c0a-4a4b-bd4f-df9df27fbdcd', 'UNSOLD'),
('448bcef7-a58e-4993-908d-18416fcec3b5', '207361a1-5129-4dc0-865e-9a0b174965f8', 'UNSOLD'),
('94871e0a-06cc-48e3-b9f5-08d8204d4891', '0674ee7c-dea0-4b0d-a89d-4489cea17904', 'UNSOLD'),
('bca880d9-f217-453f-b591-a33443586b4b', 'fe43530a-034a-4090-9fa4-361b5bf7aed0', 'UNSOLD'),
('302cc59b-6a3e-4638-982d-60cd37864229', '0bcd7ac9-99a4-406c-b2f2-7900f051458f', 'UNSOLD'),
('9c38d7c3-21d4-4253-a394-7045ccb71376', 'c95d6378-7f97-4bf3-af0f-0f9405e01fbf', 'UNSOLD'),
('76694deb-d7ed-4678-a134-f6ff00a3f1ed', '01f429d4-daf9-4776-9384-f9f9d86f6f34', 'UNSOLD'),
('208a82eb-a6b9-4b79-a216-d8bbcaf969e5', '2ec1093d-1dd6-43c2-8987-6d571bfd4497', 'UNSOLD'),
('d1cbb79a-1825-41b2-8c59-a1b6b998ee56', '54f5b011-4a4c-4428-b376-492393a31a5b', 'UNSOLD'),
('1d157fd2-47d5-4d58-b95c-65a96489baef', 'b811435d-dace-4aef-b713-2cc4aafd6fb0', 'UNSOLD'),
('9eff1b1b-d0e3-4952-b85f-70dddad768e8', '6f935322-3adb-403c-a39e-3d3ff75e508c', 'UNSOLD'),
('a6cb6cda-a18a-4029-8a29-78945c50a588', 'a8d90cd4-8530-433f-b6f3-5dac66bb39be', 'UNSOLD'),
('7550df1c-dbf7-4d88-a8cc-09a27ed6efe3', 'fc6f07c5-bc56-4b69-a6b2-ed2508e63a87', 'UNSOLD'),
('373c389d-7f24-4617-8c6e-2e58a7ba1e86', 'bf662945-3f01-45b3-b637-de67b34ad692', 'UNSOLD'),
('5c1ed944-4367-4563-a0e4-b561f14a2598', '3533e7d5-d837-4fdd-97d8-03d351ada428', 'UNSOLD'),
('4ac5c84d-8a78-42fd-8c85-7e638c9cac7e', '8ec057f8-dab2-4f70-839d-1fb687f52fbc', 'UNSOLD'),
('599477e1-7b3f-4cbb-88aa-cb8fa65983a9', 'e408e7bc-6357-41f1-844b-74cd8f36d86f', 'UNSOLD'),
('d4acffe4-7f43-4fa2-957e-deeb7ba3b38e', 'bdf4ab11-cb3d-48e0-be58-003f084080c4', 'UNSOLD'),
('26c42d96-f80c-486b-9958-688ec393f5a5', '273ee050-e7e3-43af-9032-0242ddebcb2d', 'UNSOLD'),
('db310f37-4a54-475f-8af9-f78e69a6cf66', '6076c823-34d8-4d9a-b21c-9746336f9e5e', 'UNSOLD'),
('44f9eb2b-c66b-47c4-ae31-c89eba586ce5', '8e6d9e96-d7a7-4a34-94db-4d9b08b76f6a', 'UNSOLD'),
('c05239a0-b478-4740-8720-d333f411d311', 'f65a67b4-5fd5-4e55-a42b-8d81ec005195', 'UNSOLD'),
('4b8b44cb-a484-4ec1-82e3-292ccbcffe0e', '1263fea4-b188-410b-87ff-46b7d3ede3e1', 'UNSOLD'),
('5a739134-c228-484a-b67c-6a616b63511a', 'f1a34231-dd8a-450c-9af6-001dc7d032bd', 'UNSOLD'),
('48f48037-d5c0-4c31-9b6a-4f384619c07f', '83c8f7a6-18c2-440b-b94d-68067a4acf00', 'UNSOLD'),
('a86efc4a-de57-4060-aa62-7244e4d16dc3', '024bf114-88fc-482e-a1ce-d11c55589df5', 'UNSOLD'),
('13f4e55a-0368-415e-a408-fd006691e455', '938ea7e6-fe9d-43f6-9854-7a4c26d0865b', 'UNSOLD'),
('3ccecaa4-5502-4eab-b66d-6850196dd8d3', 'a8cc1105-47fe-4c9f-b256-b73ee79de8ac', 'UNSOLD'),
('71d74c24-9809-4fbb-bccf-65b42773a4f6', '02810f81-6cee-4dcd-9980-6008e97c6d57', 'UNSOLD'),
('7f9e6c27-5cb5-4781-a5b5-a92389f8ed29', '30b29783-b511-461d-8c6a-03ca31887904', 'UNSOLD'),
('e2331608-8ae1-400a-92a3-7cc50dfd41a0', '4b64f174-6b5e-4057-b7ef-97161a8d07d7', 'UNSOLD'),
('59aaeba1-c1f4-4aeb-98a5-a99512c27223', '1581673e-bc5e-4780-a8ab-17973c47630f', 'UNSOLD'),
('f49e0031-2776-47bc-81c6-b5dd9ff4aaf5', '182efdd2-596b-416f-8063-a858c1cc4c73', 'UNSOLD'),
('e1fa9a7e-5779-47eb-bba8-c8e0875d6af2', '4ca5dea1-1c7e-4f41-8e89-7262f89b549e', 'UNSOLD'),
('37b2dfb1-2fdd-444e-a2fa-b9d2342c33eb', '60123b9f-d5cf-488f-a745-12494b7425ec', 'UNSOLD'),
('d34c76d6-0022-4eef-9379-fc6d9dc849fc', '1820773b-8f40-48ee-a6ea-69d995f5f7e2', 'UNSOLD'),
('32893499-67ba-494e-ab7f-78c7fbf63bee', 'c039785c-ed83-495b-af6e-0934cf05d9bd', 'UNSOLD'),
('5e133281-21dc-4e49-a1bf-24004d1dc97e', 'd4c9170f-9379-45d4-9c91-f92013449fa8', 'UNSOLD'),
('1a7d327b-aa9e-4bde-808d-f177c2b35afa', '1e22ee42-bbf0-4ae4-bb8b-256f3f119dda', 'UNSOLD'),
('5a01ef77-2a61-417f-8490-d24f4a1bdca7', '8df50e64-b17c-4d7d-af67-5839c7759022', 'UNSOLD'),
('8b19a1dd-0896-4b3c-9e59-3c324bf13212', 'b4cadc71-b776-4898-99c1-2546c3817f8c', 'UNSOLD'),
('10eade14-3782-42f5-8bdb-62fb65febb9a', '5b73cd07-a791-4927-a368-3edb3e86e920', 'UNSOLD'),
('80b833b6-fa5f-4b1b-963d-f9c51b0cc08e', '696caa53-98b8-4576-8cbf-272367ce0510', 'UNSOLD'),
('dc697fb7-7387-44e9-8b03-ac27190283dd', 'f8d61fa1-5f80-426d-8786-f5fc8faba07d', 'UNSOLD'),
('b71c8217-550f-4c51-bcb5-a837654740d5', '0618b740-232b-4bce-991a-2d749cfa2fd5', 'UNSOLD'),
('8ff9b22d-3d5f-4d86-a5ef-0fdaaf9093bf', '3ca6ba7e-599d-4b0c-a551-1f2baf2b59e6', 'UNSOLD'),
('25fbe0a3-5a3a-471b-a63d-46a025dba067', '0ba1b72f-1a41-4f73-b18f-0b285c41a465', 'UNSOLD'),
('13efcaae-84ef-46d1-86fa-76642066c600', '70fdc10c-9297-4ac7-a571-37dd9969278a', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('f721c7ed-522c-4933-9d70-57654eeaf720', 'admin', '$2b$10$EJnw1dI2fla9WnD9zHd5v.hJvzW13yaHtYVO12LazucSL1kZOGvQG', 'ADMIN'),
('cf8a3330-0b59-4117-96fe-fd017264ae83', 'screen', '$2b$10$1nHnF4Dxp0iPw9ax6YPXsey2b77uAWA4vD0/HYcm0xIcDRHiAYklu', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Franchise Sequence', 'FRANCHISE', '[3,4,2,6,8,7,10,9,1,5]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(2, 'Power Card Sequence', 'POWER_CARD', '["GOD_EYE","MULLIGAN","FINAL_STRIKE","BID_FREEZER"]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(3, 'Player Sequence', 'PLAYER', '[134,137,104,138,100,115,117,37,87,141,53,143,29,5,42,78,86,154,71,131,105,32,116,91,118,94,54,112,27,90,119,25,65,135,103,108,26,145,157,150,23,47,15,69,77,123,122,16,39,17,44,43,124,114,149,156,140,158,130,75,73,88,41,56,129,120,40,97,19,93,98,109,38,61,8,82,139,101,55,48,11,84,142,68,132,95,72,10,58,80,31,81,57,28,155,159,63,66,34,126,96,110,36,148,13,127,153,50,9,133,136,83,74,59,60,20,113,102,14,52,106,4,79,144,46,22,51,45,147,1,33,152,2,70,107,121,62,99,35,89,92,128,12,151,76,111,21,67,64,30,85,6,125,18,49,7,24,146,3]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

