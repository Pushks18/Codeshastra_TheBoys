import { useSelectedLayoutSegments } from "next/navigation";
import React, { useState } from "react";
import { render } from "react-dom";
import { Test, QuestionGroup, Question, Option } from "react-multiple-choice";

const QuestionShastra = ({question,choices,answer,index,setSelectedAnswer,selectedAnswer}) => {
  const [selectedOptions, setSelectedOptions] = useState({});


  const handleOptionSelect = (selectedOptions) => {
 
     


    let oldArray=selectedAnswer.map((answers,i)=>
    {
        if(i==index)
        {
          return selectedOptions[index];   
        }
        else
         return answers 
    });
    console.log(oldArray);
    // selectedAnswer[index]=selectedOptions;
    setSelectedAnswer(oldArray);
  };
  return (
    <div className="flex justify-center">
    <Test onOptionSelect={handleOptionSelect}>
      <QuestionGroup questionNumber={index}>
        <Question className="text-black">{question}</Question>
        <Option value=" A">{choices.A}</Option>
        <Option value=" B">{choices.B}</Option>
        <Option value=" C">{choices.C}</Option>
        <Option value=" D">{choices.D}</Option>
      </QuestionGroup>
    </Test>
    </div>
  );
};

export default QuestionShastra;

