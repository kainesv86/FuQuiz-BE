import { QuizService } from './../quiz/quiz.service';
import { LessonQuizService } from './../lesson-quiz/lesson-quiz.service';
import { LessonDetailService } from './../lesson-detail/lesson-detail.service';
import { SubjectTopicService } from './../subject-topic/subject-topic.service';
import { Lesson, LessonDetail, LessonQuiz, SubjectTopic } from './../core/models';
import { SubjectService } from './../subject/subject.service';
import { LessonTypeService } from './../lesson-type/lesson-type.service';
import { ExpertGuard } from './../auth/guard';
import { JoiValidatorPipe } from './../core/pipe';
import { ResponseMessage } from './../core/interface';
import { Body, Controller, Get, HttpException, Param, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateLessonDTO, vCreateLessonDTO } from './dto';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService,
        private readonly lessonTypeService: LessonTypeService,
        private readonly subjectService: SubjectService,
        private readonly subjectTopicService: SubjectTopicService,
        private readonly lessonDetailService: LessonDetailService,
        private readonly lessonQuizService: LessonQuizService,
        private readonly quizService: QuizService,
    ) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    async cGetLessonById(@Param('id') id: string, @Res() res: Response) {
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(lesson);
    }

    @Post('')
    @UseGuards(ExpertGuard)
    @UsePipes(new JoiValidatorPipe(vCreateLessonDTO))
    async cCreateLesson(@Res() res: Response, @Body() body: CreateLessonDTO) {
        const lessonType = await this.lessonTypeService.getLessonTypeByField('id', body.type);
        if (!lessonType) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);

        const newLesson = new Lesson();
        newLesson.name = body.name;
        newLesson.order = body.order;

        await this.lessonService.saveLesson(newLesson);

        if (lessonType.name === 'Subject Topic') {
            const subjectTopic = new SubjectTopic();
            subjectTopic.lesson = newLesson;
            await this.subjectTopicService.saveSubjectTopic(subjectTopic);
        }

        if (lessonType.name === 'Lesson Detail') {
            if (!body.description) throw new HttpException({ description: ResponseMessage.INVALID_DESCRIPTION }, StatusCodes.BAD_REQUEST);
            if (!body.videoLink) throw new HttpException({ videoLink: ResponseMessage.INVALID_VIDEO_LINK }, StatusCodes.BAD_REQUEST);
            const lessonDetail = new LessonDetail();
            lessonDetail.description = body.description;
            lessonDetail.videoLink = body.videoLink;
            lessonDetail.lesson = newLesson;
            await this.lessonDetailService.saveLessonDetail(lessonDetail);
        }

        if (lessonType.name === 'Lesson Quiz') {
            if (!body.description) throw new HttpException({ description: ResponseMessage.INVALID_DESCRIPTION }, StatusCodes.BAD_REQUEST);
            if (!body.quiz) throw new HttpException({ videoLink: ResponseMessage.INVALID_QUIZ }, StatusCodes.BAD_REQUEST);

            const quiz = body.quiz.split(',');

            const lessonQuiz = new LessonQuiz();
            lessonQuiz.quizs = [];
            for (const item of quiz) {
                const res = await this.quizService.getQuizByField('id', item);
                lessonQuiz.quizs.push(res);
            }
            lessonQuiz.description = body.description;
            lessonQuiz.lesson = newLesson;
            await this.lessonQuizService.saveLessonQuiz(lessonQuiz);
        }

        return res.send(newLesson);
    }
}
