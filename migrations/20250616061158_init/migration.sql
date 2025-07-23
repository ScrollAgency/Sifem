/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Lesion" (
    "id" SERIAL NOT NULL,
    "name_fr" TEXT,
    "name_en" TEXT,
    "category_fr" TEXT,
    "category_en" TEXT,
    "image_fr" TEXT,
    "video_fr" TEXT,
    "macro_category_fr" TEXT,
    "multi_step" BOOLEAN,
    "next_step" TEXT,
    "previous_step" TEXT,
    "image_en" TEXT,
    "video_en" TEXT,
    "image_trauma" TEXT,
    "face" TEXT,
    "has_options" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name_fr" TEXT,
    "name_en" TEXT,
    "lesion_id" INTEGER,
    "image_trauma" TEXT,
    "face" TEXT,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_lesion_id_fkey" FOREIGN KEY ("lesion_id") REFERENCES "Lesion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
