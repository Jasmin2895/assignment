import React, { Component } from 'react';
import Websocket from 'react-websocket';
import './stocks.css'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
const moment = require('moment')
// status will be 0, 1,-1 to define the current state of the function increasing , decresing and null status 
class Stocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            graphData: []
        }
    }
    setGraphData = (stock) => {
        let tempArr = []
        Object.keys(stock).map(res => {
            tempArr.push({ name: res, price: stock[res]['price'] })
        })
        this.setState({
            graphData: tempArr
        })
    }


    handleData(data) {
        let that = this;
        let result = JSON.parse(data);
        result.forEach(function (res) {
            let classname = !!that.state.data[res[0]] ? (that.state.data[res[0]].price > res[1] ? "lower" : that.state.data[res[0]].price < res[1] ? "higher" : "") : "initial"
            
            that.state.data[res[0]] = {
                price: res[1].toFixed(3),
                classname: classname,
                updated_at: moment().startOf('hour').fromNow()
            }
        })

        this.setState({
            data: this.state.data
        })

        this.setGraphData(this.state.data)
    }

    render() {
        let that = this;
        return (
            <div className="stocks">
                <Websocket url='ws://stocks.mnet.website' onMessage={this.handleData.bind(this)} />
                <div className="container">
                    <div className="parts">
                        <table className="one" >
                            <thead>
                                <tr>
                                    <th className="header">Ticker</th>
                                    <th className="header">Price </th>
                                    <th className="header">Last Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(this.state.data).length > 0 ?

                                        Object.keys(this.state.data).map((key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className="b">{key}</td>
                                                    <td className={that.state.data[key].classname === "higher" ? "higher" : that.state.data[key].classname === "lower" ? "lower" : that.state.data[key].classname === "initial" ? "initial" : ""}>{that.state.data[key].price}</td>
                                                    <td className="b">{that.state.data[key].updated_at}</td>
                                                </tr>
                                            )
                                        })
                                        : ""
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="graph">
                        <div> Graph Data </div>
                        <AreaChart width={600} height={400} data={this.state.graphData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type='monotone' dataKey='price' stroke='#8884d8' fill='#8884d8' />
                        </AreaChart>
                    </div>
                </div>
            </div>
        )
    }
}

export default Stocks;