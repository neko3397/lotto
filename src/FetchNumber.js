import React from 'react';
import * as axios from 'axios';

class LottoRandomHeader extends React.Component {

    state = {
        history : [
            {
                lottoNumber: Array(6).fill(null)
            }
        ],
        drwNo : 0
    }

    componentDidMount(){
        axios.get('http://localhost:5000/lottos/last').then((res)=>{
            const data = res.data;
            if(data){
                const lottoNumber = [];
                lottoNumber.push(data.drwtNo1);
                lottoNumber.push(data.drwtNo2);
                lottoNumber.push(data.drwtNo3);
                lottoNumber.push(data.drwtNo4);
                lottoNumber.push(data.drwtNo5);
                lottoNumber.push(data.drwtNo6);
                this.setState({lottoNumber, drwNo: data.drwNo});
            }
            
        })
    }

    render(){
        return(
            <div className="lotto-random-header">
                <div className="lotto-title">
                    로또 랜덤 번호 생성기
                </div>
            </div>
        );
    }
}
export default LottoRandomHeader;