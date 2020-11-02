<?php

namespace App\Controller;

use App\Security\LoginAuthenticator;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use Symfony\Component\Security\Guard\GuardAuthenticatorHandler;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController
{
    /**
     * @Route("/api/user/register")
     * @param Request $request
     * @param EntityManagerInterface $em
     * @param GuardAuthenticatorHandler $guardHandler
     * @param LoginAuthenticator $authenticator
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function register(
        Request $request,
        EntityManagerInterface $em,
        GuardAuthenticatorHandler $guardHandler,
        LoginAuthenticator $authenticator,
        ValidatorInterface $validator
    ) {
        try {
            $userToSave = $em->getRepository(User::class)->registerUser($request);

            $errors = $validator->validate($userToSave);
            if (count($errors) > 0) {
                $errorsString = (string)$errors;
                return new JsonResponse(['message' => $errorsString], Response::HTTP_BAD_REQUEST);
            }

            $em->persist($userToSave);
            $em->flush();

            $guardLoginStatus = $guardHandler->authenticateUserAndHandleSuccess(
                $userToSave,
                $request,
                $authenticator,
                'main'
            )->getStatusCode();

            return new JsonResponse(
                [
                    'registration' => 'success',
                    'logInStatus' => $guardLoginStatus,
                    'redirect' => '/tasks'
                ]
            );
        } catch (Exception $e) {
            return new JsonResponse(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/api/user/login")
     * @return void
     */
    public function login(){}
}
