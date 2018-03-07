<?php

class app_YaDummy {

    public static function title() {
        $matches = [];
        while(!isset($matches[1])) {
            $resp = file_get_contents('https://yandex.ru/referats/write/?t=astronomy+geology+gyroscope+literature+marketing+mathematics+music+polit+agrobiologia+law+psychology+geography+physics+philosophy+chemistry+estetica&s='.mt_rand(1,99999));
            preg_match('/<strong>Тема: «(.*?)»<\/strong>/', $resp, $matches);
        }
        return html_entity_decode($matches[1]);
    }

    public static function phrase() {
        return file_get_contents('https://yandex.ru/referats/creator/write/?t=hgfh&s='.mt_rand(1,99999));
    }

    public static function paragraph() {
        $matches = [];
        while(!isset($matches[1])) {
            $resp = file_get_contents('https://yandex.ru/referats/write/?t=astronomy+geology+gyroscope+literature+marketing+mathematics+music+polit+agrobiologia+law+psychology+geography+physics+philosophy+chemistry+estetica&s='.mt_rand(1,99999));
            preg_match('/<p>(.+?)<\/p>/s', $resp, $matches);
        }
        return html_entity_decode($matches[1]);
    }

    public static function paragraphs() {
        $matches = [];
        while(!isset($matches[0])) {
            $resp = file_get_contents('https://yandex.ru/referats/write/?t=astronomy+geology+gyroscope+literature+marketing+mathematics+music+polit+agrobiologia+law+psychology+geography+physics+philosophy+chemistry+estetica&s='.mt_rand(1,99999));
            preg_match('/<p>(.*)<\/p>/s', $resp, $matches);
        }
        return html_entity_decode($matches[0]);
    }

    public static function word() {
        $matches = [];
        while(!isset($matches[1]) || !$matches[1]) {
            $resp = file_get_contents('http://megagenerator.ru/words/?c='.mt_rand(1,99999));
            preg_match('/<div>\s*(.*?)\s*<\/div>/s', $resp, $matches);
        }
        return html_entity_decode($matches[1]);
    }

    //fname, lname, userpic, phone, email
    public static function person() {
        $person = @json_decode(file_get_contents('http://randus.ru/api.php'), true);
        $person['email'] = mb_strtolower(Helpers::translit($person['fname'])).'@test.ru';
        return $person;
    }

    public static function date() {
        $date = new DateTime();
        return $date->sub(new DateInterval('P'.mt_rand(0,5).'D'))->format('Y-m-d H:i:s');
    }

}

/**
 * Class YaDummy_cached
 * @method static title()
 * @method static phrase()
 * @method static paragraph()
 * @method static paragraphs()
 * @method static word()
 * @method static person()
 * @method static date()
 */
class app_YaDummy_cached {

    public static function __callStatic($name, $arguments) {
        $array = unserialize(file_get_contents('cache/'.$name));
        return $array[mt_rand(0,99)];
    }

}