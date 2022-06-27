// @grant    GM.getValue
// @grant    GM.setValue

var delay = function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
};

var save = async function(nbrs) {
    var nbrsStr = "";
    if ((nbrs !== null) && (Array.isArray(nbrs))) {
        nbrsStr = nbrs.join(',');
    };
    return GM.setValue('nbrs', nbrsStr);
};

var processNext = async function() {
    let {nbr, remaining} = await pop();
    await processNbr(nbr);
    return remaining;
};

var processNbr = async function(nbr) {
    console.log(">>> Process nbr: " + nbr + " ...");
    await delay(1000);
    console.log(">>> Process nbr: " + nbr + " ... done");
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

var load = async function() {
    return GM.getValue('nbrs', "").then(nbrsStr => nbrsStr.split(','));
};
