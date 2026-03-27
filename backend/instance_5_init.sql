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



-- ── DATA FOR INSTANCE 5 ──

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
('6a302de3-8fdc-476d-83a4-4945b48b3a4e', 'Team Alpha', 'alpha', '$2b$10$uhE.Ooi7S.oqh.pkh4nYkuDQ6HuVrA/OZg6wuaF7AOqI90di/.Ff.', 120, 0),
('55127668-83d8-47f7-a75d-a0949176050f', 'Team Bravo', 'bravo', '$2b$10$X8wCpnb8yhyXbhakFZnOhO835CPh6uc9CUNQHecJ7dD6fyuxsprJO', 120, 0),
('c1517685-3267-430c-88b2-bf8ee188e78f', 'Team Charlie', 'charlie', '$2b$10$HS5am9G5iTtXiciA/9km/uWwEOYfPyH2GwSyCnfSiPOobnsBHGQWK', 120, 0),
('a3455b54-552c-40de-a3db-0d456ce7469e', 'Team Delta', 'delta', '$2b$10$RQgB/88B5DodPJeqH5Pe8OrseMNHNcmYUL/ZLaeHPCrCArMrZig5.', 120, 0),
('9adc5e2c-bb4d-4ad6-b036-c4fe65b83581', 'Team Echo', 'echo', '$2b$10$UT2CfAci3Fv72RU4jy/VTu4LmmHlW02a4rgx4RbkBMaHbHXreKi6y', 120, 0),
('a4c1b659-9651-499a-899c-46187ff29f9d', 'Team Foxtrot', 'foxtrot', '$2b$10$gQpC5MkU8U1P5f5F8SXNGO.bzKuL03fjChQhDRCXOD2zZaSZuB5ui', 120, 0),
('95d844b7-e26d-4e77-994f-a11d654e95c0', 'Team Golf', 'golf', '$2b$10$sFRfWXf43TATpqNW80e6JO0zRsbi./gSddTDuorDZaU5.ymzqFmSK', 120, 0),
('09f4f064-8b13-4ec0-9f0d-81e7b3aedf35', 'Team Hotel', 'hotel', '$2b$10$60yGq5xWkP1tMtMHBMdKqezsDtWq4q0NqdwzA2YcKS.YP3.K3r.Ze', 120, 0),
('c3985a4f-b31b-4a81-aa45-8c717f6ecff4', 'Team India', 'india', '$2b$10$iMuHk7GfSpG0VSIT7k1GNuMae5KxNS/aBn9.TZdRokFf8cy9OXXOW', 120, 0),
('00cc216c-7b70-4660-b28c-0f10bfc90053', 'Team Juliet', 'juliet', '$2b$10$gJ6Fm.NSGvbjCoepyidaKOV1zLCEfxiXfUo0rTFB59Hk4M4AFcc3m', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, riddle_title, riddle_question, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('5ae99cc7-d558-402e-9939-c13a938d46d9', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('613af839-6753-418f-bf26-5b7dbaa8184a', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('5dac4ee7-581f-4c64-887b-c206ffdd4807', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('073da1e5-ac52-4462-82a9-5e0cf45cea41', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('f8f9119e-9c6e-4563-a61f-338cfac39fd9', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('acea4483-b389-4d00-962d-6dcb4c57d5b6', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('e575c8fe-feeb-4aa4-a269-5fdc48800f84', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('161574d8-800c-413c-901c-38501cd3ccbf', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('036520f1-9bf5-453a-adae-8b0954777110', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('167a55c0-8fef-4a59-baff-d9b4419c6b7e', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('e923a75d-6172-486b-a9a4-2313e1650b62', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('aa6dd264-9c68-4d99-a0c0-bd6147e4d0ad', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('2557c3d7-9ea8-426d-9978-919903a63136', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('b406bf33-48dd-4b81-a935-acd6e8436885', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('884b5962-bf19-4e2c-a35b-009302de672f', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('2ffb42d8-bc4b-45fc-8ed8-4fae11f04c53', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('dae57875-e515-47ec-9ea6-bdc3083cf3a0', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('44887942-0b24-453d-866f-9e9cd80dd613', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('9744daf2-5c8c-47eb-b8d8-b6bfffc89f7c', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('2f3e7775-1a4b-4cab-9d89-30e2e48ab497', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('f53491d1-681e-41c7-b9a1-a8bf0d35022c', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('edc7d1c1-0dbe-44e8-b96f-cfcfe0e19267', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('68356bea-7882-4732-8df4-827dc302a02b', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('c595cb93-df39-4dbd-bc17-82c5bbf97643', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('91210047-8144-49ce-8ddd-72313db8535b', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('8d732f63-a793-470a-85d7-b780bd7570c5', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('a4a99a0b-3b6d-4458-8551-d274e7f816a9', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('13d3baf7-1819-44f8-95dd-927576203d80', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('808feb4a-3058-41bc-b2ab-24dcfa0db103', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('505d4e36-d28a-4485-938c-2cc848efd88a', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('df341367-89fd-4a00-9d5c-b0cbc68ecc86', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('d018be36-4b18-4571-bf90-33b2e14668c9', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('b08e516e-e066-44dc-bc5c-15f0f2434e9a', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('ef873c7d-f649-47c3-99b9-45301466c9f4', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('26799c77-5c95-4c4d-bbbc-7fadb6ddefa7', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('8bbde2d4-91ea-4ddc-a1aa-7b4e86f48a6d', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('c50b2918-25e6-4606-8b1d-f821b331e332', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('697274bc-bd5a-45b2-9ed5-faf3c1b31dd4', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('baf652e0-1032-4f0e-8880-459286c4c15e', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('13a186a6-0c0a-4aa1-8869-f819340bdf2f', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('21fa9cd1-6330-468f-b96e-cfa76b7cb4dc', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('70559c77-7fd9-45d8-a4f9-95055a09632c', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('6956c699-5860-4c19-ac8b-b23b22885a73', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('a75f8809-3ff2-4ffa-afee-ed5841094c5b', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('c50b80cc-257a-446c-93f6-f268e4c90fd6', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('22fe1964-fdea-4a0b-aeec-323f6cb7b2fa', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('ed4e9cdc-38d8-4f08-bd47-93aa2e331268', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('4a5fe7d1-5c40-4c97-aa40-dc4aae620b1f', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('60ceee1b-d191-4c40-bbc6-efef74cb38c6', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('88bf0b88-6114-4ef0-ae91-5c8f53c56aba', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('ab093854-363d-4f25-9c48-11008670ff93', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('e639ed9c-609d-495e-89f0-cf971c5381d4', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('dee2bbf9-533a-41e2-8c4b-fc2b3760c8cc', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('ef66ceec-e85f-41c2-b5cc-07ab5a69b946', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('91af0e75-f313-47fc-bc6f-91dc762c1437', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('f4db0a32-7015-4f9c-bc99-ac8574492317', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('f42ca4da-e039-477c-8fa6-4f6c30fd9cc0', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('da1073f1-dd87-4911-a0c3-7f0b6eca25df', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('fa2ec34d-dff9-4a47-965e-14e05bbea5aa', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('bdd415b6-cc5a-4510-8e20-0835de2fc5bc', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('f15f8f7b-129e-4f08-9639-430bdb3db2cb', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('ae4df262-92e2-406b-8a14-4463770070f6', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('8249b95b-c0ef-4b86-9f85-e84ee875c24f', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('ca458c9f-fafd-4e08-8cd1-6433ccc26bfc', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('12d7a741-cf82-4dc3-a09c-fc31d1574dde', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('ee061966-b46b-4ce0-90bf-00b1a7b62ef4', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('c21d33f6-01af-495a-9b8e-950b628945fb', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('12fc91b2-da3f-42a7-becb-aefcb9062326', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('35f44f51-f9a0-4ae2-a348-055c34f7c96a', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('d4687367-6bf2-4711-9cc2-1ccdb3f80154', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('bd1f276d-b5ed-47a9-a898-3b49bc3a92b5', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('36c313b6-8773-4ba7-9b9a-0582efe3af49', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('1bbd893b-559d-4051-b58c-651a1014a319', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('e8594b61-f252-4257-b7de-5bce76c7427a', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('b6c31a14-3de5-4d9f-914a-44155b9691e3', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('03f469dd-9655-4d7d-bba5-330cc31d1f47', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('f0e0e6b0-af99-4ede-890d-edd86d650689', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('6859b759-b4ae-4e91-8cf6-1b8953de0aed', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('529d9212-85fd-4b90-9da4-b8cdb7598636', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('044d9941-e768-44bc-958e-41188b96b7d9', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('cf3ba7f7-fccd-44e3-b34a-d05c82532837', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('3aa043b3-0f15-460d-8437-721faa8d7812', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('ebabea97-0a49-4bbd-b640-9df974154bad', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('b7b22b33-f38a-44d3-8e3e-f9c6e60d49ed', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('5249e1ec-f301-46e6-9c4c-5250f6484f49', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('a3ea91d9-75da-4e41-9207-4bd2c5d6e422', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('6483bdcb-4670-4618-ba3b-864390f327a7', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('54366341-9e9c-4dfa-b702-42bc1030c270', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('2b07e11f-b57c-4418-a00a-b6a4361e5459', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('7e9ac152-d2bf-4195-9563-a4390fb9af0f', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('4a5d2106-1f92-4a40-8324-017812d9153a', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('7d536b73-546e-40da-bb90-b88916a515db', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('ee006c14-d823-4278-ac1e-99e45b019621', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('c4b291e2-36ee-4e3f-a236-05fb2a17bdb4', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('82dd9ae5-e681-49e0-be7b-7ca1d0d65c50', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('891ea2ba-598a-4c88-85fe-7bbd4a748264', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('8caa27a7-78cb-4394-a918-173cb8437d9f', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('13380c13-7f21-4d26-9575-e511564b1b4c', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('e8dde543-c66b-4ec5-920c-7c2f05357fd9', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('4d7ca075-f381-4970-af78-03704d24c453', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('64ed839f-8288-4fd6-95a2-bb3d5e84e23b', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('08c46cc1-5ca2-4f13-a5df-ad7f40bcd7d1', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('03d72db7-44eb-4f14-8c3f-e67d2af91e95', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('6821781f-f36d-406f-a43b-9fe4092c5e68', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('e20f64d0-838a-4be4-8475-59c24dd3be33', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('687d92df-f82e-4401-873c-2051cf9c662a', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('36970a2b-cc60-4c46-a868-a29841bb9f22', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('b495b6d5-8986-4de7-bf53-c1631cc41811', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('ef4384b3-5986-491a-b38a-413c80252e4c', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('be9d4747-1150-4e31-8ed8-dae8268f6b3a', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('1349b3ac-7de5-4cd8-a507-0ec768f2ad75', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('ba9eeb52-b02f-486e-b511-8a0d72556af7', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('58a86a3d-5e95-462e-973f-b1e6240aa16a', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('3cfe7434-a0f4-44fe-b05c-95dd2a1aac8f', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('53a6930b-7c7b-4eb7-accd-ce6516356a89', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('989ff448-5480-46b7-ad83-5e914c510084', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('b17c6968-42ce-4cbd-9c7f-19e2eb3f5f52', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('dda0ee3a-b441-4c69-8895-80024eb7fd48', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('45ca7b7d-c490-4742-a0d2-7b81074244a9', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('cf0403df-aa36-4bee-91c3-5133d90a0ce9', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('8ff2c67b-7c4d-40e6-9434-271f1dfe356c', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('49fa1cab-a235-4805-89fc-1ffd12f1e691', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('66bd92e0-9289-49cf-a0c3-136e8f276373', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, true, 'The Run-Chase Specialist (Grade A - Hard Mode)', 'Most people associate me with the color pink, but I actually won my first IPL championship wearing blue back in 2017, playing a supporting role in a dramatic one-run final victory. Besides my aggressive opening stats, I was the victim in the most explosive "Mankad" run-out controversy this league has ever witnessed. After matching the all-time tournament record for the most centuries in run-chases, I’m now packing my bags to join the exact same franchise that broke my heart in the 2022 final. Who am I?', 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('e920834a-0103-449b-a5e8-4c85ec3e59b1', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('988ac2e1-1e7a-42ae-95d8-e842e512ed68', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('1ef6234d-49b8-4b6d-ae2e-b8a94804b827', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('cd5a5bbe-83d5-4e8f-a0bf-e5097051aa1d', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('4bb6eb5f-1190-4e03-975b-32a7af53ca38', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('36e1f8ea-039f-44a1-b75d-83a65c662b38', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('95d055c2-ea3b-4515-81af-317a0d2890fe', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, true, 'The Dynasty Builder (Grade A - Hard Mode)', 'I am the only cricketer in the history of this league to boast both a century and a hat-trick on my resume. My very first IPL championship didn''t even happen in India, but on South African soil with a franchise that no longer exists. Despite building a legendary, multi-title dynasty in my home city over the last decade, my time at the helm ended in a massive, highly-debated captaincy controversy last season. Who am I?', 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('72e2736b-cba8-4dba-a0e0-2d5adb11e10b', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('404aea55-2868-4a67-a445-f230bf77d74e', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('d46e03af-c3e6-44c8-96c4-f4255bc803a4', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('72f1252b-4b85-44dd-a278-46ec3ff7093f', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('9610948f-2a52-45f0-9d90-cb07b716f4d8', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('2d033e85-2c54-45cf-87e0-ad03646797d2', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('d4a77169-3798-476a-a29b-062a4a50469e', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, NULL, NULL, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('b98c8606-b3e4-4743-9f47-44fd48c8e6b2', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('3c150260-57b5-4718-b675-42bc168b914a', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('2d74e6c2-c920-459a-b484-608422974818', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 1, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('9940a210-01d4-49ac-b1ba-6838b1baf416', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('824d5f2a-9f01-4bab-8ff9-db420ad1dc19', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('76cec410-216c-461e-a4c7-e213fb540c51', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('f8220062-0f8e-4b7d-b9d8-902b84fff6d1', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('7d889d7a-4e55-4442-98f3-8cb1ab287291', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('0fb8f0a8-00cd-4507-8955-030a57fa53f5', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('df3f8d23-0f17-4e58-a5a1-7ff4b7f10255', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('a4719dd8-42b2-42f8-a837-c8ecfaddbbbc', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('d739d4cc-faf0-4118-8f79-d1cc6b203de4', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('64b0e1cb-0359-4bb7-baa6-c12edffb74ec', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, NULL, NULL, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('b89fd609-348a-4859-b837-8d5640ac3894', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('3ecc1e1e-6cdf-446e-8542-c10835f3ecda', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('1d843f91-a14c-4c3b-9792-b7163df0f1f4', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('54a5352b-be2e-445b-90c1-784adb0821d2', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, NULL, NULL, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('320db34c-f217-4fca-b2af-213add979691', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('4fe9ced8-47fd-488e-aed7-f6d717c9233f', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, NULL, NULL, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('3eb8cd23-7a5c-4bbb-9c19-31edf4eb4685', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('06008588-4bdc-4f84-9cf5-7053b1a1028d', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, NULL, NULL, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('47a95413-960b-48bc-8f5b-671960bbbc89', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, NULL, NULL, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('50dcc975-c672-4207-b47b-5ed126d56614', '5ae99cc7-d558-402e-9939-c13a938d46d9', 'UNSOLD'),
('93cc295c-53c7-4184-b420-c66277d39f88', '613af839-6753-418f-bf26-5b7dbaa8184a', 'UNSOLD'),
('b6cebb76-5084-43c2-a6fb-7de4d62f193a', '5dac4ee7-581f-4c64-887b-c206ffdd4807', 'UNSOLD'),
('a86404fb-eb23-4cd4-a5e2-329b94c24a56', '073da1e5-ac52-4462-82a9-5e0cf45cea41', 'UNSOLD'),
('f74014e3-854b-41a8-aea1-68cfb561b5ff', 'f8f9119e-9c6e-4563-a61f-338cfac39fd9', 'UNSOLD'),
('b8c930dc-945a-4876-97b6-dee9dc345010', 'acea4483-b389-4d00-962d-6dcb4c57d5b6', 'UNSOLD'),
('371b7a48-9ae9-46e8-a052-0b5a5109ed2b', 'e575c8fe-feeb-4aa4-a269-5fdc48800f84', 'UNSOLD'),
('649d914a-54a1-4410-9524-61797933455e', '161574d8-800c-413c-901c-38501cd3ccbf', 'UNSOLD'),
('d66b43d4-76e9-4adf-9392-c11dc1c146b8', '036520f1-9bf5-453a-adae-8b0954777110', 'UNSOLD'),
('47a7d766-8b3d-4af9-b799-0714091a6a6a', '167a55c0-8fef-4a59-baff-d9b4419c6b7e', 'UNSOLD'),
('f213f6bb-c29a-48c0-81e6-dfa122fda549', 'e923a75d-6172-486b-a9a4-2313e1650b62', 'UNSOLD'),
('ee7eb9d4-2b61-4e9b-905c-8e4a8bd56abe', 'aa6dd264-9c68-4d99-a0c0-bd6147e4d0ad', 'UNSOLD'),
('0e15fa64-df7f-4f4e-874b-83c6b9c61f21', '2557c3d7-9ea8-426d-9978-919903a63136', 'UNSOLD'),
('1beefa29-242a-48d3-8f3b-e48c912fa4b4', 'b406bf33-48dd-4b81-a935-acd6e8436885', 'UNSOLD'),
('432ccc45-c87a-44dd-b681-8e43f929c4a2', '884b5962-bf19-4e2c-a35b-009302de672f', 'UNSOLD'),
('1f887cc5-4ad0-409a-ae50-097c8f7052b2', '2ffb42d8-bc4b-45fc-8ed8-4fae11f04c53', 'UNSOLD'),
('069a9393-e27c-4d89-8347-4702fe9cfc59', 'dae57875-e515-47ec-9ea6-bdc3083cf3a0', 'UNSOLD'),
('a17cffdf-38aa-47b9-8737-232ded610525', '44887942-0b24-453d-866f-9e9cd80dd613', 'UNSOLD'),
('3ea2f06e-6a04-48ea-8885-bef40918f763', '9744daf2-5c8c-47eb-b8d8-b6bfffc89f7c', 'UNSOLD'),
('7be59c25-2552-45a1-be3d-42318ebc4a39', '2f3e7775-1a4b-4cab-9d89-30e2e48ab497', 'UNSOLD'),
('326c29bb-c2c3-49dc-9638-dde1b28f265b', 'f53491d1-681e-41c7-b9a1-a8bf0d35022c', 'UNSOLD'),
('a87d50eb-0fa9-4ca4-9bd9-873ae9eee9aa', 'edc7d1c1-0dbe-44e8-b96f-cfcfe0e19267', 'UNSOLD'),
('a91c6e1b-9655-4f15-bcbc-872363d2a38f', '68356bea-7882-4732-8df4-827dc302a02b', 'UNSOLD'),
('5f243328-1921-4e56-ab7d-dd14cf968a28', 'c595cb93-df39-4dbd-bc17-82c5bbf97643', 'UNSOLD'),
('bc21773e-7a3f-43a8-8348-a63f66715467', '91210047-8144-49ce-8ddd-72313db8535b', 'UNSOLD'),
('5ecd4ce0-a18a-4a2c-89ff-9e1f6d340310', '8d732f63-a793-470a-85d7-b780bd7570c5', 'UNSOLD'),
('99d7be77-0671-4f40-a072-1e6d02d63e7b', 'a4a99a0b-3b6d-4458-8551-d274e7f816a9', 'UNSOLD'),
('1d4bef95-a8a9-4d6b-9fa9-199c1be49bfb', '13d3baf7-1819-44f8-95dd-927576203d80', 'UNSOLD'),
('a5c39258-4f85-4925-8193-f3ef6ae71b21', '808feb4a-3058-41bc-b2ab-24dcfa0db103', 'UNSOLD'),
('51dbdfa5-97bc-421b-ab09-bf35f2120877', '505d4e36-d28a-4485-938c-2cc848efd88a', 'UNSOLD'),
('e9ea17b8-678c-46d3-a125-34b08365c8c3', 'df341367-89fd-4a00-9d5c-b0cbc68ecc86', 'UNSOLD'),
('5b94fbf7-8259-447c-b65c-bba4f10862e4', 'd018be36-4b18-4571-bf90-33b2e14668c9', 'UNSOLD'),
('dab4e0bb-eb80-442b-916c-f79d43f233de', 'b08e516e-e066-44dc-bc5c-15f0f2434e9a', 'UNSOLD'),
('e1de976f-f619-4c5d-b879-a3d411ab955f', 'ef873c7d-f649-47c3-99b9-45301466c9f4', 'UNSOLD'),
('5f5f8496-7d0d-44d5-8287-d7ffd0687fbe', '26799c77-5c95-4c4d-bbbc-7fadb6ddefa7', 'UNSOLD'),
('6d172a36-9617-4c04-b05c-85744290e27a', '8bbde2d4-91ea-4ddc-a1aa-7b4e86f48a6d', 'UNSOLD'),
('e1cf5742-e7eb-4878-b3d1-4164d385f72f', 'c50b2918-25e6-4606-8b1d-f821b331e332', 'UNSOLD'),
('f8a3eb43-0d3c-4094-8ba6-ccbe276bceb2', '697274bc-bd5a-45b2-9ed5-faf3c1b31dd4', 'UNSOLD'),
('b4ce50e2-9ac8-4edf-887e-cd8ddcabbd66', 'baf652e0-1032-4f0e-8880-459286c4c15e', 'UNSOLD'),
('a34d51ea-a775-4d6f-ad31-fe964a7f1c82', '13a186a6-0c0a-4aa1-8869-f819340bdf2f', 'UNSOLD'),
('8f4e45d3-3552-49d4-832d-f4dfa0b6e8c8', '21fa9cd1-6330-468f-b96e-cfa76b7cb4dc', 'UNSOLD'),
('d511bfb0-1db8-402e-ac56-4de3c9938da8', '70559c77-7fd9-45d8-a4f9-95055a09632c', 'UNSOLD'),
('74875d42-c2fc-4437-ac5e-320cf06371ae', '6956c699-5860-4c19-ac8b-b23b22885a73', 'UNSOLD'),
('c0c4c7f2-cda6-4dbb-9b0f-931d8c069362', 'a75f8809-3ff2-4ffa-afee-ed5841094c5b', 'UNSOLD'),
('cfb97a8a-93cf-49fa-8f11-34ff424d50e3', 'c50b80cc-257a-446c-93f6-f268e4c90fd6', 'UNSOLD'),
('3a53c156-6d07-46f4-a976-afde3b0d78ea', '22fe1964-fdea-4a0b-aeec-323f6cb7b2fa', 'UNSOLD'),
('7da0dc6f-180d-44b3-9004-020304e06cbd', 'ed4e9cdc-38d8-4f08-bd47-93aa2e331268', 'UNSOLD'),
('e7a422df-b5f3-4767-8a11-7fded8131c75', '4a5fe7d1-5c40-4c97-aa40-dc4aae620b1f', 'UNSOLD'),
('6ecffb47-6da5-4477-9737-376503201879', '60ceee1b-d191-4c40-bbc6-efef74cb38c6', 'UNSOLD'),
('49f79018-b8bc-49d2-8c3a-1d790017ca98', '88bf0b88-6114-4ef0-ae91-5c8f53c56aba', 'UNSOLD'),
('d5eda3f6-acbb-484b-875f-1693218efcc3', 'ab093854-363d-4f25-9c48-11008670ff93', 'UNSOLD'),
('95ca7190-24f5-4e97-b272-3073ed5c0e79', 'e639ed9c-609d-495e-89f0-cf971c5381d4', 'UNSOLD'),
('e23ff2b1-f69c-4eca-9b26-738a1d55e86b', 'dee2bbf9-533a-41e2-8c4b-fc2b3760c8cc', 'UNSOLD'),
('21fb0348-7f1b-4397-b179-2833ad36e0e6', 'ef66ceec-e85f-41c2-b5cc-07ab5a69b946', 'UNSOLD'),
('52921fb0-2007-4682-bd30-d32a9fa4e8e1', '91af0e75-f313-47fc-bc6f-91dc762c1437', 'UNSOLD'),
('94138561-7851-4d55-9271-9a7ffa2844bd', 'f4db0a32-7015-4f9c-bc99-ac8574492317', 'UNSOLD'),
('bcff4491-ca82-412b-9f41-7e6b3c386ce5', 'f42ca4da-e039-477c-8fa6-4f6c30fd9cc0', 'UNSOLD'),
('4c92a5ab-371b-4547-8288-3b5f40355e6e', 'da1073f1-dd87-4911-a0c3-7f0b6eca25df', 'UNSOLD'),
('754c8476-02d2-481f-b004-ac2e79f81cb6', 'fa2ec34d-dff9-4a47-965e-14e05bbea5aa', 'UNSOLD'),
('d78e0601-3ff2-40a2-9406-bb84cfc7acda', 'bdd415b6-cc5a-4510-8e20-0835de2fc5bc', 'UNSOLD'),
('5860e41f-2c5c-4063-99de-c2dcf595efc7', 'f15f8f7b-129e-4f08-9639-430bdb3db2cb', 'UNSOLD'),
('11dc8999-4942-40fd-84dd-f991879ff570', 'ae4df262-92e2-406b-8a14-4463770070f6', 'UNSOLD'),
('8308630e-fb1d-45de-8c96-005c9c9b1c9f', '8249b95b-c0ef-4b86-9f85-e84ee875c24f', 'UNSOLD'),
('df21c0a4-1881-477a-ad80-532e3c7a04c5', 'ca458c9f-fafd-4e08-8cd1-6433ccc26bfc', 'UNSOLD'),
('92e49437-4285-4113-a481-1b9abacad612', '12d7a741-cf82-4dc3-a09c-fc31d1574dde', 'UNSOLD'),
('9e0c10f6-ed3a-46a6-b52a-72a8395101fc', 'ee061966-b46b-4ce0-90bf-00b1a7b62ef4', 'UNSOLD'),
('55b927ab-b854-4045-a6d2-b2f804ba03bd', 'c21d33f6-01af-495a-9b8e-950b628945fb', 'UNSOLD'),
('5d4009af-5ca2-484d-ae45-04a78cb67e84', '12fc91b2-da3f-42a7-becb-aefcb9062326', 'UNSOLD'),
('8fed7613-26d9-412c-a5da-b47d1a7db750', '35f44f51-f9a0-4ae2-a348-055c34f7c96a', 'UNSOLD'),
('3e22f7a1-15ab-4a3f-a338-e25454ee3f52', 'd4687367-6bf2-4711-9cc2-1ccdb3f80154', 'UNSOLD'),
('3af94b05-7130-4928-bd5e-484c3dbc60cb', 'bd1f276d-b5ed-47a9-a898-3b49bc3a92b5', 'UNSOLD'),
('a76115f7-c6e0-438e-b530-9831911aef1d', '36c313b6-8773-4ba7-9b9a-0582efe3af49', 'UNSOLD'),
('266df123-7dc0-4a4a-bf61-7ee8ba048f5f', '1bbd893b-559d-4051-b58c-651a1014a319', 'UNSOLD'),
('18eddd6c-04ae-4398-a559-2de88a28d6a6', 'e8594b61-f252-4257-b7de-5bce76c7427a', 'UNSOLD'),
('82304370-9fba-4a05-b1ca-3f413db747b6', 'b6c31a14-3de5-4d9f-914a-44155b9691e3', 'UNSOLD'),
('f6491aff-8120-4b96-8f24-35bd0c13c545', '03f469dd-9655-4d7d-bba5-330cc31d1f47', 'UNSOLD'),
('36d238e0-e231-41dd-8152-5decf5bc86a5', 'f0e0e6b0-af99-4ede-890d-edd86d650689', 'UNSOLD'),
('1fe4965c-95c9-42f0-9e06-75105ecff012', '6859b759-b4ae-4e91-8cf6-1b8953de0aed', 'UNSOLD'),
('24ca4a6e-4219-48e6-bc79-27ac72354a6d', '529d9212-85fd-4b90-9da4-b8cdb7598636', 'UNSOLD'),
('74412f6d-62cc-4ed6-8f0f-87c61048b82e', '044d9941-e768-44bc-958e-41188b96b7d9', 'UNSOLD'),
('005a155e-1596-4035-a404-d93b7fc4ec90', 'cf3ba7f7-fccd-44e3-b34a-d05c82532837', 'UNSOLD'),
('e658eb26-ddcb-40fc-a3e0-84201cee0ae7', '3aa043b3-0f15-460d-8437-721faa8d7812', 'UNSOLD'),
('411253e1-bd37-4c6e-a0c9-e42e30f75a12', 'ebabea97-0a49-4bbd-b640-9df974154bad', 'UNSOLD'),
('0508dfa3-80fe-475d-86bb-4ede459cee89', 'b7b22b33-f38a-44d3-8e3e-f9c6e60d49ed', 'UNSOLD'),
('cabdbe8a-2e17-40dd-84d1-fc758c0f6433', '5249e1ec-f301-46e6-9c4c-5250f6484f49', 'UNSOLD'),
('64fda890-a8fa-444b-b751-dc057128b4bd', 'a3ea91d9-75da-4e41-9207-4bd2c5d6e422', 'UNSOLD'),
('e79cfdce-76ce-4089-b893-9325331d31d0', '6483bdcb-4670-4618-ba3b-864390f327a7', 'UNSOLD'),
('81265870-b7da-4d00-a78b-e35fb83acce2', '54366341-9e9c-4dfa-b702-42bc1030c270', 'UNSOLD'),
('7c854e4c-ab07-46a4-8a12-3a3d8c2a7afb', '2b07e11f-b57c-4418-a00a-b6a4361e5459', 'UNSOLD'),
('eaf30bdf-ea51-4279-baaa-0da5493bad5a', '7e9ac152-d2bf-4195-9563-a4390fb9af0f', 'UNSOLD'),
('52132821-7eec-4544-8c06-76f5baabe45d', '4a5d2106-1f92-4a40-8324-017812d9153a', 'UNSOLD'),
('bec955b8-8d63-4079-a247-645bb0a13b30', '7d536b73-546e-40da-bb90-b88916a515db', 'UNSOLD'),
('a1c773de-381d-42aa-91d5-cda707013cbd', 'ee006c14-d823-4278-ac1e-99e45b019621', 'UNSOLD'),
('def9f2d9-f82f-4bcf-b39e-3ca428b20659', 'c4b291e2-36ee-4e3f-a236-05fb2a17bdb4', 'UNSOLD'),
('ed2725b9-1964-4ebf-a597-b6e100a89205', '82dd9ae5-e681-49e0-be7b-7ca1d0d65c50', 'UNSOLD'),
('cb6b45ae-de0f-49a1-a70a-b291f8301b04', '891ea2ba-598a-4c88-85fe-7bbd4a748264', 'UNSOLD'),
('fcf3d754-2b23-4771-8c0d-e00ef642e856', '8caa27a7-78cb-4394-a918-173cb8437d9f', 'UNSOLD'),
('4943b8fb-30a7-44c3-b1f0-8adce1a71151', '13380c13-7f21-4d26-9575-e511564b1b4c', 'UNSOLD'),
('b3b59183-c850-4f68-9455-d624df75506e', 'e8dde543-c66b-4ec5-920c-7c2f05357fd9', 'UNSOLD'),
('af291f51-9d14-4f77-9424-686578afab27', '4d7ca075-f381-4970-af78-03704d24c453', 'UNSOLD'),
('16a770a3-0eee-43c3-8070-b57757588082', '64ed839f-8288-4fd6-95a2-bb3d5e84e23b', 'UNSOLD'),
('2f7ccab3-9542-4dd5-a1ee-e5231fb9f9eb', '08c46cc1-5ca2-4f13-a5df-ad7f40bcd7d1', 'UNSOLD'),
('72e93166-def7-476b-a40d-c7e3eda0e115', '03d72db7-44eb-4f14-8c3f-e67d2af91e95', 'UNSOLD'),
('5a369943-efe5-4fea-b2ae-18de765de508', '6821781f-f36d-406f-a43b-9fe4092c5e68', 'UNSOLD'),
('9477e716-9fc2-4cf1-bdf3-4785d6819ada', 'e20f64d0-838a-4be4-8475-59c24dd3be33', 'UNSOLD'),
('6fc57d2b-1657-48e0-aa47-016eb8a845fb', '687d92df-f82e-4401-873c-2051cf9c662a', 'UNSOLD'),
('8efcc2e0-8211-4ee5-8723-fcf74fa0c904', '36970a2b-cc60-4c46-a868-a29841bb9f22', 'UNSOLD'),
('c9e8b092-5fdc-474f-b8fe-4129f96d0994', 'b495b6d5-8986-4de7-bf53-c1631cc41811', 'UNSOLD'),
('0b973de5-e3a4-486d-8745-352fdd9555d3', 'ef4384b3-5986-491a-b38a-413c80252e4c', 'UNSOLD'),
('069f448e-66e4-49bd-b083-49706416f7ff', 'be9d4747-1150-4e31-8ed8-dae8268f6b3a', 'UNSOLD'),
('3a61ea37-f0f3-4ae6-9daf-97730975e8f2', '1349b3ac-7de5-4cd8-a507-0ec768f2ad75', 'UNSOLD'),
('6f1b8019-61b5-47c4-8bd2-eb9acb73ea78', 'ba9eeb52-b02f-486e-b511-8a0d72556af7', 'UNSOLD'),
('b3223c93-0f06-492a-a6e4-382ce4ff5074', '58a86a3d-5e95-462e-973f-b1e6240aa16a', 'UNSOLD'),
('4e917a2c-bc0b-43fc-bf4c-68f45cab597a', '3cfe7434-a0f4-44fe-b05c-95dd2a1aac8f', 'UNSOLD'),
('7523bb04-0408-49ab-9f24-687ef03100c9', '53a6930b-7c7b-4eb7-accd-ce6516356a89', 'UNSOLD'),
('39271663-e763-44af-bb50-5ef1d0ce8186', '989ff448-5480-46b7-ad83-5e914c510084', 'UNSOLD'),
('565b162d-368d-440f-b4e0-580656b554c9', 'b17c6968-42ce-4cbd-9c7f-19e2eb3f5f52', 'UNSOLD'),
('7074d2b7-f607-4f79-bb71-b2abfdbdaeb0', 'dda0ee3a-b441-4c69-8895-80024eb7fd48', 'UNSOLD'),
('3df87d9e-c8e6-4f3f-a952-94e39219ade8', '45ca7b7d-c490-4742-a0d2-7b81074244a9', 'UNSOLD'),
('a13159fb-ead4-4a89-9e4b-1ca8fe61bec4', 'cf0403df-aa36-4bee-91c3-5133d90a0ce9', 'UNSOLD'),
('36b5ce99-983b-4084-88ff-5e74dac8ce4d', '8ff2c67b-7c4d-40e6-9434-271f1dfe356c', 'UNSOLD'),
('9761d5db-acec-43f9-a5b8-f39e0d7c79e4', '49fa1cab-a235-4805-89fc-1ffd12f1e691', 'UNSOLD'),
('3fe4f7d6-ea3a-4acb-853f-fc2bb6019cb2', '66bd92e0-9289-49cf-a0c3-136e8f276373', 'UNSOLD'),
('211b1537-f1c4-4d46-930b-8cb0bae95e28', 'e920834a-0103-449b-a5e8-4c85ec3e59b1', 'UNSOLD'),
('616d9aeb-9014-4d17-bdc0-3808d7b8bd8e', '988ac2e1-1e7a-42ae-95d8-e842e512ed68', 'UNSOLD'),
('f646a3e1-114a-4c4d-848e-69c052c0ea8a', '1ef6234d-49b8-4b6d-ae2e-b8a94804b827', 'UNSOLD'),
('f3f38cb6-7134-4fa5-9abf-32b99f4a0358', 'cd5a5bbe-83d5-4e8f-a0bf-e5097051aa1d', 'UNSOLD'),
('550fb822-6b12-49af-8e44-bcc278dd5373', '4bb6eb5f-1190-4e03-975b-32a7af53ca38', 'UNSOLD'),
('4fd64321-1e00-4f18-a16c-1e2079bd4b7b', '36e1f8ea-039f-44a1-b75d-83a65c662b38', 'UNSOLD'),
('9cc29b37-78b1-4029-a1fe-6daecf6f1261', '95d055c2-ea3b-4515-81af-317a0d2890fe', 'UNSOLD'),
('64a49a24-7410-4c5e-b35a-70f1b3ab4e14', '72e2736b-cba8-4dba-a0e0-2d5adb11e10b', 'UNSOLD'),
('14e8b949-f7fa-4059-9e41-9d849acc7fb0', '404aea55-2868-4a67-a445-f230bf77d74e', 'UNSOLD'),
('b02fd2e7-899c-458a-bfa6-d5c5071b60ca', 'd46e03af-c3e6-44c8-96c4-f4255bc803a4', 'UNSOLD'),
('6608245c-1299-4f48-babc-d67ce182fe3b', '72f1252b-4b85-44dd-a278-46ec3ff7093f', 'UNSOLD'),
('abbcf37e-932d-4a4e-b06d-b921fe1a4010', '9610948f-2a52-45f0-9d90-cb07b716f4d8', 'UNSOLD'),
('7c5e43d6-48a5-4dc9-aa66-d33aca004d50', '2d033e85-2c54-45cf-87e0-ad03646797d2', 'UNSOLD'),
('057a2150-8ece-4865-b440-138fc8d72478', 'd4a77169-3798-476a-a29b-062a4a50469e', 'UNSOLD'),
('dbab9825-8cf0-448e-ab6d-ebe4863f3a86', 'b98c8606-b3e4-4743-9f47-44fd48c8e6b2', 'UNSOLD'),
('4da81dce-f732-468b-9c8f-92e894ccdddd', '3c150260-57b5-4718-b675-42bc168b914a', 'UNSOLD'),
('4a8a2254-7b1c-4d79-ae42-df42a067c376', '2d74e6c2-c920-459a-b484-608422974818', 'UNSOLD'),
('55d10963-0b4f-4c1d-89a3-ac956a2a4f95', '9940a210-01d4-49ac-b1ba-6838b1baf416', 'UNSOLD'),
('9b0e7118-faa1-493d-8ae6-dfc4c06760a5', '824d5f2a-9f01-4bab-8ff9-db420ad1dc19', 'UNSOLD'),
('a323c92d-499f-4d49-8d46-1a193c6a7620', '76cec410-216c-461e-a4c7-e213fb540c51', 'UNSOLD'),
('1b0ae212-e92f-4fcc-acff-788a234c744f', 'f8220062-0f8e-4b7d-b9d8-902b84fff6d1', 'UNSOLD'),
('d3c4048b-14ba-44b5-b4f2-763b213fbdcd', '7d889d7a-4e55-4442-98f3-8cb1ab287291', 'UNSOLD'),
('50e1ea0d-0f52-46ff-90dc-c46e77260d45', '0fb8f0a8-00cd-4507-8955-030a57fa53f5', 'UNSOLD'),
('4fb11a04-5e06-48c7-b294-618b42801ac2', 'df3f8d23-0f17-4e58-a5a1-7ff4b7f10255', 'UNSOLD'),
('f50e45d9-a7f5-4a7a-9c6e-f398574f4f0d', 'a4719dd8-42b2-42f8-a837-c8ecfaddbbbc', 'UNSOLD'),
('1556136b-a107-4db3-a682-1f7f2af43247', 'd739d4cc-faf0-4118-8f79-d1cc6b203de4', 'UNSOLD'),
('90d5c62f-6863-4952-802e-3c64a1739c1a', '64b0e1cb-0359-4bb7-baa6-c12edffb74ec', 'UNSOLD'),
('9f83ecaf-6eb4-4174-80d6-c54ff6f59118', 'b89fd609-348a-4859-b837-8d5640ac3894', 'UNSOLD'),
('4d1f7a8e-7de6-4cd1-b552-6a6015a8872d', '3ecc1e1e-6cdf-446e-8542-c10835f3ecda', 'UNSOLD'),
('a6db2505-88ee-409c-a437-e7b2fbce7f38', '1d843f91-a14c-4c3b-9792-b7163df0f1f4', 'UNSOLD'),
('af828f01-4e3f-418f-b7fb-ee025dc70100', '54a5352b-be2e-445b-90c1-784adb0821d2', 'UNSOLD'),
('73c114a4-1354-4e3e-aa44-ace20496c198', '320db34c-f217-4fca-b2af-213add979691', 'UNSOLD'),
('e498e117-2937-4d91-9e95-5941ca19fac4', '4fe9ced8-47fd-488e-aed7-f6d717c9233f', 'UNSOLD'),
('02f082f8-ad84-4fc8-ad2f-944e10226db7', '3eb8cd23-7a5c-4bbb-9c19-31edf4eb4685', 'UNSOLD'),
('168e01e4-7997-482c-b376-215e1298224a', '06008588-4bdc-4f84-9cf5-7053b1a1028d', 'UNSOLD'),
('44a4b29c-d87a-4673-99d7-91102c1769e3', '47a95413-960b-48bc-8f5b-671960bbbc89', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('9ea406a5-db14-459f-ac29-9fd2d82cf7b4', 'admin', '$2b$10$T6sRhF9wf/dPQGticUL7DuE6U.DHi2nze0EOa7fWrHNcQYebWOq12', 'ADMIN'),
('304ad712-9aec-48dd-8145-739c9f081268', 'screen', '$2b$10$/8CB0gEIrTB81a7u7nkuI.DEzqQl6bvbKA4C4MQuEN.Ij25krUxrW', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Franchise Sequence', 'FRANCHISE', '[10,4,2,5,9,8,7,1,6,3]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(2, 'Power Card Sequence', 'POWER_CARD', '["BID_FREEZER","GOD_EYE","FINAL_STRIKE","MULLIGAN"]');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(3, 'Player Sequence', 'PLAYER', '[152,75,154,16,138,73,106,90,155,100,80,93,41,118,18,69,103,105,102,88,126,136,115,129,68,44,150,157,14,65,4,127,140,91,142,144,28,58,82,50,43,34,143,119,37,123,23,89,64,24,85,62,148,149,96,63,98,45,15,87,70,101,32,10,67,35,132,27,153,130,159,33,12,66,79,133,1,156,125,120,59,83,84,74,121,146,141,117,124,97,139,52,51,107,72,86,39,29,108,135,3,60,110,158,77,9,31,95,81,49,151,113,109,111,116,54,122,137,26,40,92,71,20,57,36,53,11,47,42,6,145,114,7,134,112,30,2,25,94,38,76,131,17,46,19,56,21,104,99,5,147,61,48,8,78,22,55,13,128]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

