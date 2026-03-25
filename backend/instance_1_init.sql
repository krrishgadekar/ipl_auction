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
('5b3eb2e9-23d8-4879-a8fb-9d20bb610708', 'Team Alpha', 'alpha', '$2b$10$RHMCdd5vh3FC4bSJpuvrveAZPS0i3VHRj0ShDdiXO1ThuwgqgTYua', 120, 0),
('97bb4410-add9-4fbe-b5f1-97e2b40558be', 'Team Bravo', 'bravo', '$2b$10$.FvfiueGoST1MmJAcHP5/OQmFVgM2SUdHcjfZg2QL52A4nL8rdX7K', 120, 0),
('850520a8-14ca-4493-9c33-c323917721fe', 'Team Charlie', 'charlie', '$2b$10$s5uuG2Tp9pun1ExiXnfhauNk4R23lvSxQEudQ.jLqfbQFKKliVCw2', 120, 0),
('72f9f62a-66a1-4d0d-abd8-cc2760caedc7', 'Team Delta', 'delta', '$2b$10$3/4HquIHCWQO5Ym3rjNpjuLJM5uS2.HsLOmBpqRT940Ab9y3C5TMG', 120, 0),
('2ef2f385-a5f1-4a5e-b19e-ed026819ba19', 'Team Echo', 'echo', '$2b$10$i4V7dGIauJocixfI2F44AuXk.vIq9/YaAUryw1NykTfq/LsW4GZT.', 120, 0),
('2926e76c-96b0-4135-8409-be2afde88762', 'Team Foxtrot', 'foxtrot', '$2b$10$CLtqtOVa0HHNfAZ9B51oD.pkcEWpFpcDEXWp/UFw.a1DT342xD6DG', 120, 0),
('13a48d43-9e99-4b8c-bac6-994c97246925', 'Team Golf', 'golf', '$2b$10$gM2FaPAHM8vl1r08uSVZ/eQ25smxJs16bGNJES5YlF346jf6KZLgW', 120, 0),
('ad963396-6af8-4ea4-b13e-dc5ed81aa454', 'Team Hotel', 'hotel', '$2b$10$BOkBmIsr1zYfpMCQ5MuHGe3qT0XhlUa4N9fgukrvZ8y5GD5Int5si', 120, 0),
('a2986150-aa65-420f-bcf7-a7901c001a91', 'Team India', 'india', '$2b$10$xRrcx/8WL4SFOb.GRi.qXeNu.OXqLVeY0uVamwGK7LvNu68y4AShG', 120, 0),
('4540ada2-1c63-4825-8efb-97f6104c5c6d', 'Team Juliet', 'juliet', '$2b$10$ovrqISxMxvtPZLAvGkQRvem1.WHBYRPnC0y0zuu.5rtWqnOmkplCW', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, legacy, url, matches, bat_runs, bat_sr, bat_average, bowl_wickets, bowl_eco, bowl_avg, sub_scoring, sub_impact, sub_consistency, sub_experience, sub_wicket_taking, sub_economy, sub_efficiency, sub_batting, sub_bowling, sub_versatility) VALUES
('c13c8357-76cb-462f-9a83-2e8898549230', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/576/rohit-sharma', 272.0, 7046.0, 132.1, 29.73, NULL, NULL, NULL, 99.0, 66.0, 74.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('2b253220-ea2f-4d4b-8cc1-1549926240fe', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1431163/ayush-mhatre', 7.0, 240.0, 188.98, 34.29, NULL, NULL, NULL, 8.0, 99.0, 85.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('be7637d1-5d7c-47dd-a236-60d200ca853b', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 'Afghan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13214/azmatullah-omarzai', 16.0, 99.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 38, NULL, NULL, NULL, 31.0, 25.0, 25.0),
('85dfd91d-d453-4faf-8fd9-7aae6547d0e9', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14696/akash-maharaj-singh', 10.0, NULL, NULL, NULL, 9.0, 9.54, 36.22, NULL, NULL, NULL, 35, 9.0, 47.0, 61.0, NULL, NULL, NULL),
('1fcec2b1-dbf5-4db7-9698-a11fac41bf16', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/10209/heinrich-klaasen', 49.0, 1480.0, 169.73, 40.0, NULL, NULL, NULL, 31.0, 91.0, 99.0, 54, NULL, NULL, NULL, NULL, NULL, NULL),
('a76258ab-a417-4ea9-850c-a92fde2d6844', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/7625/adam-milne', 10.0, NULL, NULL, NULL, 7.0, 9.48, 46.71, NULL, NULL, NULL, 35, 8.0, 48.0, 38.0, NULL, NULL, NULL),
('c949d347-c22b-4298-8ef5-f79ed6d82791', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 'Sri Lankan', 1, false, 0, 'https://www.cricbuzz.com/profiles/16458/matheesha-pathirana', 32.0, NULL, NULL, NULL, 47.0, 8.68, 21.62, NULL, NULL, NULL, 46, 34.0, 61.0, 92.0, NULL, NULL, NULL),
('7355317f-54f4-415a-84be-6ca926c26181', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10917/venkatesh-iyer', 61.0, 1468.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 60, NULL, NULL, NULL, 77.0, 16.0, 16.0),
('85ff6b35-4600-4fbd-a7fa-aeee880e2ad0', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12930/manimaran-siddharth', 5.0, NULL, NULL, NULL, 3.0, 8.63, 46.0, NULL, NULL, NULL, 32, 5.0, 62.0, 40.0, NULL, NULL, NULL),
('5bb4b594-8d47-45a4-9a6e-6531e9f576de', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12627/mayank-markande', 37.0, NULL, NULL, NULL, 37.0, 8.91, 28.89, NULL, NULL, NULL, 48, 27.0, 57.0, 76.0, NULL, NULL, NULL),
('0ca0ead4-ae70-4d8e-b384-a056327e7ccc', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11595/ravisrinivasan-sai-kishore', 25.0, 18.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 19.0, 41.0, 19.0),
('b728d159-f815-48de-8b3d-907138c5207c', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10225/t-natarajan', 63.0, NULL, NULL, NULL, 67.0, 8.94, 30.12, NULL, NULL, NULL, 61, 47.0, 57.0, 74.0, NULL, NULL, NULL),
('a796da43-d1fb-4df5-b06a-3970c0a2512d', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/7910/yuzvendra-chahal', 174.0, NULL, NULL, NULL, 221.0, 7.96, 22.77, NULL, NULL, NULL, 99, 99.0, 73.0, 89.0, NULL, NULL, NULL),
('77feb4ea-6c52-47a1-9e06-c4deb62dd2b4', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13217/arshdeep-singh', 82.0, NULL, NULL, NULL, 97.0, 9.0, 26.49, NULL, NULL, NULL, 71, 66.0, 56.0, 81.0, NULL, NULL, NULL),
('d9699ac3-558c-4017-aace-a1755eab071c', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/11195/shivam-dube', 79.0, 1859.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 69, NULL, NULL, NULL, 88.0, 20.0, 20.0),
('7381c88f-2e62-4184-a45e-554a4c882ae1', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/15861/vaibhav-arora', 32.0, NULL, NULL, NULL, 36.0, 9.55, 28.22, NULL, NULL, NULL, 46, 27.0, 47.0, 78.0, NULL, NULL, NULL),
('eb8b3a07-171c-4ee4-8b9a-80d30e21fe69', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10919/shashank-singh', 41.0, 773.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 50, NULL, NULL, NULL, 67.0, 14.0, 14.0),
('0b9664d4-985c-46a6-8d47-a044ee8717c0', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/8393/dushmantha-chameera', 19.0, NULL, NULL, NULL, 13.0, 9.73, 46.38, NULL, NULL, NULL, 39, 12.0, 44.0, 39.0, NULL, NULL, NULL),
('8ec4b8eb-a883-4f94-a2fb-0e187cc6aa3a', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/10045/liam-livingstone', 49.0, 1051.0, NULL, NULL, 13.0, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, 70.0, 28.0, 28.0),
('6332ebb4-6f2d-4e26-96db-e2d536aaf688', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14701/nitish-kumar-reddy', 28.0, 485.0, NULL, NULL, 5.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 50.0, 14.0, 14.0),
('1b68c2eb-48aa-4d74-abdc-4230bc708ad1', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/9582/aiden-markram', 57.0, 1440.0, 135.09, 31.3, NULL, NULL, NULL, 30.0, 68.0, 78.0, 58, NULL, NULL, NULL, NULL, NULL, NULL),
('bd68587a-5424-46dd-8575-c4eb1945ec20', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13630/nandre-burger', 5.0, NULL, NULL, NULL, 7.0, 8.53, 20.71, NULL, NULL, NULL, 32, 8.0, 63.0, 94.0, NULL, NULL, NULL),
('21111803-7ee1-4b3e-967a-9aed9b72623f', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/19027/umran-malik', 26.0, NULL, NULL, NULL, 29.0, 9.4, 26.62, NULL, NULL, NULL, 43, 22.0, 49.0, 81.0, NULL, NULL, NULL),
('74799df6-c19e-4d29-8378-19a7fefd8736', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13748/sherfane-rutherford', 23.0, 397.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 41, NULL, NULL, NULL, 48.0, 17.0, 17.0),
('54ea46f4-f56b-4734-a656-089db804989c', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10896/rinku-singh', 58.0, 1099.0, 145.18, 30.53, NULL, NULL, NULL, 24.0, 75.0, 76.0, 59, NULL, NULL, NULL, NULL, NULL, NULL),
('bde35eee-f687-4d0f-a3f5-777e53adf3fa', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/10808/mohammed-siraj', 108.0, NULL, NULL, NULL, 109.0, 8.74, 30.72, NULL, NULL, NULL, 84, 74.0, 60.0, 72.0, NULL, NULL, NULL),
('a117b846-54dd-47bd-b5ec-0482931010fb', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14254/prabhsimran-singh', 51.0, 1305.0, 151.93, 25.59, NULL, NULL, NULL, 28.0, 79.0, 64.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('ce991a36-0038-4cd2-b937-9c0756091c1f', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 'English', 2, true, 2, 'https://www.cricbuzz.com/profiles/2258/jos-buttler', 121.0, 4120.0, 149.39, 40.0, NULL, NULL, NULL, 79.0, 78.0, 99.0, 90, NULL, NULL, NULL, NULL, NULL, NULL),
('f2d3ca7a-46f2-410e-9939-47d92455f0bd', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8095/pat-cummins', 72.0, NULL, NULL, NULL, 79.0, 8.81, 30.04, NULL, NULL, NULL, 66, 54.0, 59.0, 74.0, NULL, NULL, NULL),
('3d88967b-bf97-4ba8-b30f-f24e1a40af57', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9603/lungi-ngidi', 16.0, NULL, NULL, NULL, 29.0, 8.53, 18.24, NULL, NULL, NULL, 38, 22.0, 63.0, 99.0, NULL, NULL, NULL),
('03a52a05-bc8f-43f5-b65e-5b478d16c35e', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/24326/abishek-porel', 31.0, 661.0, 149.89, 25.42, NULL, NULL, NULL, 16.0, 78.0, 63.0, 45, NULL, NULL, NULL, NULL, NULL, NULL),
('6657dff0-45ae-4e29-b81f-11986b33daa0', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10952/khaleel-ahmed', 71.0, NULL, NULL, NULL, 89.0, 8.98, 26.16, NULL, NULL, NULL, 65, 61.0, 56.0, 82.0, NULL, NULL, NULL),
('98b7de2f-82c6-4cd6-bd74-52debd0c83ce', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/24729/harshit-rana', 33.0, NULL, NULL, NULL, 40.0, 9.51, 25.73, NULL, NULL, NULL, 46, 29.0, 47.0, 83.0, NULL, NULL, NULL),
('77828c28-53a9-4583-a103-9ae8f91175c5', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14452/harpreet-brar', 49.0, NULL, NULL, NULL, 35.0, 8.03, 31.0, NULL, NULL, NULL, 54, 26.0, 71.0, 72.0, NULL, NULL, NULL),
('e40258fe-8978-4d7c-abbf-ac1027a90f16', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 'English', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12258/will-jacks', 21.0, 463.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 55.0, 28.0, 28.0),
('c3533f93-0d81-4416-98fc-51bfe00d6caf', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/22401/mayank-yadav', 6.0, NULL, NULL, NULL, 9.0, 9.17, 20.56, NULL, NULL, NULL, 33, 9.0, 53.0, 94.0, NULL, NULL, NULL),
('f5c3934e-8969-4d8e-837b-d18c4a503fad', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13497/ashutosh-sharma', 24.0, 393.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 42, NULL, NULL, NULL, 56.0, 0.0, 0.0),
('2d892a7b-6040-41ee-b34f-1b8722acaea0', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'West Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9789/shimron-hetmyer', 86.0, 1482.0, 151.85, 29.06, NULL, NULL, NULL, 31.0, 79.0, 72.0, 73, NULL, NULL, NULL, NULL, NULL, NULL),
('c1e8bd1d-ded9-430e-b33b-969c58e9bf97', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10636/rajat-patidar', 42.0, 1111.0, 154.31, 30.86, NULL, NULL, NULL, 24.0, 81.0, 77.0, 51, NULL, NULL, NULL, NULL, NULL, NULL),
('27bc9b07-2ab4-490d-99c9-44b44f768c0b', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10693/glenn-phillips', 8.0, 65.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 34, NULL, NULL, NULL, 24.0, 34.0, 24.0),
('0366ba03-3c41-4f43-b65a-281e97ba50cc', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10226/shahrukh-khan', 55.0, 732.0, NULL, NULL, 1.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 56.0, 27.0, 27.0),
('e4d18b9d-6d9c-4dbf-926d-3d4fdf7a36c9', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8356/sandeep-sharma', 136.0, NULL, NULL, NULL, 146.0, 8.03, 27.88, NULL, NULL, NULL, 98, 98.0, 71.0, 78.0, NULL, NULL, NULL),
('805c3710-42f4-491d-9d8f-5bba0a41b6fe', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1447337/vignesh-puthur', 5.0, NULL, NULL, NULL, 6.0, 9.08, 18.17, NULL, NULL, NULL, 32, 7.0, 54.0, 99.0, NULL, NULL, NULL),
('14b1c736-bb61-4d59-9815-ea9212245eac', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'OVERSEAS', 'West Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/2276/sunil-narine', 188.0, 1780.0, NULL, NULL, 192.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 84.0, 83.0, 83.0),
('abca32b2-5915-4636-b500-abea06773b01', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/1836/manish-pandey', 174.0, 3942.0, 121.52, 29.42, NULL, NULL, NULL, 76.0, 59.0, 73.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('7753ab21-e704-4629-bd4b-c28e6cdcc300', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/36487/suyash-sharma', 27.0, NULL, NULL, NULL, 18.0, 8.75, 45.22, NULL, NULL, NULL, 43, 15.0, 60.0, 41.0, NULL, NULL, NULL),
('e5acab42-1e7d-4068-9fcd-b700b0dc4759', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 'Singaporean', 1, false, 0, 'https://www.cricbuzz.com/profiles/13169/tim-david', 50.0, 846.0, 173.37, 32.54, NULL, NULL, NULL, 19.0, 94.0, 81.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('88ebdd1c-4976-4c37-8441-dc2482cd0560', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13915/nehal-wadhera', 36.0, 719.0, 142.95, 26.63, NULL, NULL, NULL, 17.0, 73.0, 66.0, 48, NULL, NULL, NULL, NULL, NULL, NULL),
('1c89c118-3d66-442b-9d42-700bb65567ac', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13136/kartik-tyagi', 20.0, NULL, NULL, NULL, 15.0, 10.14, 47.53, NULL, NULL, NULL, 40, 13.0, 37.0, 37.0, NULL, NULL, NULL),
('403840db-2d1e-470e-8e5c-8a223cdefbdf', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/6258/josh-hazlewood', 39.0, NULL, NULL, NULL, 57.0, 8.28, 20.98, NULL, NULL, NULL, 49, 40.0, 67.0, 93.0, NULL, NULL, NULL),
('dcdfaec0-21d4-4788-93db-e1069a77cc35', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10486/vijaykumar-vyshak', 16.0, NULL, NULL, NULL, 17.0, 10.38, 33.88, NULL, NULL, NULL, 38, 14.0, 33.0, 66.0, NULL, NULL, NULL),
('cd41de88-5350-4960-bd75-8f9daf2f10e2', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8497/travis-head', 38.0, 1146.0, 170.03, 34.73, NULL, NULL, NULL, 25.0, 92.0, 86.0, 49, NULL, NULL, NULL, NULL, NULL, NULL),
('8cbbd43c-91f8-4b7d-9aaf-52f163a60534', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9429/sarfaraz-khan', 50.0, 585.0, 130.59, 22.5, NULL, NULL, NULL, 15.0, 65.0, 56.0, 55, NULL, NULL, NULL, NULL, NULL, NULL),
('237eeb18-3a83-465e-8ce3-fbdd8881dfd7', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10637/josh-inglis', 11.0, 278.0, 162.58, 30.89, NULL, NULL, NULL, 9.0, 87.0, 77.0, 35, NULL, NULL, NULL, NULL, NULL, NULL),
('58391404-1d99-45d8-82bf-7c8599c3540c', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 'South African', 2, false, 2, 'https://www.cricbuzz.com/profiles/9585/kagiso-rabada', 84.0, NULL, NULL, NULL, 119.0, 8.62, 22.96, NULL, NULL, NULL, 72, 80.0, 62.0, 89.0, NULL, NULL, NULL),
('526774ac-562c-4d52-aeeb-03c2173896b6', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14691/dhruv-jurel', 41.0, 680.0, 153.85, 28.33, NULL, NULL, NULL, 16.0, 81.0, 71.0, 50, NULL, NULL, NULL, NULL, NULL, NULL),
('1673031d-3b1e-4196-9a16-0124c92cb1d3', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/14504/tilak-varma', 54.0, 1499.0, 144.42, 37.48, NULL, NULL, NULL, 31.0, 74.0, 93.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('37710bb2-df48-4e48-8a75-4bd4d621958f', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/14659/ravi-bishnoi', 77.0, NULL, NULL, NULL, 72.0, 8.22, 31.07, NULL, NULL, NULL, 68, 50.0, 68.0, 72.0, NULL, NULL, NULL),
('9f59a508-1410-47fb-ab62-72e99f86c5a3', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/18637/arshad-khan', 19.0, 124.0, NULL, NULL, 12.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 39.0, 18.0, 18.0),
('d85fdf10-22c2-437d-85f3-f1c0c627a325', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14628/abdul-samad', 63.0, 741.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 61, NULL, NULL, NULL, 57.0, 5.0, 5.0),
('d7b499f7-d218-495b-a07b-c2cc93fc2956', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1447065/aniket-verma', 14.0, 236.0, 166.2, 26.22, NULL, NULL, NULL, 8.0, 89.0, 65.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('319082e1-a235-4d4d-831d-6adfdf5f41f6', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10551/prasidh-krishna', 66.0, NULL, NULL, NULL, 74.0, 8.77, 29.61, NULL, NULL, NULL, 63, 51.0, 59.0, 75.0, NULL, NULL, NULL),
('86e817c6-5a6e-4aa9-adf5-4c9512f97354', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1448289/digvesh-singh-rathi', 13.0, NULL, NULL, NULL, 14.0, 8.25, 30.64, NULL, NULL, NULL, 36, 12.0, 68.0, 72.0, NULL, NULL, NULL),
('087ea23f-f5eb-4309-8a40-be8f0db561d0', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/22566/angkrish-raghuvanshi', 22.0, 463.0, 144.69, 28.94, NULL, NULL, NULL, 12.0, 75.0, 72.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('b0f48848-b20c-4f93-9e80-cf9d1b4002dc', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12225/cameron-green', 29.0, 707.0, NULL, NULL, 16.0, NULL, NULL, NULL, NULL, NULL, 44, NULL, NULL, NULL, 64.0, 27.0, 27.0),
('992640b1-7cf1-42ae-9173-e6c59aa71e30', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13747/arjun-tendulkar', 5.0, 13.0, NULL, NULL, 3.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 32.0, 23.0, 23.0),
('ea97a245-23e9-4e1f-b6f4-373ab2089dff', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9204/nitish-rana', 118.0, 2853.0, 136.77, 27.7, NULL, NULL, NULL, 56.0, 69.0, 69.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('af62bc56-ba57-48b4-b852-ca9c4cf54601', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11177/rachin-ravindra', 18.0, 413.0, NULL, NULL, 0.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 49.0, 29.0, 29.0),
('dfe43183-a4ca-4f32-b3b8-4e052df29790', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/702/ishant-sharma', 117.0, NULL, NULL, NULL, 96.0, 8.38, 35.18, NULL, NULL, NULL, 88, 65.0, 66.0, 63.0, NULL, NULL, NULL),
('1e171074-ffe2-41d9-a9bd-daee6a246480', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12086/abhishek-sharma', 77.0, 1815.0, NULL, NULL, 11.0, NULL, NULL, NULL, NULL, NULL, 68, NULL, NULL, NULL, 90.0, 24.0, 24.0),
('a32f95fe-b666-48ab-a9e7-ef37f3fc7d26', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13534/mohsin-khan', 24.0, NULL, NULL, NULL, 27.0, 8.51, 25.52, NULL, NULL, NULL, 42, 21.0, 64.0, 83.0, NULL, NULL, NULL),
('bb7ff3d3-2429-43f8-89dd-fc9e0c51cc5b', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 'Indian', 2, false, 10, 'https://www.cricbuzz.com/profiles/1413/virat-kohli', 267.0, 8661.0, 132.86, 39.55, NULL, NULL, NULL, 99.0, 67.0, 98.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('70dab8a8-603b-428e-95b1-02c2a23399d2', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 'Australian', 1, false, 4, 'https://www.cricbuzz.com/profiles/8989/marcus-stoinis', 109.0, 2026.0, NULL, NULL, 44.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 90.0, 37.0, 37.0),
('d8169796-c848-40aa-bcb9-9e3d904d0597', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/11808/shubman-gill', 118.0, 3866.0, 138.72, 39.45, NULL, NULL, NULL, 74.0, 70.0, 98.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('bff62ca0-3d57-45b7-9548-b7b7ed93f50f', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/8733/kl-rahul', 145.0, 5222.0, 136.03, 46.21, NULL, NULL, NULL, 99.0, 69.0, 99.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('a69ad58c-9d52-4aac-8c59-4d423da96236', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/7710/mitchell-starc', 51.0, NULL, NULL, NULL, 65.0, 8.61, 23.12, NULL, NULL, NULL, 55, 45.0, 62.0, 88.0, NULL, NULL, NULL),
('e9038217-b6c6-4055-8af1-bc35969ec106', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/15480/nathan-ellis', 17.0, NULL, NULL, NULL, 19.0, 8.67, 28.74, NULL, NULL, NULL, 38, 16.0, 61.0, 77.0, NULL, NULL, NULL),
('e9689d7f-bfdf-491c-8edb-2903a944a5ad', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/8182/jayant-yadav', 20.0, 40.0, NULL, NULL, 8.0, NULL, NULL, NULL, NULL, NULL, 40, NULL, NULL, NULL, 22.0, 25.0, 22.0),
('3c346c9e-57d8-4a17-867b-a612f4de4b1f', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10945/washington-sundar', 66.0, 511.0, NULL, NULL, 39.0, NULL, NULL, NULL, NULL, NULL, 63, NULL, NULL, NULL, 42.0, 40.0, 40.0),
('a2642458-bc7f-44dd-8336-a2a8c027343e', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14689/priyansh-arya', 17.0, 475.0, 179.25, 27.94, NULL, NULL, NULL, 13.0, 98.0, 70.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('53860a4b-b6d1-45b3-a9f3-8c8b0fc40df0', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12345/shivam-mavi', 32.0, NULL, NULL, NULL, 30.0, 8.71, 31.4, NULL, NULL, NULL, 46, 23.0, 60.0, 71.0, NULL, NULL, NULL),
('f9164cd3-ccfc-49ca-b98b-03cf013a1391', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/19243/tristan-stubbs', 32.0, 705.0, 163.2, 41.47, NULL, NULL, NULL, 17.0, 87.0, 99.0, 46, NULL, NULL, NULL, NULL, NULL, NULL),
('f492caef-5d1f-4a3d-8772-1a31229d0737', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/9311/jasprit-bumrah', 145.0, NULL, NULL, NULL, 183.0, 7.25, 22.03, NULL, NULL, NULL, 99, 99.0, 84.0, 91.0, NULL, NULL, NULL),
('2cbd3071-f676-49c2-9e52-16eb80b3d625', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12805/prashant-solanki', 2.0, NULL, NULL, NULL, 2.0, 6.33, 19.0, NULL, NULL, NULL, 31, 5.0, 99.0, 97.0, NULL, NULL, NULL),
('c3f736e4-fad9-40ce-aa33-50246ada0784', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14274/rasikh-dar-salam', 13.0, NULL, NULL, NULL, 10.0, 10.62, 40.9, NULL, NULL, NULL, 36, 10.0, 29.0, 51.0, NULL, NULL, NULL),
('945dfc36-e62c-4400-b8fb-0051e67f578a', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/9647/hardik-pandya', 152.0, 2749.0, NULL, NULL, 78.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 90.0, 50.0, 50.0),
('b6fd49be-30ee-4365-842a-f85a41492dfb', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 'West Indian', 0.5, false, 2, 'https://www.cricbuzz.com/profiles/8313/jason-holder', 46.0, 259.0, NULL, NULL, 53.0, NULL, NULL, NULL, NULL, NULL, 53, NULL, NULL, NULL, 32.0, 45.0, 32.0),
('1a8b582e-4408-4407-9319-17effc7063db', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/11540/jofra-archer', 52.0, NULL, NULL, NULL, 59.0, 7.89, 27.15, NULL, NULL, NULL, 56, 41.0, 74.0, 80.0, NULL, NULL, NULL),
('461b316d-264d-452d-ae74-2b870dd291e4', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9693/rahul-tewatia', 108.0, 1112.0, NULL, NULL, 32.0, NULL, NULL, NULL, NULL, NULL, 84, NULL, NULL, NULL, 64.0, 38.0, 38.0),
('e1c6d615-ffca-45b5-beaa-a37dbeb03941', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10744/rishabh-pant', 125.0, 3553.0, 147.62, 34.16, NULL, NULL, NULL, 68.0, 76.0, 85.0, 92, NULL, NULL, NULL, NULL, NULL, NULL),
('084555d4-0f7c-4f8f-ab6c-ed187d45d65f', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/1447/ajinkya-rahane', 198.0, 5032.0, 125.02, 30.5, NULL, NULL, NULL, 95.0, 61.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('180e2a4d-319a-443b-970b-0276f65e7b42', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/1431811/vipraj-nigam', 14.0, NULL, NULL, NULL, 11.0, 9.13, 32.36, NULL, NULL, NULL, 37, 10.0, 54.0, 69.0, NULL, NULL, NULL),
('c6c0c32d-cbea-49fa-b250-9113cee4f3e2', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13184/mukesh-choudhary', 16.0, NULL, NULL, NULL, 17.0, 9.94, 30.71, NULL, NULL, NULL, 38, 14.0, 40.0, 72.0, NULL, NULL, NULL),
('0c4aeaef-2636-4197-bd2d-70810d44324d', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10754/mukesh-kumar', 32.0, NULL, NULL, NULL, 36.0, 10.4, 30.61, NULL, NULL, NULL, 46, 27.0, 33.0, 73.0, NULL, NULL, NULL),
('1e631254-710f-4bfa-b2ef-052a6ef0f5a9', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/11427/anrich-nortje', 48.0, NULL, NULL, NULL, 61.0, 9.07, 27.16, NULL, NULL, NULL, 54, 43.0, 55.0, 80.0, NULL, NULL, NULL),
('5cf81932-c5de-4b88-b46b-b135ff845c88', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12096/yash-thakur', 21.0, NULL, NULL, NULL, 25.0, 10.43, 30.8, NULL, NULL, NULL, 40, 20.0, 32.0, 72.0, NULL, NULL, NULL),
('4e768388-8859-4825-a12d-4097b6270f15', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'OVERSEAS', 'West Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9406/nicholas-pooran', 90.0, 2293.0, 168.98, 34.22, NULL, NULL, NULL, 46.0, 91.0, 85.0, 75, NULL, NULL, NULL, NULL, NULL, NULL),
('fe89ed81-0bc2-4691-9ba5-21ceccde567f', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8808/axar-patel', 162.0, 1916.0, NULL, NULL, 128.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 82.0, 72.0, 72.0),
('f8ae3421-873f-4f7f-8913-c3f68e73d2a4', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12926/varun-chakaravarthy', 83.0, NULL, NULL, NULL, 100.0, 7.58, 23.85, NULL, NULL, NULL, 71, 68.0, 79.0, 87.0, NULL, NULL, NULL),
('2f1c2373-b619-451a-ab01-2167fd7d525c', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/6327/jaydev-unadkat', 112.0, NULL, NULL, NULL, 110.0, 8.88, 30.58, NULL, NULL, NULL, 86, 74.0, 58.0, 73.0, NULL, NULL, NULL),
('a5c62c28-dc52-4ce6-acec-75fe15da145d', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10692/lockie-ferguson', 49.0, NULL, NULL, NULL, 51.0, 8.97, 30.0, NULL, NULL, NULL, 54, 36.0, 56.0, 74.0, NULL, NULL, NULL),
('799c9886-e902-4393-b60c-46467ec2fb37', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/587/ravindra-jadeja', 254.0, 3260.0, NULL, NULL, 170.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 85.0, 78.0, 78.0),
('3efc4bf5-357f-48dd-9c50-6bc570585827', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14700/sameer-rizvi', 13.0, 172.0, 140.99, 24.57, NULL, NULL, NULL, 7.0, 72.0, 61.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('044fe23f-cc3e-46dd-8f8b-06186f6c86bf', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/8257/karun-nair', 84.0, 1694.0, 131.73, 23.86, NULL, NULL, NULL, 35.0, 66.0, 60.0, 72, NULL, NULL, NULL, NULL, NULL, NULL),
('a856d879-53ef-4baf-a814-1b8709cb678c', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14172/yash-dayal', 43.0, NULL, NULL, NULL, 41.0, 9.58, 33.9, NULL, NULL, NULL, 51, 30.0, 46.0, 66.0, NULL, NULL, NULL),
('11701e2d-fc0a-45ba-a823-1e36ea7ebabc', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13088/devdutt-padikkal', 74.0, 1806.0, 126.3, 25.44, NULL, NULL, NULL, 37.0, 62.0, 64.0, 67, NULL, NULL, NULL, NULL, NULL, NULL),
('c8f5d4d5-f12d-43ae-9e00-e2b7f32d1e4b', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14336/kuldeep-sen', 12.0, NULL, NULL, NULL, 14.0, 9.63, 27.64, NULL, NULL, NULL, 36, 12.0, 45.0, 79.0, NULL, NULL, NULL),
('e7ae7cd7-33a8-45bf-802a-4c1ad5dfb1c5', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13070/ryan-rickelton', 14.0, 388.0, 150.98, 29.85, NULL, NULL, NULL, 11.0, 79.0, 74.0, 37, NULL, NULL, NULL, NULL, NULL, NULL),
('1710540d-8233-4d94-9363-2abda63e0db4', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/6349/david-miller', 141.0, 3077.0, 138.61, 35.78, NULL, NULL, NULL, 60.0, 70.0, 89.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('39d015ee-3475-4672-ab1e-0464b1550a50', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14565/marco-jansen', 35.0, 141.0, NULL, NULL, 36.0, NULL, NULL, NULL, NULL, NULL, 47, NULL, NULL, NULL, 26.0, 36.0, 26.0),
('0909d19b-908a-4504-abc8-bc6d29476760', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/265/ms-dhoni', 278.0, 5439.0, 137.46, 38.3, NULL, NULL, NULL, 99.0, 70.0, 95.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('de396123-658d-4169-9c30-3d840afe5122', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/51791/vaibhav-suryavanshi', 7.0, 252.0, 206.56, 36.0, NULL, NULL, NULL, 9.0, 99.0, 89.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('3dab8424-4a57-4282-a5d8-00708ecb84dd', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14606/shahbaz-ahmed', 58.0, 545.0, NULL, NULL, 22.0, NULL, NULL, NULL, NULL, NULL, 59, NULL, NULL, NULL, 43.0, 27.0, 27.0),
('71bc2ddd-c22b-4aee-bd6f-29af006700f7', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9441/kyle-jamieson', 13.0, NULL, NULL, NULL, 14.0, 9.67, 29.71, NULL, NULL, NULL, 36, 12.0, 45.0, 74.0, NULL, NULL, NULL),
('e345b90b-b855-4534-9243-f4497f8da622', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/12087/rahul-chahar', 79.0, NULL, NULL, NULL, 75.0, 7.72, 28.67, NULL, NULL, NULL, 69, 52.0, 76.0, 77.0, NULL, NULL, NULL),
('2b6b0344-5398-4733-b369-c8bcbf0f500b', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 'South African', 1, false, 0, 'https://www.cricbuzz.com/profiles/8520/quinton-de-kock', 115.0, 3309.0, 134.03, 30.64, NULL, NULL, NULL, 64.0, 67.0, 76.0, 87, NULL, NULL, NULL, NULL, NULL, NULL),
('4f02d93b-a228-41d1-8969-77d2f3090660', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9428/shreyas-iyer', 132.0, 3731.0, 133.35, 34.23, NULL, NULL, NULL, 72.0, 67.0, 85.0, 96, NULL, NULL, NULL, NULL, NULL, NULL),
('99b3fa8c-aaee-43db-a202-1f51be0fcf0e', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/46926/eshan-malinga', 7.0, NULL, NULL, NULL, 13.0, 8.93, 18.31, NULL, NULL, NULL, 33, 12.0, 57.0, 99.0, NULL, NULL, NULL),
('5bd467e8-584d-40d1-88a5-e933e63da7b4', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9746/shreyas-gopal', 52.0, NULL, NULL, NULL, 52.0, 8.16, 25.92, NULL, NULL, NULL, 56, 37.0, 69.0, 83.0, NULL, NULL, NULL),
('62622de1-2e6a-477d-98a8-2cb85e924e97', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12337/ramandeep-singh', 30.0, 217.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 46.0, 35.0, 35.0),
('4143a246-0aff-46cf-b66d-92aaefdd7908', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/18509/nuwan-thushara', 8.0, NULL, NULL, NULL, 9.0, 9.43, 31.44, NULL, NULL, NULL, 34, 9.0, 49.0, 71.0, NULL, NULL, NULL),
('c47258dd-02bf-4e49-8aed-5efad95361be', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 'Indian', 2, true, 4, 'https://www.cricbuzz.com/profiles/11311/krunal-pandya', 142.0, 1748.0, NULL, NULL, 93.0, NULL, NULL, NULL, NULL, NULL, 99, NULL, NULL, NULL, 77.0, 60.0, 60.0),
('23c4f675-f298-4d22-89c7-5f30ea4a0c50', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10926/wanindu-hasaranga', 37.0, 81.0, NULL, NULL, 46.0, NULL, NULL, NULL, NULL, NULL, 48, NULL, NULL, NULL, 15.0, 45.0, 15.0),
('b48dccd5-e62b-4fb0-a4a4-ca76fab9c3c7', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/10276/ishan-kishan', 119.0, 2998.0, 137.65, 29.11, NULL, NULL, NULL, 58.0, 70.0, 72.0, 89, NULL, NULL, NULL, NULL, NULL, NULL),
('53c8a28b-8f22-4466-9888-c91bf6f279e3', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 'New Zealander', 2, false, 4, 'https://www.cricbuzz.com/profiles/8117/trent-boult', 119.0, NULL, NULL, NULL, 143.0, 8.38, 26.2, NULL, NULL, NULL, 89, 96.0, 66.0, 82.0, NULL, NULL, NULL),
('62ebfe18-8218-4b57-adf2-e1404c2b7b52', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13907/ayush-badoni', 56.0, 963.0, NULL, NULL, 4.0, NULL, NULL, NULL, NULL, NULL, 58, NULL, NULL, NULL, 63.0, 37.0, 37.0),
('6eaaf494-0966-45ea-ba8c-ab1037348c67', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/12305/riyan-parag', 83.0, 1566.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 71, NULL, NULL, NULL, 78.0, 16.0, 16.0),
('42365864-bc69-4f91-9fa1-2b474d4195c6', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11445/rovman-powell', 28.0, 365.0, 146.59, 18.25, NULL, NULL, NULL, 11.0, 76.0, 46.0, 44, NULL, NULL, NULL, NULL, NULL, NULL),
('7f86073d-dd71-40d2-9c64-72cbc53c2c93', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 'Indian', 1, false, 2, 'https://www.cricbuzz.com/profiles/8292/kuldeep-yadav', 98.0, NULL, NULL, NULL, 102.0, 8.04, 26.95, NULL, NULL, NULL, 79, 69.0, 71.0, 80.0, NULL, NULL, NULL),
('f2b19117-714b-46c7-8d14-b24f31d541bf', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13476/urvil-patel', 3.0, 68.0, 212.5, 22.67, NULL, NULL, NULL, 5.0, 99.0, 57.0, 31, NULL, NULL, NULL, NULL, NULL, NULL),
('f1e707f0-32bd-455d-bde9-aaf09812317c', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 'New Zealander', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10100/mitchell-santner', 31.0, 110.0, NULL, NULL, 25.0, NULL, NULL, NULL, NULL, NULL, 45, NULL, NULL, NULL, 25.0, 40.0, 25.0),
('d2497bf4-4b2d-4c28-b510-5a4398c77427', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 'Indian', 2, false, 4, 'https://www.cricbuzz.com/profiles/7909/mohammed-shami', 119.0, NULL, NULL, NULL, 133.0, 8.63, 28.18, NULL, NULL, NULL, 89, 89.0, 62.0, 78.0, NULL, NULL, NULL),
('12207ebe-4155-4ac0-9a20-8b186924e5cf', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/11813/ruturaj-gaikwad', 71.0, 2502.0, 137.48, 40.35, NULL, NULL, NULL, 49.0, 70.0, 99.0, 65, NULL, NULL, NULL, NULL, NULL, NULL),
('3130e78e-f9a4-4415-8cd3-a3f27fcde589', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/12344/anukul-roy', 11.0, 26.0, NULL, NULL, 6.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 17.0, 29.0, 17.0),
('493889a9-f940-4f1a-9c78-1219b7558317', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10214/jitesh-sharma', 55.0, 991.0, 157.06, 25.41, NULL, NULL, NULL, 22.0, 83.0, 63.0, 57, NULL, NULL, NULL, NULL, NULL, NULL),
('d97a437f-2e5d-4bf4-8624-0bd82f0b1b1b', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 'Afghan', 2, false, 8, 'https://www.cricbuzz.com/profiles/10738/rashid-khan', 136.0, 585.0, NULL, NULL, 158.0, NULL, NULL, NULL, NULL, NULL, 98, NULL, NULL, NULL, 51.0, 82.0, 51.0),
('81ecbfec-ff2a-475b-bf37-c3a84c66f487', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 'English', 1, false, 0, 'https://www.cricbuzz.com/profiles/10479/philip-salt', 34.0, 1056.0, 175.71, 34.06, NULL, NULL, NULL, 23.0, 95.0, 84.0, 47, NULL, NULL, NULL, NULL, NULL, NULL),
('2fdcc338-9297-4954-b298-a3ea38877ff9', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/11307/tushar-deshpande', 46.0, NULL, NULL, NULL, 51.0, 9.84, 31.04, NULL, NULL, NULL, 53, 36.0, 42.0, 72.0, NULL, NULL, NULL),
('5de838fe-78d0-4c9d-bcf6-b78ec347f91c', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'Australian', 1, false, 0, 'https://www.cricbuzz.com/profiles/6250/mitchell-marsh', 55.0, 1292.0, NULL, NULL, 37.0, NULL, NULL, NULL, NULL, NULL, 57, NULL, NULL, NULL, 72.0, 43.0, 43.0),
('f309686d-0f2c-48df-9955-4a9a257fe781', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 'Indian', 1, false, 6, 'https://www.cricbuzz.com/profiles/8683/shardul-thakur', 105.0, 325.0, NULL, NULL, 107.0, NULL, NULL, NULL, NULL, NULL, 82, NULL, NULL, NULL, 38.0, 59.0, 38.0),
('3ff04e80-2d8e-4312-b180-09f3866e978e', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 'Afghan', 1, false, 0, 'https://www.cricbuzz.com/profiles/15452/noor-ahmad', 37.0, NULL, NULL, NULL, 48.0, 8.08, 22.23, NULL, NULL, NULL, 48, 34.0, 71.0, 90.0, NULL, NULL, NULL),
('c335b74a-ea0e-4c89-af19-3969049a3e1b', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 'Indian', 2, false, 8, 'https://www.cricbuzz.com/profiles/1726/bhuvneshwar-kumar', 190.0, NULL, NULL, NULL, 198.0, 7.69, 27.33, NULL, NULL, NULL, 99, 99.0, 77.0, 80.0, NULL, NULL, NULL),
('4ad3ae51-f25e-4c25-9400-e04f59172733', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10238/swapnil-singh', 14.0, 51.0, NULL, NULL, 7.0, NULL, NULL, NULL, NULL, NULL, 37, NULL, NULL, NULL, 23.0, 27.0, 23.0),
('add87ee8-2409-4fbe-b869-38250269281a', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/7836/deepak-chahar', 95.0, NULL, NULL, NULL, 88.0, 8.14, 29.51, NULL, NULL, NULL, 77, 60.0, 70.0, 75.0, NULL, NULL, NULL),
('c95a3466-9877-40aa-8383-2d336b201073', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/14598/anshul-kamboj', 11.0, 16.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 35, NULL, NULL, NULL, 21.0, 30.0, 21.0),
('88c86f7f-b9d0-43bd-8a1a-84a0be1a03cf', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9781/avesh-khan', 75.0, NULL, NULL, NULL, 87.0, 9.12, 28.29, NULL, NULL, NULL, 67, 60.0, 54.0, 77.0, NULL, NULL, NULL),
('3bf02aeb-f8df-4727-aaac-8587548ea9df', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13135/anuj-rawat', 24.0, 318.0, 119.11, 19.88, NULL, NULL, NULL, 10.0, 57.0, 50.0, 42, NULL, NULL, NULL, NULL, NULL, NULL),
('3ccbd2b5-4fea-4fb7-92d8-a25b88fda15d', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 'Australian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/9456/matthew-short', 6.0, 117.0, 127.18, 19.5, NULL, NULL, NULL, 6.0, 63.0, 49.0, 33, NULL, NULL, NULL, NULL, NULL, NULL),
('1ed5ea50-897b-4fc7-8146-55441a218f7b', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'OVERSEAS', 'West Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/13646/romario-shepherd', 18.0, 185.0, NULL, NULL, 10.0, NULL, NULL, NULL, NULL, NULL, 39, NULL, NULL, NULL, 52.0, 18.0, 18.0),
('f85983c5-210b-4a5c-93cc-5ae7a488b2ae', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/36139/naman-dhir', 23.0, 392.0, 180.65, 28.0, NULL, NULL, NULL, 11.0, 99.0, 70.0, 41, NULL, NULL, NULL, NULL, NULL, NULL),
('72870a87-82a6-4411-bdf7-76d44e608c98', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 'South African', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/20538/dewald-brevis', 16.0, 455.0, 153.2, 28.44, NULL, NULL, NULL, 12.0, 80.0, 71.0, 38, NULL, NULL, NULL, NULL, NULL, NULL),
('71553661-9f7a-4b08-b47c-eba2341fcb2e', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/13940/yashasvi-jaiswal', 66.0, 2166.0, 152.86, 34.38, NULL, NULL, NULL, 43.0, 80.0, 85.0, 63, NULL, NULL, NULL, NULL, NULL, NULL),
('4ea7d067-e64c-4ba7-8b3a-550b653518fa', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 'Indian', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/19328/shubham-dubey', 13.0, 139.0, 163.53, 23.17, NULL, NULL, NULL, 6.0, 87.0, 58.0, 36, NULL, NULL, NULL, NULL, NULL, NULL),
('7c41020a-adb6-4928-acc3-779037c76d60', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/7915/suryakumar-yadav', 166.0, 4311.0, 148.66, 35.05, NULL, NULL, NULL, 82.0, 77.0, 87.0, 99, NULL, NULL, NULL, NULL, NULL, NULL),
('f0956430-733a-44e5-80cb-3526bd7d8046', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 'English', 1, false, 2, 'https://www.cricbuzz.com/profiles/10420/sam-curran', 64.0, 997.0, NULL, NULL, 59.0, NULL, NULL, NULL, NULL, NULL, 62, NULL, NULL, NULL, 62.0, 41.0, 41.0),
('b1ec4082-20d0-48d3-b59f-dc00fbdef77c', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 'Indian', 2, false, 6, 'https://www.cricbuzz.com/profiles/8175/harshal-patel', 119.0, NULL, NULL, NULL, 151.0, 8.86, 23.7, NULL, NULL, NULL, 89, 99.0, 58.0, 87.0, NULL, NULL, NULL),
('2ebc4d19-5426-4487-8545-497385a6dfa7', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 'Indian', 1, false, 0, 'https://www.cricbuzz.com/profiles/9012/rahul-tripathi', 100.0, 2291.0, 137.85, 26.03, NULL, NULL, NULL, 46.0, 70.0, 65.0, 80, NULL, NULL, NULL, NULL, NULL, NULL),
('af203082-691f-4439-9515-9dd2f5d6c23e', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 'Sri Lankan', 0.5, false, 0, 'https://www.cricbuzz.com/profiles/10940/kamindu-mendis', 5.0, 92.0, NULL, NULL, 2.0, NULL, NULL, NULL, NULL, NULL, 32, NULL, NULL, NULL, 38.0, 29.0, 29.0),
('ed2f3877-7074-4283-aa26-1dc64cb52757', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 'Indian', 2, false, 2, 'https://www.cricbuzz.com/profiles/8271/sanju-samson', 176.0, 4704.0, 139.05, 30.75, NULL, NULL, NULL, 89.0, 71.0, 76.0, 99, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('bc45e4f6-b571-4971-a88f-045821881f88', 'c13c8357-76cb-462f-9a83-2e8898549230', 'UNSOLD'),
('e4cf3e9d-5e78-47be-8c99-07846c3fd84f', '2b253220-ea2f-4d4b-8cc1-1549926240fe', 'UNSOLD'),
('f10a42a4-8df1-41b7-9820-acea164d248f', 'be7637d1-5d7c-47dd-a236-60d200ca853b', 'UNSOLD'),
('0bfeedbb-043b-4bab-9cde-ec1c03afb4ae', '85dfd91d-d453-4faf-8fd9-7aae6547d0e9', 'UNSOLD'),
('b273ac1f-2f8b-4008-b695-ed9c25f75254', '1fcec2b1-dbf5-4db7-9698-a11fac41bf16', 'UNSOLD'),
('9df53d55-3bc1-45ce-8e6c-12b75e547624', 'a76258ab-a417-4ea9-850c-a92fde2d6844', 'UNSOLD'),
('702c6522-3aa1-4fa6-a61e-e9fe6311b9e3', 'c949d347-c22b-4298-8ef5-f79ed6d82791', 'UNSOLD'),
('0cab5984-c400-4512-9440-429f0969c81e', '7355317f-54f4-415a-84be-6ca926c26181', 'UNSOLD'),
('ee76ec39-3a72-4198-ad05-090ef4cd1249', '85ff6b35-4600-4fbd-a7fa-aeee880e2ad0', 'UNSOLD'),
('685d1326-54c8-4708-9827-11452a7b9963', '5bb4b594-8d47-45a4-9a6e-6531e9f576de', 'UNSOLD'),
('96eac928-a849-4928-af47-5fe5a3e3d5df', '0ca0ead4-ae70-4d8e-b384-a056327e7ccc', 'UNSOLD'),
('c8f5d47d-e371-4c05-a83a-e9cdb3493443', 'b728d159-f815-48de-8b3d-907138c5207c', 'UNSOLD'),
('d8986b9a-4493-4f6e-b2f8-3e49aca10dcf', 'a796da43-d1fb-4df5-b06a-3970c0a2512d', 'UNSOLD'),
('12ea3a84-3586-4ec1-852e-2a5fcea3bd4e', '77feb4ea-6c52-47a1-9e06-c4deb62dd2b4', 'UNSOLD'),
('f7c77298-e99d-41f5-9180-f5ea4232c49d', 'd9699ac3-558c-4017-aace-a1755eab071c', 'UNSOLD'),
('ada4c85f-682a-4f16-8366-19e6820784de', '7381c88f-2e62-4184-a45e-554a4c882ae1', 'UNSOLD'),
('8f31746c-d548-47da-ba75-ad059da65608', 'eb8b3a07-171c-4ee4-8b9a-80d30e21fe69', 'UNSOLD'),
('8f284243-99fb-4ffb-a67b-093c2bbdbf86', '0b9664d4-985c-46a6-8d47-a044ee8717c0', 'UNSOLD'),
('6bc28eab-814c-465a-a7ed-e5e9f3dfd234', '8ec4b8eb-a883-4f94-a2fb-0e187cc6aa3a', 'UNSOLD'),
('5b1d4f29-4772-487d-9f2c-2e3ee3c8a82a', '6332ebb4-6f2d-4e26-96db-e2d536aaf688', 'UNSOLD'),
('0ab7678e-b67f-40b3-887d-acdd3e7f1c84', '1b68c2eb-48aa-4d74-abdc-4230bc708ad1', 'UNSOLD'),
('1dad733b-962b-401a-addb-d565627247cd', 'bd68587a-5424-46dd-8575-c4eb1945ec20', 'UNSOLD'),
('385f97e9-963d-4519-a747-aa7f1127e22c', '21111803-7ee1-4b3e-967a-9aed9b72623f', 'UNSOLD'),
('85d176c5-a692-4226-bef9-e8f7aee4e95c', '74799df6-c19e-4d29-8378-19a7fefd8736', 'UNSOLD'),
('8f007a27-a5a3-4935-ab98-77819d26fbb3', '54ea46f4-f56b-4734-a656-089db804989c', 'UNSOLD'),
('0e0054aa-963c-4007-8468-e072751fe445', 'bde35eee-f687-4d0f-a3f5-777e53adf3fa', 'UNSOLD'),
('e1cf5254-3dae-43c3-aad8-07fd7d8fa6e8', 'a117b846-54dd-47bd-b5ec-0482931010fb', 'UNSOLD'),
('39635ac8-3b73-410f-9e6d-840c7baa1088', 'ce991a36-0038-4cd2-b937-9c0756091c1f', 'UNSOLD'),
('b81bb1e0-cad8-4050-a3d0-2823a2a2626f', 'f2d3ca7a-46f2-410e-9939-47d92455f0bd', 'UNSOLD'),
('b8185290-90a1-4b2c-9d31-416c415394ff', '3d88967b-bf97-4ba8-b30f-f24e1a40af57', 'UNSOLD'),
('dad008ee-2bad-418f-a808-b5ef8426905c', '03a52a05-bc8f-43f5-b65e-5b478d16c35e', 'UNSOLD'),
('e5b0e21f-2de0-4082-9d1b-f2681ec4db0c', '6657dff0-45ae-4e29-b81f-11986b33daa0', 'UNSOLD'),
('629d7d2f-6d2b-4ebe-8b69-a57b0c405ff0', '98b7de2f-82c6-4cd6-bd74-52debd0c83ce', 'UNSOLD'),
('c0d5b42f-ec70-4427-a74a-285c996eb684', '77828c28-53a9-4583-a103-9ae8f91175c5', 'UNSOLD'),
('28ca6c92-09dc-4f1e-a17c-40d310916a18', 'e40258fe-8978-4d7c-abbf-ac1027a90f16', 'UNSOLD'),
('e8c3c729-66ba-46b2-9735-43c5c876d0f1', 'c3533f93-0d81-4416-98fc-51bfe00d6caf', 'UNSOLD'),
('7651aa57-3e6b-4e16-a86d-5d6b49099e80', 'f5c3934e-8969-4d8e-837b-d18c4a503fad', 'UNSOLD'),
('ce682c5c-9125-41d8-9bf0-80a1d0996005', '2d892a7b-6040-41ee-b34f-1b8722acaea0', 'UNSOLD'),
('d6b95234-c46f-4a94-ac1e-3223e199fe5f', 'c1e8bd1d-ded9-430e-b33b-969c58e9bf97', 'UNSOLD'),
('763e25e9-97e5-40f4-b8d9-cbb2a58174d0', '27bc9b07-2ab4-490d-99c9-44b44f768c0b', 'UNSOLD'),
('18efbd91-b08d-492c-82e0-d7c9075ddc3f', '0366ba03-3c41-4f43-b65a-281e97ba50cc', 'UNSOLD'),
('095b8346-01fd-4804-acb3-564fee69e3a6', 'e4d18b9d-6d9c-4dbf-926d-3d4fdf7a36c9', 'UNSOLD'),
('b70e44ff-2df3-469e-8b24-a59bdef7593d', '805c3710-42f4-491d-9d8f-5bba0a41b6fe', 'UNSOLD'),
('4afbdef3-48ea-4190-b80b-3c04e678b6d3', '14b1c736-bb61-4d59-9815-ea9212245eac', 'UNSOLD'),
('f3580693-c802-405f-a5a8-5a0695cf79e3', 'abca32b2-5915-4636-b500-abea06773b01', 'UNSOLD'),
('5b5ca2b2-d1c0-4254-aa93-7da8092e2360', '7753ab21-e704-4629-bd4b-c28e6cdcc300', 'UNSOLD'),
('fe2bbfb4-98aa-44ee-9812-1b2a4c9ab436', 'e5acab42-1e7d-4068-9fcd-b700b0dc4759', 'UNSOLD'),
('897fe2da-9433-4ab2-b06d-39fd753849bb', '88ebdd1c-4976-4c37-8441-dc2482cd0560', 'UNSOLD'),
('e2a7affc-4c4b-4a9d-8ff6-b59d333ef776', '1c89c118-3d66-442b-9d42-700bb65567ac', 'UNSOLD'),
('814c0879-f86e-4cc4-8964-7c6c0d118db4', '403840db-2d1e-470e-8e5c-8a223cdefbdf', 'UNSOLD'),
('de25b8cc-3258-4276-bacd-c60dddf5438a', 'dcdfaec0-21d4-4788-93db-e1069a77cc35', 'UNSOLD'),
('7f9f761d-fd40-40e2-b587-bbb8a9fbdf79', 'cd41de88-5350-4960-bd75-8f9daf2f10e2', 'UNSOLD'),
('884a1893-dfe4-499c-9ca6-268713b4d196', '8cbbd43c-91f8-4b7d-9aaf-52f163a60534', 'UNSOLD'),
('00af5da8-269f-4e5a-8f0e-437a50d7afcf', '237eeb18-3a83-465e-8ce3-fbdd8881dfd7', 'UNSOLD'),
('ef721a0d-e8d8-43e5-a9a9-62f18130d74d', '58391404-1d99-45d8-82bf-7c8599c3540c', 'UNSOLD'),
('0da99bbf-22d6-405b-ad1b-0f260a210c3c', '526774ac-562c-4d52-aeeb-03c2173896b6', 'UNSOLD'),
('52b264f0-8309-4e59-af67-148ff51685e3', '1673031d-3b1e-4196-9a16-0124c92cb1d3', 'UNSOLD'),
('4c341028-31d7-4ae3-bd5f-26f69af48c34', '37710bb2-df48-4e48-8a75-4bd4d621958f', 'UNSOLD'),
('56dc7cb3-2554-4cb9-aeb2-26728bdc1248', '9f59a508-1410-47fb-ab62-72e99f86c5a3', 'UNSOLD'),
('ac5bf396-7a87-4c40-99dd-f5efae7a4fa4', 'd85fdf10-22c2-437d-85f3-f1c0c627a325', 'UNSOLD'),
('dfbc51e1-87ba-4b36-9057-4107f23e1dc4', 'd7b499f7-d218-495b-a07b-c2cc93fc2956', 'UNSOLD'),
('e2097efd-e147-4a4e-9b38-a21cd5389582', '319082e1-a235-4d4d-831d-6adfdf5f41f6', 'UNSOLD'),
('b5975ce1-0f4e-447b-82e9-3f3565e0bf29', '86e817c6-5a6e-4aa9-adf5-4c9512f97354', 'UNSOLD'),
('3a8c5b67-809b-42e0-8d5c-6227b08eddad', '087ea23f-f5eb-4309-8a40-be8f0db561d0', 'UNSOLD'),
('7bc9f588-2e49-4158-97cf-e20a4a61b5a0', 'b0f48848-b20c-4f93-9e80-cf9d1b4002dc', 'UNSOLD'),
('6aacf382-7a2f-4287-a956-70d462e29457', '992640b1-7cf1-42ae-9173-e6c59aa71e30', 'UNSOLD'),
('6459f6c6-72ea-4f32-b713-186b4de80981', 'ea97a245-23e9-4e1f-b6f4-373ab2089dff', 'UNSOLD'),
('e3c8a7a1-8128-418c-8c9d-bdb699c37064', 'af62bc56-ba57-48b4-b852-ca9c4cf54601', 'UNSOLD'),
('a1355ab2-37a6-4e48-aa22-1ad3704b6070', 'dfe43183-a4ca-4f32-b3b8-4e052df29790', 'UNSOLD'),
('e9184379-c095-44c6-8881-cfde5edb7c55', '1e171074-ffe2-41d9-a9bd-daee6a246480', 'UNSOLD'),
('0e9f9a61-9e58-4c6a-a7b8-fafd31cb778a', 'a32f95fe-b666-48ab-a9e7-ef37f3fc7d26', 'UNSOLD'),
('c59c8e07-1f3b-4df8-b362-87aa89618e30', 'bb7ff3d3-2429-43f8-89dd-fc9e0c51cc5b', 'UNSOLD'),
('7b2b193e-8279-49a0-9e41-abf370ca766c', '70dab8a8-603b-428e-95b1-02c2a23399d2', 'UNSOLD'),
('964844e8-ce6b-4146-bd83-f2b6c260840f', 'd8169796-c848-40aa-bcb9-9e3d904d0597', 'UNSOLD'),
('e803563b-0da0-42b2-801e-cc8017d3f6e3', 'bff62ca0-3d57-45b7-9548-b7b7ed93f50f', 'UNSOLD'),
('898f07a8-3f9d-4839-bef2-d8576b597abf', 'a69ad58c-9d52-4aac-8c59-4d423da96236', 'UNSOLD'),
('f22f2e8c-5c80-477c-b771-5ef31e50580d', 'e9038217-b6c6-4055-8af1-bc35969ec106', 'UNSOLD'),
('774d8346-ec04-431d-8c21-e8a9c9d6465e', 'e9689d7f-bfdf-491c-8edb-2903a944a5ad', 'UNSOLD'),
('af76d2e6-7b3d-456f-b80a-426ad0c02658', '3c346c9e-57d8-4a17-867b-a612f4de4b1f', 'UNSOLD'),
('119961c1-10f0-4f86-9dd3-f20b55c6b11a', 'a2642458-bc7f-44dd-8336-a2a8c027343e', 'UNSOLD'),
('ce84b0be-2359-45d3-82ff-fbc0f899873e', '53860a4b-b6d1-45b3-a9f3-8c8b0fc40df0', 'UNSOLD'),
('e1f2e1c7-620e-4221-a475-6e6bf89e9e4e', 'f9164cd3-ccfc-49ca-b98b-03cf013a1391', 'UNSOLD'),
('0777e7ef-7682-40dc-bde6-df756809791d', 'f492caef-5d1f-4a3d-8772-1a31229d0737', 'UNSOLD'),
('59ba3b67-df5b-4284-8b8e-6719959b5f36', '2cbd3071-f676-49c2-9e52-16eb80b3d625', 'UNSOLD'),
('998d9dd1-d08b-48d4-9aa8-f2caef1209ce', 'c3f736e4-fad9-40ce-aa33-50246ada0784', 'UNSOLD'),
('65d27e88-a956-4315-863d-4501095f4394', '945dfc36-e62c-4400-b8fb-0051e67f578a', 'UNSOLD'),
('b784d100-b78f-43b7-b34e-02b73086732a', 'b6fd49be-30ee-4365-842a-f85a41492dfb', 'UNSOLD'),
('81c977be-fc2c-47fb-bf52-a28d256eaa59', '1a8b582e-4408-4407-9319-17effc7063db', 'UNSOLD'),
('7f04e52e-f7eb-42ba-9d60-e5a25b144f22', '461b316d-264d-452d-ae74-2b870dd291e4', 'UNSOLD'),
('aaa310d0-782e-4d7f-b3d2-1ea470a9c70c', 'e1c6d615-ffca-45b5-beaa-a37dbeb03941', 'UNSOLD'),
('d9b785d5-ff0a-41d8-9129-8bc051b89690', '084555d4-0f7c-4f8f-ab6c-ed187d45d65f', 'UNSOLD'),
('cf742a57-f3e3-4f17-a686-690f80e41c36', '180e2a4d-319a-443b-970b-0276f65e7b42', 'UNSOLD'),
('2d8c97db-9171-4780-b9ff-b23a6d01cacf', 'c6c0c32d-cbea-49fa-b250-9113cee4f3e2', 'UNSOLD'),
('f04a2e5e-10ec-4321-b516-a7341e2f955f', '0c4aeaef-2636-4197-bd2d-70810d44324d', 'UNSOLD'),
('f467ffc7-079d-424f-a3c4-8885b950713f', '1e631254-710f-4bfa-b2ef-052a6ef0f5a9', 'UNSOLD'),
('85a81a6e-48fd-4813-96b6-d777eed37e47', '5cf81932-c5de-4b88-b46b-b135ff845c88', 'UNSOLD'),
('eb92ae04-4e78-4658-8562-d9897c8ac478', '4e768388-8859-4825-a12d-4097b6270f15', 'UNSOLD'),
('3b3a3e1c-2666-49f0-9c58-e8b0795cb224', 'fe89ed81-0bc2-4691-9ba5-21ceccde567f', 'UNSOLD'),
('a85d5bb5-d11a-4ed5-a4b7-4bae02c81fcc', 'f8ae3421-873f-4f7f-8913-c3f68e73d2a4', 'UNSOLD'),
('8bdc811e-de9d-4583-b7c9-9036cef48b29', '2f1c2373-b619-451a-ab01-2167fd7d525c', 'UNSOLD'),
('b1798717-99e0-407f-9c7d-7e111e5d72a2', 'a5c62c28-dc52-4ce6-acec-75fe15da145d', 'UNSOLD'),
('6fc20639-d73d-49d6-8d75-026d8c9036c4', '799c9886-e902-4393-b60c-46467ec2fb37', 'UNSOLD'),
('2c70a377-de29-4754-b653-02ef75cb2a44', '3efc4bf5-357f-48dd-9c50-6bc570585827', 'UNSOLD'),
('8a98b19b-f4b3-44d9-9726-5b8a698dc57f', '044fe23f-cc3e-46dd-8f8b-06186f6c86bf', 'UNSOLD'),
('b85738b4-4a75-4257-9c41-75187f31e9ef', 'a856d879-53ef-4baf-a814-1b8709cb678c', 'UNSOLD'),
('d826af25-a618-439d-b852-a2c562648ac9', '11701e2d-fc0a-45ba-a823-1e36ea7ebabc', 'UNSOLD'),
('ef2f60d0-2157-4ea2-b130-b8a5822d27c9', 'c8f5d4d5-f12d-43ae-9e00-e2b7f32d1e4b', 'UNSOLD'),
('aaef7658-624d-4dfb-829a-dc4919e274d8', 'e7ae7cd7-33a8-45bf-802a-4c1ad5dfb1c5', 'UNSOLD'),
('b427c65a-738d-4d6d-9235-966bae8ca200', '1710540d-8233-4d94-9363-2abda63e0db4', 'UNSOLD'),
('ae989c32-2687-49ce-af64-6d8f443af10f', '39d015ee-3475-4672-ab1e-0464b1550a50', 'UNSOLD'),
('4f8138b5-7082-41c1-98d9-9754adb83042', '0909d19b-908a-4504-abc8-bc6d29476760', 'UNSOLD'),
('a50978a6-a9d5-4522-8594-5c3719ee7c08', 'de396123-658d-4169-9c30-3d840afe5122', 'UNSOLD'),
('99667bc2-812a-4fee-89d1-7096ebbe25db', '3dab8424-4a57-4282-a5d8-00708ecb84dd', 'UNSOLD'),
('13cac80d-fc3e-4128-a384-c2a1e3da2e42', '71bc2ddd-c22b-4aee-bd6f-29af006700f7', 'UNSOLD'),
('ca029f8c-f6a7-43ad-b82a-3e037f0ce3d2', 'e345b90b-b855-4534-9243-f4497f8da622', 'UNSOLD'),
('99bb2bed-6669-4107-ba29-560b7ceca04a', '2b6b0344-5398-4733-b369-c8bcbf0f500b', 'UNSOLD'),
('65ea353b-aba7-4ed9-ba11-2e9afd7f17a1', '4f02d93b-a228-41d1-8969-77d2f3090660', 'UNSOLD'),
('49023e46-930b-4256-8405-3184ebe0bb86', '99b3fa8c-aaee-43db-a202-1f51be0fcf0e', 'UNSOLD'),
('c4cde83f-1eeb-4cee-9f50-2d4a24ebf1a0', '5bd467e8-584d-40d1-88a5-e933e63da7b4', 'UNSOLD'),
('d6adc74a-382f-47cd-b163-03079ebf49c8', '62622de1-2e6a-477d-98a8-2cb85e924e97', 'UNSOLD'),
('0b5f8f49-dea2-4c08-9fb0-ee0a26b0e779', '4143a246-0aff-46cf-b66d-92aaefdd7908', 'UNSOLD'),
('7554fe7b-d46d-4078-a5ee-4ff5a8800e93', 'c47258dd-02bf-4e49-8aed-5efad95361be', 'UNSOLD'),
('80225c90-ed57-40d5-854c-0f51f2ef1520', '23c4f675-f298-4d22-89c7-5f30ea4a0c50', 'UNSOLD'),
('1288931f-fa01-4692-b6a4-215940ed48c2', 'b48dccd5-e62b-4fb0-a4a4-ca76fab9c3c7', 'UNSOLD'),
('f6051573-0718-4347-b446-054c18f6e8d0', '53c8a28b-8f22-4466-9888-c91bf6f279e3', 'UNSOLD'),
('573e6aa2-dc79-4128-b07b-a95e910fd0f4', '62ebfe18-8218-4b57-adf2-e1404c2b7b52', 'UNSOLD'),
('37b0f534-a3cf-4835-8a78-661e9c273a08', '6eaaf494-0966-45ea-ba8c-ab1037348c67', 'UNSOLD'),
('24f074d3-e351-42b9-ae52-69dd5631a49f', '42365864-bc69-4f91-9fa1-2b474d4195c6', 'UNSOLD'),
('9cc08b8b-6779-4e36-a562-507b16a1af60', '7f86073d-dd71-40d2-9c64-72cbc53c2c93', 'UNSOLD'),
('0e31cc76-03cd-4392-b7db-23897993483f', 'f2b19117-714b-46c7-8d14-b24f31d541bf', 'UNSOLD'),
('8e4331dd-ba9f-4c06-9d3a-ba8dedeed4d5', 'f1e707f0-32bd-455d-bde9-aaf09812317c', 'UNSOLD'),
('4f5d70c4-8ede-4068-96b7-77e43e4761a9', 'd2497bf4-4b2d-4c28-b510-5a4398c77427', 'UNSOLD'),
('6c14ba3f-696e-41c1-a0d1-c8c9692f2359', '12207ebe-4155-4ac0-9a20-8b186924e5cf', 'UNSOLD'),
('e844133d-04bc-44a0-8edc-2743b0cd50fb', '3130e78e-f9a4-4415-8cd3-a3f27fcde589', 'UNSOLD'),
('2698f298-4187-4972-90c0-12076ebe92f7', '493889a9-f940-4f1a-9c78-1219b7558317', 'UNSOLD'),
('18e9f0d2-11d2-4119-a2a4-b375cf6c4168', 'd97a437f-2e5d-4bf4-8624-0bd82f0b1b1b', 'UNSOLD'),
('ad41d3a4-6bac-407f-9209-44bbd8b441bb', '81ecbfec-ff2a-475b-bf37-c3a84c66f487', 'UNSOLD'),
('5c7b6724-ad76-4f96-822c-9a10f53b6d36', '2fdcc338-9297-4954-b298-a3ea38877ff9', 'UNSOLD'),
('f9b59b35-666d-43e5-9b24-affdfec72d4d', '5de838fe-78d0-4c9d-bcf6-b78ec347f91c', 'UNSOLD'),
('2e21145a-18e2-48db-9def-a6a0cf179e20', 'f309686d-0f2c-48df-9955-4a9a257fe781', 'UNSOLD'),
('c68f8702-eccd-499c-87d5-51fbfabae72b', '3ff04e80-2d8e-4312-b180-09f3866e978e', 'UNSOLD'),
('6321b9ec-512c-477d-812f-7ec5d8689340', 'c335b74a-ea0e-4c89-af19-3969049a3e1b', 'UNSOLD'),
('bad82034-72ae-44eb-b469-9977c02a94c1', '4ad3ae51-f25e-4c25-9400-e04f59172733', 'UNSOLD'),
('1b35c805-c16c-4e47-9d2c-bef9bbbda4db', 'add87ee8-2409-4fbe-b869-38250269281a', 'UNSOLD'),
('e742137f-a6df-4b34-918b-af4296179ec9', 'c95a3466-9877-40aa-8383-2d336b201073', 'UNSOLD'),
('7e34f01c-52f8-4912-a056-a6c6fa2242ff', '88c86f7f-b9d0-43bd-8a1a-84a0be1a03cf', 'UNSOLD'),
('840e2506-bdeb-4201-97d9-056349c5b06b', '3bf02aeb-f8df-4727-aaac-8587548ea9df', 'UNSOLD'),
('a98a7655-5254-425b-8167-9a38d8118582', '3ccbd2b5-4fea-4fb7-92d8-a25b88fda15d', 'UNSOLD'),
('2419eaee-fdf7-4061-ab36-508d9916757b', '1ed5ea50-897b-4fc7-8146-55441a218f7b', 'UNSOLD'),
('96f366be-a69e-4c1a-9dfe-bcb91546dbf9', 'f85983c5-210b-4a5c-93cc-5ae7a488b2ae', 'UNSOLD'),
('53b2b922-c738-4ed0-83ee-323c664f6935', '72870a87-82a6-4411-bdf7-76d44e608c98', 'UNSOLD'),
('bddf4f29-3296-4ba9-9ef4-d89c8f93e3f5', '71553661-9f7a-4b08-b47c-eba2341fcb2e', 'UNSOLD'),
('e8887632-879a-4c6b-89d4-7ff63923849b', '4ea7d067-e64c-4ba7-8b3a-550b653518fa', 'UNSOLD'),
('387014f6-030d-4811-a3f8-265b4e98eb0f', '7c41020a-adb6-4928-acc3-779037c76d60', 'UNSOLD'),
('22d5c20e-0c62-4545-90a7-7496d4ceb317', 'f0956430-733a-44e5-80cb-3526bd7d8046', 'UNSOLD'),
('86dfa685-a757-4e61-9e94-35302bfb28de', 'b1ec4082-20d0-48d3-b59f-dc00fbdef77c', 'UNSOLD'),
('8893e877-d3a9-4651-b5bb-a63dc9087d0c', '2ebc4d19-5426-4487-8545-497385a6dfa7', 'UNSOLD'),
('76670caa-69d8-4074-991e-11961dca4ae1', 'af203082-691f-4439-9515-9dd2f5d6c23e', 'UNSOLD'),
('b9afc609-0e8e-4dbc-aad5-01366db2386f', 'ed2f3877-7074-4283-aa26-1dc64cb52757', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('a77c1245-1626-47d4-9938-363b9d9cde24', 'admin', '$2b$10$FRWoKTlAVYQkQsBPPNyVB.DJNZ/9TOZEKkvVnrjO0joq2xw9U6YEi', 'ADMIN'),
('5671604a-fc7d-4269-b585-5b5854982b35', 'screen', '$2b$10$97zuuXLzYKUYp9BKwPCv2eh7vZRj4SKjN7R2x/HXIEdzsSkoSJ4XS', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence 1', 'PLAYER', '[{"rank":6,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":1,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":159,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":15,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

