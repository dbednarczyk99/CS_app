-- Planowanie dostępności produktu: sama data (dzień w czasie polskim) zamiast daty z godziną

-- AlterTable
ALTER TABLE `Product` MODIFY `availableFrom` CHAR(10) NULL,
    MODIFY `unavailableFrom` CHAR(10) NULL;
