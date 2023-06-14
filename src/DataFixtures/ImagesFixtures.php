<?php

namespace App\DataFixtures;

use App\Entity\Images;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;


class ImagesFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {

        $arr = ["salon1.jpg", "salon2.jpg", "salon3.jpg", "salon4.jpg", "salon5.jpg", "salon6.jpg", "salon7.jpg", "salon8.jpg", "salon9.jpg", "cuisine1.jpg", "cuisine2.jpg", "cuisine3.jpg", "cuisine4.jpg", "cuisine5.jpg", "cuisine6.jpg", "cuisine7.jpg", "cuisine8.jpg"];
        for ($img = 1; $img <= 100; $img++) {
            $image = new Images();
            $image->setName($arr[array_rand($arr)]);
            // $image->setName($faker->image(null, 640, 480));
            $product = $this->getReference('prod-' . rand(1, 20));
            $image->setProducts($product);
            $manager->persist($image);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProductsFixtures::class
        ];
    }
}
