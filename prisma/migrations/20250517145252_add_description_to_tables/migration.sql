/*
  Warnings:

  - Added the required column `description` to the `Deck` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Deck` ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `description` VARCHAR(191) NOT NULL;
