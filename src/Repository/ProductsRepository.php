<?php

namespace App\Repository;


use App\Entity\Products;
use App\Entity\PropertySearch;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Knp\Component\Pager\Pagination\PaginationInterface;
use Knp\Component\Pager\PaginatorInterface;

/**
 * @method Products|null find($id, $lockMode = null, $lockVersion = null)
 * @method Products|null findOneBy(array $criteria, array $orderBy = null)
 * @method Products[]    findAll()
 * @method Products[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, PaginatorInterface $paginator)
    {
        parent::__construct($registry, Products::class);
        $this->paginator = $paginator;
    }



    /**
     * @return Products[]
     */
    private function findVisibleQuery(): QueryBuilder
    {
        return $this->createQueryBuilder('p')
            ->select('c', 'p')
            ->join('p.categories', 'c')
            ->where('p.sold = false');
    }

    /**
     * @return Products[]
     */
    public function findLatest($limit): array
    {
        return $this->findVisibleQuery()
            ->orderBy('RAND()')
            ->setMaxResults($limit)
            ->getQuery()

            ->getResult();
    }



    /**
     * @return Query
     */
    public function findAllVisibleQuery()
    {
        $query = $this->findVisibleQuery();
        return $query->getQuery();
    }

    // /**
    //  * @return Products[] Returns an array of Products objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Products
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }



     /**
     * Récupère les produits en lien avec une recherche
     *
     */
    public function findSearch(PropertySearch $search)
    {
        $query = $this->getSearchQuery($search)->getQuery();
        return $query;
    }


    /**
     * Récupère le prix minimum et maximum correspondant à une recherche
     * @return integer[]
     */
    public function findMinMax(PropertySearch $search): array
    {
        $results = $this->getSearchQuery($search, true)
            ->select('MIN(p.price) as min', 'MAX(p.price) as max')
            ->getQuery()
            ->getScalarResult();
        return [(int)$results[0]['min'], (int)$results[0]['max']];
    }

    private function getSearchQuery(PropertySearch $search, $ignorePrice = false): QueryBuilder
    {
        $query = $this
            ->createQueryBuilder('p')
            ->select('c', 'p')
            ->join('p.categories', 'c')
            ->where('p.sold = false');

        if (!empty($search->q)) {
            // Split the search string into separate keywords using a regular expression
            $keywords = preg_split('/[\s,]+/', $search->q);

            $zips = [];
            $cities = [];

            foreach ($keywords as $key => $keyword) {
                if (is_numeric($keyword)) {
                    $zips[] = $keyword;
                } else {
                    $cities[] = $keyword;
                }
            }

            if (!empty($zips) && !empty($cities)) {
                // If we have both zip codes and cities, add WHERE clauses for both
                $query = $query
                    ->andWhere(
                        $query->expr()->orX(
                            $query->expr()->in('p.zipcode', $zips),
                            $query->expr()->in('p.city', $cities)
                        )
                    );
            } else if (!empty($zips)) {
                // If we only have zip codes, add a WHERE clause for those
                $query = $query
                    ->andWhere($query->expr()->in('p.zipcode', $zips));
            } else if (!empty($cities)) {
                // If we only have cities, add a WHERE clause for those
                $query = $query
                    ->andWhere($query->expr()->in('p.city', $cities));
            }
        }


        if (!empty($search->getMinPrice()) && $ignorePrice === false) {
            $query = $query
                ->andWhere('p.price >= :min')
                ->setParameter('min', $search->getMinPrice());
        }

        if (!empty($search->getMaxPrice()) && $ignorePrice === false) {
            $query = $query
                ->andWhere('p.price <= :max')
                ->setParameter('max', $search->getMaxPrice());
        }

        if ($search->getMinSurface()) {
            $query = $query
                ->andWhere('p.surface >= :minsurface')
                ->setParameter('minsurface', $search->getMinSurface());
        }

        if ($search->getMinBedRooms()) {
            $query = $query->andWhere('p.bedrooms >= :minbedrooms')
                ->setParameter('minbedrooms', $search->getMinBedRooms());
        }

        if (!empty($search->getCategories() && $search->getCategories()->count() > 0)) {
            $query = $query
                ->andWhere('c.id IN (:categories)')
                ->setParameter('categories', $search->getCategories());
        }

        if ($search->getOptions() != null && $search->getOptions()->count() > 0) {
            foreach ($search->getOptions() as $k => $option) {
                $query = $query
                    ->andWhere(":option$k MEMBER of p.options")
                    ->setParameter("option$k", $option);
            }
        }

        /*

           if ($search->getLat() && $search->getLng() && $search->getDistance()) {
            $query = $query
                ->andWhere('(6353 * 2 * ASIN(SQRT(POWER(SIN((p.lat - :lat) * pi()/180 / 2), 2) +COS(p.lat * pi()/180) * COS(:lat * pi()/180) * POWER(SIN((p.lng - :lng) * pi()/180 / 2), 2) ))) <= :distance')
                ->setParameter('lng', $search->getLng())
                ->setParameter('lat', $search->getLat())
                ->setParameter('distance', $search->getDistance())
            ;
        }
*/
        return $query;
    }

    /**
     * @return Products[] Returns an array of Products objects
     */

    public function findByZipField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.zipCode = :val')
            ->setParameter('val', $value)
            //->orderBy('p.id', 'ASC')
            //->setMaxResults(10)
            ->getQuery()
            ->getResult();
    }
}
