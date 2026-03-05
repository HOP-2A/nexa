-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "links" TEXT[],
ALTER COLUMN "socialPlatform" DROP NOT NULL,
ALTER COLUMN "profileLink" DROP NOT NULL;
