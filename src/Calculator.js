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


//如果完成一次计算后值为true，然后重新开始一次计算
let isCompleteCalculate = false;

export default class Calculator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputValue: '0',
            resultValue: '0'
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
                inputValue: num + ""
            })
            return;
        }
        if (this.state.inputValue === '0' && this.state.inputValue.length === 1) {
            this.setState({
                inputValue: num + ""
            })
            return;
        }
        let newValue = this.state.inputValue + num;
        this.setState({
            inputValue: newValue
        })
    }

    __handleOperateInput(operate) {

        switch (operate) {
            case '+':
            case '×':
            case '÷':
                if (this.state.inputValue === '0') {
                    return;
                }
            case '-':
            case '(':
            case ')':
                if (this.state.inputValue === '0') {
                    this.setState({
                        inputValue: operate
                    })
                    return;
                }
            case '.':
                if (isCompleteCalculate) {
                    isCompleteCalculate = false;
                    this.setState({
                        inputValue: this.state.resultValue + operate
                    })
                    return;
                }
                this.setState({
                    inputValue: this.state.inputValue + operate
                })
                break;
            case 'AC':
                isCompleteCalculate = false;
                
                this.setState({
                    inputValue: '0',
                    resultValue: '0',
                })
                break;
            case '←':
                if (this.state.inputValue == 0) {
                    return;
                }
                if (isCompleteCalculate) {
                    return;
                }
                if (this.state.inputValue.length === 1) {
                    this.setState({
                        inputValue: '0'
                    })
                    return;
                }
                this.setState({
                    inputValue: this.state.inputValue.slice(0, -1)
                })
                break;
            case '=':
                if (this.state.inputValue === '0') {
                    return;
                }
                if (this.state.inputValue.search(/[+-×÷]/) == -1) {
                    return;
                }
                let replaceInputValue = this.state.inputValue.replace(/×/g, '*');
                replaceInputValue = replaceInputValue.replace(/÷/g, '/');
                try {
                    var result = eval(replaceInputValue)
                } catch (e) {
                    // alert(e.message)
                    return;
                }
                this.setState({
                    inputValue: this.state.inputValue + "=",
                    resultValue: result
                });
                isCompleteCalculate = true;
                break;
        }
    }
}



// AppRegistry.registerComponent('Calculator',()=>Calculator);