/*
  Warnings:

  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the `DeckCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DeckSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DeckToSubject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `deckId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Card` DROP FOREIGN KEY `Card_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Deck` DROP FOREIGN KEY `Deck_userId_fkey`;

-- DropForeignKey
ALTER TABLE `DeckCard` DROP FOREIGN KEY `DeckCard_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `DeckCard` DROP FOREIGN KEY `DeckCard_deckId_fkey`;

-- DropForeignKey
ALTER TABLE `DeckSubject` DROP FOREIGN KEY `DeckSubject_deckId_fkey`;

-- DropForeignKey
ALTER TABLE `DeckSubject` DROP FOREIGN KEY `DeckSubject_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `_DeckToSubject` DROP FOREIGN KEY `_DeckToSubject_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DeckToSubject` DROP FOREIGN KEY `_DeckToSubject_B_fkey`;

-- DropIndex
DROP INDEX `Card_userId_fkey` ON `Card`;

-- DropIndex
DROP INDEX `Deck_userId_fkey` ON `Deck`;

-- AlterTable
ALTER TABLE `Card` DROP COLUMN `userId`,
    ADD COLUMN `deckId` INTEGER NOT NULL,
    ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Deck` DROP COLUMN `userId`,
    ADD COLUMN `ownerId` INTEGER NOT NULL,
    ADD COLUMN `subjectId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `DeckCard`;

-- DropTable
DROP TABLE `DeckSubject`;

-- DropTable
DROP TABLE `_DeckToSubject`;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deck` ADD CONSTRAINT `Deck_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_deckId_fkey` FOREIGN KEY (`deckId`) REFERENCES `Deck`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
