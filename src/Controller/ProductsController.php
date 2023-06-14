<?php

namespace App\Controller;

use App\Entity\Images;
use App\Entity\Products;
use App\Form\ProductsType;
use App\Service\PictureService;
use App\Repository\ProductsRepository;
use App\Repository\CategoriesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/biens', name: 'products_')]
class ProductsController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('products/index.html.twig');
    }


    #[Route('/nouveau', name: 'new_post')]
    #[IsGranted("ROLE_USER")]
    public function new(Request $request, EntityManagerInterface $em, SluggerInterface $slugger, PictureService $pictureService): Response
    {
        // $this->denyAccessUnlessGranted('ROLE_USER');

        //On crée un "nouveau produit"
        $product = new Products();

        // On crée le formulaire
        $productForm = $this->createForm(ProductsType::class, $product);

        // On traite la requête du formulaire
        $productForm->handleRequest($request);

        //On vérifie si le formulaire est soumis ET valide et que le nbre d'image est <4

        if ($productForm->isSubmitted() && $productForm->isValid()) {


            // On récupère les images
            $images = $productForm->get('images')->getData();

            if (count($images) < 4) {

                //on vérifie le nombre d'images


                foreach ($images as $image) {
                    // On définit le dossier de destination
                    $folder = '';

                    // On appelle le service d'ajout
                    $fichier = $pictureService->add($image, $folder);
                    //die;

                    $img = new Images();
                    $img->setName($fichier);
                    $product->addImage($img);
                }


                //on génère le slug
                $slug = $slugger->slug($product->getTitle());
                $product->setSlug($slug);



                // dd($product);



                //On fixe le nom du user

                $product->setAuthor($this->getUser());
                //dd($product);
                //on stocke
                $em->persist($product);
                $em->flush();

                $this->addFlash('success', "Votre annonce a bien été enregistré et sera traité dans un délais de 24 heures");

                return $this->redirectToRoute('main');
            }
            $this->addFlash('warning', "Vous ne pouvez déposer au maximum que 3 images por votre annonce.");
        }

        return $this->render('products/new.html.twig', [
            'productForm' => $productForm->createView()
        ]);
    }


    #[Route('/{slug}', name: 'details')]
    public function details(CategoriesRepository $categoriesRepository, Products $product): Response
    {
        return $this->render('products/details.html.twig', [
            'categories' => $categoriesRepository->findBy([], ['categoryOrder' => 'asc']),
            'product' => $product
        ]);
    }
}
