/* eslint-disable react/prop-types */
import React from 'react';

import db from '../db.json';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';
import AlternativesForm from '../src/components/AlternativesForm';

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>Carregando...</Widget.Header>
      <Widget.Content>[Desafio do Loading]</Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results }) {
  const correctAnswers = results.reduce((accum, curr) => {
    if (curr === true) return accum + 1;
    return accum;
  }, 0);
  return (
    <Widget>
      <Widget.Header>
        <h3> Resultado: </h3>
      </Widget.Header>
      <Widget.Content>
        <h4>{`Você acertou ${correctAnswers} questoes`}</h4>
        <div>
          <ul>
            {results.map((result, index) => {
              return (
                <li key={index}>
                  {`Questão ${index + 1}:`} {result ? 'correta' : 'errada'}
                </li>
              );
            })}
          </ul>
        </div>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestions,
  questionIndex,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(
    undefined
  );
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question_${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasSelectedAlternative = selectedAlternative !== undefined;

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsQuestionSubmited(true);
    setTimeout(() => {
      addResult(isCorrect);
      onSubmit();
      setIsQuestionSubmited(false);
      setSelectedAlternative(undefined);
    }, 3 * 1000);
  };

  return (
    <Widget>
      <Widget.Header>
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesForm onSubmit={handleSubmit}>
          {question.alternatives.map((item, itemIndex) => {
            const alternativeId = `alternative_${itemIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === itemIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-seleted={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(itemIndex)}
                  type="radio"
                />
                {item}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={!hasSelectedAlternative}>
            Confirmar
          </Button>

          {isQuestionSubmited && isCorrect && <p>Você acertou</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou</p>}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  const addResult = (newResult) => {
    setResults([...results, newResult]);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  const handleSubmitQuiz = () => {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < db.questions.length) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  };

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            onSubmit={handleSubmitQuiz}
            question={question}
            totalQuestions={db.questions.length}
            questionIndex={questionIndex}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && (
          <ResultWidget results={results} />
        )}
      </QuizContainer>
    </QuizBackground>
  );
}
