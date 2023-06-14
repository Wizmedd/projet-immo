<?php

namespace App\Controller;

use App\Entity\PropertySearch;
use App\Form\PropertySearchType;
use App\Repository\ProductsRepository;
use App\Repository\CategoriesRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MainController extends AbstractController
{
    #[Route('/', name: 'main')]
    public function index(CategoriesRepository $categoriesRepository, ProductsRepository $productsRepository, PaginatorInterface $paginator, Request $request): Response
    {
        $search = new PropertySearch();
        $search->page = $request->get('page', 1);
        $form = $this->createForm(PropertySearchType::class, $search);
        $form->handleRequest($request);

        $products =  $paginator->paginate(
            $productsRepository->findLatest(50),
            $request->query->getInt('page', 1),
            /*page number*/
            8
        );

        [$min, $max] = $productsRepository->findMinMax($search);

        if ($request->get('ajax')) {
            return new JsonResponse([
                'content' => $this->renderView('_partials/_home_products.html.twig', [
                    'products' => $products,

                ]),

                'pagination' => $this->renderView('_partials/_pagination.html.twig', ['products' => $products]),
                'pages' => ceil($products->getTotalItemCount() / $products->getItemNumberPerPage()),
                'min' => $min,
                'max' => $max

                //'sorting' => $this->renderView('product/_sorting.html.twig', ['products' => $products]),
                //'pagination' => $this->renderView('product/_pagination.html.twig', ['products' => $products]),

            ]);
        }



        //dump($min, $max);
        $properties = $paginator->paginate(
            $productsRepository->findSearch($search),
            $request->query->getInt('page', 1),
            /*page number*/
            12, /*limit per page*/
            [
                'defaultSortFieldName'      => 'p.price',
                'defaultSortDirection' => 'asc'
            ]
        );
        $properties->setCustomParameters([
            'align' => 'center', # center|right (for template: twitter_bootstrap_v4_pagination)
            'size' => 'small', # small|large (for template: twitter_bootstrap_v4_pagination)
            'style' => 'bottom',
            'span_class' => 'whatever',
        ]);


        if ($request->isXmlHttpRequest() && !$request->get('ajax')) {
            return new JsonResponse([
                'content' => $this->renderView('_partials/_products.html.twig', [
                    'products' => $properties,

                ]),
                'sorting' => $this->renderView('_partials/_sorting.html.twig', ['products' => $properties]),
                'pagination' => $this->renderView('_partials/_pagination.html.twig', ['products' => $properties]),
                'min' => $min,
                'max' => $max

                //'sorting' => $this->renderView('product/_sorting.html.twig', ['products' => $products]),
                //'pagination' => $this->renderView('product/_pagination.html.twig', ['products' => $products]),

            ]);
        }





        if ($form->isSubmitted() && $form->isValid()) {



            if ($properties === []) {

                return new Response("Votre recherche n'a donné aucun résultat");
            }


            return $this->render('search/index.html.twig', [
                'products'   => $properties,
                'form'         => $form->createView(),
                'min' => $min,
                'max' => $max

            ]);
        }




        return $this->render('main/index.html.twig', [
            'categories' => $categoriesRepository->findBy([], ['categoryOrder' => 'asc']),
            'products' => $products,
            'form'         => $form->createView(),
            'min' => $min,
            'max' => $max
            //'pagination' => $this->renderView('_partials/_pagination.html.twig', ['products' => $products]),



        ]);
    }


    #[Route('/search', name: 'search')]
    public function search(ProductsRepository $productsRepository, Request $request, PaginatorInterface $paginator): Response
    {
        $search = new PropertySearch();
        $search->page = $request->get('page', 1);
        $form = $this->createForm(PropertySearchType::class, $search);
        $form->handleRequest($request);




        [$min, $max] = $productsRepository->findMinMax($search);

        dump($min, $max);
        $products = $paginator->paginate(
            $productsRepository->findAllVisibleQuery(),
            $request->query->getInt('page', 1), /*page number*/
            12 /*limit per page*/
        );
        $products->setCustomParameters([
            'align' => 'center', # center|right (for template: twitter_bootstrap_v4_pagination)
            'size' => 'small', # small|large (for template: twitter_bootstrap_v4_pagination)
            'style' => 'bottom',
            //'span_class' => 'whatever',
        ]);


        if ($request->get('ajax')) {
            return new JsonResponse([
                'content' => $this->renderView('partials/_products.html.twig', [
                    'products' => $products,
                ]),
                'sorting' => $this->renderView('_partials/_sorting.html.twig', ['products' => $products]),
                //'pagination' => $this->renderView('product/_pagination.html.twig', ['products' => $products]),
                'pages' => ceil($products->getTotalItemCount() / $products->getItemNumberPerPage()),
                'min' => $min,
                'max' => $max



            ]);
        }

        if ($form->isSubmitted() && $form->isValid()) {



            if ($products === []) {

                return new Response("Votre recherche n'a donné aucun résultat");
            }


            return $this->render('search/index.html.twig', [
                'products'   => $products,
                'form'         => $form->createView(),
                'min' => $min,
                'max' => $max


            ]);
        }

        return $this->render('search/index.html.twig', [

            'products' => $products,
            'form'         => $form->createView(),
            'min' => $min,
            'max' => $max

        ]);
    }


    #[Route('/vendre_votre_bien', name: 'new')]
    public function poster(): Response
    {
        return $this->render('products/poster.html.twig');
    }
}
