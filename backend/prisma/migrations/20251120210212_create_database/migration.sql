BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[accounts] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [initialBalance] DECIMAL(18,2) NOT NULL,
    [currency] NVARCHAR(1000) NOT NULL CONSTRAINT [accounts_currency_df] DEFAULT 'BRL',
    [isActive] BIT NOT NULL CONSTRAINT [accounts_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [accounts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [accounts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[categories] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [icon] NVARCHAR(1000),
    [color] NVARCHAR(1000),
    [isEssential] BIT NOT NULL CONSTRAINT [categories_isEssential_df] DEFAULT 0,
    [type] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [categories_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [categories_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [categories_userId_name_type_key] UNIQUE NONCLUSTERED ([userId],[name],[type])
);

-- CreateTable
CREATE TABLE [dbo].[transactions] (
    [id] NVARCHAR(1000) NOT NULL,
    [accountId] NVARCHAR(1000) NOT NULL,
    [categoryId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [amount] DECIMAL(18,2) NOT NULL,
    [description] NVARCHAR(1000),
    [date] DATETIME2 NOT NULL CONSTRAINT [transactions_date_df] DEFAULT CURRENT_TIMESTAMP,
    [isPaid] BIT NOT NULL CONSTRAINT [transactions_isPaid_df] DEFAULT 1,
    [notes] TEXT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [transactions_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [transactions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[goals] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] TEXT,
    [targetValue] DECIMAL(18,2) NOT NULL,
    [currentValue] DECIMAL(18,2) NOT NULL CONSTRAINT [goals_currentValue_df] DEFAULT 0,
    [targetDate] DATETIME2,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [goals_status_df] DEFAULT 'IN_PROGRESS',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [goals_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [goals_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [accounts_userId_idx] ON [dbo].[accounts]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [categories_userId_idx] ON [dbo].[categories]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_accountId_idx] ON [dbo].[transactions]([accountId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_categoryId_idx] ON [dbo].[transactions]([categoryId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_date_idx] ON [dbo].[transactions]([date]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [transactions_type_idx] ON [dbo].[transactions]([type]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [goals_userId_idx] ON [dbo].[goals]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [goals_status_idx] ON [dbo].[goals]([status]);

-- AddForeignKey
ALTER TABLE [dbo].[accounts] ADD CONSTRAINT [accounts_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[categories] ADD CONSTRAINT [categories_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_accountId_fkey] FOREIGN KEY ([accountId]) REFERENCES [dbo].[accounts]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transactions] ADD CONSTRAINT [transactions_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[categories]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[goals] ADD CONSTRAINT [goals_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
