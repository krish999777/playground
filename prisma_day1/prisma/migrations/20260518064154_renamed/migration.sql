/*
  Warnings:

  - You are about to drop the `Resume` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resume" DROP CONSTRAINT "Resume_userId_fkey";

-- DropTable
DROP TABLE "Resume";

-- CreateTable
CREATE TABLE "resumes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
