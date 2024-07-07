/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `verificationCode` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Booking] ADD [verificationCode] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_verificationCode_key] UNIQUE NONCLUSTERED ([verificationCode]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
