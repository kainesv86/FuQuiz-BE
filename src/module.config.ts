import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './core';
import {
    User,
    Slider,
    Role,
    Customer,
    Marketing,
    Blog,
    Admin,
    Sale,
    Expert,
    Subject,
    SubjectCategory,
    Dimension,
    DimensionType,
    BlogCategory,
    Lesson,
    PricePackage,
    LessonType,
    ExamLevel,
    Quiz,
    QuizType,
    SubjectTopic,
    LessonDetail,
    LessonQuiz,
    Question,
    Answer,
    Registration,
    QuizResult,
    QuizDetail,
    AttendedQuestion,
    UserAnswer,
    QuestionLevel,
    SystemMenu,
    Transaction,
} from './core/models';

export const DbModule = TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    // logging: true,
    keepConnectionAlive: true,
    entities: [
        User,
        Role,
        Slider,
        Customer,
        Marketing,
        Blog,
        BlogCategory,
        Admin,
        Sale,
        Expert,
        Subject,
        SubjectCategory,
        Dimension,
        DimensionType,
        Lesson,
        LessonType,
        PricePackage,
        ExamLevel,
        LessonType,
        Quiz,
        QuizType,
        LessonType,
        SubjectTopic,
        LessonDetail,
        LessonQuiz,
        Question,
        Answer,
        Registration,
        QuizResult,
        QuizDetail,
        AttendedQuestion,
        UserAnswer,
        QuestionLevel,
        SystemMenu,
        Transaction,
    ],
    extra: { connectionLimit: 1 },
});
