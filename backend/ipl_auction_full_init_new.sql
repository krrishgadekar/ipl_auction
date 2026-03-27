-- CreateEnum
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


-- â”€â”€ DATA INITIALIZATION â”€â”€

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
('b6d2af2f-7460-4afd-9987-eea8e04f2148', 'Team Alpha', 'alpha', '$2b$10$85v0yf/TL/NqaHLciw2xDeUaigkevWG6Eej7drSOkIJRH52/78FgK', 120, 0),
('9dd0f869-c819-48be-b9a7-66ac0e12dc70', 'Team Bravo', 'bravo', '$2b$10$zg2bvqb7TmMlDB3KEjIK3.FjVGK8Fee12/2U9C8xUyrfWCLa6JyVu', 120, 0),
('1c50753a-ee92-4983-961f-e27cc608cb4f', 'Team Charlie', 'charlie', '$2b$10$sIlrfDlOjtV6bPpqir7TLOEDU96VxYoOq/lW2uglc8dGNRhz5BV4i', 120, 0),
('4af78cef-2ebe-4bd4-adc7-16b07dc61dd4', 'Team Delta', 'delta', '$2b$10$ulDXxlfG0v4IKnvz2HN0nOF/LPv7sTnrQvnV3ndXkiWu7GQUD2QpG', 120, 0),
('b111b05e-1f2b-4473-8407-8f736d3e95d5', 'Team Echo', 'echo', '$2b$10$y9JhpaD1BoG0NCCzL5S5oeoBK/WNh80klFW2iVjnal2awyYxXHKk2', 120, 0),
('77c5955d-d241-4703-8776-66fada4cf0fd', 'Team Foxtrot', 'foxtrot', '$2b$10$JaaULlfq.gJigen8jriy4OPiq6PzGXOTfr1vmS8vTYNdnF1EXf/iy', 120, 0),
('808a375a-a5e6-43cb-9428-14868dd03286', 'Team Golf', 'golf', '$2b$10$iMU/hBKhYwOmopopxLoRj.Zi1BV1gg8dAx0FCQk7P8MJKoVJrU/SG', 120, 0),
('e998b3dd-5351-48e4-afa7-645b66d45ace', 'Team Hotel', 'hotel', '$2b$10$KlFrCeT6bwtq9E4WzYofn.rYWd6QYxFw5zTnCUN7HzuhwPogpjexC', 120, 0),
('5e739e4a-253a-492c-ac44-66f7411d471f', 'Team India', 'india', '$2b$10$xLxQYiWH41dbqcvzqeP0XOzErMwKVEqTXdWIRUMAru1Hnpw/7Im8C', 120, 0),
('48d48316-f184-4920-ba13-a08e1097b23d', 'Team Juliet', 'juliet', '$2b$10$/.B7Um/ODyoOwYGtTuO0Su5s5FbcFzfsm05kRF//V.p5xQRvwfYAe', 120, 0);

