<?php

namespace App\Entity;



use App\Entity\Trait\SlugTrait;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Trait\CreatedAtTrait;
use App\Repository\ProductsRepository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Mapping\Annotation\UploadableField;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;




#[ORM\Entity(repositoryClass: ProductsRepository::class)]
#[UniqueEntity('title', message: 'Ce titre est déjà utilisé pour une autre annonce, veuillez le modifier svp.')]
#[Vich\Uploadable]
class Products
{
    use CreatedAtTrait;
    use SlugTrait;

    const HEAT = [
        0 => 'Électrique',
        1 => 'Gaz'
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;







    #[ORM\Column(type: 'integer')]
    private $heat;


    #[ORM\Column(type: 'string', length: 255, unique: true)]
    #[Assert\NotBlank(message: 'Le titre de votre annonce ne peut pas être vide')]
    #[Assert\Length(
        min: 20,
        max: 255,
        minMessage: 'Le titre doit faire au moins {{ limit }} caractères',
        maxMessage: 'Le titre ne doit pas faire plus de {{ limit }} caractères'
    )]
    private $title;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank(message: 'La description de votre annonce ne peut pas être vide')]
    #[Assert\Length(
        min: 100,
        max: 500,
        minMessage: "La description de votre annonce doit faire au moins {{ limit }} caractères",
        maxMessage: 'La description de votre annonce ne doit pas faire plus de {{ limit }} caractères'
    )]
    private $description;

    #[ORM\Column(type: 'integer')]
    #[Assert\Positive(message: 'Le prix de votre bien ne peut pas être négatif ou nul')]
    #[Assert\GreaterThan(
        4999,
        message: 'Le prix de votre bien doit être supérieur ou égal à 5000 €'
    )]
    private $price;

    #[ORM\Column(type: 'string', length: 255)]
    private $address;

    #[ORM\Column(type: 'string', length: 5)]
    private $zipcode;

    #[ORM\Column(type: 'string', length: 150)]
    private $city;

    #[ORM\Column(type: 'integer')]
    #[Assert\GreaterThan(
        8,
        message: 'La surface de votre bien doit être supérieur ou égal à 9 m²'
    )]
    #[Assert\LessThan(
        value: 1001,
        message: 'La surface de votre bien doit être inférieur ou égal à 1000 m²'
    )]
    private $surface;

    #[ORM\Column(type: 'integer')]
    #[Assert\Positive(message: 'Le nombre de pièce(s) de votre bien ne peut pas être négatif ou nul')]
    private $rooms;

    #[ORM\Column(type: 'integer')]
    #[Assert\PositiveOrZero(message: 'Le nombre de chambre(s) de votre bien ne peut pas être négatif')]
    #[Assert\Expression(
        " value <= this.getRooms() ",
        message: 'Le nombre de chambre(s) ne peut être supérieur au nombre de pièce(s) du bien',
    )]
    private $bedrooms;

    #[Assert\GreaterThan(
        -1,
        message: "L'étage du bien doit être supérieur ou égal à -1"
    )]
    #[ORM\Column(type: 'integer')]
    private $floor;

    #[ORM\Column(type: 'boolean')]
    private $sold = false;





    #[ORM\ManyToOne(targetEntity: Categories::class, inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private $categories;

    #[ORM\OneToMany(mappedBy: 'products', targetEntity: Images::class, orphanRemoval: true, cascade: ['persist'])]
    private $images;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Users $author = null;

    #[ORM\ManyToMany(targetEntity: Options::class, inversedBy: 'products')]
    private Collection $options;

    #[ORM\Column]
    private ?float $latitude = null;

    #[ORM\Column]
    private ?float $longitude = null;





    public function __construct()
    {
        $this->images = new ArrayCollection();


        $this->created_at = new \DateTimeImmutable();



        $this->options = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getSurface(): ?int
    {
        return $this->surface;
    }

    public function setSurface(int $surface): self
    {
        $this->surface = $surface;

        return $this;
    }

    public function getRooms(): ?int
    {
        return $this->rooms;
    }

    public function setRooms(int $rooms): self
    {
        $this->rooms = $rooms;

        return $this;
    }
    public function getFloor(): ?int
    {
        return $this->floor;
    }

    public function setFloor(int $floor): self
    {
        $this->floor = $floor;

        return $this;
    }

    public function getBedrooms(): ?int
    {
        return $this->bedrooms;
    }

    public function setBedrooms(int $bedrooms): self
    {
        $this->bedrooms = $bedrooms;

        return $this;
    }


    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): self
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getFormattedPrice(): string
    {
        return number_format($this->price, 0, '', ' ');
    }

    public function getHeat(): ?int
    {
        return $this->heat;
    }

    public function setHeat(int $heat): self
    {
        $this->heat = $heat;

        return $this;
    }

    public function getHeatType(): string
    {
        return self::HEAT[$this->heat];
    }

    public function getSold(): ?bool
    {
        return $this->sold;
    }

    public function setSold(bool $sold): self
    {
        $this->sold = $sold;

        return $this;
    }

    public function getCategories(): ?Categories
    {
        return $this->categories;
    }

    public function setCategories(?Categories $categories): self
    {
        $this->categories = $categories;

        return $this;
    }

    /**
     * @return Collection|Images[]
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Images $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setProducts($this);
        }

        return $this;
    }

    public function removeImage(Images $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProducts() === $this) {
                $image->setProducts(null);
            }
        }

        return $this;
    }

    public function getAuthor(): ?Users
    {
        return $this->author;
    }

    public function setAuthor(?Users $author): self
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection<int, Options>
     */
    public function getOptions(): Collection
    {
        return $this->options;
    }

    public function addOption(Options $option): self
    {
        if (!$this->options->contains($option)) {
            $this->options->add($option);
            $option->addProduct($this);
        }

        return $this;
    }

    public function removeOption(Options $option): self
    {
        if ($this->options->removeElement($option)) {
            $option->removeProduct($this);
        }

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }
}
