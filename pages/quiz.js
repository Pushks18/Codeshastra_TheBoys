import Loader from "../components/Loader.js";
import QuestionShastra from "../components/Question.js";
import { useState, useEffect } from "react";
import React from "react";


const Quiz = () => {

  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([0,0,0,0,0,0,0,0,0,0])
  
  useEffect(() => {
    fetch_data();
  }, []); 
  
  useEffect(() => {
    console.log("ANswers",answers)
  }, [answers]);
  
  const handleClick = () => {
    console.log("Selected ANswer",selectedAnswer)
    console.log("Answer after submitting",answers)
    let score=0;
    for(let i=0;i<answers.length;i++)
    {
      if(answers[i]==selectedAnswer[i])
       score+=1
    }
    console.log(score); 
  }
  
  function fetch_data() {
    let temp_ques = []
    let temp_answers = [];
    let temp_choices = [];
   
    fetch('http://127.0.0.1:8000/quiz')
      .then(response => {
        console.log("INside then")
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // console.log(response)
        return response.json();
      })

      .then(data => {
        // Assuming data is an array of questions, update the questions state

        // console.log(data);

        let curr_index = 0;
        for (let i = 0; i < data.length; i++) {
          console.log("hello")
          if (data[i] == "Question ") {
            temp_ques.push(data[i + 1])
            curr_index += 1;
          }
          if (data[i] == "Answer") {
            temp_answers.push(data[i + 1]);
          }
        }

        let dict = {}
        for (let i = 0; i < data.length; i++) {
          if (data[i] === 'CHOICE') {
            dict[data[i + 1]] = data[i + 2]
            if (data[i + 1] == 'D') {
              temp_choices.push(dict)
              dict = {}

            }
          }


        }

        setQuestions(temp_ques)
        // setQuestions(temp_ques);
        // console.log(temp_ques)
        // console.log("Temp",temp_ques)
        setChoices(temp_choices)
        // console.log("Choices are",choices)
        // console.log(temp_answers)
        // console.log("Answers are",answers)
        setAnswers(temp_answers)

        // console.log(temp_choices)

      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });

  }

  // fetch_data()


  return (
    <>
      {questions.length == 0 ? <Loader /> :


        questions.map((question, index) => <QuestionShastra index={index} question={question} answer={answers[index]} choices={choices[index]} setSelectedAnswer={setSelectedAnswer} selectedAnswer={selectedAnswer} />)}
      <button onClick={handleClick}>Submit</button>
    </>)
}
export default Quiz;