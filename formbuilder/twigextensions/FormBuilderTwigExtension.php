<?php
namespace Craft;

use Twig_Filter_Method;

class FormBuilderTwigExtension extends \Twig_Extension
{
    /**
     * Extension name
     */
    public function getName() {
        Craft::t('AddSpace');
    }

    /**
     * Extension filters
     *
     * @return array
     */
    public function getFilters() {
        return array(
            'addSpace' => new Twig_Filter_Method($this, 'addSpace'),
            'replaceUnderscoreWithSpace' => new Twig_Filter_Method($this, 'replaceUnderscoreWithSpace'),
            'checkArray' => new Twig_Filter_Method($this, 'checkArray'),
            'camelCase' => new Twig_Filter_Method($this, 'camelCase'),
            'uncamelCase' => new Twig_Filter_Method($this, 'uncamelCase'),
            'unescape' => new Twig_Filter_Method($this, 'unescape'),
            'timeAgo' => new Twig_Filter_Method($this, 'getTimeAgo'),
            'formatBytes' => new Twig_Filter_Method($this, 'formatBytes'),
            'browser' => new Twig_Filter_Method($this, 'browser'),
            'getClass' => new Twig_Filter_Method($this, 'getClass'),
            'json_decode' => new Twig_Filter_Method($this, 'json_decode')
        );
    }

    /**
     * Add Space
     *
     * @param $string
     * @return string
     */
    public function addSpace($string) {
        $addSpace = preg_replace('/(?<!\ )[A-Z]/', ' $0', $string);
        $fullString = ucfirst($addSpace);

        return $fullString;
    }

    /**
     * Replace Underscore With Space
     *
     * @param $string
     * @return mixed
     */
    public function replaceUnderscoreWithSpace($string) {
        $output = str_replace('_', ' ', $string);

        return $output;
    }

    /**
     * Check Array
     *
     * @param $array
     * @return bool
     */
    public function checkArray($array) {
        $check = is_array($array);

        return $check;
    }

    /**
     * Camel Case
     *
     * @param $str
     * @return mixed|string
     */
    public function camelCase($str) {
        $i = array("-","_");
        $str = preg_replace('/([a-z])([A-Z])/', "\\1 \\2", $str);
        $str = preg_replace('@[^a-zA-Z0-9\-_ ]+@', '', $str);
        $str = str_replace($i, ' ', $str);
        $str = str_replace(' ', '', ucwords(strtolower($str)));
        $str = strtolower(substr($str,0,1)).substr($str,1);

        return $str;
    }

    /**
     * Uncamel Case :P
     *
     * @param $str
     * @return mixed|string
     */
    public function uncamelCase($str) {
        $str = preg_replace('/([a-z])([A-Z])/', "\\1_\\2", $str);
        $str = strtolower($str);

        return $str;
    }

    /**
     * Unescape
     *
     * @param $str
     * @return string
     */
    public function unescape($str) {
        return html_entity_decode($str);
    }

    /**
     * Get clean element class name
     *
     * @param $object
     * @return string
     */
    public function getClass($object)
    {
        return (new \ReflectionClass($object))->getShortName();
    }


    /**
     * json_decode
     *
     * @param $json
     * @return mixed
     */
    public function json_decode($json) {
        return json_decode($json, true);
    }

    /**
     * Get user friend time ago value
     *
     * @param $time
     * @return string
     */
    public function getTimeAgo($time)
    {
        $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
        $lengths = array("60","60","24","7","4.35","12","10");

        $now = time();
        $difference     = $now - strtotime($time);

        for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
            $difference /= $lengths[$j];
        }

        $difference = round($difference);

        if($difference != 1) {
            $periods[$j].= "s";
        }

        return "$difference $periods[$j]";
    }

    /**
     * Get browser from user-agent string
     *
     * @param $browser
     */
    public function browser($browser)
    {
        if(strpos($browser, 'MSIE') !== FALSE)
            echo 'Internet explorer';
        elseif(strpos($browser, 'Trident') !== FALSE) //For Supporting IE 11
            echo 'Internet explorer';
        elseif(strpos($browser, 'Firefox') !== FALSE)
            echo 'Mozilla Firefox';
        elseif(strpos($browser, 'Chrome') !== FALSE)
            echo 'Google Chrome';
        elseif(strpos($browser, 'Opera Mini') !== FALSE)
            echo "Opera Mini";
        elseif(strpos($browser, 'Opera') !== FALSE)
            echo "Opera";
        elseif(strpos($browser, 'Safari') !== FALSE)
            echo "Safari";
        else
            echo 'Unknown';
    }

    /**
     * Format bytes to ...
     *
     * @param $bytes
     * @param int $precision
     * @return string
     */
    public function formatBytes($bytes, $precision = 0)
    {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        // Uncomment one of the following alternatives
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

