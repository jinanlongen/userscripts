// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.deleteValue

var delay = function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
};

var save = async function(nbrs) {
    if ((nbrs !== null) && (Array.isArray(nbrs)) && (nbrs.length > 0)) {
        nbrsStr = nbrs.join(',');
        return GM.setValue('nbrs', nbrsStr);
    } else {
        return GM.deleteValue('nbrs');
    };
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

var load = async function() {
    return GM.getValue('nbrs').then(nbrsStr => {
        if(Boolean(nbrsStr)) {
           return nbrsStr.split(',');
        } else {return [];};
    });
};
