import React from 'react';
import { QuestionOptions } from './components/QuestionOptions';

const questions = {
  questions: [
    {
      options: [
        { id: "A", text: "$n \\propto {u^2}$" },
        { id: "B", text: "$n \\propto u$" },
        { id: "C", text: "$n \\propto \\sqrt u $" },
        { id: "D", text: "$n \\propto \\cfrac{1}{u}$" }
      ]
    },
    {
      options: [
        { id: "A", text: "30 m towards West" },
        { id: "B", text: "10 m towards East" },
        { id: "C", text: "10 m towards West" },
        { id: "D", text: "30 m towards East" }
      ]
    },
    {
      options: [
        { id: "A", text: "4-bromo-2-methyl but-2-ene" },
        { id: "B", text: "1-bromo-2,3-dimethyl prop-2-ene" },
        { id: "C", text: "1-bromo-1-methyl prop-1-ene" },
        { id: "D", text: "1-bromo-2-methyl but-2-ene" }
      ]
    }
  ]
};

function App() {
  return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-[21cm] mx-auto bg-white shadow-lg p-8 min-h-[29.7cm]">
          <div className="grid grid-cols-[2fr_1fr] gap-8 h-full">
            {/* Left Column - Options */}
            <div className="border-r border-gray-200 pr-8">
              <h2 className="text-xl font-semibold mb-6">Question Options</h2>
              {questions.questions.map((question, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Question {index + 1}</h3>
                    <QuestionOptions options={question.options}/>
                  </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-6">Answer Space</h2>
            </div>
          </div>
        </div>
      </div>

  );
}

export default App
