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
('4c63d27b-b1fe-45f3-b5dc-02635718aa0f', 'Team Alpha', 'alpha', '$2b$10$9sfcE5XrrzArgFtTXOzVKuDK35iPraNusTqVl0ZZUKb5mEKp6t4ui', 120, 0),
('268e915f-480e-4d74-b437-02e3af0a6496', 'Team Bravo', 'bravo', '$2b$10$CFJ7fscDoeXAdSTBqUfRieIiPwNWNS9Xn31hw6a4HfT2ZKmwhQJeW', 120, 0),
('bc5f7d78-a911-4f3f-b16a-d1cfec4b3bb3', 'Team Charlie', 'charlie', '$2b$10$y9IrYsjO7upPcIOVGm8tj.G88rFY9bC8WAzrMN37rl6FTg9Ba3j62', 120, 0),
('1e9e8be7-92b3-4b5c-b5cb-14cf8cabbe15', 'Team Delta', 'delta', '$2b$10$iNqMLghUmYJE2dSCDH2EDO.c2mJgUofI.Bknnruv4uB3kMfLi3a0q', 120, 0),
('8b2e32c8-cfc5-4fe1-b157-e97fb370b434', 'Team Echo', 'echo', '$2b$10$LSnCvURdu7eThVDOXa3/6O5Wv9xl1gSjTO8XEihQ48uM/MZgvagMC', 120, 0),
('da2d751f-5094-4ee9-ae11-f6bea3fa1764', 'Team Foxtrot', 'foxtrot', '$2b$10$Q2Uso/p4waqVT/7bCMwZhO5OcdUEBlYlKZb4Q6lwwtgtOE1jqpAXm', 120, 0),
('24b94fb3-23bb-4ab1-9ec5-13c634640c1a', 'Team Golf', 'golf', '$2b$10$gH49.TrJRYwaUv0TodRTTOnnQc2pgsiUvV63fD5VQR.dBEVrmvC9y', 120, 0),
('ccebb69d-3af6-4c7e-9cc1-31647b43ada0', 'Team Hotel', 'hotel', '$2b$10$ky6qOtGLRRWabP.fY08MdO37WD74UQbm6vZA1souLu3aGbineR2oq', 120, 0),
('2245750b-e5d0-4190-a2e9-421893ccb5f5', 'Team India', 'india', '$2b$10$AAtveS1yH7QhemrlN8A2nOYZpBOoomdTZws798QcKpY3PBZiZ2phy', 120, 0),
('0998eb0a-db28-4a39-86e9-1edd8e31dba6', 'Team Juliet', 'juliet', '$2b$10$l7DXiJJSi1Gk5XG4TXXwteb1FuwSOKBKyGHWL/X4pMQ0d/bukE3E2', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('50544bad-3145-4751-aebf-4f1cf53bf5cb', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('9f903ddd-ea75-4584-9dba-795e8b522408', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('c535c48d-11c1-4a6d-9371-a12f8b096134', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('f3a927fd-642c-4b2c-9a71-8f3f095a7f0e', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('441803bc-f725-498c-ba56-66c97271dd0c', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('28ec666b-05d3-44d2-a21e-0ae5a21e9ca3', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('9a1d3ade-b038-4541-a886-13c405775927', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('b3ba8d7a-5a60-414c-bb82-1f279bb01d21', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('235481d3-ab24-4799-8a83-8c995baaad4a', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('5f70f64c-a401-4b8f-b73e-9ee82d2a7f45', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('c9d5e554-958d-47b2-9f16-4e7c4badede2', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('c71e0ac0-5a9e-4fcb-a31e-c161c43ff741', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('ffb62dc9-21c5-45cb-be63-6b7155d66ebe', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('2209520d-6654-40f5-acc9-e926f780cadf', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('59aa73b8-d4ca-4dfd-92bc-36d929ea5060', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('4d0d11c3-f900-4e81-818e-4b6093eaebce', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('b6428fb3-9d29-4603-bd7d-963ab3871cc1', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('8a6ce9ec-83e6-4d19-a5a8-10a70499a652', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('ceb3c609-b44c-4059-a82e-9294700e5696', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('0e356b8a-346b-4d97-be85-9afa8bfeb0d1', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('ada1e8c5-89c2-476f-b43d-119c581c00e2', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('a6401c7a-1e0d-430e-b3b3-8a1f52036cba', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('a7bc2c88-c463-4919-b6c1-f4f21165804f', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('093d6eab-2497-40b7-baec-ade079943f8a', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('4788fa60-7ce5-469d-be3c-7adcb971ce15', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('8cab2cd5-77db-4129-97ae-5900f85b3e71', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('0d75839b-2e12-4b77-8f1e-3fbd34c3ed07', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('a03d76de-1961-4fde-9509-1bc356a87cc8', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('65f080cb-8e16-45a9-95d9-25bc38d82e64', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('c208ec58-6087-4948-8bca-57378103ec02', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('4648944f-2648-4910-9646-90bbd6ff3e2a', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('1d534ae2-48cc-4ba7-9a1e-478eef6a532a', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('36bc0899-aef2-4f83-bb6b-5badd377a28f', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('b46796b3-28bb-43df-83c6-6c44c4a4c9f5', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('58bd7a44-9a64-4b80-be0b-89c37c4913a2', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('0f64971a-3b05-4701-8e08-315cc7c2843b', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('860b3e28-24e3-4020-8417-3d8d8032295b', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('4c02f8e0-29f1-43d8-adb3-50a030085b6c', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('b38b314b-bed2-4c6e-a760-fda27c12cfee', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('a4492e7c-d0fa-434b-902d-c3d62e7f2563', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('b520492e-e997-44e8-8767-75f797910eee', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('00efe3f1-5bb5-44c8-98a6-af0d203cfd43', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('95764485-fdf2-4693-90be-2e0d1c7414bc', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('c969805b-2ce6-4da6-b1fa-1fa219b6a8ca', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('cde15e12-4e03-4512-97e9-298d87318227', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('e8d6c8d9-abd7-480f-9919-668bec9844b9', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('1f551544-274c-478e-b18a-9c280f149f3b', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('f1247f23-6bfc-4055-ae63-0ca0b676f9ce', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('1abda6d3-aba1-4181-93ab-1bb9f35a921c', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('dc1a37b5-a659-4f28-ad6a-dc1addd1fc84', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('2031b6e6-ae37-4f98-9734-5709e3a70d88', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('7128c731-98df-4762-8c27-497e5cdb3163', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('48e00b4a-ce89-4674-bc9e-8b8123f7793d', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('60019392-fa8b-409d-9884-2aefced4a80a', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('79cb3a2f-825f-453d-b676-442d96218b3f', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('5d6f1b5d-d736-46b2-9fc7-6ca3690bb455', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('b086e8ce-aa63-4183-83db-d1323cbe63e4', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('a95ff1e5-7adf-4937-8eec-82e1ece49dae', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('e60a101c-4ce9-4baf-87b7-764591375064', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('d927988f-0211-4c2a-a3c3-957d8ca56ad6', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('7fc45ba5-3847-49b7-b7e2-d4b2e5a32a4b', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('cf4ec2be-b2f0-4656-905a-48901fd7c7d1', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('b5307ac9-b705-444e-94eb-11fbc7ade63a', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('1c80877f-daa3-4931-8589-2804861b0079', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('142eb8a4-759d-4a96-bc45-eadf694d128f', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('54927f15-73de-4f90-9095-e5f626863f4a', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('2fedbadd-44b9-48a1-8fd5-197a0bc9c83d', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('543eb432-22a7-473d-b029-b4ec7d4161af', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('2ae49087-9675-426f-a5ac-009487136dd2', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('02588e22-e0bb-4dfd-b7a9-464c25883d3d', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('c4b59df2-d449-49b9-bd9d-8655b5476fe7', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('86cae072-3f67-4424-b8c8-0d4f1d38a658', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('845a8ecc-aaf1-4c53-aa3a-c7224d68c5fc', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('217ccce6-c43f-4127-ace7-227d7f8635eb', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('58142d0f-93f8-49f8-b72c-1a6aadfa2f9e', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('e48d5c77-222d-4fec-9405-332bef104bed', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('9d377854-f055-43e4-90b2-796fabd3f271', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('a41a62fd-db3a-426c-b115-3d72d23c65b8', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('6a2cee5f-f155-4856-b015-ac472629191b', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('1f23c33a-1eeb-48d4-b191-4d93594c5f52', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('070fea6e-97b0-42f2-a617-730f1bc0aec8', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('701879a0-7709-454e-b60f-6c54e8fd2118', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('3400f841-fdf1-4a4a-83b9-5488f0941698', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('5ed7a890-acff-4d74-9387-1a04e6feebef', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('b99bedbc-fd5d-4f2f-b58e-8233083fe838', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('563825b0-c27f-420a-9d9e-8ffaa3355791', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('f6151902-bd81-463c-9c1c-d8f94a7a63dd', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('ab2cf120-01c5-40ce-84df-0bbb97574523', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('d698a797-cb39-414d-a2e3-2f32f131916f', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('af5caf66-2a89-47af-b1de-05f56294fefd', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('8e90cf65-e9d9-491d-9a5f-aec54246b81d', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('018d1857-c470-479e-8b67-cda01259206b', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('990769f1-34a8-47ae-a0ef-cff7327dcc64', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('88ff7985-0286-45d6-a298-f4288aba62d3', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('40190c1c-edd6-4f67-a0d2-9946780f5b0d', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('86fb8b44-13dc-4a3b-94e9-e549a4bb9c30', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('4ed7da7a-73af-4326-ad79-63a6ed856327', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, true, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('859dea20-9b00-42d9-b991-8ce37b0db486', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('ecde1f4c-17f6-4e16-9219-63b751a93edf', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('a806bc5c-1b23-44db-a012-89bf832240fe', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('61e68266-9744-49d9-b980-f5a3f747cf57', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('c08056b9-d7d3-4792-a7ac-86fe53172056', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('a57fa102-ae06-4694-b83b-fbfacc05dd01', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('700e3101-2324-418d-a935-b9cc11a7d20e', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('800824d3-e2d0-47cf-9b73-85f092be852c', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('7a8f25fa-3a9b-448e-ac9b-d2da8de620ea', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('c90584a1-a7a0-4c04-8944-c9f280b9e142', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('77037444-aead-4bc7-a496-3eb47b1007df', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('bd53ec2b-fbd9-47f9-841b-95edccc59770', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('93ee1264-5108-46a7-ad19-6d53459e890b', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('78495b75-1da4-4b47-ac62-10a17fd0308c', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('a51bc99e-809d-47e0-8378-e466a91447a2', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('7bada71f-cab8-4d15-84e0-9406e7d323be', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('94e4eb03-356b-41fe-b9ac-fe47392eaf41', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('d0c4555a-bff4-4732-8613-f6028eef5794', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('4acb110c-83a2-4096-bc45-e54de594bc8c', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('22957c68-2f73-4ebd-93b7-a3d1e9c127ee', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('1730943d-f81d-4827-a4f1-e20516bfec70', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('bc910343-3c5c-4580-adbb-d4a7e444f9e5', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('7dbe8404-ae65-49ad-bcb8-a1fefa1437c9', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('b9a40db1-7fef-40d6-a7fd-ed6b7e69aed6', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('332c1cd7-932d-4e2c-9abc-42e9bccee6c2', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('21751450-74c4-4f8b-bf2f-d66b15f34d18', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('86e66317-ad20-4c69-b626-d7d1e47d2cb8', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('f4851fe1-a836-4ee8-bd4f-e310d7dc3522', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('d6faee56-d099-47af-af06-3381e726e7d4', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('ddfb3ac5-31f5-476f-8481-c6151f33a7c7', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('129db252-2b10-41de-9ab6-66d902790f3b', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('5b42b012-d857-4fc1-851e-53a8585f53ac', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 2, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('135fbe0e-fdf9-438b-9c9e-5610d0c8ce85', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('9bf98232-f909-46de-890a-27e908ce7ffa', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('74407e1b-dea8-4a32-a984-5db14e3b3635', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('89fb2268-683e-4627-bbb4-cf358a45245b', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('cf6ebfa4-3a11-44a2-868c-5f47bcfae3b2', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('b01b4907-0032-4309-beda-198fff370dc8', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('63d64e32-6ac4-42b6-ae68-188a8d251277', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('71140557-b0d7-436a-a6db-362c31fceb68', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('74157539-81e6-48bd-825c-98dca8ff2e19', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('3df7829d-ab93-4b75-b74e-d4626eff0f64', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('019825f4-64da-468e-b93e-edeb0ef00470', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('85222d0a-3e1f-49fd-951e-545fdd0f7b3d', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('f058e5dd-8408-467a-81a8-4d3598f74f6d', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('53df321f-897d-411b-a4b4-baac45b8f098', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('a6e964a9-baa4-4c74-b687-8ca404ab0dd9', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('3433b9ad-8f1e-4e21-b77f-aa47ab980e38', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('6b9aa21a-c282-42ec-b8d5-dbd15f0f1674', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('333dd082-e351-4b9e-927a-949d2ea86845', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('064e46d2-4e04-4df1-8a3d-caf45e632b56', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('47ed328f-5239-4a9b-bd71-fca17085f56b', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('4a4021ea-e7fa-4fd8-9204-3c6ae9efbc45', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, true, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('577dbb73-09fc-4bec-ae7c-694078b432fa', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('45927d10-198e-4775-97e8-af423f5ae931', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('3375c693-1aae-4104-bf3d-5b3ef59a8fd2', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('06b78a22-faa8-4309-b7aa-9eea3e335bcb', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('889090d5-957f-4f46-bed4-b69708d9e1b5', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('425ce4c7-d6d5-4a28-ba1d-9d4e14279504', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('4843bce7-fbc2-487b-b9b3-3ab21e542035', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('854e9779-5171-4d5e-89d0-9366211be673', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('6175e781-c3ea-40c0-be95-eab5938fa105', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('22913759-b805-49ce-802f-6a70bfb798d5', '50544bad-3145-4751-aebf-4f1cf53bf5cb', 'UNSOLD'),
('04108d0c-bccb-436c-893c-0de9902a4e43', '9f903ddd-ea75-4584-9dba-795e8b522408', 'UNSOLD'),
('9436735f-cef6-4d59-b1c0-6eeed8e04bc2', 'c535c48d-11c1-4a6d-9371-a12f8b096134', 'UNSOLD'),
('b3993a53-806b-489e-adc9-58c1da54b75a', 'f3a927fd-642c-4b2c-9a71-8f3f095a7f0e', 'UNSOLD'),
('9995592e-02c7-4923-9151-6124ffece88d', '441803bc-f725-498c-ba56-66c97271dd0c', 'UNSOLD'),
('735d52f3-1d71-4b0a-91cb-60a6e54fa9d5', '28ec666b-05d3-44d2-a21e-0ae5a21e9ca3', 'UNSOLD'),
('ab9226b2-3edc-4ebb-9132-223085ab26da', '9a1d3ade-b038-4541-a886-13c405775927', 'UNSOLD'),
('f457f49c-f312-4df0-8e7f-d7a332c98032', 'b3ba8d7a-5a60-414c-bb82-1f279bb01d21', 'UNSOLD'),
('3be7cd20-69f2-4a65-9486-5f91800d55d3', '235481d3-ab24-4799-8a83-8c995baaad4a', 'UNSOLD'),
('27a0371f-60ba-41d7-878f-4593527aa827', '5f70f64c-a401-4b8f-b73e-9ee82d2a7f45', 'UNSOLD'),
('a3ae6e74-22ae-439d-a1e5-5bd5412aaf89', 'c9d5e554-958d-47b2-9f16-4e7c4badede2', 'UNSOLD'),
('cf7b5c5f-b9bb-4fc5-b914-ac73be79ee8f', 'c71e0ac0-5a9e-4fcb-a31e-c161c43ff741', 'UNSOLD'),
('f6a103b6-1b99-4404-a85c-fd165dd681ed', 'ffb62dc9-21c5-45cb-be63-6b7155d66ebe', 'UNSOLD'),
('5d32f1d9-72c4-43aa-b68d-f87d95d857d4', '2209520d-6654-40f5-acc9-e926f780cadf', 'UNSOLD'),
('660ba5da-1878-4c67-895b-04b08193fd26', '59aa73b8-d4ca-4dfd-92bc-36d929ea5060', 'UNSOLD'),
('612d7fb4-5b22-4f8e-863a-df3f76ffce60', '4d0d11c3-f900-4e81-818e-4b6093eaebce', 'UNSOLD'),
('1d164b17-f5bb-4627-9cd2-9fa62dcf8a85', 'b6428fb3-9d29-4603-bd7d-963ab3871cc1', 'UNSOLD'),
('8cc735c5-1133-40bc-b209-cc65e3986b44', '8a6ce9ec-83e6-4d19-a5a8-10a70499a652', 'UNSOLD'),
('bbe6f949-997d-4115-9753-0983c1f732da', 'ceb3c609-b44c-4059-a82e-9294700e5696', 'UNSOLD'),
('7fe66e47-5f56-4bad-be42-ee0c19dba310', '0e356b8a-346b-4d97-be85-9afa8bfeb0d1', 'UNSOLD'),
('78e3aecd-8956-4f69-8679-988fcf44079d', 'ada1e8c5-89c2-476f-b43d-119c581c00e2', 'UNSOLD'),
('d4c6fe00-fc56-47c1-98f4-1cba099fb087', 'a6401c7a-1e0d-430e-b3b3-8a1f52036cba', 'UNSOLD'),
('c0553f70-ba26-424f-9a5e-754721aef926', 'a7bc2c88-c463-4919-b6c1-f4f21165804f', 'UNSOLD'),
('23ae2a85-7c6e-4010-89a4-c5e6c6d6df18', '093d6eab-2497-40b7-baec-ade079943f8a', 'UNSOLD'),
('06d458e9-7013-4f96-98db-68883624ebfb', '4788fa60-7ce5-469d-be3c-7adcb971ce15', 'UNSOLD'),
('d52b7cf3-db96-4e1e-9b46-5391ad5c803b', '8cab2cd5-77db-4129-97ae-5900f85b3e71', 'UNSOLD'),
('ff23cbe9-bfdf-4732-81eb-7426c02b365d', '0d75839b-2e12-4b77-8f1e-3fbd34c3ed07', 'UNSOLD'),
('f215f41e-30bc-4081-9c79-60c075ff4d23', 'a03d76de-1961-4fde-9509-1bc356a87cc8', 'UNSOLD'),
('3168e289-41bc-4d0c-8276-d8be88f684fa', '65f080cb-8e16-45a9-95d9-25bc38d82e64', 'UNSOLD'),
('1ccdbafb-e934-4a08-af1b-d28eb06d4c0d', 'c208ec58-6087-4948-8bca-57378103ec02', 'UNSOLD'),
('a638b3ae-1f66-49bb-a9f5-467147beffa9', '4648944f-2648-4910-9646-90bbd6ff3e2a', 'UNSOLD'),
('8a46d3a3-a44c-4b15-9638-af202f8eb5ac', '1d534ae2-48cc-4ba7-9a1e-478eef6a532a', 'UNSOLD'),
('2a695a45-5535-4067-8f35-544716f44ff8', '36bc0899-aef2-4f83-bb6b-5badd377a28f', 'UNSOLD'),
('beed21b9-0505-495e-92ac-662ff7f03084', 'b46796b3-28bb-43df-83c6-6c44c4a4c9f5', 'UNSOLD'),
('fb9fc5ed-033a-4508-a4cc-20a021961f78', '58bd7a44-9a64-4b80-be0b-89c37c4913a2', 'UNSOLD'),
('d312cb7b-89b5-45e4-90f2-7d8c7a7cfff6', '0f64971a-3b05-4701-8e08-315cc7c2843b', 'UNSOLD'),
('bf54a732-8257-4753-afed-ae461a8050e0', '860b3e28-24e3-4020-8417-3d8d8032295b', 'UNSOLD'),
('b3b9cadf-2d92-44dc-a090-50f562b8aac7', '4c02f8e0-29f1-43d8-adb3-50a030085b6c', 'UNSOLD'),
('1c63483f-53a5-4eb2-ab45-2a9643f8199f', 'b38b314b-bed2-4c6e-a760-fda27c12cfee', 'UNSOLD'),
('4f88d496-0b22-4f96-96fb-6a6b44d30c15', 'a4492e7c-d0fa-434b-902d-c3d62e7f2563', 'UNSOLD'),
('61e83263-10f7-4260-a48d-41cd5838173f', 'b520492e-e997-44e8-8767-75f797910eee', 'UNSOLD'),
('ac1bb53f-9e5b-4d40-96c5-bea45e91d143', '00efe3f1-5bb5-44c8-98a6-af0d203cfd43', 'UNSOLD'),
('eb60d176-9320-4fdb-bce7-d6332f0dfe69', '95764485-fdf2-4693-90be-2e0d1c7414bc', 'UNSOLD'),
('78909519-0194-4b44-8f8d-65682ecd7906', 'c969805b-2ce6-4da6-b1fa-1fa219b6a8ca', 'UNSOLD'),
('1138e1b9-40da-41b1-9c0a-64b027a912c3', 'cde15e12-4e03-4512-97e9-298d87318227', 'UNSOLD'),
('7ddc568b-227d-4596-af34-5e7d0ad9521f', 'e8d6c8d9-abd7-480f-9919-668bec9844b9', 'UNSOLD'),
('7e1d1c40-e138-4d5f-9256-5caac96b8dc9', '1f551544-274c-478e-b18a-9c280f149f3b', 'UNSOLD'),
('5c423c3a-1e27-4c22-bd8d-1d025380b868', 'f1247f23-6bfc-4055-ae63-0ca0b676f9ce', 'UNSOLD'),
('d5469bfa-ab2b-4b2a-bb2b-5353744322b8', '1abda6d3-aba1-4181-93ab-1bb9f35a921c', 'UNSOLD'),
('2e504da6-e09f-441b-83dd-fcf558d2fce4', 'dc1a37b5-a659-4f28-ad6a-dc1addd1fc84', 'UNSOLD'),
('97587147-2ac5-402f-8b04-01faba1bb766', '2031b6e6-ae37-4f98-9734-5709e3a70d88', 'UNSOLD'),
('2e953875-5b59-4b00-9204-e92dccb4ab91', '7128c731-98df-4762-8c27-497e5cdb3163', 'UNSOLD'),
('494a0e54-992e-42be-8616-73e5cc852d43', '48e00b4a-ce89-4674-bc9e-8b8123f7793d', 'UNSOLD'),
('fe7ad10a-8e73-437d-9cbc-01d8cfae6765', '60019392-fa8b-409d-9884-2aefced4a80a', 'UNSOLD'),
('81176021-83f1-4217-89eb-f7ae2834fa21', '79cb3a2f-825f-453d-b676-442d96218b3f', 'UNSOLD'),
('cfb8e22a-7899-4859-86b6-acadf3dc5ae7', '5d6f1b5d-d736-46b2-9fc7-6ca3690bb455', 'UNSOLD'),
('856b91e2-0aa6-4fc1-b8d7-b940dd2509ad', 'b086e8ce-aa63-4183-83db-d1323cbe63e4', 'UNSOLD'),
('4b690d1d-3f17-4389-9606-928b7a4d596a', 'a95ff1e5-7adf-4937-8eec-82e1ece49dae', 'UNSOLD'),
('ad56b852-4b39-47d0-96d6-3b79d9a87c49', 'e60a101c-4ce9-4baf-87b7-764591375064', 'UNSOLD'),
('f0387d5d-fe88-4321-bd26-518c4a2139a5', 'd927988f-0211-4c2a-a3c3-957d8ca56ad6', 'UNSOLD'),
('909802d9-6243-4808-9865-ee55ef84cfd7', '7fc45ba5-3847-49b7-b7e2-d4b2e5a32a4b', 'UNSOLD'),
('61c893af-1ec8-4243-8ed0-a40f4ce25dfb', 'cf4ec2be-b2f0-4656-905a-48901fd7c7d1', 'UNSOLD'),
('24a2c84c-9713-40a9-96a0-0a746934b59d', 'b5307ac9-b705-444e-94eb-11fbc7ade63a', 'UNSOLD'),
('a8a94fc9-796f-46b0-a40f-6c14df882cdd', '1c80877f-daa3-4931-8589-2804861b0079', 'UNSOLD'),
('508e7613-0ccc-4458-9703-53c06a1b3cd2', '142eb8a4-759d-4a96-bc45-eadf694d128f', 'UNSOLD'),
('e1454a53-3e4b-40d3-9999-d4d240f5b557', '54927f15-73de-4f90-9095-e5f626863f4a', 'UNSOLD'),
('c77e1e4b-5b13-4d0f-bdfa-e8b591a1a124', '2fedbadd-44b9-48a1-8fd5-197a0bc9c83d', 'UNSOLD'),
('21f04a11-2e98-4fb5-8e42-7c29d0e8364e', '543eb432-22a7-473d-b029-b4ec7d4161af', 'UNSOLD'),
('2bcaf88b-cfdd-4046-abdb-3c9f4530f852', '2ae49087-9675-426f-a5ac-009487136dd2', 'UNSOLD'),
('659f898f-a890-4750-b239-087420e00539', '02588e22-e0bb-4dfd-b7a9-464c25883d3d', 'UNSOLD'),
('a2be23c6-268b-4d13-9f48-5a5a7fc62a8b', 'c4b59df2-d449-49b9-bd9d-8655b5476fe7', 'UNSOLD'),
('09364147-a647-4214-ab9c-01e4301bcfbf', '86cae072-3f67-4424-b8c8-0d4f1d38a658', 'UNSOLD'),
('a36919d8-be63-4392-9a91-8e6b4c019549', '845a8ecc-aaf1-4c53-aa3a-c7224d68c5fc', 'UNSOLD'),
('60756c6d-ed2a-478b-bf26-59d0d0bbbf3a', '217ccce6-c43f-4127-ace7-227d7f8635eb', 'UNSOLD'),
('236339ca-df84-4539-a76a-bae1636f0324', '58142d0f-93f8-49f8-b72c-1a6aadfa2f9e', 'UNSOLD'),
('8f947c73-b328-40c8-9cdb-282fe54575d9', 'e48d5c77-222d-4fec-9405-332bef104bed', 'UNSOLD'),
('64944f6e-cd48-400e-96ef-953d5c2079ea', '9d377854-f055-43e4-90b2-796fabd3f271', 'UNSOLD'),
('f8d37928-1d90-4060-8c60-7a0393ee2139', 'a41a62fd-db3a-426c-b115-3d72d23c65b8', 'UNSOLD'),
('47a9934e-0fbc-4796-89da-bd2eb9c5efbf', '6a2cee5f-f155-4856-b015-ac472629191b', 'UNSOLD'),
('c2bc8d83-b05e-4092-a483-688820aabd80', '1f23c33a-1eeb-48d4-b191-4d93594c5f52', 'UNSOLD'),
('e6ea9d6e-22e7-40a5-a6c2-3c7fa0cf2b59', '070fea6e-97b0-42f2-a617-730f1bc0aec8', 'UNSOLD'),
('c2bcda81-0942-4fcf-8195-d6786ea41f52', '701879a0-7709-454e-b60f-6c54e8fd2118', 'UNSOLD'),
('97fe35b5-9832-4835-812f-15af21dbed98', '3400f841-fdf1-4a4a-83b9-5488f0941698', 'UNSOLD'),
('ef811e9a-3b40-4042-bcd5-187c18d3f86d', '5ed7a890-acff-4d74-9387-1a04e6feebef', 'UNSOLD'),
('ce6f172a-3b7d-4fd0-9d1d-d4bb68b2b275', 'b99bedbc-fd5d-4f2f-b58e-8233083fe838', 'UNSOLD'),
('7f7a4529-b9f6-4da6-94df-f561940f845f', '563825b0-c27f-420a-9d9e-8ffaa3355791', 'UNSOLD'),
('cb368474-fdac-4384-a131-bb5523e2acf1', 'f6151902-bd81-463c-9c1c-d8f94a7a63dd', 'UNSOLD'),
('c37bde1a-210d-482d-b79b-e62d65f4a703', 'ab2cf120-01c5-40ce-84df-0bbb97574523', 'UNSOLD'),
('1088dd84-9174-44fc-9351-da77d3efae2b', 'd698a797-cb39-414d-a2e3-2f32f131916f', 'UNSOLD'),
('255d8448-8ffa-4b28-859b-e2d03513ff0d', 'af5caf66-2a89-47af-b1de-05f56294fefd', 'UNSOLD'),
('30be1996-ae00-4a44-82dd-be34d0dc3862', '8e90cf65-e9d9-491d-9a5f-aec54246b81d', 'UNSOLD'),
('6ca5885a-b07a-4adb-bf5f-89355906d3da', '018d1857-c470-479e-8b67-cda01259206b', 'UNSOLD'),
('081edba7-efc5-4560-b79e-21079f649f0c', '990769f1-34a8-47ae-a0ef-cff7327dcc64', 'UNSOLD'),
('b8217c70-bcef-4e21-872b-42ac8bceb98a', '88ff7985-0286-45d6-a298-f4288aba62d3', 'UNSOLD'),
('34d0b31b-26f8-4392-a7c8-55b7e2d306de', '40190c1c-edd6-4f67-a0d2-9946780f5b0d', 'UNSOLD'),
('dfdc9853-edbb-486b-a92d-22f7b8987ad5', '86fb8b44-13dc-4a3b-94e9-e549a4bb9c30', 'UNSOLD'),
('b5da64f5-614b-44bc-9310-1844958571c3', '4ed7da7a-73af-4326-ad79-63a6ed856327', 'UNSOLD'),
('ad814bd1-9f10-4346-8d97-cc73e9e06ccc', '859dea20-9b00-42d9-b991-8ce37b0db486', 'UNSOLD'),
('2343243c-0b48-468a-a4ba-01b515410d55', 'ecde1f4c-17f6-4e16-9219-63b751a93edf', 'UNSOLD'),
('c6a20412-22d6-4904-b0d4-a8c7af074f5b', 'a806bc5c-1b23-44db-a012-89bf832240fe', 'UNSOLD'),
('fb3a218e-07cb-4088-89e9-839852ae4d07', '61e68266-9744-49d9-b980-f5a3f747cf57', 'UNSOLD'),
('ef66b695-6eed-4785-8e5c-901a223cae78', 'c08056b9-d7d3-4792-a7ac-86fe53172056', 'UNSOLD'),
('3c93bd11-f372-41b9-9150-223372ff27e0', 'a57fa102-ae06-4694-b83b-fbfacc05dd01', 'UNSOLD'),
('95541fe5-fce9-404b-b8a2-170010ed1d8e', '700e3101-2324-418d-a935-b9cc11a7d20e', 'UNSOLD'),
('6ea47e9a-1de7-4513-97aa-1124b774bbed', '800824d3-e2d0-47cf-9b73-85f092be852c', 'UNSOLD'),
('fc16ad14-3560-414b-b002-cd3b88fa909e', '7a8f25fa-3a9b-448e-ac9b-d2da8de620ea', 'UNSOLD'),
('5f1750e6-3b37-47f9-97b9-8fcfb1bfd6cd', 'c90584a1-a7a0-4c04-8944-c9f280b9e142', 'UNSOLD'),
('259cf292-0849-459a-b69d-1ebca624470e', '77037444-aead-4bc7-a496-3eb47b1007df', 'UNSOLD'),
('7428a46d-46aa-41ea-b76e-9917b9242691', 'bd53ec2b-fbd9-47f9-841b-95edccc59770', 'UNSOLD'),
('77f59d08-5f6c-4802-9485-5c2fb52c7d66', '93ee1264-5108-46a7-ad19-6d53459e890b', 'UNSOLD'),
('91ceb0d7-03ab-4ed7-bb5f-03a7652acde8', '78495b75-1da4-4b47-ac62-10a17fd0308c', 'UNSOLD'),
('7f92a8b4-52cb-4627-b47b-f9384663bfa5', 'a51bc99e-809d-47e0-8378-e466a91447a2', 'UNSOLD'),
('964b27a6-79f4-4faf-86cf-2cac55b835cd', '7bada71f-cab8-4d15-84e0-9406e7d323be', 'UNSOLD'),
('4fd627ca-e319-4ac4-bc43-390741ec1d1a', '94e4eb03-356b-41fe-b9ac-fe47392eaf41', 'UNSOLD'),
('86121a01-d784-45f7-9882-59cb4be1aa4a', 'd0c4555a-bff4-4732-8613-f6028eef5794', 'UNSOLD'),
('ae2bacc9-b001-4826-831f-9637b434f70c', '4acb110c-83a2-4096-bc45-e54de594bc8c', 'UNSOLD'),
('668e7bfa-6874-43b6-9442-2327f685046d', '22957c68-2f73-4ebd-93b7-a3d1e9c127ee', 'UNSOLD'),
('084455ee-2359-450e-a3a4-2f0b7310d878', '1730943d-f81d-4827-a4f1-e20516bfec70', 'UNSOLD'),
('6b300105-9d1a-4d16-b75a-232e99be61a9', 'bc910343-3c5c-4580-adbb-d4a7e444f9e5', 'UNSOLD'),
('fa649579-4ec4-4bd2-a1bd-56743aae116f', '7dbe8404-ae65-49ad-bcb8-a1fefa1437c9', 'UNSOLD'),
('1410ae71-32b8-406f-8b4b-8475a7133d44', 'b9a40db1-7fef-40d6-a7fd-ed6b7e69aed6', 'UNSOLD'),
('08998e3a-9943-4b2c-a0a8-ef067b460e66', '332c1cd7-932d-4e2c-9abc-42e9bccee6c2', 'UNSOLD'),
('d0f97d2d-4f31-4801-8e20-9f34c46cdc3e', '21751450-74c4-4f8b-bf2f-d66b15f34d18', 'UNSOLD'),
('514a4d74-f43a-4a2b-98fa-56b0e26815af', '86e66317-ad20-4c69-b626-d7d1e47d2cb8', 'UNSOLD'),
('171d7223-fc1f-48bd-9b0c-e82e19c1c8f1', 'f4851fe1-a836-4ee8-bd4f-e310d7dc3522', 'UNSOLD'),
('0fe46d8a-e2e4-42f4-9ed1-013190f4265b', 'd6faee56-d099-47af-af06-3381e726e7d4', 'UNSOLD'),
('874dcdd5-6894-4653-9c25-f1dc29ce6e35', 'ddfb3ac5-31f5-476f-8481-c6151f33a7c7', 'UNSOLD'),
('982cda17-d604-47e1-a3ae-c21c748aa2df', '129db252-2b10-41de-9ab6-66d902790f3b', 'UNSOLD'),
('a2032d4d-025c-4f59-a6c5-e06a33624afd', '5b42b012-d857-4fc1-851e-53a8585f53ac', 'UNSOLD'),
('b77ab011-3c34-487e-95f2-fbf2cb4be9ca', '135fbe0e-fdf9-438b-9c9e-5610d0c8ce85', 'UNSOLD'),
('28893489-351a-4777-acf2-e2b58cedd83b', '9bf98232-f909-46de-890a-27e908ce7ffa', 'UNSOLD'),
('7e46697c-5b47-4fb5-a280-976a1e8b9cfb', '74407e1b-dea8-4a32-a984-5db14e3b3635', 'UNSOLD'),
('00ea060d-ae9d-4844-85ca-f1b179acab7a', '89fb2268-683e-4627-bbb4-cf358a45245b', 'UNSOLD'),
('c4bd9b97-4252-4c15-83c5-fe57a2d79423', 'cf6ebfa4-3a11-44a2-868c-5f47bcfae3b2', 'UNSOLD'),
('c5b64fbe-8935-4ed1-8127-b60ce9d8f600', 'b01b4907-0032-4309-beda-198fff370dc8', 'UNSOLD'),
('13f5cc9f-0f0e-4161-b356-48846c8389e0', '63d64e32-6ac4-42b6-ae68-188a8d251277', 'UNSOLD'),
('fef3669f-9975-4aab-8879-6c09df3992df', '71140557-b0d7-436a-a6db-362c31fceb68', 'UNSOLD'),
('697b8d16-546c-4032-86dc-58a1158a0bc2', '74157539-81e6-48bd-825c-98dca8ff2e19', 'UNSOLD'),
('8e4f5d0b-6d00-4f02-abe4-abbfae07181d', '3df7829d-ab93-4b75-b74e-d4626eff0f64', 'UNSOLD'),
('4814cf4d-8093-4bc9-972b-98cdb28d8027', '019825f4-64da-468e-b93e-edeb0ef00470', 'UNSOLD'),
('e402fe0a-a10c-4330-bbca-d83a3d8721c4', '85222d0a-3e1f-49fd-951e-545fdd0f7b3d', 'UNSOLD'),
('feda392b-8193-4fa0-a6e4-68a8d41e8888', 'f058e5dd-8408-467a-81a8-4d3598f74f6d', 'UNSOLD'),
('9e041c7a-0dc2-4368-8c23-e4b0a2d5e56b', '53df321f-897d-411b-a4b4-baac45b8f098', 'UNSOLD'),
('241ef555-7470-46a5-9def-33d751f724f1', 'a6e964a9-baa4-4c74-b687-8ca404ab0dd9', 'UNSOLD'),
('b5bdee23-5a8e-4375-82a0-35de1af2e251', '3433b9ad-8f1e-4e21-b77f-aa47ab980e38', 'UNSOLD'),
('029c6040-c663-45ee-a578-6380fcfee7bd', '6b9aa21a-c282-42ec-b8d5-dbd15f0f1674', 'UNSOLD'),
('76639ddf-c5d6-45ea-aaf7-beeb59e5b017', '333dd082-e351-4b9e-927a-949d2ea86845', 'UNSOLD'),
('d4cd5c58-c2d9-4ddc-851d-d40f35d122dd', '064e46d2-4e04-4df1-8a3d-caf45e632b56', 'UNSOLD'),
('d8b0a2cd-165f-42d9-a386-22fd8ee931d3', '47ed328f-5239-4a9b-bd71-fca17085f56b', 'UNSOLD'),
('4bb79d20-0603-4785-b298-ae4857e583f4', '4a4021ea-e7fa-4fd8-9204-3c6ae9efbc45', 'UNSOLD'),
('505cb135-6307-47d0-997f-444d7219757c', '577dbb73-09fc-4bec-ae7c-694078b432fa', 'UNSOLD'),
('3ac073f2-aafd-4349-b513-e808afeeac77', '45927d10-198e-4775-97e8-af423f5ae931', 'UNSOLD'),
('b2e0216b-e91b-4b9c-976f-de1417b3b9bc', '3375c693-1aae-4104-bf3d-5b3ef59a8fd2', 'UNSOLD'),
('14919bf6-65ea-4c26-a603-d55d14cb9ace', '06b78a22-faa8-4309-b7aa-9eea3e335bcb', 'UNSOLD'),
('20df0299-b0ed-42af-8e6e-2ec21a3d9064', '889090d5-957f-4f46-bed4-b69708d9e1b5', 'UNSOLD'),
('483a9a84-35f8-4f7f-b2e4-383b795a6e26', '425ce4c7-d6d5-4a28-ba1d-9d4e14279504', 'UNSOLD'),
('c6cdd677-d97c-40c8-b1fd-145ea84e7e50', '4843bce7-fbc2-487b-b9b3-3ab21e542035', 'UNSOLD'),
('5ba2ca5e-68ad-4f56-a670-1b03edae20b7', '854e9779-5171-4d5e-89d0-9366211be673', 'UNSOLD'),
('c73edb15-f761-49c9-9e6a-f536219d4948', '6175e781-c3ea-40c0-be95-eab5938fa105', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('04c52214-6e18-4835-b6f4-cd54ae282c09', 'admin', '$2b$10$yFL0Tmap4PT7kedbd/F8lOe4uriTvAp7jFP.yb1xQBC656HWuBnu.', 'ADMIN'),
('a0b1e029-30c0-4d8f-9300-771c039fe987', 'screen', '$2b$10$23ROquaoCgXLOgnpgouS6u8AZ2DIwX1FPWRwsPCWRdmBeHYR0tfH2', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 2', 'PLAYER', '[{"rank":131,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":14,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