INSERT INTO "Player" (id, rank, name, team, role, category, pool, grade, rating, nationality, nationality_raw, base_price, is_riddle, riddle_title, riddle_question) VALUES
('f30dd00e-1395-4759-831a-4812a99a3c8c', 1, 'Virat Kohli', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'A', 99, 'INDIAN', 2, false),
('5214e58d-88c0-4c9b-986a-30ae9b195a1d', 2, 'Yuzvendra Chahal', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 2, false),
('5bf613fe-bd79-44d7-ab3f-29169c1906ec', 3, 'Jasprit Bumrah', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 99, 'INDIAN', 2, false),
('f54b8fc7-bad2-403d-b893-a1e188bbad62', 4, 'Sunil Narine', 'Kolkata Knight Riders', 'Bowling Allrounder', 'AR', 'AR', 'A', 98, 'INDIAN', 2, false),
('26061e9c-5dbd-4b79-84bf-35f0674c4c8f', 5, 'Bhuvneshwar Kumar', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'A', 98, 'INDIAN', 2, false),
('46473697-6d0b-461c-9f87-2848e7ae155c', 6, 'Rohit Sharma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 96, 'INDIAN', 2, false),
('695a16e4-3a5e-4916-80e5-38309ba041d9', 7, 'Ravindra Jadeja', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'A', 95, 'INDIAN', 2, false),
('843ecdd4-1b51-4c5f-84bd-bd76e205f662', 8, 'MS Dhoni', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 2, false),
('036568f8-9845-4c90-ae87-c1d7c09faeea', 9, 'KL Rahul', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 95, 'INDIAN', 2, false),
('98649f51-999c-427e-94e7-3ba61a6bca3c', 10, 'Harshal Patel', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'A', 94, 'INDIAN', 2, false),
('1525621f-5539-4c40-8342-6df71e1e667f', 11, 'Sandeep Sharma', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'A', 93, 'INDIAN', 2, false),
('23073ce0-493e-470a-82ea-e6ff29586797', 12, 'Trent Boult', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'A', 92, 'OVERSEAS', 2, false),
('91c1a922-6f2d-4656-8629-4d8502154852', 13, 'Axar Patel', 'Delhi Capitals', 'Bowling Allrounder', 'AR', 'AR', 'A', 91, 'INDIAN', 2, false),
('a8a36ba1-f1ce-4a11-a02f-6e4374f417f0', 14, 'Ajinkya Rahane', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'A', 91, 'INDIAN', 2, false),
('489f0741-9b20-4268-81e2-d7d11d2ca6ca', 15, 'Sanju Samson', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 89, 'INDIAN', 2, false),
('e40db3d1-ea52-412b-a10d-746f0cf958b4', 16, 'Suryakumar Yadav', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'A', 89, 'INDIAN', 2, false),
('64345277-6332-4c79-a00d-d645cc88fdbf', 17, 'Mohammed Shami', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'A', 89, 'INDIAN', 2, false),
('abb0e5dd-689c-479f-8c2f-239cee809e47', 18, 'Rashid Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'A', 89, 'OVERSEAS', 2, false),
('7decd9bf-61af-4d78-83b4-90659dd0ec6d', 19, 'Hardik Pandya', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'A', 89, 'INDIAN', 2, false),
('3a9268e9-1f0c-4b99-99d2-5f8641c7cfd9', 20, 'Jos Buttler', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'A', 88, 'OVERSEAS', 2, true),
('5c22e487-e9f4-4228-921a-6e425488a6ed', 21, 'Krunal Pandya', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'A', 86, 'INDIAN', 2, true),
('48377b53-c0c4-4cec-bf8c-b7ba37cd8090', 22, 'Kagiso Rabada', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'A', 85, 'OVERSEAS', 2, false),
('ea929022-0767-457d-90ab-5de2029aa075', 23, 'Shubman Gill', 'Gujarat Titans', 'Batsman', 'BAT', 'BAT_WK', 'B', 84, 'INDIAN', 1, false),
('0e1c1b8a-88fc-42c0-9c17-e9dbfb0d7c16', 24, 'Varun Chakaravarthy', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 84, 'INDIAN', 1, false),
('ef9e295d-3f5d-4cc0-be04-4bea8949c2ad', 25, 'Marcus Stoinis', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 83, 'OVERSEAS', 1, false),
('47933a35-bc27-47f2-b5cb-c16052ba4e02', 26, 'Jaydev Unadkat', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 1, false),
('1e8d668d-9f6c-406f-b0a9-a194120686a1', 27, 'Shreyas Iyer', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 83, 'INDIAN', 1, false),
('c678bc06-f606-47d0-a781-f2c09b6bdfe4', 28, 'Kuldeep Yadav', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 1, false),
('62a8d38b-7ed5-4030-af68-33052d7ef6df', 29, 'Mohammed Siraj', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 83, 'INDIAN', 1, false),
('b9567748-f92e-4a13-9d4d-bb32ab5962f4', 30, 'Rishabh Pant', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 82, 'INDIAN', 1, false),
('8c480d49-222e-4620-af79-7aaf4090c511', 31, 'Manish Pandey', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 82, 'INDIAN', 1, false),
('f6fc0da5-ec6b-434b-81b7-01596fef5996', 32, 'David Miller', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 80, 'OVERSEAS', 1, false),
('4530c806-bc19-49c4-aaeb-e19ec2a2948d', 33, 'Ishant Sharma', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 79, 'INDIAN', 1, false),
('da735c9d-cd2c-4d57-b83f-3cea3e7ad88f', 34, 'Quinton de Kock', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 79, 'OVERSEAS', 1, false),
('c240c457-461a-46b5-b503-0774e0796674', 35, 'Deepak Chahar', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 1, false),
('cbc06a7f-ec5a-4aa0-bd89-29c087cce0e7', 36, 'Arshdeep Singh', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 78, 'INDIAN', 1, false),
('997d80e5-5450-4ccb-84da-503cc0b70637', 37, 'Ishan Kishan', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 1, false),
('2f6d67ca-2446-4e1b-b99a-6df8de0b0a99', 38, 'Shardul Thakur', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'B', 78, 'INDIAN', 1, false),
('e0d73b39-5770-4513-be31-3f47bd1af7db', 39, 'Nicholas Pooran', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 78, 'INDIAN', 1, false),
('82272910-ff22-4a7a-901c-6309bea495f9', 40, 'Rahul Chahar', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 1, false),
('e7f4f272-002b-46b4-97e4-9b5a18e39854', 41, 'Nitish Rana', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 1, false),
('2e3b1b93-639b-4bf7-8cb9-30b248518290', 42, 'Ruturaj Gaikwad', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'B', 77, 'INDIAN', 1, false),
('f13477ad-9977-46e5-bdb7-b5ace6e683e3', 43, 'Abhishek Sharma', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 77, 'INDIAN', 1, false),
('179124c1-a5e7-45d1-b690-df747c913374', 44, 'Khaleel Ahmed', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 77, 'INDIAN', 1, false),
('02988de8-b84d-44a9-b045-1848d4d17dc8', 45, 'Shivam Dube', 'Chennai Super Kings', 'Batting Allrounder', 'AR', 'AR', 'B', 76, 'INDIAN', 1, false),
('41e1df4a-20fe-478f-adb7-649827186c81', 46, 'Avesh Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 76, 'INDIAN', 1, false),
('77f73f60-7165-4618-a396-029986d7ab62', 47, 'Yashasvi Jaiswal', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 75, 'INDIAN', 1, false),
('d6149790-e190-4805-aa06-41c047edfe87', 48, 'Pat Cummins', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'OVERSEAS', 1, false),
('946a6af2-ce1f-4d01-9ccf-e090c3d35948', 49, 'Ravi Bishnoi', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 75, 'INDIAN', 1, false),
('90758f66-c771-4747-b324-b42c56f920b7', 50, 'Mitchell Marsh', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 1, false),
('63da2387-ce6b-4a78-a535-b83e52ce48ba', 51, 'Sam Curran', 'Rajasthan Royals', 'Bowling Allrounder', 'AR', 'AR', 'B', 74, 'OVERSEAS', 1, false),
('ca9c7b9d-2bc3-4db1-b73d-6e94b881259b', 52, 'Rahul Tripathi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'B', 74, 'INDIAN', 1, false),
('bc914e5a-b394-4638-af5a-3afe9731105b', 53, 'Prasidh Krishna', 'Gujarat Titans', 'Bowler', 'BOWL', 'BOWL', 'B', 74, 'INDIAN', 1, false),
('3b9ec1f8-fd1a-4944-891b-6265e2524fde', 54, 'Heinrich Klaasen', 'Sunrisers Hyderabad', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 74, 'OVERSEAS', 1, false),
('f469f71c-6737-4d8e-899c-01d8f939e19a', 55, 'Mitchell Starc', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 1, false),
('261e5216-e812-4e43-8266-2c3869b3339f', 56, 'Josh Hazlewood', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 1, false),
('37aeaea5-9995-4cb7-8776-f92e50761314', 57, 'Jofra Archer', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'B', 73, 'OVERSEAS', 1, false),
('71119f74-6659-4121-9c70-5b90cc1d58ec', 58, 'Riyan Parag', 'Rajasthan Royals', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 1, false),
('ccd514a8-1d44-4224-aea3-10299f0fcc51', 59, 'Rahul Tewatia', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'B', 73, 'INDIAN', 1, false),
('4351de5b-46df-47f4-a8e4-ab799062e453', 60, 'Noor Ahmad', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'OVERSEAS', 1, false),
('cb25448f-c42c-496e-82e4-06ec3f48c042', 61, 'Travis Head', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'OVERSEAS', 1, false),
('3ac07617-061e-469f-96d0-cb66b8b787ed', 62, 'Shimron Hetmyer', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 1, false),
('d3187fca-4972-4a13-82eb-b9f59db833de', 63, 'T Natarajan', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 1, false),
('af3bb46a-c17f-414b-800f-06ef4cc62866', 64, 'Shreyas Gopal', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'B', 72, 'INDIAN', 1, false),
('255c1da1-006f-4a15-8789-96e50147c469', 65, 'Tilak Varma', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'B', 72, 'INDIAN', 1, false),
('c42763a7-1d4e-4032-87d6-24488fc8dea6', 66, 'Philip Salt', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 71, 'OVERSEAS', 1, false),
('1c486bf8-3fb2-40bd-ba1f-3393d157b106', 67, 'Ayush Badoni', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'B', 71, 'INDIAN', 1, false),
('43e12404-d514-413b-bf5b-e76ea2d1e74d', 68, 'Anrich Nortje', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'B', 71, 'OVERSEAS', 1, false),
('cccb21bc-8297-44fc-b4a0-9985e2f5c1f6', 69, 'Liam Livingstone', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'OVERSEAS', 1, false),
('c39ce27f-5d28-45fe-b1ad-5ed8c9502029', 70, 'Venkatesh Iyer', 'Royal Challengers Bengaluru', 'Batting Allrounder', 'AR', 'AR', 'B', 70, 'INDIAN', 1, false),
('0bbe3a5b-5111-4253-b917-9429f43f75b3', 71, 'Matheesha Pathirana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'B', 70, 'OVERSEAS', 1, false),
('590e3287-cba2-42a9-a1b2-cd656eb4bc28', 72, 'Aiden Markram', 'Lucknow Super Giants', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 1, false),
('32fcf2ce-a492-4303-9156-bffd3634576a', 73, 'Tim David', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'OVERSEAS', 1, false),
('732e30b2-92e7-47d9-8ea1-cc3e8e671219', 74, 'Devdutt Padikkal', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 1, false),
('ee4125bb-d920-451f-8067-c93938d39651', 75, 'Karun Nair', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'B', 70, 'INDIAN', 1, false),
('2e68b252-627d-4133-a640-8c3808f21454', 76, 'Tristan Stubbs', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'B', 70, 'OVERSEAS', 1, false),
('2266d8fb-ccf1-418b-9547-5a182578e6e8', 77, 'Rinku Singh', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 0.5, false),
('a18e6344-eeb3-483a-9301-ade8ab282ab0', 78, 'Rajat Patidar', 'Royal Challengers Bengaluru', 'Batsman', 'BAT', 'BAT_WK', 'C', 69, 'INDIAN', 0.5, false),
('8c4b5085-72b5-4fcb-bfa8-6341ac4a87e3', 79, 'Prabhsimran Singh', 'Punjab Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 69, 'INDIAN', 0.5, false),
('770fbe27-e93d-4771-83e9-7ad1f6372b95', 80, 'Lockie Ferguson', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 69, 'OVERSEAS', 0.5, false),
('ec272fb2-7727-42d5-81c7-7b62838eef23', 81, 'Harpreet Brar', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 68, 'INDIAN', 0.5, false),
('79b28c23-1d4b-4449-bb29-ad2464d86c04', 82, 'Jitesh Sharma', 'Royal Challengers Bengaluru', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 68, 'INDIAN', 0.5, false),
('aa2388e6-8b08-4379-93ce-96f5e825d666', 83, 'Jason Holder', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 68, 'INDIAN', 0.5, false),
('a4f5069f-8353-49c9-81bf-5c0987609667', 84, 'Cameron Green', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 68, 'OVERSEAS', 0.5, false),
('e601c314-11c6-4635-b060-501283f74dac', 85, 'Mohsin Khan', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 0.5, false),
('e369a965-6254-4327-ae85-8a371a7abda9', 86, 'Mayank Markande', 'Mumbai Indians', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 0.5, false),
('ff720cc3-8756-4b5e-8417-e218d26726a9', 87, 'Tushar Deshpande', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 0.5, false),
('c1d404ab-bf03-482c-8d3b-7c0d8471789c', 88, 'Harshit Rana', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 67, 'INDIAN', 0.5, false),
('9548196f-0a2a-41e4-ba6d-1d0ac5b2514a', 89, 'Dhruv Jurel', 'Rajasthan Royals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 67, 'INDIAN', 0.5, false),
('7d1ad432-e0e3-4eff-b786-ed10585192a8', 90, 'Naman Dhir', 'Mumbai Indians', 'Batsman', 'BAT', 'BAT_WK', 'C', 67, 'INDIAN', 0.5, false),
('bbbbeefa-a82b-4055-8b52-b5d6c26f656b', 91, 'Shahrukh Khan', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 0.5, false),
('8b348599-945e-4b2e-bec4-4afba294b66e', 92, 'Shashank Singh', 'Punjab Kings', 'Batting Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 0.5, false),
('97c53018-4675-4372-9e9d-db449fbe16a2', 93, 'Washington Sundar', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 67, 'INDIAN', 0.5, false),
('fe3f5703-5249-4717-b44a-0b41ad089300', 94, 'Will Jacks', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'OVERSEAS', 0.5, false),
('0cbd5123-0b8a-470a-8e01-dcae5d9843b1', 95, 'Nehal Wadhera', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 66, 'INDIAN', 0.5, false),
('09e36982-48b6-472b-bbcf-f3fe84077ee4', 96, 'Vaibhav Arora', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 0.5, false),
('b2c7c20a-ef67-4803-bafb-5456267340cb', 97, 'Ramandeep Singh', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 66, 'INDIAN', 0.5, false),
('12c25eca-8f24-447e-9aff-67434e47fb62', 98, 'Shivam Mavi', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 0.5, false),
('df9c2c1a-ee6d-492e-b0e6-6a74b77e5ff3', 99, 'Yash Dayal', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 66, 'INDIAN', 0.5, false),
('a0e851b5-827b-46e5-a408-604457b8da6b', 100, 'Abishek Porel', 'Delhi Capitals', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 66, 'INDIAN', 0.5, false),
('93899c66-c490-4bdd-b3e6-51dcafed64bb', 101, 'Umran Malik', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 65, 'INDIAN', 0.5, false),
('a61bda72-80bf-42e3-aaa4-0f87c8f280ea', 102, 'Angkrish Raghuvanshi', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 65, 'INDIAN', 0.5, false),
('f99b6bba-81f6-4490-b7ab-7ae4379c02f7', 103, 'Priyansh Arya', 'Punjab Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 0.5, false),
('c52f325e-9834-4634-9d85-ab0cd631bc96', 104, 'Lungi Ngidi', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'OVERSEAS', 0.5, false),
('45592fb5-90e0-4c8d-951f-a9809dded4e0', 105, 'Mukesh Kumar', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 64, 'INDIAN', 0.5, false),
('581bbf97-2966-4fa7-a5bb-b93bc1e97228', 106, 'Sarfaraz Khan', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 64, 'INDIAN', 0.5, false),
('16276d61-9dd9-47b4-97c1-9dfafc5567e4', 107, 'Shahbaz Ahmed', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 64, 'INDIAN', 0.5, false),
('ff376f38-dc17-42de-b3ca-693058f7c9b4', 108, 'Rovman Powell', 'Kolkata Knight Riders', 'Batsman', 'BAT', 'BAT_WK', 'C', 63, 'INDIAN', 0.5, false),
('16b06be5-ecfb-429a-bd8d-20f47f5b27de', 109, 'Abdul Samad', 'Lucknow Super Giants', 'Batting Allrounder', 'AR', 'AR', 'C', 63, 'INDIAN', 0.5, false),
('23daf201-1830-4c5e-92e2-fb640624bf02', 110, 'Josh Inglis', 'Lucknow Super Giants', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 63, 'OVERSEAS', 0.5, false),
('73c23104-20ed-4f66-ac31-a1a16c555a92', 111, 'Ryan Rickelton', 'Mumbai Indians', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 62, 'OVERSEAS', 0.5, false),
('5a545e9f-2f2a-4444-a9c1-3d37ffcfff6e', 112, 'Nitish Kumar Reddy', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 0.5, false),
('4463ced8-2140-4322-95e3-89bf3cdfb32b', 113, 'Marco Jansen', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 0.5, false),
('b84acf7b-4fa1-4b82-9996-55ee6442dbe8', 114, 'Mitchell Santner', 'Mumbai Indians', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 0.5, false),
('9881b8b1-671e-4c3e-93ed-974787b7771c', 115, 'Rachin Ravindra', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 0.5, false),
('63bedcb5-0a6d-42bc-bc5b-0fff587ce636', 116, 'Sherfane Rutherford', 'Mumbai Indians', 'Batting Allrounder', 'AR', 'AR', 'C', 62, 'INDIAN', 0.5, false),
('ddddb3da-c299-4d26-b05c-a71b22115f0c', 117, 'Dewald Brevis', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'OVERSEAS', 0.5, false),
('6fb8f4a0-d05e-4775-a6df-4cb66427c4b1', 118, 'Aniket Verma', 'Sunrisers Hyderabad', 'Batsman', 'BAT', 'BAT_WK', 'C', 62, 'INDIAN', 0.5, false),
('bb93985a-d608-4cd7-8cf4-0ccb1aba2fd6', 119, 'Wanindu Hasaranga', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 62, 'OVERSEAS', 0.5, false),
('989e858e-27f8-42d6-b712-ba6df570800e', 120, 'Ravisrinivasan Sai Kishore', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 0.5, false),
('68efbb10-0ce2-4655-b384-c9ebe078e391', 121, 'Suyash Sharma', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 0.5, false),
('5d79def3-23ed-45e5-b3f1-801392f9fc72', 122, 'Ashutosh Sharma', 'Delhi Capitals', 'Batting Allrounder', 'AR', 'AR', 'C', 61, 'INDIAN', 0.5, false),
('a3a4a04f-baff-448c-aaba-869417361da3', 123, 'Ayush Mhatre', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 0.5, false),
('a36e7f35-fa93-47d9-8877-82d855e99aa8', 124, 'Shubham Dubey', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 0.5, false),
('f18b4ba8-0df9-4e45-9bd0-2a647558e732', 125, 'Vaibhav Suryavanshi', 'Rajasthan Royals', 'Batsman', 'BAT', 'BAT_WK', 'C', 61, 'INDIAN', 0.5, false),
('1e60eaeb-569e-4187-a1ab-5d2ef91c9ee7', 126, 'Nathan Ellis', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'OVERSEAS', 0.5, false),
('5fc125dc-7468-4cf1-bbbc-a63886da2e3e', 127, 'Digvesh Singh Rathi', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 0.5, false),
('214e6c07-0e11-4660-b0e0-20fd4194b97d', 128, 'Yash Thakur', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 61, 'INDIAN', 0.5, false),
('cc5ab914-f139-4e35-872a-cf2404826130', 129, 'Anuj Rawat', 'Gujarat Titans', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 60, 'INDIAN', 0.5, false),
('fc2f5cb2-d9ef-43f3-a2c5-f6a4d2ce2e5a', 130, 'Sameer Rizvi', 'Delhi Capitals', 'Batsman', 'BAT', 'BAT_WK', 'C', 60, 'INDIAN', 0.5, false),
('7a855d13-4a6d-493e-8447-3e57d3dddc09', 131, 'Romario Shepherd', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 60, 'INDIAN', 0.5, false),
('f821377d-d6d3-422e-bdc3-f6bfdc5d4192', 132, 'Kuldeep Sen', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 0.5, false),
('416b9e78-d03c-419d-9d73-1f3a26dc8541', 133, 'Kyle Jamieson', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'OVERSEAS', 0.5, false),
('33d24e49-bf04-408d-8f24-e0098cf84ef1', 134, 'Vipraj Nigam', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 59, 'INDIAN', 0.5, false),
('f0ddefa6-a8d6-4b20-9266-b609117a931f', 135, 'Kartik Tyagi', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 0.5, false),
('5114c648-af6c-4903-8a2d-48fe51943069', 136, 'Arshad Khan', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 0.5, false),
('f58eb98e-2567-4677-a825-d4b3ac2c9f3b', 137, 'Jayant Yadav', 'Gujarat Titans', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'INDIAN', 0.5, false),
('e5db284c-966d-4c90-b395-49062a5ffaa2', 138, 'Azmatullah Omarzai', 'Punjab Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 58, 'OVERSEAS', 0.5, false),
('939309c3-3772-42c2-b0ab-db26d096133c', 139, 'Nandre Burger', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'OVERSEAS', 0.5, false),
('86401cbb-a2c3-4257-9902-3848d0a834fb', 140, 'Mukesh Choudhary', 'Chennai Super Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 0.5, false),
('8588cdb6-b951-4433-a9d4-d84af71d2126', 141, 'Eshan Malinga', 'Sunrisers Hyderabad', 'Bowler', 'BOWL', 'BOWL', 'C', 58, 'INDIAN', 0.5, false),
('b0e10647-c614-47e1-8a97-211255d1f28a', 142, 'Kamindu Mendis', 'Sunrisers Hyderabad', 'Batting Allrounder', 'AR', 'AR', 'C', 57, 'OVERSEAS', 0.5, false),
('a0c2e8ea-27f5-4318-8cff-c626b7206fdf', 143, 'Prashant Solanki', 'Kolkata Knight Riders', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 0.5, false),
('9b6867bb-004e-47fb-8b53-22e83679df02', 144, 'Vijaykumar Vyshak', 'Punjab Kings', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 0.5, false),
('49b9c7ca-153f-4991-9252-639ecac31eb1', 145, 'Akash Maharaj Singh', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 0.5, false),
('d92c974c-30cc-421a-8d66-6c85b4e3ccb8', 146, 'Anshul Kamboj', 'Chennai Super Kings', 'Bowling Allrounder', 'AR', 'AR', 'C', 57, 'INDIAN', 0.5, false),
('025e7c29-7817-4909-935d-2095f1db3399', 147, 'Mayank Yadav', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 0.5, false),
('18840d7e-7c71-4c62-9911-52864d11b8cf', 148, 'Vignesh Puthur', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 57, 'INDIAN', 0.5, false),
('d3daeafd-ba1f-413a-86ad-062e706c23fd', 149, 'Glenn Phillips', 'Gujarat Titans', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'OVERSEAS', 0.5, false),
('ceca944a-1efb-4cdf-886b-c429e7623f06', 150, 'Adam Milne', 'Rajasthan Royals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 0.5, false),
('cc9d3e41-5802-4a5f-a856-9d8e846f63df', 151, 'Dushmantha Chameera', 'Delhi Capitals', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 0.5, false),
('45108b1e-e79f-473f-9698-9563dc861b20', 152, 'Anukul Roy', 'Kolkata Knight Riders', 'Batting Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 0.5, false),
('f354c9ec-5b90-4946-9da1-7c3d50c3ed41', 153, 'Urvil Patel', 'Chennai Super Kings', 'WK-Batsman', 'WK', 'BAT_WK', 'C', 56, 'INDIAN', 0.5, false),
('d916536c-19bc-4795-9695-dd48f570666f', 154, 'Nuwan Thushara', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 56, 'OVERSEAS', 0.5, false),
('7def13c9-b7a6-4927-b578-029876c38c27', 155, 'Swapnil Singh', 'Royal Challengers Bengaluru', 'Bowling Allrounder', 'AR', 'AR', 'C', 56, 'INDIAN', 0.5, false),
('d140443f-d1a6-43cb-b2f0-1b2692f6e3d4', 156, 'Matthew Short', 'Chennai Super Kings', 'Batsman', 'BAT', 'BAT_WK', 'C', 55, 'OVERSEAS', 0.5, false),
('35241d07-b24c-4ffa-83cd-43e0ab06092e', 157, 'Manimaran Siddharth', 'Lucknow Super Giants', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 0.5, false),
('0c03481a-c29a-4901-934d-e6b5ab9033ac', 158, 'Arjun Tendulkar', 'Lucknow Super Giants', 'Bowling Allrounder', 'AR', 'AR', 'C', 55, 'INDIAN', 0.5, false),
('26c7f818-affc-4388-a321-e688356fec7a', 159, 'Rasikh Dar Salam', 'Royal Challengers Bengaluru', 'Bowler', 'BOWL', 'BOWL', 'C', 55, 'INDIAN', 0.5, false);

INSERT INTO "AuctionPlayer" (id, player_id, status) VALUES
('943b9d4d-d0a8-42a8-a8b2-7679d2302099', 'f30dd00e-1395-4759-831a-4812a99a3c8c', 'UNSOLD'),
('1a63c694-6808-41bc-b34c-67d95bc9c95b', '5214e58d-88c0-4c9b-986a-30ae9b195a1d', 'UNSOLD'),
('8afa35a2-3947-4546-a4a5-e96f41900d7a', '5bf613fe-bd79-44d7-ab3f-29169c1906ec', 'UNSOLD'),
('094b6f44-d497-4445-a5c4-10e65385c1fe', 'f54b8fc7-bad2-403d-b893-a1e188bbad62', 'UNSOLD'),
('88179aa3-376d-4e75-8e01-423cd636ef6d', '26061e9c-5dbd-4b79-84bf-35f0674c4c8f', 'UNSOLD'),
('3bb8a8e6-2b90-4eb4-8ef8-021b86a94ca2', '46473697-6d0b-461c-9f87-2848e7ae155c', 'UNSOLD'),
('76e95882-044a-4113-beb1-55d9c0a6b65c', '695a16e4-3a5e-4916-80e5-38309ba041d9', 'UNSOLD'),
('bfcc56b2-57a8-4cd5-84d1-4a2763b0af9b', '843ecdd4-1b51-4c5f-84bd-bd76e205f662', 'UNSOLD'),
('49607258-6b70-43e3-b6fd-2bdb5a0f7469', '036568f8-9845-4c90-ae87-c1d7c09faeea', 'UNSOLD'),
('a1735efe-1a07-4159-9188-0d0ec3dc6826', '98649f51-999c-427e-94e7-3ba61a6bca3c', 'UNSOLD'),
('8e806483-22af-47b3-aa76-d9f09ea660fd', '1525621f-5539-4c40-8342-6df71e1e667f', 'UNSOLD'),
('1812a097-bd7d-493e-a643-e724de8c1f39', '23073ce0-493e-470a-82ea-e6ff29586797', 'UNSOLD'),
('64ed6602-00d9-4df6-a3bf-3a15d211e0c7', '91c1a922-6f2d-4656-8629-4d8502154852', 'UNSOLD'),
('9ccb02a7-567c-4b78-9e09-03150f08fe7f', 'a8a36ba1-f1ce-4a11-a02f-6e4374f417f0', 'UNSOLD'),
('aa4ede9d-34bb-4d22-8453-7acecc3c60b2', '489f0741-9b20-4268-81e2-d7d11d2ca6ca', 'UNSOLD'),
('3e8adbf4-d50d-4ee5-b789-7e4040c47e30', 'e40db3d1-ea52-412b-a10d-746f0cf958b4', 'UNSOLD'),
('0a602a48-04bb-400d-af7b-60a5d3cb1eae', '64345277-6332-4c79-a00d-d645cc88fdbf', 'UNSOLD'),
('80029b95-a2a5-4fe7-a7ba-ec723c29b08b', 'abb0e5dd-689c-479f-8c2f-239cee809e47', 'UNSOLD'),
('0f0aff44-c873-4846-a859-4a788b19d18f', '7decd9bf-61af-4d78-83b4-90659dd0ec6d', 'UNSOLD'),
('f1a7518f-8a6c-4be9-ba8d-d514ad3420fa', '3a9268e9-1f0c-4b99-99d2-5f8641c7cfd9', 'UNSOLD'),
('d2cd5249-1e09-4d25-8130-4f912d5ddb92', '5c22e487-e9f4-4228-921a-6e425488a6ed', 'UNSOLD'),
('fe36ae70-df79-49ea-be7c-474dee6d576d', '48377b53-c0c4-4cec-bf8c-b7ba37cd8090', 'UNSOLD'),
('b4bd1b67-a75b-43c4-8b46-a402251e1475', 'ea929022-0767-457d-90ab-5de2029aa075', 'UNSOLD'),
('543e918a-f8f7-4993-abad-0d05a2722a70', '0e1c1b8a-88fc-42c0-9c17-e9dbfb0d7c16', 'UNSOLD'),
('49fc3cf6-5995-4350-b48f-a63bcc189bc7', 'ef9e295d-3f5d-4cc0-be04-4bea8949c2ad', 'UNSOLD'),
('f7f85639-d07f-4c34-9d56-e77eceac6a92', '47933a35-bc27-47f2-b5cb-c16052ba4e02', 'UNSOLD'),
('50a16eed-b83c-4448-b710-4a2c057f6053', '1e8d668d-9f6c-406f-b0a9-a194120686a1', 'UNSOLD'),
('8aaa2232-896d-4cde-980f-4cdcd9fa6182', 'c678bc06-f606-47d0-a781-f2c09b6bdfe4', 'UNSOLD'),
('10740bf2-f2a1-47e8-9d6e-d0642d0c320a', '62a8d38b-7ed5-4030-af68-33052d7ef6df', 'UNSOLD'),
('ed3de626-95e1-4439-9d31-ff7ed0e0bf59', 'b9567748-f92e-4a13-9d4d-bb32ab5962f4', 'UNSOLD'),
('fdb85bb6-ac73-4a22-bdc9-e718c01db4cf', '8c480d49-222e-4620-af79-7aaf4090c511', 'UNSOLD'),
('bb99d8bf-cbff-4788-9d07-a656c5a86289', 'f6fc0da5-ec6b-434b-81b7-01596fef5996', 'UNSOLD'),
('860a6037-6249-4e1a-9ae0-73672e0c8ea1', '4530c806-bc19-49c4-aaeb-e19ec2a2948d', 'UNSOLD'),
('ed77df09-e5d9-46e9-9810-b5eeba2152ed', 'da735c9d-cd2c-4d57-b83f-3cea3e7ad88f', 'UNSOLD'),
('c567381d-5707-4e07-bfb2-f4acc821ec8c', 'c240c457-461a-46b5-b503-0774e0796674', 'UNSOLD'),
('1cc54641-4c3a-448e-be2e-95bc15dabad9', 'cbc06a7f-ec5a-4aa0-bd89-29c087cce0e7', 'UNSOLD'),
('09eaa1c8-78ba-4246-873e-02c421057ba2', '997d80e5-5450-4ccb-84da-503cc0b70637', 'UNSOLD'),
('e6c0892c-ff1c-49e1-a034-db19f87a0fbf', '2f6d67ca-2446-4e1b-b99a-6df8de0b0a99', 'UNSOLD'),
('6479987e-2a54-4d4a-a976-af8d84049e0b', 'e0d73b39-5770-4513-be31-3f47bd1af7db', 'UNSOLD'),
('ffababb3-7e79-434a-92da-19a3e07529d5', '82272910-ff22-4a7a-901c-6309bea495f9', 'UNSOLD'),
('722d5abd-c20e-4290-876d-60bbc3335b1a', 'e7f4f272-002b-46b4-97e4-9b5a18e39854', 'UNSOLD'),
('afa28ae9-b3d3-40f6-8b7f-76c4f803ed4f', '2e3b1b93-639b-4bf7-8cb9-30b248518290', 'UNSOLD'),
('71030e07-68bc-4f3c-bd58-66cd3b9c2913', 'f13477ad-9977-46e5-bdb7-b5ace6e683e3', 'UNSOLD'),
('409936b7-f4a7-4251-bbce-ec2ce1b83e85', '179124c1-a5e7-45d1-b690-df747c913374', 'UNSOLD'),
('ecf6e8cb-6335-452f-a882-900793c56b86', '02988de8-b84d-44a9-b045-1848d4d17dc8', 'UNSOLD'),
('8ca31097-52ac-4a9e-9cbb-9d1f014b7ade', '41e1df4a-20fe-478f-adb7-649827186c81', 'UNSOLD'),
('3c5f383f-1012-49ef-a11d-3c0652cc04a5', '77f73f60-7165-4618-a396-029986d7ab62', 'UNSOLD'),
('5935820e-f455-40dc-b90b-d83aea3584f7', 'd6149790-e190-4805-aa06-41c047edfe87', 'UNSOLD'),
('61510703-e482-4517-9158-d0de16845686', '946a6af2-ce1f-4d01-9ccf-e090c3d35948', 'UNSOLD'),
('290c679e-8538-4179-856a-ebbec609be36', '90758f66-c771-4747-b324-b42c56f920b7', 'UNSOLD'),
('bfb1e12b-ebbd-4a02-b8e8-8e0fb42e6ae6', '63da2387-ce6b-4a78-a535-b83e52ce48ba', 'UNSOLD'),
('cb50baf3-2461-4cfa-a7dd-69085e6c2d93', 'ca9c7b9d-2bc3-4db1-b73d-6e94b881259b', 'UNSOLD'),
('0f54465b-f9aa-43d9-ba76-9fee9e248e8c', 'bc914e5a-b394-4638-af5a-3afe9731105b', 'UNSOLD'),
('c98f84e1-549d-42c0-8f22-f0f36f852b07', '3b9ec1f8-fd1a-4944-891b-6265e2524fde', 'UNSOLD'),
('47074ece-db08-48aa-9a72-1c126b605094', 'f469f71c-6737-4d8e-899c-01d8f939e19a', 'UNSOLD'),
('d9476805-d771-4b57-b6da-c6a829774e1a', '261e5216-e812-4e43-8266-2c3869b3339f', 'UNSOLD'),
('7d7ed9cd-6948-4bef-b5f2-9927f42717e8', '37aeaea5-9995-4cb7-8776-f92e50761314', 'UNSOLD'),
('2eff8860-769d-43b7-8169-7ca273310a05', '71119f74-6659-4121-9c70-5b90cc1d58ec', 'UNSOLD'),
('725ee17b-74a2-4d0c-844c-b0e824a29243', 'ccd514a8-1d44-4224-aea3-10299f0fcc51', 'UNSOLD'),
('c2cd4e9b-7c02-4468-9104-cbf6a01d9421', '4351de5b-46df-47f4-a8e4-ab799062e453', 'UNSOLD'),
('3e11d437-5539-40ab-81b7-bdbd29224683', 'cb25448f-c42c-496e-82e4-06ec3f48c042', 'UNSOLD'),
('70adbe0b-5f69-40fa-9209-e4c9ec44f730', '3ac07617-061e-469f-96d0-cb66b8b787ed', 'UNSOLD'),
('c002fa9a-1013-4993-949b-fb01b993d58a', 'd3187fca-4972-4a13-82eb-b9f59db833de', 'UNSOLD'),
('5ebedde0-057b-4342-b6c2-90266799802c', 'af3bb46a-c17f-414b-800f-06ef4cc62866', 'UNSOLD'),
('5d1542b9-707c-4cb6-ace1-d76bbd3d8bae', '255c1da1-006f-4a15-8789-96e50147c469', 'UNSOLD'),
('8e6e93b7-e8a1-47d3-82a3-ebb4d0279eb7', 'c42763a7-1d4e-4032-87d6-24488fc8dea6', 'UNSOLD'),
('9fe0b7aa-1590-41af-8624-1936b3b7ab95', '1c486bf8-3fb2-40bd-ba1f-3393d157b106', 'UNSOLD'),
('3abf54aa-1f6e-4999-8ed1-c2df3fcca0c5', '43e12404-d514-413b-bf5b-e76ea2d1e74d', 'UNSOLD'),
('e57fd81c-d12e-4a98-8c6a-8f3d6b461c3d', 'cccb21bc-8297-44fc-b4a0-9985e2f5c1f6', 'UNSOLD'),
('b183c93c-5ac7-4096-b66a-66750b1b164e', 'c39ce27f-5d28-45fe-b1ad-5ed8c9502029', 'UNSOLD'),
('6ff06630-7ae4-4e39-9cbd-ccde18e43f10', '0bbe3a5b-5111-4253-b917-9429f43f75b3', 'UNSOLD'),
('33c4956a-ff97-47da-a42d-8925282eb074', '590e3287-cba2-42a9-a1b2-cd656eb4bc28', 'UNSOLD'),
('03702c73-8c39-407d-9d1b-d57a22472c86', '32fcf2ce-a492-4303-9156-bffd3634576a', 'UNSOLD'),
('06e1cb28-155c-45ae-9967-b34c4f82cc25', '732e30b2-92e7-47d9-8ea1-cc3e8e671219', 'UNSOLD'),
('c409c70a-f981-49ba-8409-49e494aaa8b5', 'ee4125bb-d920-451f-8067-c93938d39651', 'UNSOLD'),
('8c64de7d-2e38-413d-ba2d-4b4a65e96249', '2e68b252-627d-4133-a640-8c3808f21454', 'UNSOLD'),
('e9e92d2b-cb1a-4186-85ae-227aba9293b4', '2266d8fb-ccf1-418b-9547-5a182578e6e8', 'UNSOLD'),
('803c1874-5013-4cc1-8ad9-79a2890b52bd', 'a18e6344-eeb3-483a-9301-ade8ab282ab0', 'UNSOLD'),
('475a63d9-1fd0-4922-805b-12601f1d6352', '8c4b5085-72b5-4fcb-bfa8-6341ac4a87e3', 'UNSOLD'),
('3fc0f806-d200-41fe-a4e3-2446f0057c24', '770fbe27-e93d-4771-83e9-7ad1f6372b95', 'UNSOLD'),
('85768485-1189-4681-a9ac-cf77c529fe2b', 'ec272fb2-7727-42d5-81c7-7b62838eef23', 'UNSOLD'),
('fc656990-7e77-4d5e-9010-6b2346d430cf', '79b28c23-1d4b-4449-bb29-ad2464d86c04', 'UNSOLD'),
('7bfe5db6-905e-4060-8028-a8915fe35ee9', 'aa2388e6-8b08-4379-93ce-96f5e825d666', 'UNSOLD'),
('7bff4fc9-72ad-4150-a0d4-5831333bb20f', 'a4f5069f-8353-49c9-81bf-5c0987609667', 'UNSOLD'),
('0c78802d-fef4-40db-8177-271d3cd65f03', 'e601c314-11c6-4635-b060-501283f74dac', 'UNSOLD'),
('75d1a1d3-824e-4ce4-bbd7-5c6b315b3764', 'e369a965-6254-4327-ae85-8a371a7abda9', 'UNSOLD'),
('9f81811e-ec7f-4892-889d-423f968285dd', 'ff720cc3-8756-4b5e-8417-e218d26726a9', 'UNSOLD'),
('fb2c6da0-829c-42c4-a183-2f5d4b98c1f8', 'c1d404ab-bf03-482c-8d3b-7c0d8471789c', 'UNSOLD'),
('c9f9c481-b083-4ef9-bd9e-97ed0adf0702', '9548196f-0a2a-41e4-ba6d-1d0ac5b2514a', 'UNSOLD'),
('79df59a0-2d6c-47fe-a056-b48ac590b517', '7d1ad432-e0e3-4eff-b786-ed10585192a8', 'UNSOLD'),
('329469b5-6553-4d45-895c-c4a0e2d79ffc', 'bbbbeefa-a82b-4055-8b52-b5d6c26f656b', 'UNSOLD'),
('6d802932-ead0-497e-8ca7-e28b1512c1ed', '8b348599-945e-4b2e-bec4-4afba294b66e', 'UNSOLD'),
('62efcb10-0496-4076-bb79-83308f8b85a3', '97c53018-4675-4372-9e9d-db449fbe16a2', 'UNSOLD'),
('fbbf4c69-e82b-4755-94ad-461ce402749c', 'fe3f5703-5249-4717-b44a-0b41ad089300', 'UNSOLD'),
('322b5b46-a080-4ca7-ae1a-6e7c7cc1db79', '0cbd5123-0b8a-470a-8e01-dcae5d9843b1', 'UNSOLD'),
('7d1023f3-80d0-43af-9c02-6a0d994839d5', '09e36982-48b6-472b-bbcf-f3fe84077ee4', 'UNSOLD'),
('abc923e3-3205-47a2-a535-e001372ee112', 'b2c7c20a-ef67-4803-bafb-5456267340cb', 'UNSOLD'),
('bbec9cc0-dc5e-401f-a79f-290103c0a0a4', '12c25eca-8f24-447e-9aff-67434e47fb62', 'UNSOLD'),
('5ff6ad94-d155-4f52-a8ab-e51fdf27003e', 'df9c2c1a-ee6d-492e-b0e6-6a74b77e5ff3', 'UNSOLD'),
('be3023a4-0278-4306-8c52-c6da8b3579a8', 'a0e851b5-827b-46e5-a408-604457b8da6b', 'UNSOLD'),
('5065caed-c3f7-4727-9ef4-486ee05b0ae5', '93899c66-c490-4bdd-b3e6-51dcafed64bb', 'UNSOLD'),
('35be6180-6cae-4550-9524-d455605f0826', 'a61bda72-80bf-42e3-aaa4-0f87c8f280ea', 'UNSOLD'),
('fc6ccc86-457e-4c4e-8444-81297a996698', 'f99b6bba-81f6-4490-b7ab-7ae4379c02f7', 'UNSOLD'),
('40c76ca5-522b-4869-8652-cd4405621605', 'c52f325e-9834-4634-9d85-ab0cd631bc96', 'UNSOLD'),
('b6fd81cc-8375-41a9-9642-7413e76e6996', '45592fb5-90e0-4c8d-951f-a9809dded4e0', 'UNSOLD'),
('88b36186-29b9-4abe-85c3-1f4afbd0f33a', '581bbf97-2966-4fa7-a5bb-b93bc1e97228', 'UNSOLD'),
('551a276b-ce61-4180-bf89-bf35738cfb44', '16276d61-9dd9-47b4-97c1-9dfafc5567e4', 'UNSOLD'),
('fec111ff-3baa-469e-9fc0-191545668ac6', 'ff376f38-dc17-42de-b3ca-693058f7c9b4', 'UNSOLD'),
('1e3f5793-b18f-4a9e-804d-9d51025e5929', '16b06be5-ecfb-429a-bd8d-20f47f5b27de', 'UNSOLD'),
('b4a875b6-b1c5-46e3-8105-78992b91cce0', '23daf201-1830-4c5e-92e2-fb640624bf02', 'UNSOLD'),
('af6e7bb1-9ecb-41f1-ad80-2e73fbe49657', '73c23104-20ed-4f66-ac31-a1a16c555a92', 'UNSOLD'),
('eeba0a5b-b929-4ae3-8eaf-b501af2add82', '5a545e9f-2f2a-4444-a9c1-3d37ffcfff6e', 'UNSOLD'),
('175d5265-5289-4868-93bb-79a48af597a7', '4463ced8-2140-4322-95e3-89bf3cdfb32b', 'UNSOLD'),
('a85aaec2-eda4-489a-a587-4c4a94a5cf6b', 'b84acf7b-4fa1-4b82-9996-55ee6442dbe8', 'UNSOLD'),
('74bb3e72-c467-40ee-9bd0-e7077e4ba370', '9881b8b1-671e-4c3e-93ed-974787b7771c', 'UNSOLD'),
('be410e79-879f-48d0-b122-7f89970935e6', '63bedcb5-0a6d-42bc-bc5b-0fff587ce636', 'UNSOLD'),
('ff1c8aed-90a1-41ba-9960-79682e6a8f0a', 'ddddb3da-c299-4d26-b05c-a71b22115f0c', 'UNSOLD'),
('af31db4d-1918-4ce9-98a5-5906163050fc', '6fb8f4a0-d05e-4775-a6df-4cb66427c4b1', 'UNSOLD'),
('f22de72c-dc88-47ef-996c-be0a18144f0c', 'bb93985a-d608-4cd7-8cf4-0ccb1aba2fd6', 'UNSOLD'),
('fa4cc5c7-2e93-4f4b-9c10-a7da823b1a72', '989e858e-27f8-42d6-b712-ba6df570800e', 'UNSOLD'),
('820e19e1-230a-4dc9-b23a-f0519bcde366', '68efbb10-0ce2-4655-b384-c9ebe078e391', 'UNSOLD'),
('16692a94-8e68-4248-8f7a-ab09db18c20f', '5d79def3-23ed-45e5-b3f1-801392f9fc72', 'UNSOLD'),
('4976194c-3552-4902-a7e8-21ea16edd644', 'a3a4a04f-baff-448c-aaba-869417361da3', 'UNSOLD'),
('93d7336b-c53b-46cc-bbc3-edfa1c22f527', 'a36e7f35-fa93-47d9-8877-82d855e99aa8', 'UNSOLD'),
('d511f8bf-a0d9-47da-9300-d163992f6bd8', 'f18b4ba8-0df9-4e45-9bd0-2a647558e732', 'UNSOLD'),
('66963745-5bec-45b6-9a67-8391f7923672', '1e60eaeb-569e-4187-a1ab-5d2ef91c9ee7', 'UNSOLD'),
('beb02a2c-b07c-495a-83c4-d8c27860c0bd', '5fc125dc-7468-4cf1-bbbc-a63886da2e3e', 'UNSOLD'),
('9cce12e0-ad7a-4ca3-ad73-1539285bcf8b', '214e6c07-0e11-4660-b0e0-20fd4194b97d', 'UNSOLD'),
('ce85fcbc-4f55-42bc-ac6a-681d160786a1', 'cc5ab914-f139-4e35-872a-cf2404826130', 'UNSOLD'),
('f3f81d97-7b72-4cc9-8133-42e2a444f7ca', 'fc2f5cb2-d9ef-43f3-a2c5-f6a4d2ce2e5a', 'UNSOLD'),
('744952bc-021b-4c54-9103-999cf30ada20', '7a855d13-4a6d-493e-8447-3e57d3dddc09', 'UNSOLD'),
('d1b538f5-1273-4fff-8bee-5ce695fedff5', 'f821377d-d6d3-422e-bdc3-f6bfdc5d4192', 'UNSOLD'),
('e3a4281f-e723-4bcf-ba8d-930c2d2e071c', '416b9e78-d03c-419d-9d73-1f3a26dc8541', 'UNSOLD'),
('aebc69e3-f730-44bc-a5c4-972fcfcb05cb', '33d24e49-bf04-408d-8f24-e0098cf84ef1', 'UNSOLD'),
('64996219-d1a7-42c3-a5fd-096e00fc98b8', 'f0ddefa6-a8d6-4b20-9266-b609117a931f', 'UNSOLD'),
('1b8d5eb7-c514-43a0-a8ee-5668f92fd1b0', '5114c648-af6c-4903-8a2d-48fe51943069', 'UNSOLD'),
('b19c1cc0-8fb4-423b-aa98-33f8ab2fa44b', 'f58eb98e-2567-4677-a825-d4b3ac2c9f3b', 'UNSOLD'),
('4cc54ba7-07dc-423c-b9ed-c2b123442f09', 'e5db284c-966d-4c90-b395-49062a5ffaa2', 'UNSOLD'),
('a714c4cc-0868-4da1-88c1-b1a3bb589637', '939309c3-3772-42c2-b0ab-db26d096133c', 'UNSOLD'),
('fa637fc8-d257-42a0-a513-c7724c4d205a', '86401cbb-a2c3-4257-9902-3848d0a834fb', 'UNSOLD'),
('03e4b2d8-0cce-4f3f-a647-e3a7d5d9da6d', '8588cdb6-b951-4433-a9d4-d84af71d2126', 'UNSOLD'),
('f8f99ba0-209d-4351-aa80-b681fb7e386e', 'b0e10647-c614-47e1-8a97-211255d1f28a', 'UNSOLD'),
('6750336f-69c1-4c2a-99f7-e8e271cee2e2', 'a0c2e8ea-27f5-4318-8cff-c626b7206fdf', 'UNSOLD'),
('1feccda8-eae4-4faf-baae-8e4a4f4dc348', '9b6867bb-004e-47fb-8b53-22e83679df02', 'UNSOLD'),
('25862dc1-1034-4141-8515-fea2e1d82862', '49b9c7ca-153f-4991-9252-639ecac31eb1', 'UNSOLD'),
('d3ae11b2-8cd5-4c57-a915-cb46ba9ed341', 'd92c974c-30cc-421a-8d66-6c85b4e3ccb8', 'UNSOLD'),
('a199d50b-a56e-498d-a696-fb133ebe9933', '025e7c29-7817-4909-935d-2095f1db3399', 'UNSOLD'),
('200a3799-fae2-4a42-b6ab-585870c15bfe', '18840d7e-7c71-4c62-9911-52864d11b8cf', 'UNSOLD'),
('9048c67a-a226-456b-91ef-0262ea276e42', 'd3daeafd-ba1f-413a-86ad-062e706c23fd', 'UNSOLD'),
('9037830c-a09d-408d-81cf-18436720ace4', 'ceca944a-1efb-4cdf-886b-c429e7623f06', 'UNSOLD'),
('78b66cf2-669e-47ec-a6bb-32e0dd1e71d7', 'cc9d3e41-5802-4a5f-a856-9d8e846f63df', 'UNSOLD'),
('a292de42-28c8-4f1c-958a-bade5dbfe2c7', '45108b1e-e79f-473f-9698-9563dc861b20', 'UNSOLD'),
('936386ab-0166-46e7-9280-0555ee19372c', 'f354c9ec-5b90-4946-9da1-7c3d50c3ed41', 'UNSOLD'),
('cbea9c00-3b6a-4d3f-86e9-defb594b7bad', 'd916536c-19bc-4795-9695-dd48f570666f', 'UNSOLD'),
('c348113d-0480-4f1a-95d5-92b29651bc5b', '7def13c9-b7a6-4927-b578-029876c38c27', 'UNSOLD'),
('d18a9866-9aeb-40e5-aa42-83a69e2e0b8a', 'd140443f-d1a6-43cb-b2f0-1b2692f6e3d4', 'UNSOLD'),
('510a3518-c18e-4e63-abac-d5b0d995319b', '35241d07-b24c-4ffa-83cd-43e0ab06092e', 'UNSOLD'),
('e8132770-564d-44bb-a7f8-bdb2820f7e3b', '0c03481a-c29a-4901-934d-e6b5ab9033ac', 'UNSOLD'),
('09d5c51f-e1ac-4d67-a314-394a62658053', '26c7f818-affc-4388-a321-e688356fec7a', 'UNSOLD');

INSERT INTO "AdminUser" (id, username, password_hash, role) VALUES
('28605167-dcd4-451d-a470-c631cc1dfc7b', 'admin', '$2b$10$3b4vRlQLjfWhsGFUO7MqL.pkWGecQ.LTpiPRw.QsGeqJgewHZ14Ve', 'ADMIN'),
('abb83ca4-3b2d-47c0-a1c2-67a9ed6ae374', 'screen', '$2b$10$3b4vRlQLjfWhsGFUO7MqL.pkWGecQ.LTpiPRw.QsGeqJgewHZ14Ve', 'SCREEN');

INSERT INTO "AuctionSequence" (id, name, type, sequence_items) VALUES
(1, 'Sequence Alpha', 'PLAYER', '[{"rank":1,"type":"PLAYER"},{"rank":2,"type":"PLAYER"},{"rank":3,"type":"PLAYER"},{"rank":4,"type":"PLAYER"},{"rank":5,"type":"PLAYER"},{"rank":6,"type":"PLAYER"},{"rank":7,"type":"PLAYER"},{"rank":8,"type":"PLAYER"},{"rank":9,"type":"PLAYER"},{"rank":10,"type":"PLAYER"},{"rank":11,"type":"PLAYER"},{"rank":12,"type":"PLAYER"},{"rank":13,"type":"PLAYER"},{"rank":14,"type":"PLAYER"},{"rank":15,"type":"PLAYER"},{"rank":16,"type":"PLAYER"},{"rank":17,"type":"PLAYER"},{"rank":18,"type":"PLAYER"},{"rank":19,"type":"PLAYER"},{"rank":20,"type":"PLAYER"},{"rank":21,"type":"PLAYER"},{"rank":22,"type":"PLAYER"},{"rank":23,"type":"PLAYER"},{"rank":24,"type":"PLAYER"},{"rank":25,"type":"PLAYER"},{"rank":26,"type":"PLAYER"},{"rank":27,"type":"PLAYER"},{"rank":28,"type":"PLAYER"},{"rank":29,"type":"PLAYER"},{"rank":30,"type":"PLAYER"},{"rank":31,"type":"PLAYER"},{"rank":32,"type":"PLAYER"},{"rank":33,"type":"PLAYER"},{"rank":34,"type":"PLAYER"},{"rank":35,"type":"PLAYER"},{"rank":36,"type":"PLAYER"},{"rank":37,"type":"PLAYER"},{"rank":38,"type":"PLAYER"},{"rank":39,"type":"PLAYER"},{"rank":40,"type":"PLAYER"},{"rank":41,"type":"PLAYER"},{"rank":42,"type":"PLAYER"},{"rank":43,"type":"PLAYER"},{"rank":44,"type":"PLAYER"},{"rank":45,"type":"PLAYER"},{"rank":46,"type":"PLAYER"},{"rank":47,"type":"PLAYER"},{"rank":48,"type":"PLAYER"},{"rank":49,"type":"PLAYER"},{"rank":50,"type":"PLAYER"},{"rank":51,"type":"PLAYER"},{"rank":52,"type":"PLAYER"},{"rank":53,"type":"PLAYER"},{"rank":54,"type":"PLAYER"},{"rank":55,"type":"PLAYER"},{"rank":56,"type":"PLAYER"},{"rank":57,"type":"PLAYER"},{"rank":58,"type":"PLAYER"},{"rank":59,"type":"PLAYER"},{"rank":60,"type":"PLAYER"},{"rank":61,"type":"PLAYER"},{"rank":62,"type":"PLAYER"},{"rank":63,"type":"PLAYER"},{"rank":64,"type":"PLAYER"},{"rank":65,"type":"PLAYER"},{"rank":66,"type":"PLAYER"},{"rank":67,"type":"PLAYER"},{"rank":68,"type":"PLAYER"},{"rank":69,"type":"PLAYER"},{"rank":70,"type":"PLAYER"},{"rank":71,"type":"PLAYER"},{"rank":72,"type":"PLAYER"},{"rank":73,"type":"PLAYER"},{"rank":74,"type":"PLAYER"},{"rank":75,"type":"PLAYER"},{"rank":76,"type":"PLAYER"},{"rank":77,"type":"PLAYER"},{"rank":78,"type":"PLAYER"},{"rank":79,"type":"PLAYER"},{"rank":80,"type":"PLAYER"},{"rank":81,"type":"PLAYER"},{"rank":82,"type":"PLAYER"},{"rank":83,"type":"PLAYER"},{"rank":84,"type":"PLAYER"},{"rank":85,"type":"PLAYER"},{"rank":86,"type":"PLAYER"},{"rank":87,"type":"PLAYER"},{"rank":88,"type":"PLAYER"},{"rank":89,"type":"PLAYER"},{"rank":90,"type":"PLAYER"},{"rank":91,"type":"PLAYER"},{"rank":92,"type":"PLAYER"},{"rank":93,"type":"PLAYER"},{"rank":94,"type":"PLAYER"},{"rank":95,"type":"PLAYER"},{"rank":96,"type":"PLAYER"},{"rank":97,"type":"PLAYER"},{"rank":98,"type":"PLAYER"},{"rank":99,"type":"PLAYER"},{"rank":100,"type":"PLAYER"},{"rank":101,"type":"PLAYER"},{"rank":102,"type":"PLAYER"},{"rank":103,"type":"PLAYER"},{"rank":104,"type":"PLAYER"},{"rank":105,"type":"PLAYER"},{"rank":106,"type":"PLAYER"},{"rank":107,"type":"PLAYER"},{"rank":108,"type":"PLAYER"},{"rank":109,"type":"PLAYER"},{"rank":110,"type":"PLAYER"},{"rank":111,"type":"PLAYER"},{"rank":112,"type":"PLAYER"},{"rank":113,"type":"PLAYER"},{"rank":114,"type":"PLAYER"},{"rank":115,"type":"PLAYER"},{"rank":116,"type":"PLAYER"},{"rank":117,"type":"PLAYER"},{"rank":118,"type":"PLAYER"},{"rank":119,"type":"PLAYER"},{"rank":120,"type":"PLAYER"},{"rank":121,"type":"PLAYER"},{"rank":122,"type":"PLAYER"},{"rank":123,"type":"PLAYER"},{"rank":124,"type":"PLAYER"},{"rank":125,"type":"PLAYER"},{"rank":126,"type":"PLAYER"},{"rank":127,"type":"PLAYER"},{"rank":128,"type":"PLAYER"},{"rank":129,"type":"PLAYER"},{"rank":130,"type":"PLAYER"},{"rank":131,"type":"PLAYER"},{"rank":132,"type":"PLAYER"},{"rank":133,"type":"PLAYER"},{"rank":134,"type":"PLAYER"},{"rank":135,"type":"PLAYER"},{"rank":136,"type":"PLAYER"},{"rank":137,"type":"PLAYER"},{"rank":138,"type":"PLAYER"},{"rank":139,"type":"PLAYER"},{"rank":140,"type":"PLAYER"},{"rank":141,"type":"PLAYER"},{"rank":142,"type":"PLAYER"},{"rank":143,"type":"PLAYER"},{"rank":144,"type":"PLAYER"},{"rank":145,"type":"PLAYER"},{"rank":146,"type":"PLAYER"},{"rank":147,"type":"PLAYER"},{"rank":148,"type":"PLAYER"},{"rank":149,"type":"PLAYER"},{"rank":150,"type":"PLAYER"},{"rank":151,"type":"PLAYER"},{"rank":152,"type":"PLAYER"},{"rank":153,"type":"PLAYER"},{"rank":154,"type":"PLAYER"},{"rank":155,"type":"PLAYER"},{"rank":156,"type":"PLAYER"},{"rank":157,"type":"PLAYER"},{"rank":158,"type":"PLAYER"},{"rank":159,"type":"PLAYER"}]');

INSERT INTO "AuctionState" (id, phase, auction_day) VALUES (1, 'NOT_STARTED', 'Day 1');

