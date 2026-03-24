-- INSTANCE 1 INITIALIZATION
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



-- ── DATA FOR INSTANCE 1 ──

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
('8d8e04f4-efc2-4d54-9f87-788d76e6d88a', 'Team Alpha', 'alpha', '$2b$10$2xAZ3qiulcwAaRmQMereX.q0soH08nVdVZ7DUYq.JxIvgIQGaEaoa', 120, 0),
('a0a54fab-4c88-496f-a376-82675d045e8d', 'Team Bravo', 'bravo', '$2b$10$Wsg9OpBLc0M3Z1x.ZAIiKedxhLtLXeIJXlV/1a6tdo1IXnv6NuAR6', 120, 0),
('a2cb9f31-3e6c-47be-9b10-a308c5be3c8c', 'Team Charlie', 'charlie', '$2b$10$e3PmqhrQBwWGATDgisjvwug3ShKVd6bjydvYZR1sdXrRPsQFQhc4.', 120, 0),
('a31e0d1c-e3cd-4adf-a744-7e1b6445c225', 'Team Delta', 'delta', '$2b$10$8Zy.JshSUgQ7sYEGUi8QS.emDb0nGWVwcqyjOF7R07C9t9214SUnq', 120, 0),
('87acbd15-3577-4b4c-b0eb-fe5231864e4b', 'Team Echo', 'echo', '$2b$10$usJ2h2qx3HWGS64MyyHzTOmv.1IHReBRk7dyYQhQja1rUUNuPt0ya', 120, 0),
('61f5540e-f8e0-492f-ac28-589409ece082', 'Team Foxtrot', 'foxtrot', '$2b$10$0Bg45SidYtvYdXE6exQxQO0WV.steLk7l8mB6Eg1vCP/LhN5aYTg.', 120, 0),
('bdd0810e-265a-446f-8196-d67d7f02bef6', 'Team Golf', 'golf', '$2b$10$dtYDRqNdXrxoofcYE8x1GunJbWEEdhId4a0uF7APHIwKClW7.cNZC', 120, 0),
('414ce907-9879-42ae-864b-8baf1bcddade', 'Team Hotel', 'hotel', '$2b$10$CVRPQBAe03ZWOejRj479ve4ri20Ize57hkQxBvv0E3z0lhCuWSiZS', 120, 0),
('0cfc4fe4-55de-431d-983b-99956d5c4e32', 'Team India', 'india', '$2b$10$X8th9NYSUeJskn4p51O0meoXkvIiD9ZXvqVyQU/7eaqyWjcUXxBwy', 120, 0),
('60a586d2-4573-413d-be37-3d95dc503fb0', 'Team Juliet', 'juliet', '$2b$10$ElBhqDAWcgiEEhW9ucish.ffO.nFkmHABWorpBOeNRS3y53C7mmAS', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('3178e766-c14b-4cfb-b6cb-8a0359de4555', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('6b37dc21-ab90-4a1d-8e54-72c49b80bcd9', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('0f21113e-d2c4-442b-891c-34f253324e9a', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('202663d8-a590-4a71-adcd-a820d5ccb0d4', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('54ed8407-7f1f-44b2-8946-32dcff65c2b4', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('f98ba183-eac3-40da-a387-29a9716c654f', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('37d4ae3f-826f-4268-94b5-985b9a080ac1', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('8305c170-9a60-4286-aa2f-9128fd7bc2a9', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('83d4fef2-660a-4e99-8068-2a15df5589e9', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('109c4f97-6d1a-4705-af96-e6fbb4059d64', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('e59eaa10-9782-4a8d-8557-cf6c2a296710', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('a84911c6-7498-47f1-9ea3-7274bd017625', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('402bfe39-01d5-44ec-8806-5a3fef62bf2a', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('08d78af8-1ae8-40a9-bc30-8b40859378d8', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('777d9831-d903-4132-a721-3b4e7fb59e0d', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('5245b95e-36dc-4ccd-8092-a32eaaad1c96', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('32783605-287e-498e-a698-c3bc4218610c', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('2d425f1e-6dc8-4f68-951f-82cc39c3d589', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('d3b0f53f-b759-4e0a-903b-dea0d772233b', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('c87e0032-b41a-4e4c-a2e7-305b783f3095', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('24a24b5e-2208-4944-8562-88810db398e6', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('0716b506-14e8-4270-b836-dc5afcc2bf57', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('4a2dfb77-2918-47f6-bfd2-519cce6077b7', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('285d77bb-b5e1-469d-803b-2f4677cd5292', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('90e14a7e-1fe7-49fb-89fb-a279bfd88d2b', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('82edad95-8f23-470d-803b-6930b7fa90cf', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('1a43900f-56ae-424f-bb3d-5a823e4290c7', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('29a015b2-e2dd-401f-ba62-f9f0d37528a8', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, true, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('3c73cb87-5533-4875-b7af-cbcbb122a17c', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('0b804f64-387f-43f5-beb2-5cb19eeb2a83', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('de3784a6-70e9-4939-ba08-4d32128412e8', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('b1d6e3ae-072f-4c05-8a22-e567e42b614f', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('9ff8d393-852d-4579-b58a-252ed2755b6b', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('6ff2b573-222c-4cc6-b8bd-6c063262349c', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('56ed2348-033a-4a4b-b999-f3b5b6e24e84', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('4adf694a-4313-4373-ad5a-de1ed76d9c2f', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('80a013ff-c430-4bbe-981c-3ac15f066927', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('57e78683-95d6-4905-84e1-9d7600b7dfe3', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('093ded36-370f-4291-8acf-37749ba9534e', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('5b729a96-a800-4a2f-9f72-65a05649969c', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('e3a6652f-5077-4500-905e-4497ca8bbbd3', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('88807b22-1fe5-4c99-9ddb-845efd8a3d81', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('424b2312-5002-4afa-9768-879711811b8c', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('088254aa-1852-4369-a583-829ea632d9bd', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('c0880eb4-e921-4cd2-bd5b-dbce727de797', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('edfcde64-0478-4030-b20c-e6759b9e5558', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('0fb7f56c-9e4c-4718-a135-e997d8174e42', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 2, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('80f25607-d6b6-469c-a8f2-1ed6def026f7', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('edb55818-4060-4d00-81d8-5a051b8c61ef', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('7844fee3-e4b7-4be5-baa0-b7da6ddc9ad7', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('11bbf36c-efa5-4e57-809b-0977f5bab03b', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('80b27256-3abc-42a3-bbb1-fd9fe405cdd4', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('104a4e11-889a-4d84-ba8b-51dbfb1bbff4', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('2742a305-d370-4c35-819c-3bc6618d9040', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('c9441cc7-6728-4450-a3f3-4c744019bd95', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('c07bb624-eeae-4361-93f3-500369f50426', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('d61a93eb-4c35-45b9-b1eb-451d684f4885', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('d4dea5da-7a8a-4b8a-8e33-25d2006899f4', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('919d3fbf-f4d8-404e-a431-d95976acca7f', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('31f7404a-e43b-4fa3-94c4-d6f952739e50', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('019ad7e3-4177-4f9e-a3b1-bbb0eb18b314', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('12e732f4-6044-47e5-b12b-66a0f973fb3a', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('1cc34364-0646-4d92-96b6-02f726159995', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('da859a6d-5fa2-4856-b1f1-467b389e593f', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('c29a47fb-2834-42f3-ad3c-ce2c0c493672', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('95f22ffe-2613-4ec9-8845-56bfc0453029', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('1ed6c8d0-5d7b-4207-9727-01d600027e80', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('3c30e125-6a53-4c81-9b9c-446f8d9586da', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('c52e4e9e-03b3-4905-a288-de9d39a3402f', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('1c19b28e-8e0a-4590-a6dd-be48f03b0cfb', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('4c7bf8b1-6286-4280-98d6-7b3824eb9ccb', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('5dae0fda-1620-47a5-b701-6d6122f0ec86', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('5f5f828d-27cb-489e-875c-c5787ed7ef19', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('a89ae118-0854-45d3-a4fb-e392b87ce310', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('7fd5e0b9-f61b-4d12-8b3d-d6032f9d8a06', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('c724a8bb-2c4f-4687-be8a-f7f645b84d0c', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('79b0c52b-1233-4d2f-a4c5-ae605948eec7', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('1cdeb1b9-2b4f-4766-ae36-0a2ff1ba4474', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('a6fcd340-8a39-410e-a1a2-b5ee896f62eb', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('ef343b84-05ae-46b5-b4d1-e4ba40e61441', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('df912914-cfe1-41cf-90cf-3abece5e25fd', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('a306bc3b-237d-4795-8dc1-d708d14077a9', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('a751eab8-26c9-4614-b404-996557316023', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('dbe6ac8c-4bd3-487e-8512-3cc61b3127b4', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('624e2904-24a0-43a5-bac2-fb19de968363', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('61ee34a9-91bc-4163-94f1-471474e762d4', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('ab6f045f-d7c6-42be-ae35-c75f58fb54b3', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('5973ae08-768e-4e05-9351-4b799149a33d', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('b84b17b5-9185-43ac-9d92-205d79ae6c4a', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('108e5f60-9ac9-4ac2-998a-23618f2f7ffd', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('eb1fd650-6fea-44db-8e1b-31986cf6809b', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('7ae4bf23-82cf-4829-bbcb-44aa692f23f0', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('f484afc5-bea8-4162-97ae-f328277e60c3', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('94b04e01-899a-4628-a976-480e4f1f179c', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('f14f0fe2-a320-42d3-ae88-0011154b5e72', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('abec015d-71c7-4530-8fda-50643d11105e', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('34dfafd5-280f-4384-9d53-3dc46f070272', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('0cfee4de-eae7-4915-83fe-294babb8c581', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('4029a3d5-fc2e-4d8e-8561-38c27db824b1', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('5691d12e-afda-4298-9a9b-ece52f4672b0', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('c3524a9a-5778-4a48-958c-f9933fa0efcb', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('c3572f02-8db6-49d9-88f2-d35953689e9a', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('8ad71764-8131-4c68-8a84-62d58a8acb44', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('0ee644fc-3c10-4197-80a6-d70ab9ded457', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('8c7af7d0-b208-4b1a-bf13-6e08b396bc0e', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('162b2183-2f4c-4a60-a421-0e6e74b29315', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('aeffd1e2-a1bf-4f17-a7c6-91d3ac17b194', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('bfce66e4-0feb-48cf-b514-56973e3581ed', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('491e6494-eecd-4994-99ca-115da3eeaf60', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('0d2056d8-fea0-4b7c-ad1d-84c8c1519db7', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('889abaac-cab7-4e45-b453-6a49f0e5124e', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('9c959623-51fd-4417-bfaa-14527fa80c9d', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('28ef5e04-b0c6-4afc-b69e-a635da4da806', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('1faf83c4-5487-4ddf-8858-3ddfadb27c48', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('f8bc5b04-6be1-4227-9bdf-817f9f06754e', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('2b90f793-6491-458e-aea9-e89d8d593467', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('bf886d8e-ce9f-40a0-a004-9658ed62738c', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('7b6b8ec4-dcbe-4bed-9279-4dc2c8dcc624', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('8d76e550-460e-45b2-8fb1-fbe3edd8a34b', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('e0096ad8-7be3-4a68-8699-8070e494d149', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('38b4ba7f-4ae9-47e3-8394-d99f02f950ad', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('6aa5e59b-25de-4250-82a8-a3c6aa1995be', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, true, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('ab602bcd-a4cb-4c4b-9ad0-a6c2e1d6898c', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('7518a1b4-2a11-428c-a03e-7538a51caa12', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('53a82b67-3480-4208-ad56-3483b80a759b', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('fa0b4e25-3c2f-43cf-8dd6-db05dec887d2', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('6501d6fe-037d-4068-9be1-43534922e57c', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('cfbc5575-028c-4e0d-9a06-ca0ee4c72ed5', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('982ebe3e-d07f-4493-abb4-3d98ccfb8ff9', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('096dc67f-b79e-40a4-9437-0c78812ceee5', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('ff6fd0f6-d7c9-48fd-a491-d9546ffe1636', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 2, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('9e1b5379-8e5f-4452-9ca5-9ef3827a5394', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('efef5628-3472-47c7-82a6-ec6a911b52fb', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('83451fcf-8bdc-47e9-a7e4-e9b0dee625fe', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('42695ff1-0edb-465d-85cd-9749cf25d89e', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('643ffbde-f5c8-43c9-9aa8-02cd08008ca4', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('481da015-6b9d-4f6e-886e-19eb5a5dc938', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 2, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('b0a4c54d-64fc-427d-9511-b84c9d3edc55', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('da6df73a-b493-4a87-81f7-b64b14463e71', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('d09d5abc-4276-4aa3-9129-b4a91061299d', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('ba6fe1b7-8638-4e66-9326-bfc1cfdf079b', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 2, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('2aa9c04c-c7a0-4585-b00b-5d3983dc73d5', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('db942286-fdfa-4e96-9280-5a74682e2ddf', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('e7fdf1ac-d0be-4e17-91ad-02b68267f7f5', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('99f2efeb-113d-4825-a4a6-8afe4ea85433', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('02b0fd67-b435-4654-bd45-031e452405bf', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('40c2f56e-cfb3-479c-88dc-0c414a5f8d43', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('d7388a08-dc70-40cd-a7b2-ceb2b1839cb2', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('e797063b-9941-4493-946f-f252b5c77554', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('08443dba-ef5d-4a45-aa63-f707a10d11f9', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('3102b035-49b0-4496-89fe-2871944d25f1', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 2, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('46643d29-b990-499e-929a-24f32094982a', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('ccfd4f2e-2138-4759-8543-f9800c810291', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('d1ede890-511e-43da-a4d2-ba8c31769b04', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('cb373383-3d85-4548-8d49-b628f5af3b5d', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 2, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('3e1e03fc-5ec0-4d62-b783-c6c03f1bc354', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('2c285a62-a1fc-4ed2-a3af-8809aa5ab358', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 2, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('521ccfe4-2543-4817-9c6c-57c3ecf498f6', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 2, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('f5894748-d625-4d4f-bf23-83c684cec1f9', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('d2e98b0c-87e9-4cc6-96d0-d9dd67cf1097', '3178e766-c14b-4cfb-b6cb-8a0359de4555', 'UNSOLD'),
('ccb50285-a7c7-46d1-a283-6f526cba7a32', '6b37dc21-ab90-4a1d-8e54-72c49b80bcd9', 'UNSOLD'),
('fbbafb05-8a1e-4ee3-911b-f4ba17c6d8c3', '0f21113e-d2c4-442b-891c-34f253324e9a', 'UNSOLD'),
('3553477c-221c-467e-96e0-b91e098283af', '202663d8-a590-4a71-adcd-a820d5ccb0d4', 'UNSOLD'),
('fa0a1e5f-a5bb-4cf7-bab3-5fcc125f5582', '54ed8407-7f1f-44b2-8946-32dcff65c2b4', 'UNSOLD'),
('7276583f-06a2-4b30-8c70-eeedc15267f2', 'f98ba183-eac3-40da-a387-29a9716c654f', 'UNSOLD'),
('c4b32deb-b849-468e-81f5-6e32c39c122c', '37d4ae3f-826f-4268-94b5-985b9a080ac1', 'UNSOLD'),
('9f9106a5-0708-462c-ae64-cc103ebed747', '8305c170-9a60-4286-aa2f-9128fd7bc2a9', 'UNSOLD'),
('5ab3b0ea-44d2-4038-9935-c893c365d4e3', '83d4fef2-660a-4e99-8068-2a15df5589e9', 'UNSOLD'),
('eb5aa366-28e2-4ae9-ae16-69386b6d6a4d', '109c4f97-6d1a-4705-af96-e6fbb4059d64', 'UNSOLD'),
('e44cb2a8-1c1e-432e-a3d7-ea23b7fff7b5', 'e59eaa10-9782-4a8d-8557-cf6c2a296710', 'UNSOLD'),
('7e2c2e9d-6326-4c13-b54f-1befbf2f28cc', 'a84911c6-7498-47f1-9ea3-7274bd017625', 'UNSOLD'),
('0cecf6f8-15e3-4172-8afa-9fdb5a77b704', '402bfe39-01d5-44ec-8806-5a3fef62bf2a', 'UNSOLD'),
('c9d810c6-1fbb-40ec-970e-d6db7835b51b', '08d78af8-1ae8-40a9-bc30-8b40859378d8', 'UNSOLD'),
('c7721997-fc07-4403-a60b-529e7a0b272d', '777d9831-d903-4132-a721-3b4e7fb59e0d', 'UNSOLD'),
('16ee4d90-8fa8-4c54-aa9e-9ec4be14c074', '5245b95e-36dc-4ccd-8092-a32eaaad1c96', 'UNSOLD'),
('1ad833eb-1a7e-4b38-b2e3-e70c9d46c0aa', '32783605-287e-498e-a698-c3bc4218610c', 'UNSOLD'),
('7b9495b9-145f-4aba-ad0f-f2714bc5487c', '2d425f1e-6dc8-4f68-951f-82cc39c3d589', 'UNSOLD'),
('b5dc62e4-1d0f-4af1-8f30-1ac6bae0bab2', 'd3b0f53f-b759-4e0a-903b-dea0d772233b', 'UNSOLD'),
('5900fffe-cd6c-4c0d-99cf-fbae2cfd3ae7', 'c87e0032-b41a-4e4c-a2e7-305b783f3095', 'UNSOLD'),
('ca2697e3-7bba-49e3-a43a-b08f02bfda61', '24a24b5e-2208-4944-8562-88810db398e6', 'UNSOLD'),
('dc735c1f-7c97-4caf-8150-cbc9b6f1072e', '0716b506-14e8-4270-b836-dc5afcc2bf57', 'UNSOLD'),
('6111dd52-a0bd-41b8-ab57-b09cecbe965f', '4a2dfb77-2918-47f6-bfd2-519cce6077b7', 'UNSOLD'),
('2c05825f-ecc0-4161-a22d-10603ff79fec', '285d77bb-b5e1-469d-803b-2f4677cd5292', 'UNSOLD'),
('4a8c8af9-83bd-48dd-a049-496ad5104e1f', '90e14a7e-1fe7-49fb-89fb-a279bfd88d2b', 'UNSOLD'),
('7df1308c-5818-4686-96ef-3d8a83f76db3', '82edad95-8f23-470d-803b-6930b7fa90cf', 'UNSOLD'),
('257de418-d4f3-4cc4-9b61-37b15875efa6', '1a43900f-56ae-424f-bb3d-5a823e4290c7', 'UNSOLD'),
('5f4f3ba0-cd50-4c52-8451-0e408667b9af', '29a015b2-e2dd-401f-ba62-f9f0d37528a8', 'UNSOLD'),
('6186d490-6b1f-4f9d-8c5d-7902e7e598d4', '3c73cb87-5533-4875-b7af-cbcbb122a17c', 'UNSOLD'),
('8283c75e-9adf-4cda-840b-892236300caa', '0b804f64-387f-43f5-beb2-5cb19eeb2a83', 'UNSOLD'),
('aa766642-83db-4d69-90c6-443a43fa5e1d', 'de3784a6-70e9-4939-ba08-4d32128412e8', 'UNSOLD'),
('ba7c6982-1a9a-4e98-ac65-b116ec1712d7', 'b1d6e3ae-072f-4c05-8a22-e567e42b614f', 'UNSOLD'),
('9b011b74-c0a9-4ef5-9521-e5ba4c10e2e4', '9ff8d393-852d-4579-b58a-252ed2755b6b', 'UNSOLD'),
('b4fb0222-eec3-47f2-87e1-e7dfcc3ecb95', '6ff2b573-222c-4cc6-b8bd-6c063262349c', 'UNSOLD'),
('a3ac566a-f713-4c4c-8438-f15d1abf3fd7', '56ed2348-033a-4a4b-b999-f3b5b6e24e84', 'UNSOLD'),
('884a7fbd-0186-4097-8b15-45aeddbc2522', '4adf694a-4313-4373-ad5a-de1ed76d9c2f', 'UNSOLD'),
('b61593e7-10fe-4cc7-8c26-2d310e9ed04d', '80a013ff-c430-4bbe-981c-3ac15f066927', 'UNSOLD'),
('c1db4b2c-9385-41d8-ad7b-23b525ad4827', '57e78683-95d6-4905-84e1-9d7600b7dfe3', 'UNSOLD'),
('cb1569cc-345e-4d68-94ff-9fa40cb8992e', '093ded36-370f-4291-8acf-37749ba9534e', 'UNSOLD'),
('8521eadf-6c59-4e16-9ef3-f09f1daf1986', '5b729a96-a800-4a2f-9f72-65a05649969c', 'UNSOLD'),
('cf250b05-d3fe-4369-a1fb-63f22a79cd13', 'e3a6652f-5077-4500-905e-4497ca8bbbd3', 'UNSOLD'),
('fd6adbf5-33c7-4996-af0c-209c5b199f8f', '88807b22-1fe5-4c99-9ddb-845efd8a3d81', 'UNSOLD'),
('6a803f21-7f8c-412a-8f84-643e6982166d', '424b2312-5002-4afa-9768-879711811b8c', 'UNSOLD'),
('75d5fd26-ff80-49a6-8e7e-a27589744577', '088254aa-1852-4369-a583-829ea632d9bd', 'UNSOLD'),
('ade9eabe-5888-4edd-aeca-c62bc7df810d', 'c0880eb4-e921-4cd2-bd5b-dbce727de797', 'UNSOLD'),
('5bc37444-3fa1-4b92-9f7e-a8a2bac843c5', 'edfcde64-0478-4030-b20c-e6759b9e5558', 'UNSOLD'),
('e18f6f84-fd82-447c-bf60-801e4b0826e3', '0fb7f56c-9e4c-4718-a135-e997d8174e42', 'UNSOLD'),
('001d7099-08b7-4392-a184-cbde8c9cf44a', '80f25607-d6b6-469c-a8f2-1ed6def026f7', 'UNSOLD'),
('bcda3a15-9dfd-4c11-b47a-c4bef1d0e34b', 'edb55818-4060-4d00-81d8-5a051b8c61ef', 'UNSOLD'),
('31fb5160-f81a-42e1-b976-e7b490b2ff38', '7844fee3-e4b7-4be5-baa0-b7da6ddc9ad7', 'UNSOLD'),
('e22af301-3af9-4dce-a648-86fd2d790b6b', '11bbf36c-efa5-4e57-809b-0977f5bab03b', 'UNSOLD'),
('c1fa70df-614f-44f4-a856-05abc28ff970', '80b27256-3abc-42a3-bbb1-fd9fe405cdd4', 'UNSOLD'),
('920228fd-bf0c-4859-a6b6-b7831b036093', '104a4e11-889a-4d84-ba8b-51dbfb1bbff4', 'UNSOLD'),
('6c75f126-6b21-4594-9bbf-332e256c3a36', '2742a305-d370-4c35-819c-3bc6618d9040', 'UNSOLD'),
('caed52ed-8b44-4c6a-9c37-5c365a353b1f', 'c9441cc7-6728-4450-a3f3-4c744019bd95', 'UNSOLD'),
('3cf36800-4301-4431-8520-e6893fee6f2a', 'c07bb624-eeae-4361-93f3-500369f50426', 'UNSOLD'),
('5db29883-5f0e-4e6a-8c29-c72fbac70a86', 'd61a93eb-4c35-45b9-b1eb-451d684f4885', 'UNSOLD'),
('f67e737c-d85a-4c79-af30-ee0e26a803d5', 'd4dea5da-7a8a-4b8a-8e33-25d2006899f4', 'UNSOLD'),
('5e4f57a4-1ee0-43ef-9ee4-47196a0e70de', '919d3fbf-f4d8-404e-a431-d95976acca7f', 'UNSOLD'),
('a5931033-5fc5-4a97-819f-238281026b0f', '31f7404a-e43b-4fa3-94c4-d6f952739e50', 'UNSOLD'),
('fd54fe53-4d20-473e-a2d6-26b5b335c95a', '019ad7e3-4177-4f9e-a3b1-bbb0eb18b314', 'UNSOLD'),
('793e74c0-2740-4e1f-8c59-e8c6e6bae77f', '12e732f4-6044-47e5-b12b-66a0f973fb3a', 'UNSOLD'),
('40d020f6-1328-453d-bc1b-90b35f6e5518', '1cc34364-0646-4d92-96b6-02f726159995', 'UNSOLD'),
('666470e8-6e89-4db6-a4b1-186eb4d26012', 'da859a6d-5fa2-4856-b1f1-467b389e593f', 'UNSOLD'),
('53ed2db7-423d-4e45-aad6-b837c0e98b5a', 'c29a47fb-2834-42f3-ad3c-ce2c0c493672', 'UNSOLD'),
('6bdb41bc-d11d-4e47-ac98-083ce6ddaab1', '95f22ffe-2613-4ec9-8845-56bfc0453029', 'UNSOLD'),
('2ad1cfe3-109a-4814-99fb-1160db359a46', '1ed6c8d0-5d7b-4207-9727-01d600027e80', 'UNSOLD'),
('987f941b-3772-4fa2-b6bc-dd19c0e06638', '3c30e125-6a53-4c81-9b9c-446f8d9586da', 'UNSOLD'),
('a02a232d-2ded-422b-b050-1e3533dd18e1', 'c52e4e9e-03b3-4905-a288-de9d39a3402f', 'UNSOLD'),
('d3dff4e8-2457-4a80-8987-d9f100d86c44', '1c19b28e-8e0a-4590-a6dd-be48f03b0cfb', 'UNSOLD'),
('0895f2e9-5bdd-426d-a004-5198411e594e', '4c7bf8b1-6286-4280-98d6-7b3824eb9ccb', 'UNSOLD'),
('25d35e81-98b8-4f6c-9a9e-33126d9f6505', '5dae0fda-1620-47a5-b701-6d6122f0ec86', 'UNSOLD'),
('76e7ff6e-c310-4f7f-9715-f094a16ae363', '5f5f828d-27cb-489e-875c-c5787ed7ef19', 'UNSOLD'),
('1ac69e1d-772b-41cb-816f-cd2f213ff4d4', 'a89ae118-0854-45d3-a4fb-e392b87ce310', 'UNSOLD'),
('3a215f7b-61ff-430d-b85b-fbccd17739be', '7fd5e0b9-f61b-4d12-8b3d-d6032f9d8a06', 'UNSOLD'),
('ef313bb0-090b-48ca-8ca9-cb1217f8adb7', 'c724a8bb-2c4f-4687-be8a-f7f645b84d0c', 'UNSOLD'),
('a228b55c-222c-4259-acd3-9aeced82aceb', '79b0c52b-1233-4d2f-a4c5-ae605948eec7', 'UNSOLD'),
('ed9a9199-b684-4b4d-ba25-aefa1b96e381', '1cdeb1b9-2b4f-4766-ae36-0a2ff1ba4474', 'UNSOLD'),
('6a9df7d3-3ca9-4cab-9260-6080cd6b08ae', 'a6fcd340-8a39-410e-a1a2-b5ee896f62eb', 'UNSOLD'),
('9bcb6195-4968-4340-bffd-1903e765e82a', 'ef343b84-05ae-46b5-b4d1-e4ba40e61441', 'UNSOLD'),
('7c7d4c3c-c6b9-4bbc-9f67-50a6e53a4729', 'df912914-cfe1-41cf-90cf-3abece5e25fd', 'UNSOLD'),
('ed87fdf8-f0c4-4129-ae45-83496fd5d02b', 'a306bc3b-237d-4795-8dc1-d708d14077a9', 'UNSOLD'),
('ce589fc4-4801-4959-a9c2-22cb76d173f9', 'a751eab8-26c9-4614-b404-996557316023', 'UNSOLD'),
('c6da6b21-8632-4568-8b07-02a66b1b69e4', 'dbe6ac8c-4bd3-487e-8512-3cc61b3127b4', 'UNSOLD'),
('9a6cc21c-8eb0-42c3-a8d6-b2598d968c92', '624e2904-24a0-43a5-bac2-fb19de968363', 'UNSOLD'),
('a5c4260b-74c1-4fdd-9958-8ccee1695bc9', '61ee34a9-91bc-4163-94f1-471474e762d4', 'UNSOLD'),
('4f8e2cdf-e7bf-48bc-88d7-8ad9079517fd', 'ab6f045f-d7c6-42be-ae35-c75f58fb54b3', 'UNSOLD'),
('faa53311-04f7-4574-8a14-f9c87028f0ea', '5973ae08-768e-4e05-9351-4b799149a33d', 'UNSOLD'),
('6ff2dc91-3bd4-4064-939a-a75c86b15051', 'b84b17b5-9185-43ac-9d92-205d79ae6c4a', 'UNSOLD'),
('99ee1428-7e6e-4f58-a30b-93b2921efc1e', '108e5f60-9ac9-4ac2-998a-23618f2f7ffd', 'UNSOLD'),
('27734e61-2055-4675-b38d-818e1ebb1bc4', 'eb1fd650-6fea-44db-8e1b-31986cf6809b', 'UNSOLD'),
('b1b0c822-d43d-441e-b65d-2f4aef406d87', '7ae4bf23-82cf-4829-bbcb-44aa692f23f0', 'UNSOLD'),
('92bca83a-c1a0-4ec0-a2f5-fae61266f7aa', 'f484afc5-bea8-4162-97ae-f328277e60c3', 'UNSOLD'),
('3c201d4d-e665-4604-bfab-5c152f270a25', '94b04e01-899a-4628-a976-480e4f1f179c', 'UNSOLD'),
('85457a21-c2e7-435b-b930-cb5500a9832b', 'f14f0fe2-a320-42d3-ae88-0011154b5e72', 'UNSOLD'),
('c153340b-878b-4e31-ab5f-6635cc0f2373', 'abec015d-71c7-4530-8fda-50643d11105e', 'UNSOLD'),
('90fd29dc-18ac-431a-9542-e46bbd84d2d6', '34dfafd5-280f-4384-9d53-3dc46f070272', 'UNSOLD'),
('a8dec248-3d5a-437d-b194-dd9adc24c5ed', '0cfee4de-eae7-4915-83fe-294babb8c581', 'UNSOLD'),
('b4c559c4-ce16-43f6-836d-4b3a647f668c', '4029a3d5-fc2e-4d8e-8561-38c27db824b1', 'UNSOLD'),
('095c6ac7-e1b1-4cd9-8770-ff4c007ea113', '5691d12e-afda-4298-9a9b-ece52f4672b0', 'UNSOLD'),
('6460870e-5d78-426e-965f-e0c4c5fe9425', 'c3524a9a-5778-4a48-958c-f9933fa0efcb', 'UNSOLD'),
('da90a35c-45b2-43c3-9a11-85aac542aba2', 'c3572f02-8db6-49d9-88f2-d35953689e9a', 'UNSOLD'),
('d0c3ec6b-5ae9-4c02-8889-18415b395333', '8ad71764-8131-4c68-8a84-62d58a8acb44', 'UNSOLD'),
('6d884398-066e-47f1-b33e-1e27e897ca33', '0ee644fc-3c10-4197-80a6-d70ab9ded457', 'UNSOLD'),
('a26c5a8e-7bea-44ef-93a3-d9340c4df316', '8c7af7d0-b208-4b1a-bf13-6e08b396bc0e', 'UNSOLD'),
('05b19078-4ef1-4d71-85b0-bd5362b0f68f', '162b2183-2f4c-4a60-a421-0e6e74b29315', 'UNSOLD'),
('d0b467c1-cf9b-4e3d-9427-f0a645e87ec1', 'aeffd1e2-a1bf-4f17-a7c6-91d3ac17b194', 'UNSOLD'),
('357889b3-2755-4961-bd92-019c34cd3361', 'bfce66e4-0feb-48cf-b514-56973e3581ed', 'UNSOLD'),
('7f90154b-2f63-419d-991f-734282a55e49', '491e6494-eecd-4994-99ca-115da3eeaf60', 'UNSOLD'),
('29b9bf95-66c0-4bdf-a20b-3cb00df63224', '0d2056d8-fea0-4b7c-ad1d-84c8c1519db7', 'UNSOLD'),
('61998bfe-df9e-4dba-8a65-b742eb8996a6', '889abaac-cab7-4e45-b453-6a49f0e5124e', 'UNSOLD'),
('98cf0aba-63be-42b3-a68b-278fa30d87a2', '9c959623-51fd-4417-bfaa-14527fa80c9d', 'UNSOLD'),
('6d8b4e46-474f-401f-a59b-22574dbbebb5', '28ef5e04-b0c6-4afc-b69e-a635da4da806', 'UNSOLD'),
('7f199550-a929-4279-8a66-51cd2e960f33', '1faf83c4-5487-4ddf-8858-3ddfadb27c48', 'UNSOLD'),
('91855cf8-cf47-4df8-b4e8-a764a277c71a', 'f8bc5b04-6be1-4227-9bdf-817f9f06754e', 'UNSOLD'),
('d6c1fc47-3380-429a-8a92-efa1608719f3', '2b90f793-6491-458e-aea9-e89d8d593467', 'UNSOLD'),
('460867a6-f6c5-4732-a430-4e16e89195b4', 'bf886d8e-ce9f-40a0-a004-9658ed62738c', 'UNSOLD'),
('42fb0e03-bd1a-479f-a7ff-b8edeb329508', '7b6b8ec4-dcbe-4bed-9279-4dc2c8dcc624', 'UNSOLD'),
('12a2f3c3-8ac3-4ebe-ad42-6e2045ffabeb', '8d76e550-460e-45b2-8fb1-fbe3edd8a34b', 'UNSOLD'),
('13f73617-b611-47a6-a675-b3e864d592ea', 'e0096ad8-7be3-4a68-8699-8070e494d149', 'UNSOLD'),
('5cab01a8-bcaf-4b40-8b54-a0627a04d887', '38b4ba7f-4ae9-47e3-8394-d99f02f950ad', 'UNSOLD'),
('6b2b0c11-72b5-44f8-93be-2c39c6d7538a', '6aa5e59b-25de-4250-82a8-a3c6aa1995be', 'UNSOLD'),
('95e6cfbf-9cf1-4a5b-b2b7-bba5d5b3fc8d', 'ab602bcd-a4cb-4c4b-9ad0-a6c2e1d6898c', 'UNSOLD'),
('8b0a25d4-7dd1-4f58-8d89-ce16fb9cf58a', '7518a1b4-2a11-428c-a03e-7538a51caa12', 'UNSOLD'),
('143be574-ac6c-4085-8f2b-204e552b8726', '53a82b67-3480-4208-ad56-3483b80a759b', 'UNSOLD'),
('98ddff05-b806-4635-a8d3-45b14852dd33', 'fa0b4e25-3c2f-43cf-8dd6-db05dec887d2', 'UNSOLD'),
('0145911e-2edb-4222-ad5c-a89ef492481f', '6501d6fe-037d-4068-9be1-43534922e57c', 'UNSOLD'),
('e6d64d7d-5ea3-4825-b6d1-c29639057454', 'cfbc5575-028c-4e0d-9a06-ca0ee4c72ed5', 'UNSOLD'),
('9dd314ac-8ae0-4e37-9403-c31aacdeb971', '982ebe3e-d07f-4493-abb4-3d98ccfb8ff9', 'UNSOLD'),
('16363dcd-009e-45fb-8f53-0826d0be1774', '096dc67f-b79e-40a4-9437-0c78812ceee5', 'UNSOLD'),
('56fc6721-2f30-45f9-93c3-81055d377ade', 'ff6fd0f6-d7c9-48fd-a491-d9546ffe1636', 'UNSOLD'),
('77c3b96b-5ee8-4b3a-973c-859a24f39d11', '9e1b5379-8e5f-4452-9ca5-9ef3827a5394', 'UNSOLD'),
('7bf92097-8f91-45ee-9754-e6e0feef2c1b', 'efef5628-3472-47c7-82a6-ec6a911b52fb', 'UNSOLD'),
('0541f7dd-9d92-4f41-901d-7197e1f5868b', '83451fcf-8bdc-47e9-a7e4-e9b0dee625fe', 'UNSOLD'),
('ee7d9cb0-e337-41ba-af9b-0b48a121afe2', '42695ff1-0edb-465d-85cd-9749cf25d89e', 'UNSOLD'),
('c5ceae40-a7ac-4838-abb3-1e38cb01d8f9', '643ffbde-f5c8-43c9-9aa8-02cd08008ca4', 'UNSOLD'),
('b97735c6-ceac-4cc1-85a1-8ef19dcf070a', '481da015-6b9d-4f6e-886e-19eb5a5dc938', 'UNSOLD'),
('18cd71fc-8d51-46d5-a2b5-51c73b9a226c', 'b0a4c54d-64fc-427d-9511-b84c9d3edc55', 'UNSOLD'),
('48f79bb7-40c7-42f1-9338-11addaa553f1', 'da6df73a-b493-4a87-81f7-b64b14463e71', 'UNSOLD'),
('06030487-ab4c-43f3-bfd2-84cb20a9efda', 'd09d5abc-4276-4aa3-9129-b4a91061299d', 'UNSOLD'),
('0b00b0ce-f3ab-4298-8f3b-e5760908910c', 'ba6fe1b7-8638-4e66-9326-bfc1cfdf079b', 'UNSOLD'),
('f8ea9e97-b495-4f8c-adad-32c1ce485c25', '2aa9c04c-c7a0-4585-b00b-5d3983dc73d5', 'UNSOLD'),
('e4199ebd-e11b-4c72-b944-94c9938bf4f8', 'db942286-fdfa-4e96-9280-5a74682e2ddf', 'UNSOLD'),
('dd7e0fde-a2dc-4e75-a062-a897a742fe5f', 'e7fdf1ac-d0be-4e17-91ad-02b68267f7f5', 'UNSOLD'),
('609cc400-9a90-4c51-a2f3-fb7b09735b37', '99f2efeb-113d-4825-a4a6-8afe4ea85433', 'UNSOLD'),
('563b30f0-de5e-4858-9998-af853fb5b9b9', '02b0fd67-b435-4654-bd45-031e452405bf', 'UNSOLD'),
('9c183ccb-ab3f-4923-b7fb-098a23a42751', '40c2f56e-cfb3-479c-88dc-0c414a5f8d43', 'UNSOLD'),
('a4873ec8-59fa-4c5a-83be-46899f2efa77', 'd7388a08-dc70-40cd-a7b2-ceb2b1839cb2', 'UNSOLD'),
('275061bd-257e-408b-be8d-08db42998b6f', 'e797063b-9941-4493-946f-f252b5c77554', 'UNSOLD'),
('1b95dfa1-6f13-457e-b1f9-d66a0aa07b54', '08443dba-ef5d-4a45-aa63-f707a10d11f9', 'UNSOLD'),
('782c257d-1ed4-4638-9754-6408b39d4f22', '3102b035-49b0-4496-89fe-2871944d25f1', 'UNSOLD'),
('c486e450-b95c-4809-8339-be1a7dacf510', '46643d29-b990-499e-929a-24f32094982a', 'UNSOLD'),
('a7472626-645e-4c89-8486-e24d3fd02c4e', 'ccfd4f2e-2138-4759-8543-f9800c810291', 'UNSOLD'),
('c7c00f2c-6a2c-47b6-89a8-4f1b24b013d1', 'd1ede890-511e-43da-a4d2-ba8c31769b04', 'UNSOLD'),
('4bf83b10-ed79-4e88-a907-af13c1112fb5', 'cb373383-3d85-4548-8d49-b628f5af3b5d', 'UNSOLD'),
('6a56a786-2d5c-4b78-a77c-e03e40ccc767', '3e1e03fc-5ec0-4d62-b783-c6c03f1bc354', 'UNSOLD'),
('7755fd4e-e97f-48ca-b0c9-90e09136c206', '2c285a62-a1fc-4ed2-a3af-8809aa5ab358', 'UNSOLD'),
('516cddbd-1f3e-4824-876d-de2364e2548b', '521ccfe4-2543-4817-9c6c-57c3ecf498f6', 'UNSOLD'),
('e94f6be8-9f41-42e4-b061-6843908a1c4a', 'f5894748-d625-4d4f-bf23-83c684cec1f9', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('ebeac336-c8d6-45ee-87e8-3f78d07234c2', 'admin', '$2b$10$VVRSm3OfhIjZYGQDCl26/uRYbFJXGf7dWXx2XwLhliuse5RJU3nki', 'ADMIN'),
('1f4fb076-8cdc-49f1-a541-009ba9919429', 'screen', '$2b$10$0AFy8.ImLzKucTi3IxLRaeg.zZkPWi5NdVLrfxMdsPNz.ar0kwyJ2', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 1', 'PLAYER', '[{"rank":6,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":15,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

