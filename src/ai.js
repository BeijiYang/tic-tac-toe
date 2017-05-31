function ai(arr,idCheck) {
    const player= idCheck ? 'X' : 'O';
    const enemy = idCheck ? 'O' : 'X';
    const loacation=arr.map(function(item,index){
        if(item===null){
            return index;
        }
    }).filter( item => (item !== undefined));
    // console.log(loacation);

    const oCalc={};

    for(let j=0;j<loacation.length;j++){
        const index=loacation[j];
        switch(index){
            case 0:
            case 2:
            case 6:
            case 8:
              oCalc['loacation'+index]=judgeConner(index);
              break;
            case 1:
            case 3:
            case 5:
            case 7:
              oCalc['loacation'+index.toString()]=judgeSide(index);
              break;
            case 4:
              oCalc['loacation'+index.toString()]=judgeCenter(index);
              break;
            default:
        }
    }

    // console.log(JSON.stringify(oCalc));


    function judgeConner(index) {
      switch (index) {
        case 0:
        return conner(1,2,3,6,4,8);
        case 2:
        return conner(0,1,5,8,4,6);
        case 6:
        return conner(0,3,7,8,2,4);
        case 8:
        return conner(2,5,6,7,0,4);

        default:
      }
    }
    function judgeSide(index) {
      switch (index) {
        case 1:
        return side(4,7,0,2);
        case 3:
        return side(0,6,4,5);
        case 5:
        return side(2,8,3,4);
        case 7:
        return side(6,8,1,4);
        default:
      }
    }
    function judgeCenter(index) {
      return center(3,5,1,7,0,8,2,6)
    }

    function side(a,b,c,d) {
      if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player)) {
        return 10000;
      }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy)) {
        return 1000;
      }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player)) {
        return 100;
      }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy)) {
        return -10;
      }else {
        return 0;
      }
    }

    function conner(a,b,c,d,e,f) {
      if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player) || (arr[e]===player && arr[f]===player)) {
        return 10000;
      }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy)|| (arr[e]===enemy && arr[f]===enemy)) {
        return 1000;
      }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player)|| (arr[e]===player || arr[f]===player)) {
        return 100;
      }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy) || (arr[e]===enemy || arr[f]===enemy)) {
        return -10;
      }else {
        return 0;
      }
    }

    function center(a,b,c,d,e,f,g,h) {
      if ((arr[a]===player && arr[b]===player) || (arr[c]===player && arr[d]===player) || (arr[e]===player && arr[f]===player) || (arr[g]===player && arr[h]===player)) {
        return 10000;
      }else if((arr[a]===enemy && arr[b]===enemy) || (arr[c]===enemy && arr[d]===enemy) || (arr[e]===enemy && arr[f]===enemy) || (arr[g]===enemy && arr[h]===enemy)) {
        return 1000;
      }else if ((arr[a]===player || arr[b]===player) || (arr[c]===player || arr[d]===player) || (arr[e]===player || arr[f]===player) || (arr[g]===player || arr[h]===player)) {
        return 100;
      }else if ((arr[a]===enemy || arr[b]===enemy) || (arr[c]===enemy || arr[d]===enemy) || (arr[e]===enemy || arr[f]===enemy) || (arr[g]===enemy || arr[h]===enemy)) {
        return -10;
      }else {
        return 0;
      }
    }


    const largest={
        index:-1,
        value:-100
    };

    for(const item in oCalc){
        if(oCalc[item]>largest.value){
            largest.index=parseInt(item.replace('loacation',''),10);
            largest.value=oCalc[item];
        }
    }

    // console.log([player,JSON.stringify(largest)]);

    return largest.index;
  }


export default ai;
