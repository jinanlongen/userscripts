// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.deleteValue

var save = async function(nbrs) {
    if (nbrs == null) {
        return GM.deleteValue('nbrs');
    } else {
        return GM.setValue('nbrs', JSON.stringify(nbrs));
    };
};

var load = async function() {
    return GM.getValue('nbrs').then(nbrs => {
        if(Boolean(nbrs)) {
           return JSON.parse(nbrs);
        } else {
            return null;
        };
    });
};

var locked = async function() {
    return GM.getValue('nbrs').then(nbrs => {return Boolean(nbrs);});
};

var popAndDo = async function(accept) {
    let {nbr, remaining} = await pop();
    if(Boolean(nbr)) { //not empty
        await accept(nbr);
    };
    return remaining;
};

var pop = async function() {
    return load().then(nbrs => {
        let nbr = nbrs.shift();
        return {nbr, nbrs};
    }).then(({nbr, nbrs}) => {
        save(nbrs);
        return {nbr, nbrs};
    }).then(({nbr, nbrs}) => {
        let remaining = nbrs.length;
        return {nbr, remaining};
    });
};

var reset = async function() {
    await GM.deleteValue('nbrs');
};

var delay = function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
};

// for test/demo
var processNbr = async function(nbr) {
    console.log(">>> Process nbr: " + nbr + " ...");
    await delay(1000);
    console.log(">>> Process nbr: " + nbr + " ... done");
};

