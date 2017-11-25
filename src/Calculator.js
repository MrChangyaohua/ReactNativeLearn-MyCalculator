import React, { Component } from 'react';
import {
    Text,
    View,
    AppRegistry
} from 'react-native';
import Style from './Style'
import InputButton from './InputButton'

const inputButtons = [
    ['AC', '(', ')', '←'],
    [1, 2, 3, '+'],
    [4, 5, 6, '-'],
    [7, 8, 9, '×'],
    [0, '.', '=', '÷']
];

//如果是第一次输入的话，将默认值0替换为输入值
let firstEnter = true;

//如果完成一次计算后值为true，然后重新开始一次计算
let isCompleteCalculate = false;

export default class Calculator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            previousInputValue: 0,
            inputValue: 0,
            resultValue: 0,
            selectedSymbol: null
        }
    }

    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer} >
                    <Text style={Style.displayText}>{this.state.inputValue}</Text>
                    <Text style={Style.displayText}>{this.state.resultValue}</Text>
                </View>
                <View style={Style.inputContainer} >
                    {this._renderInputButtons()}
                </View>
            </View>
        )
    }

    _renderInputButtons() {
        let views = [];
        for (let r = 0; r < inputButtons.length; r++) {
            let row = inputButtons[r];
            let inputRow = [];
            for (let i = 0; i < row.length; i++) {
                let input = row[i];
                inputRow.push(
                    <InputButton
                        value={input}
                        highlight={this.state.selectedSymbol === input}
                        onPress={this._onInputButtonPressed.bind(this, input)}
                        key={r + "-" + i} />
                );
            }
            views.push(<View style={Style.inputRow} key={row + "-" + r}>{inputRow}</View>);
        }
        return views;
    }

    _onInputButtonPressed(input) {
        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input);
            case 'string':
                return this.__handleOperateInput(input);
        }
    }

    _handleNumberInput(num) {
        if (isCompleteCalculate) {
            isCompleteCalculate = false;
            this.setState({
                inputValue: num
            })
            return;
        }
        if(firstEnter) {
            this.setState({
                inputValue : num
            })
            firstEnter = false;
            return;
        }
        let newValue = this.state.inputValue + "" + num;
        this.setState({
            inputValue : newValue
        })
    }

    __handleOperateInput(operate) {
        switch (operate) {
            case '+':
            case '-':
                this.setState({
                    selectedSymbol: operate,
                    previousInputValue: this.state.inputValue,
                    inputValue: 0
                })
                break;
            case '×':
                this.setState({
                    selectedSymbol: '*',
                    previousInputValue: this.state.inputValue,
                    inputValue: 0
                })
                break;
            case '÷':
                this.setState({
                    selectedSymbol: '/',
                    previousInputValue: this.state.inputValue,
                    inputValue: 0
                })
                break;
            case 'AC':
                this.setState({
                    selectedSymbol: null,
                    previousInputValue: 0,
                    inputValue: 0,
                    resultValue: 0
                })
                break;
            case '=':
                let symbol = this.state.selectedSymbol,
                    inputValue = this.state.inputValue,
                    previousInputValue = this.state.previousInputValue;

                if (!symbol) {
                    return;
                }

                this.setState({
                    previousInputValue: 0,
                    inputValue: previousInputValue + symbol + inputValue + "=",
                    resultValue: eval(previousInputValue + symbol + inputValue),
                    selectedSymbol: null
                });

                isCompleteCalculate = true;

                break;
        }
    }
}



// AppRegistry.registerComponent('Calculator',()=>Calculator);