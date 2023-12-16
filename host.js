/**
 * Copyright (C) LEE'S INC. - All Rights Reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 * Written by Franz Lee (Franz) <franz.e.lee@gmail.com>, Sep. 2023.
 *
 * This script servers as the `host` role in 1A2B game.
 * 
 * @author Franz Lee (Franz) <franz.e.lee@gmail.com>, Sep. 2023.
 * @link https://github.com/FranzLee/
 */
var host = {
    _target: 0, 
    _playerAnswer: 0, 
    _times: 0, 
    _probablyAnswers: [], 
    _debugMode: false, 
    
    // 取1~x中隨機整數
    _getRandom: function(x) {
        return Math.floor(Math.random() * x) + 1;
    }, 
    
    // 判斷x是否為整數
    _isInteger: function(x) {
        if (x % 1 == 0) {
            return true;
        }
        else {
            return false;
        }
    }, 
    
    // 檢查x是否符合規則
    _check: function(x) {
        if(!this._isInteger(x)) {
            console.log('error code:1');
            return false;
        }
        if(x > 9999 && x < 1000){
            console.log('error code:2');
            return false;
        }
        var x = Number(x);
        this.first = Math.floor(x / 1000);
        x = x - (this.first * 1000);
        this.second = Math.floor(x / 100);
        x = x - (this.second * 100);
        this.third = Math.floor(x / 10);
        x = x - (this.third * 10);
        this.forth = x;
        if(this.first == this.second || this.first == this.third || this.first == this.forth || this.second == this.third || this.second == this.forth || this.third == this.forth) {
            console.log('error code:3');
            return false;
        }
        else{
            return true;
        }
    }, 
    
    // 先把所有可能答案放入probablyAnswers(因為會用到check()所以在這邊才寫)
    _setProbablyAnswers: function(){
        for(i = 0; i <= 9999; i++) {
            if(i < 1000) {
                if(i < 10) {
                    i = '000' + i;
                }
                else if(i < 100) {
                    i = '00' + i;
                }
                else {
                    i = '0' + i;
                }
            }
            i = String(i);
            if(this._check(i)) {
                this._probablyAnswers.push(i);
            }
        }
    }, 
    
    // 計算剩餘可能性
    _probably: function() {
        var playerResult = this._xAxB(this._playerAnswer, this._target, 'number');
        var length = this._probablyAnswers.length;
    
        for(j = 0; j < length; j++) {
            if (this._debugMode) { console.log(j); }
            if(playerResult != this._xAxB(this._probablyAnswers[j], this._playerAnswer, 'number')) {
                if (this._debugMode) { console.log('markup'+ j); }
                this._probablyAnswers[j]= '0000';
            }
        }
    
        length = this._probablyAnswers.length;
        for(i = (length-1) ; i >= 0; i--){
            if(this._probablyAnswers[i] == '0000')
                this._probablyAnswers.splice(i, 1);
        }
        
        return this._probablyAnswers.length;
    }, 
    
    // 判斷input、target為幾A幾B
    _xAxB: function(input, target, type) {
        var inputKey = []
        var x = Number(input);
        inputKey.push(Math.floor(x / 1000));
        x = x - (inputKey[0] * 1000);
        inputKey.push(Math.floor(x / 100));
        x = x - (inputKey[1] * 100);
        inputKey.push(Math.floor(x / 10));
        x = x - (inputKey[2] * 10);
        inputKey.push(x);
    
        var targetKey = []
        var y = Number(target);
        targetKey.push(Math.floor(y / 1000));
        y = y - (targetKey[0] * 1000);
        targetKey.push(Math.floor(y / 100));
        y = y - (targetKey[1] * 100);
        targetKey.push(Math.floor(y / 10));
        y = y - (targetKey[2] * 10);
        targetKey.push(y);
    
        var A = 0;
        var B = 0;
    
        for(i = 0; i < 4; i++){
            for(k = 0; k < 4; k++){ 
                if(inputKey[i] == targetKey[k]){
                    if(i == k){
                        A += 1;
                    }
                    else{
                        B += 1;
                    }
                }
            }
        }
    
        if(type == 'text'){
            return  A + 'A' + B + 'B';    
        }
        else if(type == 'number'){
            return A + (B * 0.1);
        }
        return 'error!';
    }, 
    
    // onload後先設定題目
    newRound: function() {
        while(!this._check(this._target)) {
            this._target = this._getRandom(10000);
            this._times = 0;
            this._setProbablyAnswers();
        }
    }, 
    
    /**
     * button被按下後執行，並回應
     * 
     * @param playerAnswerString <String>
     * @return <Object>
     */
    inquire: function(playerAnswerString) {
        this._playerAnswer = Number(playerAnswerString);
        if (this._check(this._playerAnswer) == false) {
            console.log('false!');
            return 'invalid input';
        }
        else {
            this._times += 1;
            if (this._playerAnswer == this._target) {
                return {
                    gameStatus: 'finish', 
                    times: this._times
                };
            }
            else {
                return {
                    gameStatus: 'continue', 
                    xAxB: this._xAxB(this._playerAnswer, this._target, 'text'), 
                    numPossible: this._probably()
                };
            }
        }
    }    
};
