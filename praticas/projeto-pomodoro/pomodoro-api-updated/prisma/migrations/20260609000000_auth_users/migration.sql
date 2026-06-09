CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `User_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `User` (`id`, `name`, `email`, `passwordHash`)
VALUES (
  'legacy-user',
  'Usuario legado',
  'legacy@example.com',
  'legacy-salt-2026:7dab39a705f36ed3ae4cba2dabba208ac384e467e2cbc9322705e883ee5dc265c5e3279d04a86c1fd4300f1cfd71083021179dceb8e84840341344b74ee8fe10'
);

CREATE TABLE `Session` (
  `id` VARCHAR(191) NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `Session_tokenHash_key`(`tokenHash`),
  INDEX `Session_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `PasswordResetToken` (
  `id` VARCHAR(191) NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `usedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `PasswordResetToken_tokenHash_key`(`tokenHash`),
  INDEX `PasswordResetToken_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Settings` ADD COLUMN `userId` VARCHAR(191) NULL;
UPDATE `Settings` SET `userId` = 'legacy-user' WHERE `userId` IS NULL;
ALTER TABLE `Settings` DROP PRIMARY KEY;
ALTER TABLE `Settings` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;
ALTER TABLE `Settings` MODIFY `userId` VARCHAR(191) NOT NULL;
ALTER TABLE `Settings` ADD PRIMARY KEY (`id`);
CREATE UNIQUE INDEX `Settings_userId_key` ON `Settings`(`userId`);

ALTER TABLE `Task` ADD COLUMN `userId` VARCHAR(191) NULL;
UPDATE `Task` SET `userId` = 'legacy-user' WHERE `userId` IS NULL;
ALTER TABLE `Task` MODIFY `userId` VARCHAR(191) NOT NULL;
CREATE INDEX `Task_userId_idx` ON `Task`(`userId`);

ALTER TABLE `Settings` ADD CONSTRAINT `Settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
