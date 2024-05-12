/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import "./App.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";

function App() {
  const sampleString =
    "Put what you want changed in this section. Then, click the paraphrase button below. It's that easy!";

  const [textArea, setTextArea] = useState("");
  const [resultSummary, setResultSummary] = useState("");
  const [copied, setCopied] = useState(false);

  const displayRef = useRef([]);
  const loadingRef = useRef();
  const levelRef = useRef();

  const [levelValue, setLevelValue] = useState(128);

  useEffect(() => {
    levelRef.current.checked = true;
  }, []);

  useEffect(() => {
    if (textArea.length != 0) {
      displayRef.current[0].style.display = "block";
      displayRef.current[1].style.display = "none";
    } else if (textArea.length == 0) {
      loadingRef.current.style.display = "none";
      displayRef.current[0].style.display = "none";
      displayRef.current[1].style.display = "flex";
    }
  }, [textArea]);

  const handlePaste = async () => {
    try {
      const clipBoardData = await navigator.clipboard.readText();
      setTextArea(clipBoardData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  // Predict
  const predictText = async () => {
    if (textArea.length == 0) {
      alert("Please enter some text first!");
    } else {
      const data = {
        inputs: textArea,
        // levelValue: levelValue,
      };
      setResultSummary("");
      loadingRef.current.style.display = "flex";
      // await axios
      //   .post(`http://localhost:8080/process`, data, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(data),
      //   })
      //   .then((res) => {
      //     console.log(res.data);
      //     loadingRef.current.style.display = "none";
      //     setResultSummary(res.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      const response = await fetch(
        "https://api-inference.huggingface.co/models/google/pegasus-cnn_dailymail",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      loadingRef.current.style.display = "none";
      setResultSummary(result[0].summary_text);

      // console.log(result[0]);
      // return result;
    }
  };

  const handleDelete = () => {
    setTextArea("");
    setResultSummary("");
    displayRef.current[0].style.display = "none";
    displayRef.current[1].style.display = "flex";
  };

  return (
    <>
      <div className="container">
        {/* Header */}
        <div className="wrapper-header">
          <div className="header">
            <div className="logo">
              {/* <img src="" alt="" className="logo" /> */}
              <i className="fa-solid fa-bars menu-icon"></i>
            </div>
            <h2 className="header-text">Summarizer</h2>
            <div>
              <i className="fa-solid fa-user-large user-icon"></i>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Modal */}
          <div className="wrapper">
            <div className="content-header">
              <p className="content-header_titleText">Language:</p>
              <p className="content-header_normalText">English</p>
              <div className="content-header_slider">
                <p className="content-header_titleText">Summary Length:</p>
                <div className="levelSummay">
                  <div className="radio">
                    <input
                      type="radio"
                      id="low"
                      name="priority"
                      value="low"
                      onClick={() => setLevelValue(64)}
                    />
                    <label htmlFor="low">Low</label>
                  </div>

                  <div className="radio">
                    <input
                      type="radio"
                      id="medium"
                      name="priority"
                      value="medium"
                      ref={levelRef}
                      onClick={() => setLevelValue(128)}
                    />
                    <label htmlFor="medium">Medium</label>
                  </div>

                  <div className="radio">
                    <input
                      type="radio"
                      id="high"
                      name="priority"
                      value="high"
                      onClick={() => setLevelValue(256)}
                    />
                    <label htmlFor="high">High</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="content-body">
              <div className="content-leftBody">
                <div className="left-body_textarea">
                  <textarea
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    className="body-textarea"
                    name="paragraph"
                    id="paragraph"
                    placeholder="To enter text, enter or paste it here and press 'Paraphrase'"
                  ></textarea>
                  {/* Delete*/}
                  <div
                    className="trashIcon"
                    ref={(el) => (displayRef.current[0] = el)}
                    onClick={handleDelete}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </div>
                </div>
                <div
                  className="content-body_button"
                  ref={(el) => (displayRef.current[1] = el)}
                >
                  <button
                    className="body-button"
                    onClick={() => {
                      setTextArea(sampleString);
                    }}
                  >
                    <i className="fa-solid fa-hands-clapping handIcon"></i>
                    <p className="icon-text">
                      <i>Try sample text</i>
                    </p>
                  </button>
                  <div className="space"></div>
                  <button className="body-button" onClick={() => handlePaste()}>
                    <i className="fa-regular fa-clipboard pasteIcon"></i>
                    <p className="icon-text">
                      <i>Paste text</i>
                    </p>
                  </button>
                </div>
                <button
                  className="body-summaryBtn"
                  onClick={() => predictText()}
                >
                  Summarize
                </button>
              </div>
              <div className="content-rightBody">
                <div className="loading-overlay" ref={loadingRef}>
                  <div className="loading-container">
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      <h3>Loading...</h3>
                    </div>
                  </div>
                </div>

                <div className="rightBody-result">
                  <p className="summaryText">{resultSummary}</p>

                  {resultSummary.length != 0 && (
                    <CopyToClipboard text={resultSummary} onCopy={handleCopy}>
                      <div className="wrapper-icon">
                        {copied && <span>Copied!</span>}
                        <p className="copyIcon">
                          <i className="fa-regular fa-clone customIcon"></i>
                        </p>
                      </div>
                    </CopyToClipboard>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
