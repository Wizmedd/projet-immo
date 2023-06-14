<?php

namespace App\DataFixtures;


use App\Entity\Options;
use Doctrine\Bundle\FixturesBundle\Fixture;

use Doctrine\Persistence\ObjectManager;


class OptionsFixtures extends Fixture
{
    private $counter = 1;

    public function __construct(){}

    public function load(ObjectManager $manager): void
    {



        $this->createOption('Balcon', $manager);
        $this->createOption('Terrasse', $manager);
        $this->createOption('Jardin', $manager);


        $manager->flush();
    }

    public function createOption(string $name, ObjectManager $manager )
    {
        $option = new Options();
        $option->setName($name);


        $manager->persist($option);

        $this->addReference('opt-'.$this->counter, $option);
        $this->counter++;

        return $option;
    }


}
