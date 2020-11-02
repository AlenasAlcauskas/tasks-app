<?php

namespace App\Controller;

use App\Entity\Task;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskController extends AbstractController
{
    /**
     * @Route("/api/task/create", name="create_task")
     * @IsGranted("ROLE_USER")
     * @param Request $request
     * @param EntityManagerInterface $em
     * @param ValidatorInterface $validator
     * @return Response
     * @throws \Exception
     */
    public function createTask(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): Response {
        $decodedRequest = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();

        $task = new Task();
        $task->setTitle($decodedRequest['title']);
        $task->setComment($decodedRequest['comment']);
        $task->setDate(new \DateTime($decodedRequest['date']));
        $task->setTimeSpent($decodedRequest['time']);

        $errors = $validator->validate($task);
        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new JsonResponse(['message'=> $errorsString], Response::HTTP_BAD_REQUEST);
        }

        $authUser = $this->getUser();

        $realUser = $em->getRepository(User::class)->find($authUser->getId());

        $task->setUserId($realUser);

        $entityManager->persist($task);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Saved new task  with id ' . $task->getId()]);
    }

    /**
     * @Route("/api/tasks/get", name="get_tasks")
     * @IsGranted("ROLE_USER")
     * @return JsonResponse
     */
    public function getTasks()
    {
        $userId = $this->getUser()->getId();

        $tasks = $this->getDoctrine()->getRepository(Task::class)
            ->createQueryBuilder('t')
            ->where('t.userId = :userId')
            ->setParameter('userId', $userId)
            ->select('t.id, t.title, t.comment, t.timeSpent, DATE_FORMAT(t.date, \'%Y-%m-%d\') as date')
            ->getQuery();

        return new JsonResponse($tasks->getArrayResult());
    }

    /**
     * @Route("/api/task/{id}/delete", name="delete_task")
     * @IsGranted("ROLE_USER")
     * @param int $id
     * @return Response
     */
    public function deleteTask(int $id)
    {
        $task = $this->getDoctrine()->getRepository(Task::class)
            ->find($id);

        if ($this->getUser()->getId() === $task->getUserId()->getId()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($task);
            $em->flush();
        }
        return new Response(Response::HTTP_OK);
    }
}
