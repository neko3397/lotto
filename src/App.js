import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


function FetchApi(props) {
  const [numbers, setNumbers] = useState(Array(0).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      let tempArr = Array(0).fill(null);
      const numbersToGet = 52;
      const requestUri = 'http://localhost:5000/lottos/';
      let finalNumber = 970;
      let startNumber = finalNumber - numbersToGet;
      const word = 'drwtNo'
      let temp = Array(0).fill(null);
      if(tempArr.length < numbersToGet) {
        setError(null);
        setNumbers(null);
        setLoading(true);
        let i=0;
        for(i = finalNumber; i >= startNumber; i--) {
          const completeUri = requestUri + i.toString();
          const response = await axios.get(completeUri);
          if(response.data.returnValue === "fail") {
            finalNumber--;
            startNumber--;
            i = finalNumber;
            console.log("finalNumber: ", finalNumber)
            console.log("startNumber: ", startNumber)
          }
          else {
            for (const [key, value] of Object.entries(response.data)) {
              if(key.includes(word)) {
                temp.push(value);
              }
            }
            tempArr.push(temp);
            temp = Array(0).fill(null);
          }
        }  
      }
      setNumbers(tempArr); 
      setLoading(false);
      if (loading === false) {
        props.handleLoading(false);
      }
      let freq = Array(46).fill(0);
      const fetchFrequency = () => {
        const numbers = tempArr;
        for(let i = 0; i < numbers.length; i++) {
          const number = numbers[i];
          // console.log('number.length: ', numbers.length);
          // console.log('number = ', number);
          for(let j = 0; j <= 5; j++) {
            freq[number[j]] = freq[number[j]] + 1;
            // console.log('number[',j, ']: ', number[j]);
            // console.log('freq[',number[j],']: ', freq[number[j]]);
          }
        }
      }

      let prob = Array(0).fill(null);
      const fetchProbability = () => {
        freq.forEach((item) => {
          prob.push(((item*100)/(52)).toFixed(2))
        })
      }
        fetchFrequency();
        fetchProbability();
        props.updateState(freq, prob);
    };
    fetchNumbers();
  },[]);
  
  if (error) return <div>에러가 발생했습니다</div>;
  return null;
}

function Number(props) {
 return(
    <div className={props.className}>
       <h5 onClick={props.onClick} style={{backgroundColor: "#" + (props.value !== 0 ? props.color : "AAA")}}>{props.value}</h5>
    </div>
 )
}

class Board extends React.Component {
  renderNumber() {
    return this.props.value.map((value) => {
      console.log(value);
      return (
          <Number
            value={value}
            onClick={this.props.onClick}
            className={this.props.className}
            color={this.props.color[value]}
          />
      );
    })
  }

  render() {
    return(
    <div className="mainNumber">
      {this.renderNumber()}
    </div>
    );
  }
}


class Info extends React.Component {
  constructor(props) {
    console.log("Info constructor")
    super(props);
    this.state = {arr3:[], arr4:[], isClick: false}
  };  

  componentDidMount() { 
    console.log("Info componentDidMount");
    let tempArr3 = Array(6).fill(0);
    let tempArr4 = Array(6).fill(0);
    for(let i = 0; i < 6; i++) {
      tempArr3[i] = this.props.value1[this.props.value[i]];
      tempArr4[i] = this.props.value2[this.props.value[i]];
    }
    this.setState({arr3: tempArr3, arr4: tempArr4})
  }
  
  render() {
    const infoGenerator = () => {
      let infoArr = [];
      for(let i = 0; i < 6; i++) {
        infoArr.push(
          <div className="wrapper3">
            <Number value={this.props.value[i]} color={this.props.color[this.props.value[i]]} className="number" />
            <h3><strong>{this.state.arr3[i]}</strong></h3>
            <h3><strong>{this.state.arr4[i]}</strong></h3>
          </div>
        );
      };
      return infoArr;
    }

    let num = 0;
    const onClickHandler = (value) => {
      num = value;
    }
    const message = () => {
      let message1 = null;
      let message2 = null;
      if(num === 1) {
        message1 = <>당첨 빈도</>
        message2 = <>당첨 빈도: 최근 52주간 당첨된 횟수</>
      }
      else if(num === 2) {
        message1 = <>당첨 확률</>
        message2 = <>당첨 확률: 최근 52주간 해당 번호가 나온 확률</>
      }
      return(
      <>
        <div id="popup1" class="overlay">
          <div class="popup">
            <h2>당첨 빈도</h2>
            <a class="close" href="#">&times;</a>
            <div class="content">
              최근 52주간 당첨된 횟수
            </div>
          </div>
        </div>
        <div id="popup2" class="overlay">
          <div class="popup">
            <h2>당첨 확률</h2>
            <a class="close" href="#">&times;</a>
            <div class="content">
             최근 52주간 해당 번호가 나온 확률
            </div>
          </div>
        </div>
      </>
      )
      
    }

    return(
      <div className="wrapper1">
          {message()}
          <div className="wrapper2">
            <h3>번호</h3>
            <h3>당첨 빈도</h3>
            <button className="question" onClick={onClickHandler(1)}><a href="#popup1">?</a></button>
            <h3>당첨 확률</h3>
            <button className="question" onClick={onClickHandler(2)}><a href="#popup2">?</a></button>
          </div>
          {infoGenerator()}
      </div>
    );
  }
}



