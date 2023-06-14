<?php

namespace App\Form;

use App\Entity\Options;
use App\Entity\Products;
use App\Entity\Categories;
use App\Repository\OptionsRepository;
use App\Repository\CategoriesRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\Valid;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

class ProductsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder

            ->add('title', options: [
                'label' => 'Titre de l\'annonce <span class="badge rounded-pill bg-danger">* obligatoire</span>',
                'label_html' => true
            ])

            ->add('categories', EntityType::class, [

                'class' => Categories::class,
                'choice_label' => 'name',
                'attr' => [

                    'class' => 'cat'

                ],
                'label' => "Type de bien",
                'group_by' => 'parent.name',
                'query_builder' => function (CategoriesRepository $cr) {

                    return $cr->createQueryBuilder('c')
                        ->where('c.parent IS NOT NULL')
                        ->orderBy('c.name', 'ASC');
                }


            ])

            ->add('description', options: [
                'label' => "Description du bien"
            ])
            ->add('price', options: [
                'label' => "Prix",
                'help' => '€',
                'attr' => array(
                    'placeholder' => 'Prix de votre bien net vendeur'

                ),
                'row_attr' => [
                    'class' => 'input-group mb-3',
                ],

            ])
            ->add('address', options: [
                'label' => "Adresse (ex: 180 rue des lilas)", 'attr' => [

                    'class' => 'adresse',


                ]

            ])
            ->add('zipcode', options: [
                'label' => "Code postal", 'attr' => [

                    'class' => 'cp',


                ]
            ])
            ->add('city', options: [
                'label' => "Ville", 'attr' => [

                    'class' => 'ville',


                ]
            ])
            ->add('latitude', HiddenType::class, [
                'label' => "Latitude", 'attr' => [

                    'class' => 'lat',


                ]
            ])
            ->add('longitude', HiddenType::class, [
                'label' => "Longitude", 'attr' => [

                    'class' => 'lon',


                ]
            ])
            ->add('surface', options: [
                'label' => "Surface en m²"
            ])
            ->add('rooms', options: [
                'label' => "Nombre de pièce(s)"
            ])
            ->add('bedrooms', options: [
                'label' => "Nombre de chambre(s)"
            ])
            ->add('floor', options: [
                'label' => "Etage"
            ])




            ->add('images', FileType::class, [
                'required' => false,
                'label' => false,
                'multiple' => true,
                'mapped' => false,
                'constraints' => [
                    new All([

                        new File(
                            [
                                'maxSize' => '2M',
                                "mimeTypes" => [
                                    "image/jpg",
                                    "image/jpeg"

                                ],
                                'maxSizeMessage' => "La taille des images ne doit pas être supérieur à 2 MB"
                            ]
                        )
                    ]),
                    new Valid(),
                ],






            ])





            ->add('heat', ChoiceType::class, [
                'choices' => $this->getChoices(),
                'label' => "Type de chauffage"
            ])
            ->add('options', EntityType::class, [
                'class' => Options::class,
                'required' => false,
                'label' => 'Extérieur',
                'choice_label' => 'name',
                'multiple' => true,
                'attr' => [

                    'class' => 'opt',


                ]



            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Products::class,
        ]);
    }

    private function getChoices()
    {
        $choices = Products::HEAT;
        $output = [];
        foreach ($choices as $key => $choice) {
            $output[$choice] = $key;
        }
        return $output;
    }
}
