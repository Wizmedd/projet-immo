<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230616184827 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE products_options DROP FOREIGN KEY FK_B0800DA6C8A81A9');
        $this->addSql('ALTER TABLE products_options DROP FOREIGN KEY FK_B0800DA3ADB05F1');
        $this->addSql('DROP TABLE options');
        $this->addSql('DROP TABLE products_options');
        $this->addSql('ALTER TABLE products DROP FOREIGN KEY FK_B3BA5A5AF675F31B');
        $this->addSql('DROP INDEX IDX_B3BA5A5AF675F31B ON products');
        $this->addSql('ALTER TABLE products DROP author_id, DROP latitude, DROP longitude');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE options (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE products_options (products_id INT NOT NULL, options_id INT NOT NULL, INDEX IDX_B0800DA3ADB05F1 (options_id), INDEX IDX_B0800DA6C8A81A9 (products_id), PRIMARY KEY(products_id, options_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE products_options ADD CONSTRAINT FK_B0800DA6C8A81A9 FOREIGN KEY (products_id) REFERENCES products (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE products_options ADD CONSTRAINT FK_B0800DA3ADB05F1 FOREIGN KEY (options_id) REFERENCES options (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE products ADD author_id INT NOT NULL, ADD latitude DOUBLE PRECISION NOT NULL, ADD longitude DOUBLE PRECISION NOT NULL');
        $this->addSql('ALTER TABLE products ADD CONSTRAINT FK_B3BA5A5AF675F31B FOREIGN KEY (author_id) REFERENCES users (id)');
        $this->addSql('CREATE INDEX IDX_B3BA5A5AF675F31B ON products (author_id)');
    }
}