class Lotto extends React.Component {
  constructor(props) {
    console.log("Lotto constructor");
    super(props);
    this.state = {
      history: [
        {
         numbers: Array(6).fill(0)
        }
      ],
      probability: Array(45).fill(0),
      frequency: Array(45).fill(0),
      stepNumber: 0,
      arr1: Array(46).fill(null),
      arr2: Array(46).fill(null),
      isClick: false,
      color: Array(46).fill(0).map((i)=> {
          const color = ["fbc400", "69c8f2", "ff7272", "aaa", "b0d840"];
          const randomColor = color[Math.floor(Math.random()*5)];
          return randomColor;
      }),
      isLoading: true,
    };
  }
  handleLoading = (value) => {
    this.setState({isLoading: value});
  }

  handleClick = () => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let numbers = current.numbers.slice();
    const generator = () => {
      let randomNumber = Math.floor(Math.random()*45) + 1;
      return randomNumber;
    };

    for(let j = 0; j < 6; j++) { // 랜덤 번호 생성
      numbers[j] = generator();
      // console.log(numbers[j]);
    }

    const makeNumbers6 = (numbers) => {
      if(numbers.length === 6) { // 중복 제거 후 부족한 숫자 생성
        return;
      }
      else {
        for(let j = numbers.length; j < 6; j++) {
          numbers[j] = generator();
        }
        removeOverlap(numbers);
      }
    }

    const removeOverlap = (arr) => { // 중복 제거 함수
      let result = arr.sort().reduce((accumulator, current) => {
        const length = accumulator.length
        if (length === 0 || accumulator[length - 1] !== current) {
            accumulator.push(current);
        }
        return accumulator;
      }, []);
      makeNumbers6(result);
      return result;
    }
    numbers = removeOverlap(numbers);

    numbers.sort(function(a, b) { // 오름차순 정렬
      return a - b;
    });

    this.setState({
      history: history.concat([
        {
          numbers: numbers
        }
      ]),
      stepNumber: this.state.stepNumber + 1,
    });
  }

  updateState = (state1, state2) => {
    this.setState({arr1: state1,
                   arr2: state2});
  }

  onClickHandler = () => {
    this.setState((state, props) => ({isClick: !state.isClick}))
    console.log("Clicked!!");
    console.log(this.state.isClick)
  }

  
  //---------------------------------------------------------------------
  render() {
    console.log("render")
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const historyList = history.map((value, index) => {
      if(value.numbers[0] !== 0) {
        return(
          <div>
              <Board value={value.numbers} onClick={this.onClickHandler} className="number" color={this.state.color} />
              {this.state.isClick ? <Info value={value.numbers} value1={this.state.arr1} value2={this.state.arr2} color={this.state.color} /> : null}
          </div>
        )
      }
      return null;
    }
    )

    const MainNumber = () => {
      let now = new Date();
      console.log(now);
      console.log("mainNumber");
      return(
        <>
          <header>
            로또 번호 생성기
            <h3>인공지능이 만드는 로또 번호</h3>
            <button onClick={this.handleClick}>{this.state.isLoading ? "로딩중" : "번호 생성"}</button>
          </header>
          <Board value={current.numbers} onClick={this.onClickHandler} className="number" color={this.state.color} />
          <div className="board">
            <Info value={current.numbers} value1={this.state.arr1} value2={this.state.arr2} color={this.state.color} /> 
          </div>
        </>
      )
    }

    return (
      <>
      <div className="game">
        <FetchApi updateState={this.updateState} handleLoading={this.handleLoading}/>
        <MainNumber />
        {historyList}
      </div>
      </>
    );
  }
}


// ========================================
export default Lotto;