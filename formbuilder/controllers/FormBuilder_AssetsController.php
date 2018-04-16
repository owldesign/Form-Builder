<?php
namespace Craft;


class FormBuilder_AssetsController extends BaseController
{
    protected $allowAnonymous = true;

    /**
     * Download all files
     *
     * @throws Exception
     */
    public function actionDownloadAllFiles()
    {
        $this->requireAjaxRequest();

        $params = craft()->request->getParam('params');
        $assets = [];


        if (empty($params['assets'])) {

            $this->returnJson(array(
                'success' => true
            ));
        }

        foreach ($params['assets'] as $id => $value) {
            $assets[] = craft()->assets->getFileById($id);
        }

        $zipPath = craft()->path->getTempPath() . '/' . 'assets-' . pathinfo($params['entryId'], PATHINFO_FILENAME) . '.zip';



        if (is_file($zipPath)) {
            try {
                unlink($zipPath);
            } catch (ErrorException $e) {
                FormBuilderPlugin::log("Unable to delete the file \"{$zipPath}\": ".$e->getMessage(), __METHOD__);
            }
        }

        $zip = new \ZipArchive();

        if ($zip->open($zipPath, \ZipArchive::CREATE) !== true) {
            throw new Exception('Cannot create zip at ', $zipPath);
        }

        foreach ($assets as $asset) {
            $zip->addFromString($asset->filename, file_get_contents($asset->url));
        }

        $filePath = $zip->filename;
        $zip->close();

        $this->returnJson(array(
            'downloadFile' => $filePath
        ));
    }

    /**
     * Download file
     *
     * @return null|void
     */
    public function actionDownloadFile()
    {
        $filePath = craft()->request->getParam('filename');

        if (IOHelper::fileExists($filePath)) {
            craft()->request->sendFile(IOHelper::getFileName($filePath), IOHelper::getFileContents($filePath), array(
                'forceDownload' => true
            ));
        }
    }

}