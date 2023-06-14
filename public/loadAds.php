<?php
// On autorise les requêtes Ajax pour toutes les sources
header('Access-Control-Allow-Origin: *');

// On vérifie qu'on utilise la méthode GET
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Ici on utilise la méthode GET
    // On se connecte à la base
    require_once('connect.php');

    // // On récupère les données dans la base


    $sql = "SELECT p.id,p.surface,p.bedrooms,p.price, p.rooms, p.zipcode AS zipcode, p.title, p.latitude, p.longitude, p.slug, GROUP_CONCAT(i.name ORDER BY i.name ) AS `images`, GROUP_CONCAT(po.options_id ORDER BY po.options_id ) AS `products_options`, GROUP_CONCAT(o.name ORDER BY o.name) AS `options`, c.name AS `categories`
FROM `products` p
LEFT JOIN images i ON p.id = i.products_id
LEFT JOIN products_options po ON po.products_id = p.id
LEFT JOIN options o ON o.id = po.options_id
LEFT JOIN categories c ON c.id = p.categories_id
GROUP BY p.id
HAVING zipcode =:zip
";
    $query = $db->prepare($sql);

    $query->bindValue(':zip', $_GET['zipcode'], PDO::PARAM_STR);

    $query->execute();
    $result = $query->fetchAll();


    // // On envoie le code de confirmation
    http_response_code(200);

    // // On envoie les données en json
    echo json_encode($result);

    // On se déconnecte de la base
    require_once('close.php');
} else {
    http_response_code(405);
    echo 'La méthode n\'est pas autorisée';
}
