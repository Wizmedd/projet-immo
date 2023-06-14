<?php

namespace App\DataFixtures;


use Faker\Factory;
use App\Entity\Products;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class ProductsFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private SluggerInterface $slugger)
    {
    }

    public function load(ObjectManager $manager): void
    {
        // use the factory to create a Faker\Generator instance
        $faker = Factory::create('fr_FR');


        for ($prod = 1; $prod <= 20; $prod++) {
            $product = new Products();
            $product->setTitle($faker->text(15));
            $product->setDescription($faker->text());
            $product->setSlug($this->slugger->slug($product->getTitle())->lower());
            $product->setSurface($faker->numberBetween(20, 350));
            $product->setRooms($faker->numberBetween(2, 10));
            $product->setBedrooms($faker->numberBetween(1, 9));
            $product->setFloor($faker->numberBetween(0, 15));
            $product->setPrice($faker->numberBetween(10000, 1000000));
            $product->setHeat($faker->numberBetween(0, count(Products::HEAT) - 1));
            //$product->setCity($faker->city);
            $product->setCity("Toulouse");
            $product->setAddress($faker->address);
            //$product->setZipcode(str_replace(' ', '', $faker->postcode));
            $product->setZipcode("31000");
            $product->setSold(false);
            // Coordonnées GPS de Toulouse
            $toulouseLat = 43.6043;
            $toulouseLng = 1.4437;

            // Rayon en kilomètres autour de Toulouse
            $radius = 0.9;

            // Génère une latitude aléatoire dans le rayon autour de Toulouse
            $latitude = $toulouseLat + ($radius / 111.2) * cos(mt_rand(0, 360) / 180 * pi());

            // Génère une longitude aléatoire dans le rayon autour de Toulouse
            $longitude = $toulouseLng + ($radius / (111.2 * cos($latitude))) * cos(mt_rand(0, 360) / 180 * pi());

            // Définit les coordonnées du produit
            $product->setLatitude($latitude);
            $product->setLongitude($longitude);


            //On va chercher une référence de catégorie



            $excludedValues = [1, 5];
            $validValues = array_diff(range(1, 9), $excludedValues);
            $category = $this->getReference('cat-' . $validValues[array_rand($validValues)]);
            $product->setCategories($category);

            //On va chercher une référence de user
            $user = $this->getReference('user-' . rand(1, 30));
            $product->setAuthor($user);

            //On va chercher une référence de option
            $option = $this->getReference('opt-' . rand(1, 3));
            $product->addOption($option);

            //On va chercher une référence de option
            $option2 = $this->getReference('opt-' . rand(1, 3));
            $product->addOption($option2);

            $this->setReference('prod-' . $prod, $product);
            $manager->persist($product);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UsersFixtures::class
        ];
    }
}
