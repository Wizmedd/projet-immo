<?php

namespace App\Entity;



use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;



class PropertySearch
{

    /**
     * @var int
     */
    public $page = 1;

    /**
     * @var string
     */
    public $q = '';

    /**
     * @var int|null
     */
    public $maxPrice;

    /**
     * @var int|null
     */
    public $minPrice;



    /**
     * @var int|null
     * @Assert\Range(min=10, max=400)
     */
    private $minSurface;

    /**
     * @var int|null
     * @Assert\Range(min=0, max=12)
     */
    private $minBedRooms;


    /**
     * @var ArrayCollection
     */
    private $categories;

    /**
     * @var ArrayCollection
     */
    private $options;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->options = new ArrayCollection();
    }

    /**
     * @param int $page
     *
     * @return int
     */
    public function setpage(int $page)
    {
        $this->page = $page;
        return $this;
    }

    /**
     * @return int
     */
    public function getpage(): ?int
    {
        return $this->page;
    }


    /**
     * @return int|null
     */
    public function getMaxPrice(): ?int
    {
        return $this->maxPrice;
    }

    /**
     * @param int|null $maxPrice
     *
     * @return PropertySearch
     */
    public function setMaxPrice(int $maxPrice): PropertySearch
    {
        $this->maxPrice = $maxPrice;
        return $this;
    }

    /**
     * @return int|null
     */
    public function getMinPrice(): ?int
    {
        return $this->minPrice;
    }

    /**
     * @param int|null $minPrice
     *
     * @return PropertySearch
     */
    public function setMinPrice(int $minPrice): PropertySearch
    {
        $this->minPrice = $minPrice;
        return $this;
    }



    /**
     * @return int|null
     */
    public function getMinSurface(): ?int
    {
        return $this->minSurface;
    }

    /**
     * @param int|null $minSurface
     *
     * @return PropertySearch
     */
    public function setMinSurface(int $minSurface): PropertySearch
    {
        $this->minSurface = $minSurface;
        return $this;
    }

    /**
     * Get the value of minRoom
     *
     * @return  int|null
     */
    public function getMinBedRooms()
    {
        return $this->minBedRooms;
    }

    /**
     * Set the value of minRoom
     *
     * @param  int|null  $minRoom
     *
     * @return  self
     */
    public function setMinBedRooms($minBedRooms)
    {
        $this->minBedRooms = $minBedRooms;

        return $this;
    }


    /**
     * Get the value of categories
     *
     * @return  ArrayCollection
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * Set the value of categories
     *
     * @param  ArrayCollection  $categories
     *
     * @return  self
     */
    public function setCategories(ArrayCollection $categories)
    {
        $this->categories = $categories;

        return $this;
    }



    /**
     * Get the value of options
     *
     * @return  ArrayCollection
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Set the value of options
     *
     * @param  ArrayCollection  $options
     *
     * @return  self
     */
    public function setOptions(ArrayCollection $options)
    {
        $this->options = $options;

        return $this;
    }
}
