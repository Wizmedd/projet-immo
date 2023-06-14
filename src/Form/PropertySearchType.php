<?php

namespace App\Form;

use App\Entity\Options;
use App\Entity\Categories;
use App\Entity\PropertySearch;
use Doctrine\ORM\EntityRepository;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\RangeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;

class PropertySearchType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder





            ->add('minSurface', RangeType::class, [
                'required' => false,
                'label' => false,
                'attr' => [
                    'placeholder' => 'Surface minimale',
                    'step' => '5',
                    'min' => '10',
                    'max' => '400',
                    'Default value' => '10',
                    'empty_data' => 'Default value',
                    'onchange' => 'updateValue(this)'


                ]
            ])

            ->add('minBedRooms', IntegerType::class, [
                'required' => false,
                'label' => false,
                'attr' => [
                    'placeholder' => 'Nombre minimum de chambre',
                    'class' => 'w-100'
                ]
            ])

            ->add('minPrice', IntegerType::class, [
                'label' => 'Prix minimum',
                'required' => false,
                //'grouping' => true,
                //'scale' => 0,
                'attr' => [
                    'placeholder' => 'Prix min €'

                ]
            ])

            ->add('maxPrice', IntegerType::class, [
                'label' => 'Prix maximum',
                'required' => false,
                'attr' => [
                    'placeholder' => 'Prix max €'

                ]
            ])

            ->add('q', TextType::class, [
                'required' => false,
                'label' => false,


                'attr' => [

                    'placeholder' => "Saisissez une ville ou un code postal",

                    'class' => 'q form-control text-center',





                ]

            ])



            ->add('categories', EntityType::class, [
                'required' => false,
                'label' => false,
                'class' => Categories::class,
                'choice_label' => 'name',
                'choice_attr' => function ($category) {
                    return ['class' => 'cat-' . $category->getId()];
                },
                'group_by' => function ($category) {
                    $parent = $category->getParent();
                    if ($parent) {
                        return $parent->getName();
                    } else {
                        return
                            'Tous les types de :';
                    }
                },
                'multiple' => true,
                'attr' => [
                    'class' => 'cat'
                ],
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('c')

                        ->leftJoin('c.parent', 'p')
                        ->addSelect('p')
                        ->orderBy('c.id', 'ASC');
                }
            ])

            ->add('options', EntityType::class, [
                'required' => false,
                'label' => false,
                'class' => Options::class,
                'choice_label' => 'name',

                'multiple' => true,
                'attr' => [

                    'class' => 'opt',


                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PropertySearch::class,
            'min' => 'min',
            'method' => 'get',
            'csrf_protection' => false,
            'attr' => ['autocomplete' => 'off'],
            'allow_extra_fields' => true
            /*'attr'=>['autocomplete' => 'off']*/
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }
}
