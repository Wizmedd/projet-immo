<?php

namespace App\DataFixtures;

use App\Entity\Categories;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\String\Slugger\SluggerInterface;

class CategoriesFixtures extends Fixture
{
    private $counter = 1;

    public function __construct(private SluggerInterface $slugger)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $parent = $this->createCategory('Maison', null, $manager, '1');


        $this->createCategory('Maison plain pied', $parent, $manager, '2');
        $this->createCategory('Maison mitoyenne', $parent, $manager, '3');
        $this->createCategory('Villa', $parent, $manager, '4');

        $parent = $this->createCategory('Appartement', null, $manager, '5');

        $this->createCategory('Loft', $parent, $manager, '6');
        $this->createCategory('Duplex', $parent, $manager, '7');
        $this->createCategory('Rooftop', $parent, $manager, '8');
        $this->createCategory('Souplex', $parent, $manager, '9');

        $manager->flush();
    }

    public function createCategory(string $name, Categories $parent = null, ObjectManager $manager, int $int)
    {
        $category = new Categories();
        $category->setName($name);
        $category->setSlug($this->slugger->slug($category->getName())->lower());
        $category->setParent($parent);
        $category->setCategoryOrder($int);

        $manager->persist($category);

        $this->addReference('cat-' . $this->counter, $category);
        $this->counter++;

        return $category;
    }
}
