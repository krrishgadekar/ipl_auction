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

