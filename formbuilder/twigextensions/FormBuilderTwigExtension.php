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
     * json_decode
     *
     * @param $json
     * @return mixed
     */
    public function json_decode($json) {
        return json_decode($json);
    }
}