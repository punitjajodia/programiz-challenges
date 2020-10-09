import React, { useState } from "react";
import "./App.css";

const RESULT = {
  NOT_EXECUTED: "Not Executed",
  FAILED: "Failed",
  PASSED: "Passed",
};

function App() {
  const [preCode, setPreCode] = useState(`import sys
test_input = sys.argv[1]`);
  const [code, setCode] = useState(`print("Hello", test_input)`);
  const [error, setError] = useState("");
  const [tests, setTests] = useState([
    {
      input: "Jack",
      output: "Hello Jack",
      result: RESULT.NOT_EXECUTED,
    },
    {
      input: "Punit",
      output: "Hello Punit",
      result: RESULT.NOT_EXECUTED,
    },
  ]);

  const testRegion = tests.map((test) => {
    let icon = "";
    if (test.result === RESULT.PASSED) {
      icon = "✔️";
    }
    if (test.result === RESULT.FAILED) {
      icon = "❌";
    }

    return (
      <div key={test.input + test.output}>
        {test.input} --{">"} {test.output} {icon}
      </div>
    );
  });

  const submit = () => {
    // console.log("Inside submit yo!");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preCode,
        code: code,
        tests,
        lang: "python",
      }),
    };

    fetch("https://repl-web.programiz.com/api/v1/challenge", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data[0].data.compilationSuccess === false) {
          setError(data[0].data.compilationErrorMessage);
        } else {
          setError("");
        }
        const updatedTests = tests.map((test, i) => {
          return {
            ...test,
            result: data[i].data.testPassed ? RESULT.PASSED : RESULT.FAILED,
          };
        });
        console.log("The updated tests are ", updatedTests);
        setTests(updatedTests);
      })
      .catch((e) => console.error("Error is in boyz", e));
  };

  return (
    <div className="App">
      <h1>Programiz Challenges</h1>
      <h4>Problem Statement</h4>
      <div>
        <code>Given a name, print Hello `name`</code>
      </div>
      <h5>Pre Code</h5>
      <textarea
        value={preCode}
        onChange={(e) => setPreCode(e.target.value)}
      ></textarea>
      <pre>{error}</pre>
      <h5>Code</h5>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <div>
        <button
          onClick={() => {
            submit();
          }}
        >
          Check
        </button>
      </div>
      <h4>Tests</h4>
      {testRegion}
    </div>
  );
}

export default App;
