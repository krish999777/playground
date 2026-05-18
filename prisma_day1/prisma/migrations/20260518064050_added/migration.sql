-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
