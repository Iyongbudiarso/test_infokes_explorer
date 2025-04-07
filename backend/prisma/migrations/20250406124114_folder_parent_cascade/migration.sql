-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_parentFolderId_fkey`;

-- DropIndex
DROP INDEX `Folder_parentFolderId_fkey` ON `Folder`;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_parentFolderId_fkey` FOREIGN KEY (`parentFolderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
