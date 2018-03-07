<?php
require_once 'app_YaDummy.php';
$id = 6;
function mb_ucfirst($str) {
    $fc = mb_strtoupper(mb_substr($str, 0, 1));
    return $fc.mb_substr($str, 1);
}
function createList($level = 0): array {
    global $id;
    $count = mt_rand(3,10);
    $result = [];
    for ($i = 0; $i < $count; $i++) {
        $parent = !mt_rand(0,2) && ($level <= 5);
        $item = [
            'id' => $id++,
            'link' => '#'.$id,
            'active' => false,
            'current' => false,
            'title' => mb_ucfirst(app_YaDummy_cached::phrase())
        ];
        if ($parent) {
            $item['title'] .= '->';
            $item['children'] = createList($level+1);
        }
        $result[] = $item;
    }
    return $result;
}
function findCurrent($currentID, &$array) {
    for ($i = 0; $i < count($array); $i++) {
        if ($currentID === $array[$i]['id']) {
            $array[$i]['current'] = true;
            $array[$i]['active'] = true;
            return true;
        } else if (isset($array[$i]['children']) && findCurrent($currentID, $array[$i]['children'])) {
            $array[$i]['active'] = true;
            return true;
        }
    }
    return false;
}
$result = [
    [
        'id' => 1,
        'link' => '#1',
        'active' => true,
        'current' => false,
        'mod' => 'production',
        'title' => 'Продукция'
    ], [
        'id' => 2,
        'link' => '#2',
        'active' => false,
        'current' => false,
        'mod' => 'services',
        'title' => 'Услуги'
    ], [
        'id' => 3,
        'link' => '#3',
        'active' => false,
        'current' => false,
        'title' => 'Доставки и оплата'
    ], [
        'id' => 4,
        'link' => '#4',
        'active' => false,
        'current' => false,
        'title' => 'О компании'
    ], [
        'id' => 5,
        'link' => '#5',
        'active' => false,
        'current' => false,
        'title' => 'Контакты'
    ]
];
$result[0]['children'] = createList(1);
$result[1]['children'] = createList(1);
findCurrent(mt_rand(6,$id-1), $result);
$json = json_encode($result);
file_put_contents('nav.json', $json);
echo $json;