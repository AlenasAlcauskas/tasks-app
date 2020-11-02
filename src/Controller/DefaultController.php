<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/logout", name="app_logout")
     */
    public function logOut(){
    }

    /**
     * @return Response
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
    }
}