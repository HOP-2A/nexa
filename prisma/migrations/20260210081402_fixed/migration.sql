/*
  Warnings:

  - You are about to drop the column `date` on the `MentorAvailability` table. All the data in the column will be lost.
  - Added the required column `availableDate` to the `MentorAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MentorAvailability" DROP COLUMN "date",
ADD COLUMN     "availableDate" TIMESTAMP(3) NOT NULL;
