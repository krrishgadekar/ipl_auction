/*
  Warnings:

  - The values [IN,OS] on the enum `Nationality` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `playerId` on the `AuctionPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `soldPrice` on the `AuctionPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `soldToTeamId` on the `AuctionPlayer` table. All the data in the column will be lost.
  - The `status` column on the `AuctionPlayer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `auction_status` on the `AuctionState` table. All the data in the column will be lost.
  - You are about to drop the column `basePrice` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `isRiddle` on the `Player` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `isUsed` on the `PowerCard` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `PowerCard` table. All the data in the column will be lost.
  - You are about to drop the column `brandKey` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `isOverseasCount` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `purseRemaining` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `TeamPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `pricePaid` on the `TeamPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `TeamPlayer` table. All the data in the column will be lost.
  - The primary key for the `Top11Selection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `captainId` on the `Top11Selection` table. All the data in the column will be lost.
  - You are about to drop the column `playerIds` on the `Top11Selection` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Top11Selection` table. All the data in the column will be lost.
  - You are about to drop the column `viceCaptainId` on the `Top11Selection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id]` on the table `AuctionPlayer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rank]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,type]` on the table `PowerCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand_key]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,player_id]` on the table `TeamPlayer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `player_id` to the `AuctionPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `base_price` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `PowerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `TeamPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_paid` to the `TeamPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `TeamPlayer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captain_id` to the `Top11Selection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Top11Selection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vice_captain_id` to the `Top11Selection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Pool" AS ENUM ('BAT_WK', 'BOWL', 'AR');

-- CreateEnum
CREATE TYPE "AuctionPhase" AS ENUM ('NOT_STARTED', 'FRANCHISE_PHASE', 'POWER_CARD_PHASE', 'LIVE', 'CLOSED_BIDDING', 'POST_AUCTION', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PlayerAuctionStatus" AS ENUM ('UNSOLD', 'SOLD');

-- AlterEnum
BEGIN;
CREATE TYPE "Nationality_new" AS ENUM ('INDIAN', 'OVERSEAS');
ALTER TABLE "Player" ALTER COLUMN "nationality" TYPE "Nationality_new" USING ("nationality"::text::"Nationality_new");
ALTER TYPE "Nationality" RENAME TO "Nationality_old";
ALTER TYPE "Nationality_new" RENAME TO "Nationality";
DROP TYPE "public"."Nationality_old";
COMMIT;

-- AlterEnum
ALTER TYPE "PowerCardType" ADD VALUE 'RIGHT_TO_MATCH';

-- DropForeignKey
ALTER TABLE "AuctionPlayer" DROP CONSTRAINT "AuctionPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "PowerCard" DROP CONSTRAINT "PowerCard_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamPlayer" DROP CONSTRAINT "TeamPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "TeamPlayer" DROP CONSTRAINT "TeamPlayer_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Top11Selection" DROP CONSTRAINT "Top11Selection_teamId_fkey";

-- DropIndex
DROP INDEX "Team_brandKey_key";

-- AlterTable
ALTER TABLE "AuctionPlayer" DROP COLUMN "playerId",
DROP COLUMN "soldPrice",
DROP COLUMN "soldToTeamId",
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "sold_price" DECIMAL(65,30),
ADD COLUMN     "sold_to_team_id" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "PlayerAuctionStatus" NOT NULL DEFAULT 'UNSOLD';

-- AlterTable
ALTER TABLE "AuctionState" DROP COLUMN "auction_status",
ADD COLUMN     "active_power_card" TEXT,
ADD COLUMN     "active_power_card_team" TEXT,
ADD COLUMN     "auction_day" TEXT NOT NULL DEFAULT 'Day 1',
ADD COLUMN     "bid_frozen_team_id" TEXT,
ADD COLUMN     "bid_history" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "current_bid" DECIMAL(65,30),
ADD COLUMN     "current_sequence_id" INTEGER,
ADD COLUMN     "current_sequence_index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gods_eye_revealed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highest_bidder_id" TEXT,
ADD COLUMN     "last_sold_player_id" TEXT,
ADD COLUMN     "last_sold_price" DECIMAL(65,30),
ADD COLUMN     "last_sold_team_id" TEXT,
ADD COLUMN     "last_sold_team_name" TEXT,
ADD COLUMN     "phase" "AuctionPhase" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "basePrice",
DROP COLUMN "isRiddle",
ADD COLUMN     "base_price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "bat_average" DECIMAL(65,30),
ADD COLUMN     "bat_runs" INTEGER,
ADD COLUMN     "bat_sr" DECIMAL(65,30),
ADD COLUMN     "bowl_avg" DECIMAL(65,30),
ADD COLUMN     "bowl_eco" DECIMAL(65,30),
ADD COLUMN     "bowl_wickets" INTEGER,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_riddle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legacy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "matches" INTEGER,
ADD COLUMN     "nationality_raw" TEXT,
ADD COLUMN     "pool" "Pool" NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "sub_batting" INTEGER,
ADD COLUMN     "sub_bowling" INTEGER,
ADD COLUMN     "sub_consistency" INTEGER,
ADD COLUMN     "sub_economy" INTEGER,
ADD COLUMN     "sub_efficiency" INTEGER,
ADD COLUMN     "sub_experience" INTEGER,
ADD COLUMN     "sub_impact" INTEGER,
ADD COLUMN     "sub_scoring" INTEGER,
ADD COLUMN     "sub_versatility" INTEGER,
ADD COLUMN     "sub_wicket_taking" INTEGER,
ADD COLUMN     "team" TEXT NOT NULL,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PowerCard" DROP COLUMN "isUsed",
DROP COLUMN "teamId",
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "brandKey",
DROP COLUMN "createdAt",
DROP COLUMN "isOverseasCount",
DROP COLUMN "purseRemaining",
ADD COLUMN     "active_session_id" TEXT,
ADD COLUMN     "ar_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "batsmen_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bowlers_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "brand_key" TEXT,
ADD COLUMN     "brand_score" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "franchise_name" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "overseas_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "primary_color" TEXT,
ADD COLUMN     "purchased_players" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "purse_remaining" DECIMAL(65,30) NOT NULL DEFAULT 120,
ADD COLUMN     "squad_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wk_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TeamPlayer" DROP COLUMN "playerId",
DROP COLUMN "pricePaid",
DROP COLUMN "teamId",
ADD COLUMN     "player_id" TEXT NOT NULL,
ADD COLUMN     "price_paid" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Top11Selection" DROP CONSTRAINT "Top11Selection_pkey",
DROP COLUMN "captainId",
DROP COLUMN "playerIds",
DROP COLUMN "teamId",
DROP COLUMN "viceCaptainId",
ADD COLUMN     "captain_id" TEXT NOT NULL,
ADD COLUMN     "player_ids" TEXT[],
ADD COLUMN     "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "team_id" TEXT NOT NULL,
ADD COLUMN     "vice_captain_id" TEXT NOT NULL,
ADD CONSTRAINT "Top11Selection_pkey" PRIMARY KEY ("team_id");

-- DropEnum
DROP TYPE "AuctionStatus";

-- CreateTable
CREATE TABLE "AuctionSequence" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "players" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "AuctionSequence_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Franchise_name_key" ON "Franchise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_short_name_key" ON "Franchise"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionPlayer_player_id_key" ON "AuctionPlayer"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_rank_key" ON "Player"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "PowerCard_team_id_type_key" ON "PowerCard"("team_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_brand_key_key" ON "Team"("brand_key");

-- CreateIndex
CREATE UNIQUE INDEX "TeamPlayer_team_id_player_id_key" ON "TeamPlayer"("team_id", "player_id");

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
