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

var popAndDo = async function(accept) {
    let {nbr, remaining} = await pop();
    await accept(nbr);
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
        if(Boolean(nbrsStr) {
           return nbrsStr.split(',');
        } else {return [];};
    };
);
};
