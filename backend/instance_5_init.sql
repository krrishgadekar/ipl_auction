-- INSTANCE 5 INITIALIZATION
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



-- ── DATA FOR INSTANCE 5 ──

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
('63d0c6bc-4440-4be6-9138-1407de7c483c', 'Team Alpha', 'alpha', '$2b$10$Si/WfRPH8HLdP5rr0Lh4geDU6qc5ollw7p5bQ2tlcVKNi9OWtt.Ji', 120, 0),
('241279c6-69f2-4934-8662-332d3a7a6ee3', 'Team Bravo', 'bravo', '$2b$10$qDwedo5QEQ8KN40np5Fo5eqLX15CzCkB0eQ6Ne42eH4jYKbzQVMbu', 120, 0),
('8ace189c-9748-4404-be55-b7e9aee0aeb5', 'Team Charlie', 'charlie', '$2b$10$NvWl0kOdSveqqo5mDNYv5.YLTe4dkINiV9lYF/JyHIfkkv/1jxMra', 120, 0),
('b48c6547-f2d4-40da-adc0-fdcf741d37f3', 'Team Delta', 'delta', '$2b$10$PRVVCYNSLToghDYrqCwZUupQ6a4mkj/1I0owJUKcOPknZgx.lOBbq', 120, 0),
('13a27274-25d2-45e3-b4b2-b7a0e8252c3c', 'Team Echo', 'echo', '$2b$10$pMuBr6Y2J0YleCjHufjMGe.W521ngu8lwGXgveg4rcdylLbYuiV3u', 120, 0),
('0735674f-ee1c-42c7-a14c-4ae230a60b94', 'Team Foxtrot', 'foxtrot', '$2b$10$Tu5oldmKeiQoBFszNms/6./76iruUZ5vkbYnOrNP06.EWjVDuPuSK', 120, 0),
('0d5973ab-137f-4ddc-81dd-5d94ff63ecb1', 'Team Golf', 'golf', '$2b$10$xu5FINexZZIVSaX2.36fHukdn04hgG9bOXxRiHx1b/9PaiKMCcgJy', 120, 0),
('329732ec-54af-46e9-897f-06b459ed924c', 'Team Hotel', 'hotel', '$2b$10$EA6IVTRaEOHrgEWnpNhDG.Z4V/GbKb449j1RqtSnT.WZ/3Hs7vbLS', 120, 0),
('1a8fd5dc-50f3-4deb-9734-9f21fa75107f', 'Team India', 'india', '$2b$10$zfjPfv8AmFxsNkoPBstdLebEx0MLHHknfOfMaSVGlE22K/MVf7nkC', 120, 0),
('fab4612c-c3f5-494e-a99f-973942968381', 'Team Juliet', 'juliet', '$2b$10$mFrBAMzyn/zjE9ijBlraX.gMVtsx0Ykt36zyrwMKenGToWKJOfg/O', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('ff59be53-cd32-4c5a-a312-84782bd6e0be', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('3f110d86-22e1-4482-96e2-650a6dc72618', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('ff78dc5a-c716-443e-b951-77c6f1b27f5d', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('4a692452-2cf0-4b77-b3e2-756403cf842f', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('6f579283-9e44-4b36-98d9-de375a05e407', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('9a8c094b-e2e7-4af2-8c29-f39a498623b1', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 2, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('8dac024e-3a76-4697-b78a-4a297af6d509', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('f4f53727-cf4b-4814-8242-c1a46890006d', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('76a99a4b-6266-48da-a008-f7ba0659bcc4', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('97bf56af-2ad9-4ed3-9b11-1e5cd717ce74', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('975c1b3a-494b-45c4-8b1a-5874f9976cd7', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('2985345f-a13c-416c-b619-2ff48c40b86d', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('3bda6d18-3fa6-41ab-9b7e-9d63bd69fc56', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('85b1b7ac-8926-4eb2-8068-5c44e8c9337a', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('57c6e9d5-9234-495c-85f8-378a3a7f5d7b', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('c11383cd-b9ff-4c34-b586-366b9324b3da', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('1f29b4ba-06ad-421a-bbab-773b2bed4063', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('143d5c33-ac35-4819-91cc-86ed9b215820', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('f214752e-609a-46d0-b6a6-03cd8597b9ae', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('0e3d7f25-8e38-4a0c-a256-198534f17d66', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('7926a612-73ad-4ea6-9b47-e9f2e5bb9094', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('632dff6b-ddb3-4c8d-8f67-d27266b4f880', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('b6b30732-bae4-42e1-be32-aa54f34fc29f', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('320f9e60-b90e-4bcc-b4e4-bf426420fa1b', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('cadc7003-ad87-4882-a5ef-ad3da08631b7', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('30cc805c-74a8-4469-b359-b68398998f8a', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('f3fa9c51-7ee2-49eb-bfce-bfb6946a4e0e', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('7ec08653-0719-4d6a-a775-073e07085c84', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('ca63ef74-78d0-48d8-9c7f-dc0608f5389b', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('55a75cc9-dd16-4eb0-91bc-01874722cf6e', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('39bb3b6c-8bf4-4a7a-8f10-632ebd94867c', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('ba07e110-ad10-4c49-a742-b9fe8a8d2870', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('e7c27d44-4cb0-4066-a11a-460815fa2f5f', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('62e542e0-0967-4118-b0b7-0718bfcd228b', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('feb2db01-6a30-43c9-a801-4b5b2d3cb5c9', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('b37e0f8f-0ff4-4ac4-b630-d88c4dd44e28', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('861a527e-13f6-4ac1-911e-a17049b41dca', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('4fc112de-dbcf-4ac6-8c98-c2461a07768d', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('5229caff-9364-44be-824f-3382744ce7c1', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('a5d93d2b-c162-46ce-98e5-85d219554380', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('cfa5e009-aad8-4b96-95f0-9674becb0589', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('df0e1328-f172-41ef-a1bf-de1549905899', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('67d64ec8-d44f-49f4-9546-e7e7be413970', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('495d8249-9787-4c16-b035-074e56134e71', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('b4531ce6-e4e7-4e20-8ce9-059b38281b9a', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('9f762793-a6f2-4823-abfc-345d2030156c', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('21513294-05b2-4942-a6b2-1b696ebd0ca2', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('400d526b-ee90-4f24-b459-5f282a6780f8', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('75d9f495-9139-4e6d-ad08-2b487abe7bb7', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('988494eb-c0cc-4bf0-9a44-5c403e39242d', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('257d5a67-b276-4fd5-8139-1fe77df5a764', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('a7d10f6d-d1da-4a7b-8238-56b158a8dce9', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('f41decd3-1f74-440f-bbdc-0bc920d057e4', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('7c266d90-0c6a-4866-a521-dd8e2962f2f1', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('7913e61a-89f3-4fc3-b5be-adb6584a55d3', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('9ce4d8d8-ad12-4827-83df-961427722fdc', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('1d32d24c-2bc6-40da-a6f3-504490bd4730', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('558c1407-3759-4513-a675-88ec3dea72ba', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('2cbb35fd-faac-4a1e-ad8c-a4a86293c174', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('185e8f38-d1be-40f7-9d2a-40fd9ac8ac3c', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('40970fdf-45e2-4c3d-881c-a9fc6394d43a', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('05f9a744-2b39-449a-bae3-df9e968f254f', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('240a7159-ad74-4039-9518-597eb0f0eb19', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('174bbb2f-ce6e-423d-adf9-a44c28320269', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('05a8162a-1af7-4d0b-8e65-373a10523d86', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('3de31a33-ad86-456e-a6b2-b0e0a6ab3134', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('bbb769d3-5e32-4145-aa95-58d149edd94a', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('9259aa5f-3f61-493c-b731-1b71dce416b2', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('d7533b6e-9db9-40a5-8027-83585c902d5c', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('5d183f4a-bf99-4969-beef-55133440f06c', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('449a799c-4834-4760-9493-b06772c87493', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('c840b297-c32e-4c40-8377-9876f487278a', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('5ba7a386-29ad-447c-9428-9fb5da8b808c', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('c0d2ad12-1f2d-483d-a101-fec8de3bc926', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('b2e3e19e-c76f-4010-bda7-c42925c2bca3', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('5dc54fbe-b490-4eaf-aac7-d75c70ce18a8', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('c69bc5b8-1282-44b2-9090-4900b51f21a7', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('6adb989f-f538-45c6-9f2d-52d57928a132', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('ccb25b79-e448-4dc4-b97a-002bc7a35187', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('8c66da25-df5b-4f8d-acff-02e38219eea0', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('472314bb-7f7e-4b6f-99b6-77f6b58a7f9a', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('cbe23f09-3d31-4132-bbd6-b9f774c3694b', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('6a1cabc0-a76c-468f-822f-aa5cc84da712', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('82f383a0-5c17-4043-8910-e7bb5b835dc5', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('aadc01ca-23b0-414f-9395-75c0597d59c0', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('a6c4361c-c55c-4870-b560-e96cab011967', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('d770dad9-93c1-44b8-b7e0-4d5a1575c045', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('846895e9-fe7d-4f13-972e-51981d3a2393', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('5129e7b6-09fb-42da-82db-ddcf43ad063d', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('abc60b01-ee02-425c-afa4-895f15a506af', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('d27275a0-cfca-4372-94f0-a22605de077a', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('2895ff48-bc1d-4a5b-8553-1f7eaffd3a04', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('7013e463-c7e8-4c4e-aa25-55ac1381567e', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('37942d32-6073-4146-bd3e-3f6a29ca135c', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('6425b897-8703-498a-b754-4fd09c92a221', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('52f40bc4-a1f0-4aa1-90a4-2150ccb01393', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('f628a283-10f8-4d10-8647-282589bdb9ec', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('afa15f18-2446-4945-99b4-87ee5eb84455', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('bf787c6d-4c41-442a-804c-cbae1c144c56', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('4fdfe072-939b-4e89-addc-1fd7ab1e1515', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('f0f6db39-fe0c-4c02-ade4-3b90ad85f3f1', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('c65678c0-eb57-4f66-9e49-e61af4f0ae9b', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('97eaa43d-d416-4112-995f-8ddb0c7131b3', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('a946048f-d914-4a54-80c1-f3eb0ef5f113', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('048a7f69-3830-4398-915c-50715af1e23f', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('67d66b4c-d842-49d9-8221-05ec771fdbec', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('0430d1d1-cb4b-4f2a-9782-f34eb478c905', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('f65c5874-8d23-4b6c-8b5c-c2398378a82b', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('88c62c8b-140d-4ffe-b5fa-8f096a479add', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('f16e5da4-5cbe-4009-ac8f-e7ece160f41d', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('07e4e082-9ab7-4d20-ba1f-8b1868897047', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('26e33b67-7c8e-4b01-87b3-e8548baf39ed', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('c4ebca1a-54ec-4c21-9c13-09f2a3658297', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('28a4f033-b4b0-455f-98b9-459f7c242cd4', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('ceaa61b5-5f89-42a5-a755-bff666da0842', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('74bc647a-486c-478d-85a8-2a5218e82fbd', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('fc8e312a-1d25-4e44-b03a-026acdca1a28', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('db9450d1-dd92-416d-9da4-bea1bb837006', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('6258574e-a9b1-479d-9323-fd283c8377f3', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('6744fd90-1baa-407c-9146-7a1f6cc84c28', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('50274df3-7ef9-406f-b8d8-800260d3ca59', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('474d2886-4785-44c6-91b5-2e9823861cb5', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('9b629918-bcd8-48fd-bac7-0618290dd8a7', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, true, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('49bcfd27-f64d-4fd6-acbe-56e829c03a0c', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('43da71d1-6575-4cff-af90-633bcb53485c', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('03c59da3-b5c5-41df-9f29-36128e6b6516', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('b7820577-718f-4ae7-b8d5-752d798b1d05', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('77e74292-600b-45a6-8921-0a68244d1e9b', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('22187e06-8a8a-4973-a26b-634093886767', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('f5b8dd37-b8c9-43c6-9f41-003c22323e17', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, true, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('c9c695c8-d429-427c-87e6-c202fc365b58', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('889f7e4f-15ad-4932-aa46-0dc6815a7e5e', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('b0b9d4b0-e8e1-46d2-83c3-09173361f260', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('9a2d4df0-22ae-479f-9654-dbf07941b1c2', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('0e1653a6-b888-45d0-956e-f17f0cdfa54b', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('d6fef4ea-2e83-4aa5-9e03-536745551762', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('d95deddb-fa56-4a2f-a5b7-1cf67c651bfb', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('b7b498b4-b2a8-4d8a-93d2-33ba6a6fcbff', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('e6f1c10c-ace1-493d-a3bc-6901fb365b19', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('d050b71a-c4ee-4cfe-a14a-809be623b7ef', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('1b7028e8-30d6-45ed-8bd3-22706f966b6f', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('a0443ab7-f457-415c-8b77-830b1f3cef3b', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('44f9386d-27ac-454c-a0e4-ae9bdeebf7c4', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('3a1b0db0-e1a4-4dc7-9fd5-f8ebfeffd00d', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('a92dbbe2-e538-4a99-9e53-a4becd1a42cd', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('e2de964b-31e8-4ffa-972d-2da957d507e1', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('5999d75b-47ba-4cb3-9d2e-fa8eab626eea', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('3798e876-b6e8-49ba-af79-524e48360a5d', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('6b33afa9-2663-4166-9427-405c9270b959', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('3755b1ae-6652-428d-b18b-6ad8c59dbbe3', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('fa0defc6-3805-4437-b20e-9074f1f26e7e', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('77ae6169-6077-4ac2-8c10-f91a747ec3d4', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('5626482f-62d2-4c08-aca3-9d284193e57b', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('5037c84d-2801-41a7-b94b-f69200bac187', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('0913aa33-1ad3-42af-9c27-596657bac78c', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('b8b3444b-dc03-4043-b1a0-cc9888c7cb7d', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('3bc1272c-18c1-4618-9c7e-e172df877a09', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('1ed77a8e-b74e-4f13-8711-9c628175dd9d', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('900f5af0-24be-407a-86e0-fca114bb4a0b', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('aa1b0934-60d1-4b57-ab5c-2f5f43acb354', 'ff59be53-cd32-4c5a-a312-84782bd6e0be', 'UNSOLD'),
('59dadecd-64a8-449d-accf-453b00041300', '3f110d86-22e1-4482-96e2-650a6dc72618', 'UNSOLD'),
('4c3caaa8-daf7-413d-ae16-14ccd423834d', 'ff78dc5a-c716-443e-b951-77c6f1b27f5d', 'UNSOLD'),
('a61ad0d8-1f0e-49fd-8cc7-252ddcab14b6', '4a692452-2cf0-4b77-b3e2-756403cf842f', 'UNSOLD'),
('839b8432-0006-40cf-81c2-95aa95b3bb48', '6f579283-9e44-4b36-98d9-de375a05e407', 'UNSOLD'),
('1a6ba612-9ac0-4ada-93e0-230bc053c6e1', '9a8c094b-e2e7-4af2-8c29-f39a498623b1', 'UNSOLD'),
('a5fe3480-d179-4c9c-aa7e-68b5ae695500', '8dac024e-3a76-4697-b78a-4a297af6d509', 'UNSOLD'),
('d10607a9-ba7b-49fb-bf39-61ffc700f1e7', 'f4f53727-cf4b-4814-8242-c1a46890006d', 'UNSOLD'),
('e06cff9a-fd28-40e7-b2bd-84e56a846b20', '76a99a4b-6266-48da-a008-f7ba0659bcc4', 'UNSOLD'),
('47c3de63-e439-48c8-a11e-3cfd5b6a8fc2', '97bf56af-2ad9-4ed3-9b11-1e5cd717ce74', 'UNSOLD'),
('72f5166a-977a-4bf1-af25-7d3322212a4e', '975c1b3a-494b-45c4-8b1a-5874f9976cd7', 'UNSOLD'),
('cf40382d-157f-46e5-bcf1-90b41320f64c', '2985345f-a13c-416c-b619-2ff48c40b86d', 'UNSOLD'),
('5bb00e80-f649-483f-ba57-6ba5dfe379cb', '3bda6d18-3fa6-41ab-9b7e-9d63bd69fc56', 'UNSOLD'),
('67b2e554-b4b1-4502-9e96-264350e6ac01', '85b1b7ac-8926-4eb2-8068-5c44e8c9337a', 'UNSOLD'),
('2be035bb-fc10-45fa-89de-4988108a1e37', '57c6e9d5-9234-495c-85f8-378a3a7f5d7b', 'UNSOLD'),
('98d16175-2eed-4095-9c47-cd3da4623d03', 'c11383cd-b9ff-4c34-b586-366b9324b3da', 'UNSOLD'),
('530b77b1-c67e-4acb-8a07-061116ce774a', '1f29b4ba-06ad-421a-bbab-773b2bed4063', 'UNSOLD'),
('4c80d1a6-eff4-4185-843e-9659d4d61e09', '143d5c33-ac35-4819-91cc-86ed9b215820', 'UNSOLD'),
('b8f164a7-0e1f-4e77-820b-8e0e11fa586f', 'f214752e-609a-46d0-b6a6-03cd8597b9ae', 'UNSOLD'),
('45ff3ae3-9379-4d0b-a2d8-960d4a55cb48', '0e3d7f25-8e38-4a0c-a256-198534f17d66', 'UNSOLD'),
('798ed02e-a771-4114-a984-06a6c5793026', '7926a612-73ad-4ea6-9b47-e9f2e5bb9094', 'UNSOLD'),
('c84fbc8f-f9a6-4d12-af6d-2b6d7490a356', '632dff6b-ddb3-4c8d-8f67-d27266b4f880', 'UNSOLD'),
('ca4b83c9-9b23-40ea-bb1f-6c87712e3450', 'b6b30732-bae4-42e1-be32-aa54f34fc29f', 'UNSOLD'),
('af556a8f-a6bf-4a16-a119-abb4d24d9baf', '320f9e60-b90e-4bcc-b4e4-bf426420fa1b', 'UNSOLD'),
('1c0b505f-7b2c-4c00-8f9d-4238c2e5cfc7', 'cadc7003-ad87-4882-a5ef-ad3da08631b7', 'UNSOLD'),
('26017fb7-e0df-4f0b-a25c-888afcd37a11', '30cc805c-74a8-4469-b359-b68398998f8a', 'UNSOLD'),
('b3902b15-de39-48b8-bc24-98694b8c8866', 'f3fa9c51-7ee2-49eb-bfce-bfb6946a4e0e', 'UNSOLD'),
('88225cc1-32c1-4ab8-b59d-1672a34816fd', '7ec08653-0719-4d6a-a775-073e07085c84', 'UNSOLD'),
('b86f7fac-7e2b-410f-863e-9b49526f0934', 'ca63ef74-78d0-48d8-9c7f-dc0608f5389b', 'UNSOLD'),
('e8df45c1-305e-494d-933a-ba8799dd266c', '55a75cc9-dd16-4eb0-91bc-01874722cf6e', 'UNSOLD'),
('9610e59f-374c-4449-887b-7e4a22838edb', '39bb3b6c-8bf4-4a7a-8f10-632ebd94867c', 'UNSOLD'),
('6b6d2a08-e50c-4e5d-85a2-9d5be0828fbb', 'ba07e110-ad10-4c49-a742-b9fe8a8d2870', 'UNSOLD'),
('1928138c-991f-4748-ae1e-8edb57ba0686', 'e7c27d44-4cb0-4066-a11a-460815fa2f5f', 'UNSOLD'),
('50a8cf09-27d2-4dca-a10a-26a7469f7556', '62e542e0-0967-4118-b0b7-0718bfcd228b', 'UNSOLD'),
('ea52ffc6-0235-4a4e-8585-ca4918512324', 'feb2db01-6a30-43c9-a801-4b5b2d3cb5c9', 'UNSOLD'),
('3ae29ddc-8a2f-46dd-a65c-81546f646b72', 'b37e0f8f-0ff4-4ac4-b630-d88c4dd44e28', 'UNSOLD'),
('327c2ea1-29ec-4c65-a070-f971c6490186', '861a527e-13f6-4ac1-911e-a17049b41dca', 'UNSOLD'),
('7bf2b9d7-e062-4993-84ec-ce3835a8bfe4', '4fc112de-dbcf-4ac6-8c98-c2461a07768d', 'UNSOLD'),
('93935872-bcb4-41d4-87b1-37c7af08f62f', '5229caff-9364-44be-824f-3382744ce7c1', 'UNSOLD'),
('770a2092-0028-4110-ae42-34a0df5c3b0b', 'a5d93d2b-c162-46ce-98e5-85d219554380', 'UNSOLD'),
('776cde23-c1b1-40c3-ace1-f9b0317496b4', 'cfa5e009-aad8-4b96-95f0-9674becb0589', 'UNSOLD'),
('4ca761c6-ea3b-4ac1-86f9-2e03e313d6f0', 'df0e1328-f172-41ef-a1bf-de1549905899', 'UNSOLD'),
('90adedb0-60b5-4156-8e0e-43e875ea8846', '67d64ec8-d44f-49f4-9546-e7e7be413970', 'UNSOLD'),
('a9daccd7-44a7-4a5f-b68d-4dc36e0973cd', '495d8249-9787-4c16-b035-074e56134e71', 'UNSOLD'),
('a15c9077-f512-481f-84c7-30af6716cc47', 'b4531ce6-e4e7-4e20-8ce9-059b38281b9a', 'UNSOLD'),
('e7479093-c905-4907-9f36-512ff850eac0', '9f762793-a6f2-4823-abfc-345d2030156c', 'UNSOLD'),
('35235b5c-3718-4b05-9eee-ba1a5c2d4287', '21513294-05b2-4942-a6b2-1b696ebd0ca2', 'UNSOLD'),
('167b6b53-ef90-4cc4-848e-091f99d2472a', '400d526b-ee90-4f24-b459-5f282a6780f8', 'UNSOLD'),
('2b8ea0a3-373d-444f-a0b7-5f2e595ef77a', '75d9f495-9139-4e6d-ad08-2b487abe7bb7', 'UNSOLD'),
('ee5e0188-c428-418b-8e72-ba8acf27cc30', '988494eb-c0cc-4bf0-9a44-5c403e39242d', 'UNSOLD'),
('b56110d6-195a-45b3-9cf5-eda9ce3cf9a8', '257d5a67-b276-4fd5-8139-1fe77df5a764', 'UNSOLD'),
('4e0b7322-a597-4d96-aa2c-843e64e96728', 'a7d10f6d-d1da-4a7b-8238-56b158a8dce9', 'UNSOLD'),
('0d57d2d0-7be0-4790-bda1-769bba63714d', 'f41decd3-1f74-440f-bbdc-0bc920d057e4', 'UNSOLD'),
('d459fffb-13c9-4f00-9a40-08982fa6ef51', '7c266d90-0c6a-4866-a521-dd8e2962f2f1', 'UNSOLD'),
('7ec5ce22-2528-48b1-9f35-14b0bcec5c20', '7913e61a-89f3-4fc3-b5be-adb6584a55d3', 'UNSOLD'),
('d27e0771-a3d4-449d-abee-74f382db1348', '9ce4d8d8-ad12-4827-83df-961427722fdc', 'UNSOLD'),
('0669aeab-7004-4cc6-9842-ad469c45c19c', '1d32d24c-2bc6-40da-a6f3-504490bd4730', 'UNSOLD'),
('aa267a0c-1ac8-4db4-84a5-6ddebc0e1308', '558c1407-3759-4513-a675-88ec3dea72ba', 'UNSOLD'),
('af10f86e-8751-4a29-bfc9-01e17e8beed0', '2cbb35fd-faac-4a1e-ad8c-a4a86293c174', 'UNSOLD'),
('d6532009-6309-4be7-92aa-b8bf3f1c0e3d', '185e8f38-d1be-40f7-9d2a-40fd9ac8ac3c', 'UNSOLD'),
('54fa6164-18db-40f6-925e-fdd84b55c1e5', '40970fdf-45e2-4c3d-881c-a9fc6394d43a', 'UNSOLD'),
('4535d49c-8a47-4bb1-bd58-6efa8f606129', '05f9a744-2b39-449a-bae3-df9e968f254f', 'UNSOLD'),
('88601ab8-47b7-4b6c-946c-4b55efd4f0d4', '240a7159-ad74-4039-9518-597eb0f0eb19', 'UNSOLD'),
('cdd46cd7-869c-4b6b-9485-bd3d18d6e80c', '174bbb2f-ce6e-423d-adf9-a44c28320269', 'UNSOLD'),
('f63385dd-fe36-4198-9d70-9cc425e40712', '05a8162a-1af7-4d0b-8e65-373a10523d86', 'UNSOLD'),
('f928bf65-2265-4930-9e00-d67b2cfbeaa4', '3de31a33-ad86-456e-a6b2-b0e0a6ab3134', 'UNSOLD'),
('2d354a94-ea1f-49b8-8f7d-104820906e40', 'bbb769d3-5e32-4145-aa95-58d149edd94a', 'UNSOLD'),
('3efe1d97-7b6d-46f0-8a2c-1d93b50bffa4', '9259aa5f-3f61-493c-b731-1b71dce416b2', 'UNSOLD'),
('1d37585a-1479-48b3-bacb-7a5b16e0e03c', 'd7533b6e-9db9-40a5-8027-83585c902d5c', 'UNSOLD'),
('19ecf832-f586-49e3-8749-7bce43dc2384', '5d183f4a-bf99-4969-beef-55133440f06c', 'UNSOLD'),
('23c759d9-858f-4075-8223-a7ebb412de6f', '449a799c-4834-4760-9493-b06772c87493', 'UNSOLD'),
('26c0c91e-e524-4e64-a03a-670be87e3ba1', 'c840b297-c32e-4c40-8377-9876f487278a', 'UNSOLD'),
('f3de0ff2-fedc-4570-bfc6-83533a974bab', '5ba7a386-29ad-447c-9428-9fb5da8b808c', 'UNSOLD'),
('22c9d640-a5fe-4464-9bef-dc005a9367e1', 'c0d2ad12-1f2d-483d-a101-fec8de3bc926', 'UNSOLD'),
('edea1c90-e481-4711-8134-318c4cd99ecf', 'b2e3e19e-c76f-4010-bda7-c42925c2bca3', 'UNSOLD'),
('4b362a83-c300-4091-b04b-46e01192b5da', '5dc54fbe-b490-4eaf-aac7-d75c70ce18a8', 'UNSOLD'),
('67e0e507-92ff-4cb3-8612-bb097705d821', 'c69bc5b8-1282-44b2-9090-4900b51f21a7', 'UNSOLD'),
('19ef03a9-6cc8-4858-8afb-e0d7cce611f2', '6adb989f-f538-45c6-9f2d-52d57928a132', 'UNSOLD'),
('99c4843a-fe54-46e4-8572-b99928c6fa8c', 'ccb25b79-e448-4dc4-b97a-002bc7a35187', 'UNSOLD'),
('31de77a9-90c7-44b9-9915-8052fb7bd6a9', '8c66da25-df5b-4f8d-acff-02e38219eea0', 'UNSOLD'),
('c42b1711-9c5d-4960-9196-bf2f067a47e1', '472314bb-7f7e-4b6f-99b6-77f6b58a7f9a', 'UNSOLD'),
('34a5eaa6-e11f-4301-bb20-a5ac72f7ce45', 'cbe23f09-3d31-4132-bbd6-b9f774c3694b', 'UNSOLD'),
('1ac2cc11-367d-4149-a73a-80bbbe7be230', '6a1cabc0-a76c-468f-822f-aa5cc84da712', 'UNSOLD'),
('96aad8c4-d17d-40a5-8e78-592bcbea0110', '82f383a0-5c17-4043-8910-e7bb5b835dc5', 'UNSOLD'),
('860a5936-40a3-464d-a7c7-21aa9010fe24', 'aadc01ca-23b0-414f-9395-75c0597d59c0', 'UNSOLD'),
('b9c09e3d-a768-430f-a718-2e5adab96f26', 'a6c4361c-c55c-4870-b560-e96cab011967', 'UNSOLD'),
('51277480-0c7c-41ba-b89e-2bd23d5db17b', 'd770dad9-93c1-44b8-b7e0-4d5a1575c045', 'UNSOLD'),
('b73412db-0bd1-4557-a2c3-fea63a4cc896', '846895e9-fe7d-4f13-972e-51981d3a2393', 'UNSOLD'),
('4b2be401-39a7-45a5-95fe-984aad37084d', '5129e7b6-09fb-42da-82db-ddcf43ad063d', 'UNSOLD'),
('19162171-5bab-4629-bbf7-2dd0543a7c13', 'abc60b01-ee02-425c-afa4-895f15a506af', 'UNSOLD'),
('fa94d18c-7be3-48d3-ad07-261df4da78b6', 'd27275a0-cfca-4372-94f0-a22605de077a', 'UNSOLD'),
('2fc84746-66aa-4c49-af56-b0c54e730c2b', '2895ff48-bc1d-4a5b-8553-1f7eaffd3a04', 'UNSOLD'),
('d1ae24dc-ee59-48f1-ae0f-6f8969e78bf5', '7013e463-c7e8-4c4e-aa25-55ac1381567e', 'UNSOLD'),
('1dcc5fa4-ca0c-4178-9ad0-ec1954d6fbf9', '37942d32-6073-4146-bd3e-3f6a29ca135c', 'UNSOLD'),
('c1a64309-a76e-4ad7-9e58-9610fce269a4', '6425b897-8703-498a-b754-4fd09c92a221', 'UNSOLD'),
('83c12431-7213-4685-9a11-573534a67eb4', '52f40bc4-a1f0-4aa1-90a4-2150ccb01393', 'UNSOLD'),
('bbd3f5e8-7e81-4c2c-a36c-68ceef2bfbc0', 'f628a283-10f8-4d10-8647-282589bdb9ec', 'UNSOLD'),
('6d77a9e5-2671-47a0-84b6-db6a2ff23233', 'afa15f18-2446-4945-99b4-87ee5eb84455', 'UNSOLD'),
('de6e821f-6e3d-48c9-a936-577dd8ed0ebd', 'bf787c6d-4c41-442a-804c-cbae1c144c56', 'UNSOLD'),
('c205f841-9777-43c4-aa03-6d767d385b26', '4fdfe072-939b-4e89-addc-1fd7ab1e1515', 'UNSOLD'),
('eb8ec9f9-3111-4909-8b20-c99fd319e67b', 'f0f6db39-fe0c-4c02-ade4-3b90ad85f3f1', 'UNSOLD'),
('c67683b5-11b0-4198-94c6-61bba479b6cc', 'c65678c0-eb57-4f66-9e49-e61af4f0ae9b', 'UNSOLD'),
('ac1d767f-4f56-479e-bbab-aba19c42f7ee', '97eaa43d-d416-4112-995f-8ddb0c7131b3', 'UNSOLD'),
('87364048-7910-4358-90c8-6ebd1b4cd6c5', 'a946048f-d914-4a54-80c1-f3eb0ef5f113', 'UNSOLD'),
('ec406518-bccb-4c62-90f0-b2af487f0e8e', '048a7f69-3830-4398-915c-50715af1e23f', 'UNSOLD'),
('fc4c8d7c-171a-4ab9-921d-435b106266b6', '67d66b4c-d842-49d9-8221-05ec771fdbec', 'UNSOLD'),
('a40f2f89-962a-4306-b212-b38bacd380f6', '0430d1d1-cb4b-4f2a-9782-f34eb478c905', 'UNSOLD'),
('8625c280-63ad-4d37-a312-f8577410102a', 'f65c5874-8d23-4b6c-8b5c-c2398378a82b', 'UNSOLD'),
('9d95de7e-8d4d-4836-be9f-eb86f9b1b5cb', '88c62c8b-140d-4ffe-b5fa-8f096a479add', 'UNSOLD'),
('50421ab2-9ef8-4568-8efd-f2df9c6ffde4', 'f16e5da4-5cbe-4009-ac8f-e7ece160f41d', 'UNSOLD'),
('b24cb819-b72b-4d8d-bbd4-e05a933f1e37', '07e4e082-9ab7-4d20-ba1f-8b1868897047', 'UNSOLD'),
('4e9a6632-dfc7-4040-a8ed-82aa60ea32e2', '26e33b67-7c8e-4b01-87b3-e8548baf39ed', 'UNSOLD'),
('599220df-f7f8-456a-a08e-e5d959f4ede6', 'c4ebca1a-54ec-4c21-9c13-09f2a3658297', 'UNSOLD'),
('4379a22b-65f7-4c5b-b632-8fc1c8de8fbf', '28a4f033-b4b0-455f-98b9-459f7c242cd4', 'UNSOLD'),
('bba793cd-9ad7-4610-b662-1e193ef3cbd3', 'ceaa61b5-5f89-42a5-a755-bff666da0842', 'UNSOLD'),
('0246701e-3b9a-470a-91ec-624b3c5eb042', '74bc647a-486c-478d-85a8-2a5218e82fbd', 'UNSOLD'),
('6e5fd5b6-dd38-4a51-ae22-c6e5ec6397a6', 'fc8e312a-1d25-4e44-b03a-026acdca1a28', 'UNSOLD'),
('7d0937b3-2fd5-495b-8326-cf8f2af28f99', 'db9450d1-dd92-416d-9da4-bea1bb837006', 'UNSOLD'),
('457a0923-4560-4df2-930f-e410c2ea76e9', '6258574e-a9b1-479d-9323-fd283c8377f3', 'UNSOLD'),
('55f01d49-4023-44f3-8b8d-6018b1aad056', '6744fd90-1baa-407c-9146-7a1f6cc84c28', 'UNSOLD'),
('a0bdc4a1-07e5-42c3-90fa-3ace880b4611', '50274df3-7ef9-406f-b8d8-800260d3ca59', 'UNSOLD'),
('6af94571-63e4-406f-af18-87b577a6fc32', '474d2886-4785-44c6-91b5-2e9823861cb5', 'UNSOLD'),
('874375ec-e54d-42bd-b24f-d13f6f13cb30', '9b629918-bcd8-48fd-bac7-0618290dd8a7', 'UNSOLD'),
('51f5def4-5fce-4e75-b46a-942dd607b948', '49bcfd27-f64d-4fd6-acbe-56e829c03a0c', 'UNSOLD'),
('9b12cb9d-b3ac-4849-bcc8-88bc09574f6d', '43da71d1-6575-4cff-af90-633bcb53485c', 'UNSOLD'),
('22bb4a52-dd04-438d-b3df-9f90e82af73d', '03c59da3-b5c5-41df-9f29-36128e6b6516', 'UNSOLD'),
('29ce1640-c7ca-4c11-beec-daa9f78abdd6', 'b7820577-718f-4ae7-b8d5-752d798b1d05', 'UNSOLD'),
('c5330b91-3bd4-43e7-992f-3d46434a0d82', '77e74292-600b-45a6-8921-0a68244d1e9b', 'UNSOLD'),
('155ddb41-8c06-466f-b5ab-c04bf9c2dd9b', '22187e06-8a8a-4973-a26b-634093886767', 'UNSOLD'),
('523d482a-e866-4a91-a69b-fa1aff6e0692', 'f5b8dd37-b8c9-43c6-9f41-003c22323e17', 'UNSOLD'),
('b7192b0c-f704-4ba7-a274-f5a19488ac41', 'c9c695c8-d429-427c-87e6-c202fc365b58', 'UNSOLD'),
('e7fbb314-3c99-4a4e-87e1-9fc21c0bd727', '889f7e4f-15ad-4932-aa46-0dc6815a7e5e', 'UNSOLD'),
('c7589f80-1ed8-4070-9845-8729f2caba86', 'b0b9d4b0-e8e1-46d2-83c3-09173361f260', 'UNSOLD'),
('22a5dd50-f0ec-4225-868f-1dd717fc2c7c', '9a2d4df0-22ae-479f-9654-dbf07941b1c2', 'UNSOLD'),
('23231508-d5f1-45b5-9b2d-ce04e6e3a3a3', '0e1653a6-b888-45d0-956e-f17f0cdfa54b', 'UNSOLD'),
('28ff5eda-3423-4203-ac43-2b2f56d308aa', 'd6fef4ea-2e83-4aa5-9e03-536745551762', 'UNSOLD'),
('dc94aa0d-86a9-48b9-92b4-197c6246104e', 'd95deddb-fa56-4a2f-a5b7-1cf67c651bfb', 'UNSOLD'),
('64d7389a-377d-4052-8599-819ac755a482', 'b7b498b4-b2a8-4d8a-93d2-33ba6a6fcbff', 'UNSOLD'),
('51f00b44-ec9f-4226-88c1-4905a8e1d4e5', 'e6f1c10c-ace1-493d-a3bc-6901fb365b19', 'UNSOLD'),
('03ea573e-a333-4575-bcb3-ddc5f643cbb0', 'd050b71a-c4ee-4cfe-a14a-809be623b7ef', 'UNSOLD'),
('7538162f-652a-4058-8cf6-60592627b87d', '1b7028e8-30d6-45ed-8bd3-22706f966b6f', 'UNSOLD'),
('1c9a84ef-7585-45f9-97f1-8c72a9123836', 'a0443ab7-f457-415c-8b77-830b1f3cef3b', 'UNSOLD'),
('398db30f-3801-41d5-b6a5-e396a5d879b1', '44f9386d-27ac-454c-a0e4-ae9bdeebf7c4', 'UNSOLD'),
('fb46ecdd-c3ed-4f3f-ac6b-1b3299c385cd', '3a1b0db0-e1a4-4dc7-9fd5-f8ebfeffd00d', 'UNSOLD'),
('c0ff5276-f973-4b17-a744-81d516933abe', 'a92dbbe2-e538-4a99-9e53-a4becd1a42cd', 'UNSOLD'),
('81b9a6c4-15d1-4fb6-82cc-2615771206dd', 'e2de964b-31e8-4ffa-972d-2da957d507e1', 'UNSOLD'),
('a0d50928-2018-40e3-9700-3c50f6f36e62', '5999d75b-47ba-4cb3-9d2e-fa8eab626eea', 'UNSOLD'),
('e5f71233-2838-4e28-87be-500818fd8f4e', '3798e876-b6e8-49ba-af79-524e48360a5d', 'UNSOLD'),
('3a694c00-c589-47e1-beac-363e071d1f2b', '6b33afa9-2663-4166-9427-405c9270b959', 'UNSOLD'),
('bd014527-bb4e-4f79-9602-f5f6aa226229', '3755b1ae-6652-428d-b18b-6ad8c59dbbe3', 'UNSOLD'),
('2171f87d-fe7c-4a3f-8984-620dbc9e9949', 'fa0defc6-3805-4437-b20e-9074f1f26e7e', 'UNSOLD'),
('d354cbb7-a872-4eb4-ac90-bdf66fdc2a62', '77ae6169-6077-4ac2-8c10-f91a747ec3d4', 'UNSOLD'),
('88d8a71b-b1c4-4296-8665-9ad502d32cdf', '5626482f-62d2-4c08-aca3-9d284193e57b', 'UNSOLD'),
('003f5677-3785-41cf-938e-b63a353fa8f7', '5037c84d-2801-41a7-b94b-f69200bac187', 'UNSOLD'),
('cf161c26-2f1f-4413-a88c-be08988952f7', '0913aa33-1ad3-42af-9c27-596657bac78c', 'UNSOLD'),
('3c5a0f61-80c0-4270-b0fa-46ea9d286e24', 'b8b3444b-dc03-4043-b1a0-cc9888c7cb7d', 'UNSOLD'),
('8efc12a6-e6e8-43bd-91d3-12be25e91bc3', '3bc1272c-18c1-4618-9c7e-e172df877a09', 'UNSOLD'),
('621c4b88-fa9c-4369-af45-dffea613cfce', '1ed77a8e-b74e-4f13-8711-9c628175dd9d', 'UNSOLD'),
('17ef42f5-ee4c-4ac0-a053-85dff8be21a1', '900f5af0-24be-407a-86e0-fca114bb4a0b', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('c4675974-2456-4924-a814-025342c3b83f', 'admin', '$2b$10$aDDdgsizNfE66gNFD76FlOxXbFCUbrPi0ZG.FfgmS2eAzVGiqoXCu', 'ADMIN'),
('2c6ea2da-e646-4586-911d-c93bdcff330c', 'screen', '$2b$10$oi.A0cTACw2F8W3nterRIO8lGrQ8EhiBN9CovEmiDQqmc2Yuv3dca', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 5', 'PLAYER', '[{"rank":152,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":128,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

