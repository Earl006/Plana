BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Booking] DROP CONSTRAINT [Booking_verificationCode_key];

-- AlterTable
ALTER TABLE [dbo].[Booking] ALTER COLUMN [verificationCode] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH