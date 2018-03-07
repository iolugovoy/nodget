<?php
require_once 'app_YaDummy.php';
if (!is_dir('cache')) {
    mkdir('cache');
}
$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::title();
    $strings[] = $string;
    echo 'title: '.$string."\n";
}
file_put_contents('cache/title', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::phrase();
    $strings[] = $string;
    echo 'phrase: '.$string."\n";
}
file_put_contents('cache/phrase', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::paragraph();
    $strings[] = $string;
    echo 'paragraph: '.$string."\n";
}
file_put_contents('cache/paragraph', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::paragraphs();
    $strings[] = $string;
    echo 'paragraphs: '.$string."\n";
}
file_put_contents('cache/paragraphs', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::word();
    $strings[] = $string;
    echo 'word: '.$string."\n";
}
file_put_contents('cache/word', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::person();
    $strings[] = $string;
    echo 'person: '.json_encode($string)."\n";
}
file_put_contents('cache/person', serialize($strings));

$strings = [];
for ($i = 0; $i < 100; $i++) {
    $string = YaDummy::date();
    $strings[] = $string;
    echo 'date: '.$string."\n";
}
file_put_contents('cache/date', serialize($strings));