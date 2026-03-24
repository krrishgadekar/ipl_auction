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
('bedf282f-6c9d-482c-8c24-f406565b4101', 'Team Alpha', 'alpha', '$2b$10$Zg9J6VfrZztpc4568VE8geTysHeAQWTS8lY.UqgPbDRkakFitviwa', 120, 0),
('74ac4083-f11d-4beb-bf84-06faf5cd080c', 'Team Bravo', 'bravo', '$2b$10$Apmc/oXbuGcIVXOW6ppJJOfni2CzORquDs3WkiVo9V52adNgMWo52', 120, 0),
('8b38beae-bf21-4acd-9ce9-88021c22f158', 'Team Charlie', 'charlie', '$2b$10$RlQ6J9ns3jldas9/8XiLNe.wDdZZ121/bLMarH4W7yRIpITPM0X1G', 120, 0),
('700a5fb5-b633-4b5b-b4c6-a2579d3b7572', 'Team Delta', 'delta', '$2b$10$RommYCjecRRXCp7tn37P8e5TSKeyKJYM.YzacVw6DmJHczNzaLNRu', 120, 0),
('32b6a73b-c493-4054-9ad8-457c3f77b789', 'Team Echo', 'echo', '$2b$10$.oqUUHVp7G68b2dBqEB3Zej8e7xJ.Qp4YXBZuPhBz/Pkd.cxZFc8u', 120, 0),
('b6c80622-6746-419f-9035-2a0a2f0646c8', 'Team Foxtrot', 'foxtrot', '$2b$10$xR8I3oeUtFq60N1w.VMdgu.jF0uYwO3eUdDnSjrk6UwpHlFXbgNLy', 120, 0),
('ed037862-c02b-4456-b426-d5b65ee6f8a8', 'Team Golf', 'golf', '$2b$10$7jrQvS9JhrxK/ed43GDBUO9dggArDBjkUzMXWkenzLmRfurMGr5Tu', 120, 0),
('e2753859-6738-4e11-8fd7-e12f7156621b', 'Team Hotel', 'hotel', '$2b$10$vfpdZfhKSbhyAQiTHWoYkeGxgOt5yofOP57MsxoAouCk6QkiUXOcm', 120, 0),
('1785c4b4-a25a-4c36-9a0e-1aa54ac0844c', 'Team India', 'india', '$2b$10$RkXtbhdWUe90o2UKMnHlLOTmShF/BvaWySevPaYfwHkeaTrz.rnpe', 120, 0),
('b1df52c4-0973-41f7-baca-9b37f2ace6c0', 'Team Juliet', 'juliet', '$2b$10$3YW.6yAEyzf1QZn/7VZvDuHlMzEIep1cDS7IGyFS7.YN/wsr6ojKa', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('3d7999e4-a54f-4bd0-8638-c792d5c54017', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('68f5ea8e-81ea-485c-a11e-c2838160be16', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('f59f74a1-37ba-46ac-9ae6-ecc6b4830cea', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('1a326d95-a5d0-4130-834f-56f5ea0a29d8', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('c0d93cde-230a-412d-9098-fccde0d564ba', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('59df9c69-3b1b-4dc8-9b60-26fb35cda92e', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('e9b9403c-d7b0-4d31-8ada-f70d402b9079', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('168c1d58-419a-419f-8dda-2038c8b20c63', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('5be22e1b-acc9-4664-b0ca-4f1d8a5376ca', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('2fdb252b-c306-4abb-bf9f-9363c0fe6db1', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('e18eb657-5b78-4c8d-baad-fd2724d7cda8', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('cfe2a0ce-7cd1-477b-825e-7e70e68e261a', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('a4a07c97-e0d7-4aa6-89f4-a82b4af9d993', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('f74bbab3-e035-4ca6-9a0c-a3f2e28a8033', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('8d18968f-be76-48cc-9982-6c0bbd8a0ba1', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('33dc88cc-4bc1-4a02-970a-468293e0b2d7', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('fa03b208-e3f5-49e6-bf0d-a9375c148266', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('3ad8d43e-aa63-4961-9a14-6ada05a11742', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('93602513-cd2f-4e17-aaaa-95e40da99d7e', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('9e849d08-36e1-43e3-9974-98c61d028df6', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('50b783e1-3f6a-4d5b-a8e2-edef4937240a', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('f1da2127-0453-41e3-8d0e-0a11caca01c9', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('4d6bbb3c-7e61-4b72-8610-2dfdc5c05329', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('a3e1f968-41ae-405f-af78-3520984658d5', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('d40adac4-b5de-46bf-b31e-00fe6b0c08bd', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('359dffb5-030f-4521-822c-a76d8f94b444', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('8f5ab1a3-d5f4-4cf0-89eb-35578f02289b', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('1185ccb3-1114-4320-a5e9-380b90791400', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('9b616758-0c7a-4eb8-919c-33c586b7dfb6', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('52517a24-dde3-4ca5-a1c9-1a0654054efc', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('6625becf-f59b-4d02-8e15-037156a3532b', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('1e520fc1-e978-4cca-83cf-7661597d0484', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('feb9279a-c373-44af-8c87-006faec99ab7', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('576f58c8-9149-48ff-9457-24935e37f686', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('183bbfde-8bc9-42a2-bbeb-a67fb94b7209', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('8496ece8-b1ff-4954-8921-7cbc630606c2', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('fcbe7cfb-4014-4b46-9b0e-175857c62205', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('e4311da6-fa2e-48ad-bb9d-a242caaf171d', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('fdf2ae04-8e7c-4819-9787-50e5d14698f8', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('2bf51493-a3ee-40c0-abdd-fda15175a039', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('074d511a-7513-479d-aa6f-c0da64c759c4', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('21fc172c-dde6-4530-9238-a6a60541793a', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('ba07784e-930b-4c58-885e-a98439acf688', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('06fef8ae-d835-4865-9d3a-60a0d6cac74c', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('36d3959d-14bf-4a7b-b229-f0d3e677a5a0', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('95ccb623-4e53-4537-bb14-e74858d2f150', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('95d36f4a-64e6-4039-b834-fad8a3915f37', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('8260ad12-c57f-448d-9ec9-80774251471b', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('a41fac34-4d62-493f-a3ba-f6d535627d4a', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('d3cf08f2-a47a-4eab-9a1b-b1218dcfda60', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('8e6c15e1-5e9f-4bd0-b422-b80151397959', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('33f989d4-17d1-40fb-89b3-beecf80b21c3', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('cc54e386-76b5-4bab-8818-e5933e9376af', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('b2fe9db2-f0cd-4963-89a0-89b728e4abf2', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('fb45dcd1-67ee-40f6-b829-e104a5cec928', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('c5a30084-b4b3-4be0-aed3-90004fc070ed', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('807a733e-09e3-4340-bcbc-e29a9160b90f', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('7d88f8d2-dc15-4eb3-9ae8-39e228b9b38d', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('74f0375c-1fc7-4ac6-8591-e09c0b6663bd', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('f6504470-e8fd-4842-8f96-db84fc68003c', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('d1fa20b6-7e65-40e8-a910-20d123d30e4d', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 2, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('f8a9723d-aa75-43d9-b71c-1ddfaf9c38b0', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('66562a22-6800-4349-9b49-bf1f6f71dafd', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('b521bc0d-a279-4655-92fc-e08344a46d06', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('ef3a0ff7-57ae-457b-8888-e42e22b9bef6', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('80e6dbc3-e54c-431b-8004-cad2ad843227', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('49c1ab8a-d315-4278-9678-e8f98845be19', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('e0ec0238-2f98-4694-8b60-85d66dbb0073', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('0ada64cb-5040-4ed3-a592-104bb8f376c3', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('765bbef8-2ae2-4b94-a88a-70972762f6cd', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('4b0368ba-c5b8-4a05-94e8-063b785c7d92', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('9e673f8a-429f-4539-8301-eb4949061875', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('a793dbac-b6ed-4134-a85e-fe5c87583978', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 2, true, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('ea8278aa-33bb-42ec-8f89-be12b06ac7e6', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('f32ae729-3907-44a4-9050-8729e4980aa8', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('32f3568e-6995-4c9b-a6c9-3e5cfb5c9375', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('226866e4-e8bc-4f59-9e38-2fce6aa74014', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('f02d39f9-e006-4574-81e3-b2124ad8ee44', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('414194ff-4dbe-4921-94e5-d41e083145e1', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('55c35313-5912-4e52-a9de-5ca5eb781a88', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('b1b49961-3643-476a-99c0-c18132f21a9e', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('45013239-cab9-43a3-9937-faa0687c2ff4', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('fff8c9b7-8b9d-4884-ad3f-c025d55ba3d5', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('12f476b7-9693-460c-9b12-c8b355397d68', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('f95282bf-8bed-42ac-aee3-66be2802838c', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('048bda73-528f-457d-9c93-3d966bdb6386', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('68016750-e213-462c-afae-71b5c7f4d432', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('6b8174d5-521a-4c4c-addd-d8ecf36cb6f8', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('822ac059-f256-47b9-ad43-20363d9fcce1', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('e7e70c01-af25-47c0-8c64-d8901f7007d6', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('4e3546e1-931a-4c7f-8258-682d30b71d37', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('5cdf1b0e-cb7f-4839-a304-03b04dd545bb', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('6698bdeb-ff69-4b35-bb8f-11f6ac62da85', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('3eb3ef09-bde1-4780-9c63-f11501074ed3', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('b9c00825-9209-4ace-9e59-5aa258c85fb2', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('85f7350b-3cd0-43a2-a368-5be8d53528fb', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('5a0c35c7-1273-46ef-9c4e-a03b43b495e1', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('ab2db6f2-c967-42b0-b258-28f4de016691', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('ffec2ee7-cc83-436a-a1dd-30fbc5bdac60', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('1d4d6336-feb9-407a-b2c8-527220cd3aa5', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('67efcdfb-e211-438e-be05-5ad3ec33841f', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('7bf4240d-b9dd-4eed-b065-d160b6cdfd27', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('25a0227c-dfe1-49ea-8f5a-9d9c039926ad', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('90f94b96-f01e-43e3-a917-fa361b42f6b4', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('6599a636-7410-493d-8754-901283d04a59', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('a2237c4e-db03-48fe-806d-f048946ffb8d', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('2df4f62b-0d53-4478-b533-249d44ccaeec', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('bd20e00a-7258-425b-b1f7-ccc58eefdfdb', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('e3fa027f-71a0-439f-b2e7-602af3fc84ab', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('46b87ec8-6b27-40bd-b4cb-66e97713fb7e', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('1c718968-83e8-4f4c-97ad-88512c42a524', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('84a81adb-bed5-4ff9-ae34-17abcbe2960b', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('716bd611-07ff-45cc-854e-71ac3e79216a', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('c8f44506-172d-4845-85d8-c1c294d02c92', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('d22c8fa3-c218-4966-9331-ffb4e79a1dad', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('9b33d5de-dc82-4c74-99f4-b692197c7a35', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('5247a3be-fbcf-4487-9243-b321fe269db6', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('75139b82-f91a-4023-9e76-1a14d22cd536', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('292553e0-8708-4733-9b86-56fba0a167c4', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('b88c2e09-8d3e-4150-9cd8-59cc30ed35da', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('ecd1eb92-6264-4bcc-b818-c13913b35a27', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('58cd613d-c8d6-4542-89f6-b672e79f1e74', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('88631a21-f181-4458-9dd4-6b9d8318ef28', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('13da825a-c732-47e0-84d7-866f4d68c87b', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('a99b23ab-7a7e-4bb6-aa31-e56fbc7620ff', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('4520e7b0-2a00-49ed-b865-9e77b72a1052', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('254d9fc5-27ca-4849-9cec-c057f271f869', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('3c205be5-5b61-4a36-92e3-aafb8d3b260f', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('f8fbc6b8-cf6e-46ac-abc8-328a0d5e8c2f', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('7ba1c2ff-f71b-404f-8b89-b4b82879876a', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('919fbe62-893a-4bca-a9b3-62580cd9dde7', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('1c822da6-a3c9-4f5b-baa8-3bd0abb562dd', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('db9ae606-bd86-48f4-b3df-2dcc2ba5bcfd', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('7ced1e33-9b52-4bf7-9692-36bbb0ad386e', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('d47e8e7b-19ec-42c8-9792-a1545f73fde1', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('516b2a7d-2171-472b-8975-9ace69a93c12', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('2f6dfb99-f443-4138-8cb3-6c4a07784743', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('30379911-7fa8-4de3-b988-76e842a537d6', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('93322108-2a05-4169-8bad-c0c4a9b8c6de', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('74a453bb-fce0-4573-821e-d17bf29cc32f', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('0ed1017a-8054-45cf-bc48-9f5ebfcc8d38', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('efb38ae0-0a0c-4e74-93fc-b41508148c7d', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('8acfe4d7-1a7e-4906-afcc-ceb229ac490d', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('33fb6051-70a8-4e1f-984a-3998682f0c4c', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('96f99590-df5a-49d2-afc5-db95358f4881', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('20146f55-6886-478d-9ebd-d754c4fd57a1', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('4e59fc86-9edc-47a3-b4f1-fb2fd9845837', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('c0fa88f8-3728-4ebb-8c6f-8656a5489862', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('ccdbaf16-ab1f-4a3d-a745-bd0a02845852', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('f29d453e-87e6-4a5a-8573-eb027dd05230', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('c45c9580-ed89-4e73-836c-2c3b5bbcaa0c', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, true, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('bbf050ca-2a59-4d2c-8c3f-6f4cc252155e', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('b2933cd0-1d91-427d-a218-a71d3ef71a5e', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('ed45f2bf-c312-4422-8529-a73e52e010b9', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('fd428204-a71d-4ce5-96ee-fa9a2e04a741', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('a00c487d-203d-40f2-93d1-8b87975230e7', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('b46c2ba6-0c57-40a6-8e0e-41f5a0761a3e', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('bcc9691d-f3d0-440a-b527-f37321a1886e', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('42a105b6-641a-46b3-b343-7b20e604f942', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('446d22a5-cde6-4be5-afee-649285be2b62', '3d7999e4-a54f-4bd0-8638-c792d5c54017', 'UNSOLD'),
('dc0a9393-9357-40a0-80a6-ea4370ffe766', '68f5ea8e-81ea-485c-a11e-c2838160be16', 'UNSOLD'),
('35d24c7f-2370-4ec3-af43-d9a702eb861d', 'f59f74a1-37ba-46ac-9ae6-ecc6b4830cea', 'UNSOLD'),
('60071ab5-3ab7-4b9a-b7ac-e08f1741fedf', '1a326d95-a5d0-4130-834f-56f5ea0a29d8', 'UNSOLD'),
('2b8b61ca-142a-4c58-b48b-ff6e4991985d', 'c0d93cde-230a-412d-9098-fccde0d564ba', 'UNSOLD'),
('e1449c27-e3f1-4c59-80cc-0c889f9c0c8b', '59df9c69-3b1b-4dc8-9b60-26fb35cda92e', 'UNSOLD'),
('b6d5ab4a-9185-4df9-956f-216c48ffc080', 'e9b9403c-d7b0-4d31-8ada-f70d402b9079', 'UNSOLD'),
('a572d918-0be5-460c-9c2b-a15a43fcec04', '168c1d58-419a-419f-8dda-2038c8b20c63', 'UNSOLD'),
('3859f727-c44e-4dc1-842f-9a7097a401f7', '5be22e1b-acc9-4664-b0ca-4f1d8a5376ca', 'UNSOLD'),
('26dd82ab-a26a-4bd2-845f-27ca43b92e2b', '2fdb252b-c306-4abb-bf9f-9363c0fe6db1', 'UNSOLD'),
('fc1cc3f2-2343-4d4a-ac6e-42860c888462', 'e18eb657-5b78-4c8d-baad-fd2724d7cda8', 'UNSOLD'),
('1deb56ec-4ec2-473d-8a7f-3b7c4e125127', 'cfe2a0ce-7cd1-477b-825e-7e70e68e261a', 'UNSOLD'),
('a1865145-1fa6-4702-b17c-dae11971471d', 'a4a07c97-e0d7-4aa6-89f4-a82b4af9d993', 'UNSOLD'),
('f12684d1-d021-4533-9194-bcdfdeb4a92e', 'f74bbab3-e035-4ca6-9a0c-a3f2e28a8033', 'UNSOLD'),
('b57da26c-cae2-4d43-9f69-8307d2b33520', '8d18968f-be76-48cc-9982-6c0bbd8a0ba1', 'UNSOLD'),
('381a774e-b824-43e1-8346-cef1f7ad309d', '33dc88cc-4bc1-4a02-970a-468293e0b2d7', 'UNSOLD'),
('d6925c76-504a-4db5-87b6-dab6fef8f9e3', 'fa03b208-e3f5-49e6-bf0d-a9375c148266', 'UNSOLD'),
('441b8104-44e2-4dff-9a83-d51db14ace0c', '3ad8d43e-aa63-4961-9a14-6ada05a11742', 'UNSOLD'),
('53c6b8f1-22bb-4155-a9af-957358a1c10f', '93602513-cd2f-4e17-aaaa-95e40da99d7e', 'UNSOLD'),
('1da41087-c0d7-4745-8dae-4a158844f53c', '9e849d08-36e1-43e3-9974-98c61d028df6', 'UNSOLD'),
('d043f384-2dcb-443b-8668-3c35cf49b4e4', '50b783e1-3f6a-4d5b-a8e2-edef4937240a', 'UNSOLD'),
('922db2f8-f890-431c-97d0-778f6f337c3a', 'f1da2127-0453-41e3-8d0e-0a11caca01c9', 'UNSOLD'),
('1892d724-49e1-4256-b082-4598bf499734', '4d6bbb3c-7e61-4b72-8610-2dfdc5c05329', 'UNSOLD'),
('f523e07d-57ad-4a79-99d5-3821e933be54', 'a3e1f968-41ae-405f-af78-3520984658d5', 'UNSOLD'),
('5306d487-b21d-41ce-85c0-b9724d577488', 'd40adac4-b5de-46bf-b31e-00fe6b0c08bd', 'UNSOLD'),
('e3c73178-5d35-42c5-b3f2-1389b93fac75', '359dffb5-030f-4521-822c-a76d8f94b444', 'UNSOLD'),
('5334e4ad-21f1-4640-aa23-a4e66c45a1b9', '8f5ab1a3-d5f4-4cf0-89eb-35578f02289b', 'UNSOLD'),
('af51797a-579a-4f3d-9976-28ddd9bd2d88', '1185ccb3-1114-4320-a5e9-380b90791400', 'UNSOLD'),
('ec41c0fb-b09d-42eb-ab6e-9d40ee7cc80b', '9b616758-0c7a-4eb8-919c-33c586b7dfb6', 'UNSOLD'),
('183fd0c7-1652-4741-9ab2-f29869ff340f', '52517a24-dde3-4ca5-a1c9-1a0654054efc', 'UNSOLD'),
('01a1fec5-1dec-42a4-8035-a94cb6529d98', '6625becf-f59b-4d02-8e15-037156a3532b', 'UNSOLD'),
('090b8ea9-5a2e-434d-96ed-6ae2ceb192c0', '1e520fc1-e978-4cca-83cf-7661597d0484', 'UNSOLD'),
('6cde253d-9a07-466d-9f39-6911b4a7aa44', 'feb9279a-c373-44af-8c87-006faec99ab7', 'UNSOLD'),
('bd08900d-bf66-461b-8a9f-57c98c7bf72d', '576f58c8-9149-48ff-9457-24935e37f686', 'UNSOLD'),
('21c1d902-fe04-448e-b664-bee1208120ab', '183bbfde-8bc9-42a2-bbeb-a67fb94b7209', 'UNSOLD'),
('f51025e0-04ec-42d4-b1e7-c96ed7643e42', '8496ece8-b1ff-4954-8921-7cbc630606c2', 'UNSOLD'),
('1351927f-19a6-4f61-8b7d-258892d93663', 'fcbe7cfb-4014-4b46-9b0e-175857c62205', 'UNSOLD'),
('0ea36d20-caa8-4884-bb33-c4e2a2a79430', 'e4311da6-fa2e-48ad-bb9d-a242caaf171d', 'UNSOLD'),
('40eb0497-95b7-463d-9497-4f919ea3d99b', 'fdf2ae04-8e7c-4819-9787-50e5d14698f8', 'UNSOLD'),
('37dac155-e5c3-454c-a718-3928b06acf58', '2bf51493-a3ee-40c0-abdd-fda15175a039', 'UNSOLD'),
('58f2e314-f393-471a-a4ee-32b3d2e1ef22', '074d511a-7513-479d-aa6f-c0da64c759c4', 'UNSOLD'),
('25065cb2-5970-4d0f-924e-e9379f5ead9c', '21fc172c-dde6-4530-9238-a6a60541793a', 'UNSOLD'),
('50d7bcf9-3895-4e14-ba3e-280320db4277', 'ba07784e-930b-4c58-885e-a98439acf688', 'UNSOLD'),
('48cfc30b-14ed-4ea0-bfc7-5cbaa0e0d737', '06fef8ae-d835-4865-9d3a-60a0d6cac74c', 'UNSOLD'),
('8d8e9653-14c8-42ac-a0c0-02f3e6d0e1f0', '36d3959d-14bf-4a7b-b229-f0d3e677a5a0', 'UNSOLD'),
('d100bf84-cd24-4fe7-9a55-cbd8623a70c5', '95ccb623-4e53-4537-bb14-e74858d2f150', 'UNSOLD'),
('dff0b7c4-ba8a-4174-9efa-8f5b5623a4ac', '95d36f4a-64e6-4039-b834-fad8a3915f37', 'UNSOLD'),
('4c406077-4673-49f5-bd2a-5b69846f9e0c', '8260ad12-c57f-448d-9ec9-80774251471b', 'UNSOLD'),
('f5e6b5b8-dd36-4806-bdb3-605fde26edb0', 'a41fac34-4d62-493f-a3ba-f6d535627d4a', 'UNSOLD'),
('9049b4b6-1d07-4b5b-b414-10229c114b3d', 'd3cf08f2-a47a-4eab-9a1b-b1218dcfda60', 'UNSOLD'),
('831aba18-c2ba-40a3-a284-19c55099cb11', '8e6c15e1-5e9f-4bd0-b422-b80151397959', 'UNSOLD'),
('c259664c-1871-4865-8d60-d4eb8cf4b7b1', '33f989d4-17d1-40fb-89b3-beecf80b21c3', 'UNSOLD'),
('af320971-ce8a-496a-b52e-955edcf1e3ac', 'cc54e386-76b5-4bab-8818-e5933e9376af', 'UNSOLD'),
('40df7a8e-e9fe-4980-b8be-8db4c299c1e6', 'b2fe9db2-f0cd-4963-89a0-89b728e4abf2', 'UNSOLD'),
('a066e9a5-f7db-4b1c-87b9-c04c81c67e9e', 'fb45dcd1-67ee-40f6-b829-e104a5cec928', 'UNSOLD'),
('56a6ff3a-514b-4301-bcbd-1b770d195058', 'c5a30084-b4b3-4be0-aed3-90004fc070ed', 'UNSOLD'),
('4289d8dc-2569-49ce-8669-5f7763acb597', '807a733e-09e3-4340-bcbc-e29a9160b90f', 'UNSOLD'),
('38e4e58b-7f96-4406-83a0-2fae7f657d7c', '7d88f8d2-dc15-4eb3-9ae8-39e228b9b38d', 'UNSOLD'),
('a7179f9e-a0b6-479b-8289-b63383c4459d', '74f0375c-1fc7-4ac6-8591-e09c0b6663bd', 'UNSOLD'),
('f2bead51-747f-4a57-97b7-50ad522adf17', 'f6504470-e8fd-4842-8f96-db84fc68003c', 'UNSOLD'),
('80422602-75e7-4c74-b69d-bb6410586d46', 'd1fa20b6-7e65-40e8-a910-20d123d30e4d', 'UNSOLD'),
('dcfe4141-3407-4bae-be0d-4a7ae11f1c82', 'f8a9723d-aa75-43d9-b71c-1ddfaf9c38b0', 'UNSOLD'),
('8c9f934c-b1fd-4626-b0f9-328ddead60dc', '66562a22-6800-4349-9b49-bf1f6f71dafd', 'UNSOLD'),
('66e81ddb-b725-41c6-a06f-43ee103c858e', 'b521bc0d-a279-4655-92fc-e08344a46d06', 'UNSOLD'),
('967fb5a0-4970-466e-b6ae-4d631b02bbd6', 'ef3a0ff7-57ae-457b-8888-e42e22b9bef6', 'UNSOLD'),
('24cb8d5a-3b94-4804-8242-698f0ba4968e', '80e6dbc3-e54c-431b-8004-cad2ad843227', 'UNSOLD'),
('cef04ced-0a68-4216-b0ef-326df616fbe2', '49c1ab8a-d315-4278-9678-e8f98845be19', 'UNSOLD'),
('80921631-6501-4955-a7a5-1b819f96e9cd', 'e0ec0238-2f98-4694-8b60-85d66dbb0073', 'UNSOLD'),
('109b655e-dd27-40c9-a375-d4f471a8ffaa', '0ada64cb-5040-4ed3-a592-104bb8f376c3', 'UNSOLD'),
('0a7dbf6b-e6f5-45d1-98b6-4ea99a1c1510', '765bbef8-2ae2-4b94-a88a-70972762f6cd', 'UNSOLD'),
('5b72f432-cf57-4ac5-ba82-c0dc8efc3efd', '4b0368ba-c5b8-4a05-94e8-063b785c7d92', 'UNSOLD'),
('7ebeddc6-5204-4f85-bde5-e93eb2f6ea08', '9e673f8a-429f-4539-8301-eb4949061875', 'UNSOLD'),
('9c163287-a096-40ef-87c6-3c009a972160', 'a793dbac-b6ed-4134-a85e-fe5c87583978', 'UNSOLD'),
('d884b2c2-261d-47cc-bb3c-6eedcbabcd75', 'ea8278aa-33bb-42ec-8f89-be12b06ac7e6', 'UNSOLD'),
('2b06aaee-4a07-48ef-b52e-6af2be8ac419', 'f32ae729-3907-44a4-9050-8729e4980aa8', 'UNSOLD'),
('cd19fd78-d522-4270-a500-d3167b6b8c82', '32f3568e-6995-4c9b-a6c9-3e5cfb5c9375', 'UNSOLD'),
('51ccefa8-0022-419d-a418-6d097526acd6', '226866e4-e8bc-4f59-9e38-2fce6aa74014', 'UNSOLD'),
('b43e9bfe-067f-4aa1-b1fc-3cea60caaac6', 'f02d39f9-e006-4574-81e3-b2124ad8ee44', 'UNSOLD'),
('45dcdc5a-feb0-4090-9cc9-368c457b6c47', '414194ff-4dbe-4921-94e5-d41e083145e1', 'UNSOLD'),
('489a2850-725e-41b2-8dfb-504372da5cc7', '55c35313-5912-4e52-a9de-5ca5eb781a88', 'UNSOLD'),
('f2be2ca2-aa54-47b3-a71b-ace5cf4ab5e4', 'b1b49961-3643-476a-99c0-c18132f21a9e', 'UNSOLD'),
('49e9cc85-ed29-4775-a115-14b420c7609b', '45013239-cab9-43a3-9937-faa0687c2ff4', 'UNSOLD'),
('ff5f86a1-6fea-430d-93c1-79cba8d5530e', 'fff8c9b7-8b9d-4884-ad3f-c025d55ba3d5', 'UNSOLD'),
('6532c404-e925-4883-bd62-05be3cab09bc', '12f476b7-9693-460c-9b12-c8b355397d68', 'UNSOLD'),
('abf8de8b-52db-46fb-9edf-8ec530a73696', 'f95282bf-8bed-42ac-aee3-66be2802838c', 'UNSOLD'),
('e08a85e1-4bec-4df8-94e1-50f5a3a098b9', '048bda73-528f-457d-9c93-3d966bdb6386', 'UNSOLD'),
('78a3145b-00b7-44de-bb17-8167ed42103b', '68016750-e213-462c-afae-71b5c7f4d432', 'UNSOLD'),
('cb4fb22f-8b0c-449f-bfc1-b7b928f2f6ad', '6b8174d5-521a-4c4c-addd-d8ecf36cb6f8', 'UNSOLD'),
('1f1be0cf-b0d0-427a-acc1-5cd0f47c9215', '822ac059-f256-47b9-ad43-20363d9fcce1', 'UNSOLD'),
('c638e329-99f8-4e28-bebb-3b2823b81b18', 'e7e70c01-af25-47c0-8c64-d8901f7007d6', 'UNSOLD'),
('3325dbc3-ed44-4eac-867c-e7cafbdee1d0', '4e3546e1-931a-4c7f-8258-682d30b71d37', 'UNSOLD'),
('ee3b0e64-f206-4220-a1a2-baf49994fc98', '5cdf1b0e-cb7f-4839-a304-03b04dd545bb', 'UNSOLD'),
('40226483-9d7a-49d2-ba21-757c9ef4b203', '6698bdeb-ff69-4b35-bb8f-11f6ac62da85', 'UNSOLD'),
('49aff938-1123-4b92-8029-db0d358b8d58', '3eb3ef09-bde1-4780-9c63-f11501074ed3', 'UNSOLD'),
('9ab10c5e-9b06-4159-9c3e-5ea24c5f6f92', 'b9c00825-9209-4ace-9e59-5aa258c85fb2', 'UNSOLD'),
('63c61de4-a43c-45e6-8c5a-e7b7609eee77', '85f7350b-3cd0-43a2-a368-5be8d53528fb', 'UNSOLD'),
('729b9d31-522a-4c85-872a-54c38634d6f8', '5a0c35c7-1273-46ef-9c4e-a03b43b495e1', 'UNSOLD'),
('0f9968ae-b608-4c2c-af39-58fbf868dba8', 'ab2db6f2-c967-42b0-b258-28f4de016691', 'UNSOLD'),
('58749592-105c-4046-9ca3-58d73f68512d', 'ffec2ee7-cc83-436a-a1dd-30fbc5bdac60', 'UNSOLD'),
('8b06a351-29a1-41d9-9ff8-5945fccae89c', '1d4d6336-feb9-407a-b2c8-527220cd3aa5', 'UNSOLD'),
('b1866ca5-d1b3-4267-9b34-8f31936828b3', '67efcdfb-e211-438e-be05-5ad3ec33841f', 'UNSOLD'),
('75e920d0-c825-4fef-805f-8675b9a70938', '7bf4240d-b9dd-4eed-b065-d160b6cdfd27', 'UNSOLD'),
('812a9b7f-12ab-4231-925f-a11151af2e80', '25a0227c-dfe1-49ea-8f5a-9d9c039926ad', 'UNSOLD'),
('e786fbbf-d52a-456d-a1a8-e337009c871d', '90f94b96-f01e-43e3-a917-fa361b42f6b4', 'UNSOLD'),
('eae07863-6294-46a9-b86d-75c09cd1680e', '6599a636-7410-493d-8754-901283d04a59', 'UNSOLD'),
('8b67a8c6-fcc1-49ef-8680-a77597be381b', 'a2237c4e-db03-48fe-806d-f048946ffb8d', 'UNSOLD'),
('64f33b10-d65f-4d3f-a37f-e29e3378d8fe', '2df4f62b-0d53-4478-b533-249d44ccaeec', 'UNSOLD'),
('6acbca58-f083-4d83-8c73-fc7c82a485f3', 'bd20e00a-7258-425b-b1f7-ccc58eefdfdb', 'UNSOLD'),
('1b815af6-7a9d-4729-b18b-593b93e8a055', 'e3fa027f-71a0-439f-b2e7-602af3fc84ab', 'UNSOLD'),
('ce56cbd1-5978-4ce3-aa4a-8a46f8d2eb77', '46b87ec8-6b27-40bd-b4cb-66e97713fb7e', 'UNSOLD'),
('34386654-d9b4-483f-97c1-f0da1f7f5f09', '1c718968-83e8-4f4c-97ad-88512c42a524', 'UNSOLD'),
('1de2330c-79f6-47df-be57-fcf2fa506a79', '84a81adb-bed5-4ff9-ae34-17abcbe2960b', 'UNSOLD'),
('eb29d55a-0021-4714-97b3-57c84cd370a2', '716bd611-07ff-45cc-854e-71ac3e79216a', 'UNSOLD'),
('3b441ff4-5632-40f5-a157-64c7ae75a459', 'c8f44506-172d-4845-85d8-c1c294d02c92', 'UNSOLD'),
('363c962e-357d-4d08-bda5-101d835a3f5a', 'd22c8fa3-c218-4966-9331-ffb4e79a1dad', 'UNSOLD'),
('9392035c-1da4-4fe1-a182-8b78a5823cac', '9b33d5de-dc82-4c74-99f4-b692197c7a35', 'UNSOLD'),
('e5c11c94-8098-4140-b68f-e474b6c68fbe', '5247a3be-fbcf-4487-9243-b321fe269db6', 'UNSOLD'),
('7fd8d5c3-6e26-4ad0-ad40-7f32bb00b8fb', '75139b82-f91a-4023-9e76-1a14d22cd536', 'UNSOLD'),
('dbf0d1bd-3609-40c6-804c-af0434048fd1', '292553e0-8708-4733-9b86-56fba0a167c4', 'UNSOLD'),
('cde6724b-3a88-43bb-a6b9-e20fff7ee1be', 'b88c2e09-8d3e-4150-9cd8-59cc30ed35da', 'UNSOLD'),
('d47b45c7-a50d-47ce-8c93-7ec7eebb1d30', 'ecd1eb92-6264-4bcc-b818-c13913b35a27', 'UNSOLD'),
('c9712f74-98dd-47bd-a93f-3d198d098041', '58cd613d-c8d6-4542-89f6-b672e79f1e74', 'UNSOLD'),
('e1a32a81-33df-42cf-9feb-c5bea18e8aa0', '88631a21-f181-4458-9dd4-6b9d8318ef28', 'UNSOLD'),
('b8a097a8-a451-4208-b685-c59c062b31d4', '13da825a-c732-47e0-84d7-866f4d68c87b', 'UNSOLD'),
('405ccd04-9736-4448-8227-d62a690b7db5', 'a99b23ab-7a7e-4bb6-aa31-e56fbc7620ff', 'UNSOLD'),
('6bdfbc4b-f391-4dfb-b192-1dc17cc0b673', '4520e7b0-2a00-49ed-b865-9e77b72a1052', 'UNSOLD'),
('2bb68486-a28f-4a94-bdae-4d0b2518e1bc', '254d9fc5-27ca-4849-9cec-c057f271f869', 'UNSOLD'),
('15834f1d-51a6-45dd-8a90-bf5f3ec70c00', '3c205be5-5b61-4a36-92e3-aafb8d3b260f', 'UNSOLD'),
('d0423d62-02ec-4b07-b8e3-ddde814be98f', 'f8fbc6b8-cf6e-46ac-abc8-328a0d5e8c2f', 'UNSOLD'),
('c7d4622d-f385-4bbd-9131-4d1cb5cc25a6', '7ba1c2ff-f71b-404f-8b89-b4b82879876a', 'UNSOLD'),
('ea83d121-de2b-4082-be48-e1de174b9c71', '919fbe62-893a-4bca-a9b3-62580cd9dde7', 'UNSOLD'),
('60803679-3889-4274-af4c-41c031f8fe9b', '1c822da6-a3c9-4f5b-baa8-3bd0abb562dd', 'UNSOLD'),
('366d0f74-9414-43b6-aca7-9f32450f66d6', 'db9ae606-bd86-48f4-b3df-2dcc2ba5bcfd', 'UNSOLD'),
('146a3e45-f9b2-4820-800d-ef0cde42666a', '7ced1e33-9b52-4bf7-9692-36bbb0ad386e', 'UNSOLD'),
('d1ed71b0-0edd-4efe-88a9-0efbd5d2b67d', 'd47e8e7b-19ec-42c8-9792-a1545f73fde1', 'UNSOLD'),
('aadf7bf6-51d7-4018-b19f-611caac79177', '516b2a7d-2171-472b-8975-9ace69a93c12', 'UNSOLD'),
('6dc3b70c-e731-42f9-8274-918902025537', '2f6dfb99-f443-4138-8cb3-6c4a07784743', 'UNSOLD'),
('e86429d6-ee38-4a61-bf00-b4c658a9bfb4', '30379911-7fa8-4de3-b988-76e842a537d6', 'UNSOLD'),
('01883c0c-debf-479e-95fd-056020784b5f', '93322108-2a05-4169-8bad-c0c4a9b8c6de', 'UNSOLD'),
('57d956a7-dbc3-4ffb-bf90-5038698f57b4', '74a453bb-fce0-4573-821e-d17bf29cc32f', 'UNSOLD'),
('cbb7115e-76ed-488d-85fd-b214628793a1', '0ed1017a-8054-45cf-bc48-9f5ebfcc8d38', 'UNSOLD'),
('314b7589-6ecd-45d6-81c2-28e5b5d993e6', 'efb38ae0-0a0c-4e74-93fc-b41508148c7d', 'UNSOLD'),
('d300ce4d-3632-49a3-8107-43432b459132', '8acfe4d7-1a7e-4906-afcc-ceb229ac490d', 'UNSOLD'),
('17dda64e-7b15-429c-b6a9-e8d28be95abd', '33fb6051-70a8-4e1f-984a-3998682f0c4c', 'UNSOLD'),
('60d6ce57-81fb-41f5-bb90-71de7c99810d', '96f99590-df5a-49d2-afc5-db95358f4881', 'UNSOLD'),
('87c1e84f-a708-4926-853c-16a202d245b6', '20146f55-6886-478d-9ebd-d754c4fd57a1', 'UNSOLD'),
('da2a06d6-0814-4e63-8a52-6ed4b292f405', '4e59fc86-9edc-47a3-b4f1-fb2fd9845837', 'UNSOLD'),
('4c51e3b2-e662-4836-8747-7c090f6cce92', 'c0fa88f8-3728-4ebb-8c6f-8656a5489862', 'UNSOLD'),
('15fa3c3d-5bec-480b-b824-56d8b6339ae3', 'ccdbaf16-ab1f-4a3d-a745-bd0a02845852', 'UNSOLD'),
('6635904e-c4b2-4b54-92a2-13d535c109aa', 'f29d453e-87e6-4a5a-8573-eb027dd05230', 'UNSOLD'),
('0d4a8aad-bb80-43ed-acfc-664cd871930a', 'c45c9580-ed89-4e73-836c-2c3b5bbcaa0c', 'UNSOLD'),
('81959c41-e971-40c2-9826-c449c6eee82a', 'bbf050ca-2a59-4d2c-8c3f-6f4cc252155e', 'UNSOLD'),
('0fad7bd2-1f92-48bb-9a5e-7c2a687109b5', 'b2933cd0-1d91-427d-a218-a71d3ef71a5e', 'UNSOLD'),
('3d8e2ca4-b471-4288-b582-3224e30228c5', 'ed45f2bf-c312-4422-8529-a73e52e010b9', 'UNSOLD'),
('7f433789-f65a-44d3-a494-fae29c1c65ed', 'fd428204-a71d-4ce5-96ee-fa9a2e04a741', 'UNSOLD'),
('e7fe150f-daa6-464d-bbbf-888be5112718', 'a00c487d-203d-40f2-93d1-8b87975230e7', 'UNSOLD'),
('3a893e30-62d2-4791-87dc-43e87689c872', 'b46c2ba6-0c57-40a6-8e0e-41f5a0761a3e', 'UNSOLD'),
('74993865-fcc1-409c-8f54-c000d1203c41', 'bcc9691d-f3d0-440a-b527-f37321a1886e', 'UNSOLD'),
('bece4934-83be-4a79-8c05-d704e18d9f84', '42a105b6-641a-46b3-b343-7b20e604f942', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('06066e30-562c-4117-b7d2-7949cd7d17eb', 'admin', '$2b$10$D86zrBJBy59BoEO.7hRD8OVF2wCnqzHiftL83yVNfOZPSTW4sWfz2', 'ADMIN'),
('777a1fd6-8481-427b-a653-829adbaacf3e', 'screen', '$2b$10$AdFiN8fscmmW.1/BIyE9Q.Qjo/dhp9RJx6bxyZ4WCm8MMKClTB96K', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 3', 'PLAYER', '[{"rank":134,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":3,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

