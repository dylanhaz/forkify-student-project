 export const convertDecimalToFraction = dec => {
     
     
    dec = dec.toString();
   
    //Ex. dec = 1.25, should be 1 1/4
    //First check if number has a decimal
    if (dec % 1 != 0) {
        //First Split the number
        // splitArr = ['1', '25']
        let splitArr = dec.split('.');
        //seperate decimal to its own var
        let fraction = splitArr[1];

        //round dec to nearest 100th
        //Ex. 2435 = 24 or 23768990 = 24
        if (fraction.length > 2) {
            const first = fraction.slice(0,2);
            const remainder = fraction.slice(3);
            let sum = `${first}.${remainder}`;
            fraction = Math.round(sum);
        }

        //check if a repeating number like 333333 or 66666
        if (fraction === 33) {
            splitArr[1] = `1/3`
            splitArr = splitArr.join(' ');
            return splitArr;
        } else if (fraction === 67) {
            splitArr[1] = `2/3`
            splitArr = splitArr.join(' ');
            return splitArr;
        }
        // return to decimal form incase of a number like .5 becoming 5 instead of 50
        fraction = `.${fraction}`
        //Multiply dec by 100
        //splitArr = ['1', 25]
        fraction *= 100
        //find the greatest common factor
        for (let i = 100; i >= 1; i--) {
            if (fraction % i === 0 && 100 % i === 0) {
                //return fraction as a string
                splitArr[1] = `${fraction/i}/${100/i}`
                splitArr = splitArr.join(' ');
                return splitArr;
            }
        }
        //no common factor found
        splitArr[1] = `${fraction}/${100}`
        splitArr = splitArr.join(' ');
        return splitArr;

    }
    //If number doesn't have a decimal, return
    return dec;
};

export const splitFraction = fraction => {
    let num;
    num = fraction.split('/'); //split fraction into usable numbers
    for (let i = 0; i < num.length; i++) { //loop through arr and convert strings to numbers
            num[i] = parseInt(num[i]);
    }
    // return the number as a decimal now
    num = num[0] / num[1];
    return num;
}